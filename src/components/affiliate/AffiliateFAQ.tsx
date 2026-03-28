import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: "How can I earn commissions through the revenue share program?",
    answer: `You can earn commissions through the automated Revenue Share Program by referring users to the Pro tier of the platform. You will earn a 30% recurring commission, which equates to $14.70 per month for every $49/month Pro subscription you refer.`
  },
  {
    question: "How do I get started?",
    answer: `1. **Register** at the affiliate dashboard, where the system will auto-generate your unique referral code.\n\n2. **Share** your custom link (formatted as https://app.soilsidekickpro.com?ref=YOUR-CODE).\n\n3. **Get Paid**: The system automatically tracks visits and conversions via Stripe integration. Once your earnings reach at least $50, you can request a payout directly from the dashboard.`
  },
  {
    question: "Where should I share my referral link?",
    answer: `Five communities where environmental arbitrage has almost zero competition:\n\n• **Agent Builders & AI Communities** — ClawHub Discord, GitHub discussions, r/automation, r/AIagents. Pitch it as a new arbitrage primitive with real-world ROI.\n\n• **Trading & Quants** — r/algotrading, trading Discords, and quant circles. Offer entirely new data sources and "blue ocean" arbitrage signals.\n\n• **Agriculture & Agronomy** — Farming Facebook groups, AgTech Slack groups, LinkedIn. Farmers are motivated by early yield signals, fertilizer timing, and drought risk alerts.\n\n• **Insurance & Risk Pricing** — Actuaries and underwriters on LinkedIn or r/insurance. They'll pay for Pro tiers to detect water risk pricing gaps and crop insurance mispricing.\n\n• **AI Side Hustle Communities** — r/SideHustle, IndieHackers, YouTube/TikTok automation channels. Pitch "AI bots that make money" using signals nobody else has.`
  },
  {
    question: "What are the top conversion strategies?",
    answer: `The "Environmental Arbitrage Playbook" recommends these tactics:\n\n• **Post "Agent Recipes"** — Give people copy-paste YAML configurations so they can easily start their own bots.\n\n• **Provide Visual Proof** — Share screenshots of real arbitrage signals to prove the concept works.\n\n• **Share Real ROI** — Cite specific examples, such as a daily crop arbitrage bot returning 8.3% in 45 days.\n\n• **Create Short Tutorials** — Make 60-second tutorials on how to run a first scan and offer hands-on help to reduce friction.`
  },
  {
    question: "What is the minimum payout threshold?",
    answer: `The minimum payout threshold is $50. Once your available earnings reach this amount, you can request a payout directly from your affiliate dashboard. Payouts are processed monthly via Stripe.`
  },
  {
    question: "Are commissions one-time or recurring?",
    answer: `Commissions are lifetime recurring. You earn 30% on Pro subscriptions and 15% on Enterprise subscriptions for as long as the referred user remains an active subscriber.`
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
