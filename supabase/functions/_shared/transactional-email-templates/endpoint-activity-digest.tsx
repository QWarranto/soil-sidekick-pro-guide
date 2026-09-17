/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ChannelRow {
  channel: string
  requests: number
  failures: number
  rate_limited: number
  avg_ms: number
  p95_ms: number
}

interface EndpointActivityDigestProps {
  windowHours?: number
  totalRequests?: number
  totalFailures?: number
  totalRateLimited?: number
  channels?: ChannelRow[]
  generatedAt?: string
}

const EndpointActivityDigest = ({
  windowHours = 6,
  totalRequests = 0,
  totalFailures = 0,
  totalRateLimited = 0,
  channels = [],
  generatedAt = new Date().toISOString(),
}: EndpointActivityDigestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      Endpoint activity — {totalRequests} requests in last {windowHours}h
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🌱 Endpoint Activity Digest</Heading>
        <Text style={text}>
          Last {windowHours} hours · generated {generatedAt}
        </Text>

        <Section style={summaryBox}>
          <Text style={summaryLine}>
            <strong>Total requests:</strong> {totalRequests.toLocaleString()}
          </Text>
          <Text style={summaryLine}>
            <strong>Failures:</strong> {totalFailures.toLocaleString()}
          </Text>
          <Text style={summaryLine}>
            <strong>Rate-limited:</strong> {totalRateLimited.toLocaleString()}
          </Text>
        </Section>

        <Heading style={h2}>By Channel</Heading>
        {channels.length === 0 ? (
          <Text style={text}>No traffic recorded in this window.</Text>
        ) : (
          channels.map((c) => (
            <Section key={c.channel} style={channelBox}>
              <Text style={channelTitle}>{c.channel}</Text>
              <Text style={channelDetail}>
                {c.requests.toLocaleString()} req · {c.failures} fail ·{' '}
                {c.rate_limited} rate-limited · avg {c.avg_ms}ms · p95{' '}
                {c.p95_ms}ms
              </Text>
            </Section>
          ))
        )}

        <Text style={footer}>
          SoilSidekick Pro · Operational Monitoring
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: EndpointActivityDigest,
  subject: (data: Record<string, any>) =>
    `Endpoint activity digest — ${data.totalRequests ?? 0} requests in last ${data.windowHours ?? 6}h`,
  displayName: 'Endpoint activity digest',
  previewData: {
    windowHours: 6,
    totalRequests: 1234,
    totalFailures: 12,
    totalRateLimited: 3,
    generatedAt: new Date().toISOString(),
    channels: [
      { channel: 'free-tier/jwt', requests: 800, failures: 5, rate_limited: 1, avg_ms: 142, p95_ms: 380 },
      { channel: 'sdk-paid', requests: 300, failures: 4, rate_limited: 2, avg_ms: 98, p95_ms: 250 },
      { channel: 'mcp-agent', requests: 100, failures: 2, rate_limited: 0, avg_ms: 110, p95_ms: 290 },
      { channel: 'sandbox', requests: 34, failures: 1, rate_limited: 0, avg_ms: 88, p95_ms: 210 },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Karla', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '20px 25px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 8px' }
const h2 = { fontSize: '16px', fontWeight: 'bold' as const, color: '#000000', margin: '24px 0 12px' }
const text = { fontSize: '14px', color: '#74786C', lineHeight: '1.5', margin: '0 0 16px' }
const summaryBox = { backgroundColor: '#f5f7f2', padding: '16px', borderRadius: '4px', margin: '16px 0' }
const summaryLine = { fontSize: '14px', color: '#000000', margin: '4px 0' }
const channelBox = { borderLeft: '3px solid #5a8a5c', paddingLeft: '12px', margin: '8px 0' }
const channelTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 4px' }
const channelDetail = { fontSize: '13px', color: '#74786C', margin: '0' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
