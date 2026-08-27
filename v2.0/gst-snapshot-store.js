// GST Snapshot Store - IndexedDB-based recording and replay
// For backtesting, debugging, and deterministic testing

(function() {
    'use strict';
    
    window.GST = window.GST || {};
    
    // IndexedDB configuration
    const DB_NAME = 'GammaStormTrackerDB';
    const DB_VERSION = 1;
    
    // Database handle
    let db = null;
    
    // Recording state
    let recordingSession = null;
    let recordingInterval = null;
    
    // Replay state
    let replaySession = null;
    let replayInterval = null;
    let replayCallback = null;
    
    // Open database
    async function openDB() {
        if (db) return db;
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                GST.logger.info('IndexedDB opened successfully');
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                
                // Sessions store
                if (!database.objectStoreNames.contains('sessions')) {
                    const sessionsStore = database.createObjectStore('sessions', { keyPath: 'id' });
                    sessionsStore.createIndex('startedAt', 'startedAt', { unique: false });
                    sessionsStore.createIndex('symbol', 'symbol', { unique: false });
                }
                
                // Snapshots store
                if (!database.objectStoreNames.contains('snapshots')) {
                    const snapshotsStore = database.createObjectStore('snapshots', { keyPath: 'id', autoIncrement: true });
                    snapshotsStore.createIndex('sessionId', 'sessionId', { unique: false });
                    snapshotsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    snapshotsStore.createIndex('symbol', 'symbol', { unique: false });
                }
                
                // Trades store
                if (!database.objectStoreNames.contains('trades')) {
                    const tradesStore = database.createObjectStore('trades', { keyPath: 'id', autoIncrement: true });
                    tradesStore.createIndex('sessionId', 'sessionId', { unique: false });
                    tradesStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                GST.logger.info('IndexedDB schema created');
            };
        });
    }
    
    // Snapshot Store API
    GST.snapshots = {
        // Initialize database
        async init() {
            await openDB();
            GST.logger.info('Snapshot store initialized');
            return this;
        },
        
        // Start recording session
        async startRecording(options = {}) {
            const {
                symbols = ['SPY'],
                intervalMs = GST.config.recordingIntervalMs || 30000,
                metadata = {}
            } = options;
            
            if (recordingSession) {
                GST.logger.warn('Recording already in progress');
                return recordingSession;
            }
            
            await openDB();
            
            // Create session
            recordingSession = {
                id: GST.utils.uuid(),
                startedAt: Date.now(),
                symbols: Array.isArray(symbols) ? symbols : [symbols],
                intervalMs,
                metadata,
                snapshotCount: 0
            };
            
            // Save session
            const tx = db.transaction('sessions', 'readwrite');
            await tx.objectStore('sessions').put(recordingSession);
            
            GST.state.isRecording = true;
            GST.events.emit('recording:start', recordingSession);
            GST.logger.info('Recording started', recordingSession);
            
            // Start interval
            recordingInterval = setInterval(async () => {
                for (const symbol of recordingSession.symbols) {
                    await this._recordSnapshot(symbol);
                }
            }, intervalMs);
            
            return recordingSession;
        },
        
        // Record single snapshot (internal)
        async _recordSnapshot(symbol) {
            try {
                // Get current data from ORATS
                const data = await GST.orats.getStrikes(symbol);
                
                const snapshot = {
                    sessionId: recordingSession.id,
                    timestamp: Date.now(),
                    symbol,
                    data
                };
                
                const tx = db.transaction('snapshots', 'readwrite');
                await tx.objectStore('snapshots').add(snapshot);
                
                recordingSession.snapshotCount++;
                GST.events.emit('snapshot:recorded', { symbol, timestamp: snapshot.timestamp });
                
            } catch (error) {
                GST.logger.error('Failed to record snapshot', { symbol, error: error.message });
            }
        },
        
        // Stop recording
        async stopRecording() {
            if (!recordingSession) {
                GST.logger.warn('No recording in progress');
                return null;
            }
            
            // Clear interval
            if (recordingInterval) {
                clearInterval(recordingInterval);
                recordingInterval = null;
            }
            
            // Update session with end time
            recordingSession.endedAt = Date.now();
            recordingSession.duration = recordingSession.endedAt - recordingSession.startedAt;
            
            const tx = db.transaction('sessions', 'readwrite');
            await tx.objectStore('sessions').put(recordingSession);
            
            GST.state.isRecording = false;
            GST.events.emit('recording:stop', recordingSession);
            GST.logger.info('Recording stopped', { 
                snapshots: recordingSession.snapshotCount,
                duration: Math.round(recordingSession.duration / 1000) + 's'
            });
            
            const session = recordingSession;
            recordingSession = null;
            
            return session;
        },
        
        // List all sessions
        async listSessions() {
            await openDB();
            
            const tx = db.transaction('sessions', 'readonly');
            const store = tx.objectStore('sessions');
            const index = store.index('startedAt');
            
            return new Promise((resolve, reject) => {
                const request = index.openCursor(null, 'prev'); // Most recent first
                const sessions = [];
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        sessions.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(sessions);
                    }
                };
                
                request.onerror = () => reject(request.error);
            });
        },
        
        // Get session by ID
        async getSession(sessionId) {
            await openDB();
            
            const tx = db.transaction('sessions', 'readonly');
            return tx.objectStore('sessions').get(sessionId);
        },
        
        // Get snapshots for session
        async getSnapshots(sessionId, options = {}) {
            const { startTime, endTime, symbol } = options;
            
            await openDB();
            
            const tx = db.transaction('snapshots', 'readonly');
            const store = tx.objectStore('snapshots');
            const index = store.index('sessionId');
            
            return new Promise((resolve, reject) => {
                const request = index.openCursor(sessionId);
                const snapshots = [];
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const snapshot = cursor.value;
                        
                        // Apply filters
                        if (startTime && snapshot.timestamp < startTime) {
                            cursor.continue();
                            return;
                        }
                        if (endTime && snapshot.timestamp > endTime) {
                            cursor.continue();
                            return;
                        }
                        if (symbol && snapshot.symbol !== symbol) {
                            cursor.continue();
                            return;
                        }
                        
                        snapshots.push(snapshot);
                        cursor.continue();
                    } else {
                        resolve(snapshots.sort((a, b) => a.timestamp - b.timestamp));
                    }
                };
                
                request.onerror = () => reject(request.error);
            });
        },
        
        // Replay session
        async replay(options = {}) {
            const {
                sessionId,
                speed = 1, // 1x, 5x, 10x, etc.
                onTick = null,
                onComplete = null,
                symbol = null
            } = options;
            
            if (replaySession) {
                GST.logger.warn('Replay already in progress');
                return;
            }
            
            // Load snapshots
            const snapshots = await this.getSnapshots(sessionId, { symbol });
            if (snapshots.length === 0) {
                throw new Error('No snapshots found for session');
            }
            
            replaySession = {
                sessionId,
                snapshots,
                currentIndex: 0,
                speed,
                startTime: snapshots[0].timestamp,
                endTime: snapshots[snapshots.length - 1].timestamp
            };
            
            replayCallback = onTick;
            GST.state.isReplaying = true;
            
            GST.events.emit('replay:start', replaySession);
            GST.logger.info('Replay started', { 
                snapshots: snapshots.length,
                speed: speed + 'x',
                duration: Math.round((replaySession.endTime - replaySession.startTime) / 1000) + 's'
            });
            
            // Start replay loop
            const baseInterval = 1000 / speed; // 1 second at 1x
            
            replayInterval = setInterval(() => {
                if (replaySession.currentIndex >= snapshots.length) {
                    this.stopReplay();
                    if (onComplete) onComplete();
                    return;
                }
                
                const snapshot = snapshots[replaySession.currentIndex];
                
                if (replayCallback) {
                    replayCallback({
                        snapshot,
                        progress: replaySession.currentIndex / snapshots.length,
                        timestamp: snapshot.timestamp,
                        index: replaySession.currentIndex,
                        total: snapshots.length
                    });
                }
                
                replaySession.currentIndex++;
                
            }, baseInterval);
            
            return replaySession;
        },
        
        // Pause replay
        pauseReplay() {
            if (replayInterval) {
                clearInterval(replayInterval);
                replayInterval = null;
                GST.events.emit('replay:pause', replaySession);
                GST.logger.info('Replay paused');
            }
        },
        
        // Resume replay
        resumeReplay() {
            if (!replaySession || replayInterval) return;
            
            const baseInterval = 1000 / replaySession.speed;
            
            replayInterval = setInterval(() => {
                if (replaySession.currentIndex >= replaySession.snapshots.length) {
                    this.stopReplay();
                    return;
                }
                
                const snapshot = replaySession.snapshots[replaySession.currentIndex];
                
                if (replayCallback) {
                    replayCallback({
                        snapshot,
                        progress: replaySession.currentIndex / replaySession.snapshots.length,
                        timestamp: snapshot.timestamp,
                        index: replaySession.currentIndex,
                        total: replaySession.snapshots.length
                    });
                }
                
                replaySession.currentIndex++;
                
            }, baseInterval);
            
            GST.events.emit('replay:resume', replaySession);
        },
        
        // Stop replay
        stopReplay() {
            if (replayInterval) {
                clearInterval(replayInterval);
                replayInterval = null;
            }
            
            GST.state.isReplaying = false;
            GST.events.emit('replay:stop', replaySession);
            GST.logger.info('Replay stopped');
            
            replaySession = null;
            replayCallback = null;
        },
        
        // Jump to specific timestamp in replay
        seekReplay(timestamp) {
            if (!replaySession) return;
            
            const index = replaySession.snapshots.findIndex(s => s.timestamp >= timestamp);
            if (index !== -1) {
                replaySession.currentIndex = index;
                GST.events.emit('replay:seek', { timestamp, index });
            }
        },
        
        // Get replay status
        getReplayStatus() {
            if (!replaySession) return null;
            
            return {
                isPlaying: !!replayInterval,
                currentIndex: replaySession.currentIndex,
                totalSnapshots: replaySession.snapshots.length,
                progress: replaySession.currentIndex / replaySession.snapshots.length,
                currentTimestamp: replaySession.snapshots[replaySession.currentIndex]?.timestamp,
                speed: replaySession.speed
            };
        },
        
        // Export session to JSON
        async exportSession(sessionId) {
            const session = await this.getSession(sessionId);
            const snapshots = await this.getSnapshots(sessionId);
            
            return {
                session,
                snapshots,
                exportedAt: Date.now()
            };
        },
        
        // Import session from JSON
        async importSession(jsonData) {
            await openDB();
            
            const { session, snapshots } = jsonData;
            
            // Generate new ID to avoid collisions
            const newSessionId = GST.utils.uuid();
            session.id = newSessionId;
            session.importedAt = Date.now();
            
            // Save session
            const sessionTx = db.transaction('sessions', 'readwrite');
            await sessionTx.objectStore('sessions').put(session);
            
            // Save snapshots with new session ID
            const snapshotTx = db.transaction('snapshots', 'readwrite');
            const snapshotStore = snapshotTx.objectStore('snapshots');
            
            for (const snapshot of snapshots) {
                snapshot.sessionId = newSessionId;
                snapshot.id = undefined; // Let auto-increment assign new ID
                await snapshotStore.add(snapshot);
            }
            
            GST.logger.info('Session imported', { 
                originalId: jsonData.session.id,
                newId: newSessionId,
                snapshots: snapshots.length
            });
            
            return session;
        },
        
        // Delete session
        async deleteSession(sessionId) {
            await openDB();
            
            // Delete snapshots first
            const snapshots = await this.getSnapshots(sessionId);
            const snapshotTx = db.transaction('snapshots', 'readwrite');
            const snapshotStore = snapshotTx.objectStore('snapshots');
            
            for (const snapshot of snapshots) {
                await snapshotStore.delete(snapshot.id);
            }
            
            // Delete session
            const sessionTx = db.transaction('sessions', 'readwrite');
            await sessionTx.objectStore('sessions').delete(sessionId);
            
            GST.logger.info('Session deleted', { sessionId, snapshots: snapshots.length });
            GST.events.emit('session:deleted', { sessionId });
        },
        
        // Get storage stats
        async getStats() {
            await openDB();
            
            const sessions = await this.listSessions();
            
            let totalSnapshots = 0;
            for (const session of sessions) {
                totalSnapshots += session.snapshotCount || 0;
            }
            
            return {
                sessions: sessions.length,
                totalSnapshots,
                isRecording: !!recordingSession,
                isReplaying: !!replaySession
            };
        },
        
        // Clear all data
        async clearAll() {
            await openDB();
            
            // Stop any active recording/replay
            if (recordingSession) await this.stopRecording();
            if (replaySession) this.stopReplay();
            
            // Clear object stores
            const tx = db.transaction(['sessions', 'snapshots', 'trades'], 'readwrite');
            await tx.objectStore('sessions').clear();
            await tx.objectStore('snapshots').clear();
            await tx.objectStore('trades').clear();
            
            GST.logger.info('All snapshot data cleared');
            GST.events.emit('snapshots:cleared');
        }
    };
    
    // Auto-init
    GST.snapshots.init().catch(err => {
        GST.logger.error('Failed to initialize snapshot store', err);
    });
    
    console.log('✅ GST Snapshot Store loaded');
})();
