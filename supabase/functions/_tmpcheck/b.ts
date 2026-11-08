import { createClient } from 'npm:@supabase/supabase-js@2';
const c = createClient('a','b'); await c.from('x').select('*');
