import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: "What is the LeafEngines Affiliate Program?",
    answer: `You earn commissions by referring customers to the LeafEngines Agricultural Intelligence Platform. Environmental data is systematically mispriced in commodity futures, crop insurance, agricultural input purchasing, and carbon credit markets — LeafEngines exposes this gap in real time with patent-pending scoring algorithms.\n\nYou earn **30% recurring** on Pro subscriptions ($14.70/month per referral) and **15% recurring** on Enterprise subscriptions — for the lifetime of the subscription.`
  },
  {
    question: "How do I get started?",
    answer: `1. **Register** at this affiliate dashboard — the system auto-generates your unique referral code.\n\n2. **Share** your custom link (e.g. app.soilsidekickpro.com?ref=YOUR-CODE) with the four target audiences: AI agent builders, homesteaders/farmers, developers, and researchers.\n\n3. **Get Paid**: The system tracks visits and conversions via Stripe. Once you reach $50, request a payout from the dashboard.`
  },
  {
    question: "Who are the four target customer profiles?",
    answer: `**USE CASE 01 — OpenClaw & AI Agents**: Real-world environmental arbitrage — a completely new profit category. First-mover advantage is real and time-limited.\n\n**USE CASE 02 — Homesteaders & Farmers**: Soil, water, and climate monitoring to detect yield deviations early. Free tier (100 calls/month), no credit card needed.\n\n**USE CASE 03 — Developers**: Open source MCP server for Claude Desktop. npm package installs in 30 seconds. Build agricultural intelligence into any app.\n\n**USE CASE 04 — Researchers & Students**: Environmental analysis, sustainability scoring, and agricultural data with 150+ country coverage and 50+ crop types.`
  },
  {
    question: "What are the three API onboarding paths?",
    answer: `**Path A — Claude Desktop**: LeafEngines appears natively in the Claude Desktop server browser. Search "LeafEngines" or configure manually with the @leafengines/mcp-server npm package.\n\n**Path B — OpenClaw Agent Config**: Run \`clawhub install leafengines-opportunity-scanner\` and add the YAML config to your OpenClaw setup.\n\n**Path C — Direct REST API**: Use the API directly from any language. Get your key at /api-docs.`
  },
  {
    question: "Where should I share my referral link?",
    answer: `Five communities where environmental arbitrage has almost zero competition:\n\n• **Agent Builders & AI Communities** — ClawHub Discord, GitHub discussions, r/automation, r/AIagents. Pitch new arbitrage primitives with real-world ROI.\n\n• **Trading & Quants** — r/algotrading, trading Discords. Offer entirely new "blue ocean" data sources.\n\n• **Agriculture & Agronomy** — Farming groups, AgTech Slack, LinkedIn. Early yield signals, fertilizer timing, drought risk.\n\n• **Insurance & Risk Pricing** — Actuaries on LinkedIn, r/insurance. Water risk pricing gaps and crop insurance mispricing.\n\n• **AI Side Hustle Communities** — r/SideHustle, IndieHackers, YouTube. "AI bots that make money" using exclusive signals.`
  },
  {
    question: "What are the top conversion strategies?",
    answer: `• **Post "Agent Recipes"** — Copy-paste YAML configurations so people can spin up bots immediately.\n\n• **Provide Visual Proof** — Screenshots of real arbitrage signals proving the concept.\n\n• **Share Real ROI** — Cite specific examples (e.g. daily crop arbitrage bot returning 8.3% in 45 days).\n\n• **Create Short Tutorials** — 60-second tutorials on running a first scan.`
  },
  {
    question: "What is the minimum payout and how are commissions structured?",
    answer: `The minimum payout is **$50**. Commissions are **lifetime recurring** — you earn for as long as your referrals remain active subscribers. Payouts are processed monthly via Stripe.\n\n• **Pro tier**: 30% recurring ($14.70/month per referral)\n• **Enterprise tier**: 15% recurring\n• **Free tier**: No commission (but free users who upgrade later are still attributed to you)`
  }
];

export function AffiliateFAQ() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                  {item.answer.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-2 last:mb-0 text-muted-foreground">
                      {paragraph.split('**').map((segment, j) =>
                        j % 2 === 1 ? <strong key={j} className="text-foreground">{segment}</strong> : segment
                      )}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
