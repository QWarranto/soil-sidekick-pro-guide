
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "What exactly is \"Agricultural Intelligence\"?",
      answer: "It's the new umbrella for SoilSidekick Pro's combined soil + water insights, planting calendars, and eco-fertilizer recommendations—delivered county-by-county, in plain English, with government-grade data from USDA & EPA. Now enhanced with ADAPT Standard 1.0 integration for seamless farm management system connectivity."
    },
    {
      question: "What is ADAPT Standard 1.0 integration and why should I care?",
      answer: "ADAPT (Agricultural Data Application Programming Toolkit) is the industry standard for farm data exchange. Our ADAPT 1.0 integration lets you export soil analysis and field boundary data directly into John Deere Operations Center, Case IH AFS Connect, AGCO systems, and other compatible farm management platforms—breaking vendor lock-in and giving you true data portability."
    },
    {
      question: "Which farm management systems work with SoilSidekick Pro?",
      answer: "We support ADAPT Standard 1.0 compatible systems including John Deere Operations Center, Case IH AFS Connect, AGCO VarioDoc, and any FMIS that follows ADAPT protocols. This covers most major equipment manufacturers and farm management platforms, ensuring your soil intelligence integrates with your existing workflow."
    },
    {
      question: "What's the difference between subscription tiers for ADAPT integration?",
      answer: "Free tier: Basic ADAPT export only. Pro tier: Full bidirectional sync with field boundaries and real-time data exchange. API tier: Complete developer access with custom integrations, batch processing, and white-label capabilities. Choose based on your integration complexity needs."
    },
    {
      question: "Can I import field boundaries from my existing farm management system?",
      answer: "Yes! Pro and API tiers support bidirectional ADAPT sync, meaning you can import field boundaries from John Deere, Case IH, or other ADAPT-compatible systems, then enhance them with our soil intelligence and sync the enriched data back to your primary farm management platform."
    },
    {
      question: "What water-quality information do I get?",
      answer: "For every county you'll see: EPA SDWIS contaminant levels, comparison against Maximum Contaminant Levels (MCLs), impaired-water-body counts, and a 1-10 risk score for fertilizer runoff. This data is now exportable in ADAPT format for integration with farm management systems."
    },
    {
      question: "Are the water-quality grades reliable for health decisions?",
      answer: "The grades come from EPA's quarterly SDWIS database and are for educational purposes only. Always consult local water utilities or certified labs for final health decisions."
    },
    {
      question: "How do personalized filter recommendations work?",
      answer: "Based on your county's contaminant profile, we suggest 4 vetted filter types (activated-carbon, reverse-osmosis, etc.) and show expected contaminant-removal percentages and price ranges."
    },
    {
      question: "How often is data updated and synced?",
      answer: "EPA publishes SDWIS updates quarterly; our nightly job refreshes the cache every 24h. Soil data updates monthly from USDA SSURGO. ADAPT integration sync frequency depends on your tier: Manual (Free), Daily/Weekly (Pro), or Real-time (API tier)."
    },
    {
      question: "Is the planting calendar available in the free tier?",
      answer: "Basic frost dates are shown, but the full planting-calendar widget (6 crops, harvest windows, color-coded badges) is in the Pro tier. ADAPT export of planting data requires Pro tier or higher."
    },
    {
      question: "Can I use the PDF reports for loan applications?",
      answer: "Yes. Pro-tier PDFs now include both soil and water-quality sections, formatted for agricultural lenders, insurers, and land appraisers. ADAPT-formatted data exports provide additional technical documentation for precision agriculture loan applications."
    },
    {
      question: "What official references support using professional soil and water reports for loan applications?",
      answer: "Multiple federal regulations mandate or recognize professional environmental assessments for agricultural lending: USDA Rural Development (7 CFR 4279.244) requires comprehensive property assessments including environmental factors for loans over $250,000. Farm Credit Administration (12 CFR 614.4265) mandates environmental risk assessment. ASTM E1527-21 sets industry standards for environmental due diligence required by most lenders. EPA Water Quality Standards (40 CFR 131) establish federal compliance benchmarks. These regulations establish that professional soil and water quality reports provide essential risk mitigation, regulatory compliance, and liability protection - making them valuable assets for loan applications, property valuations, and agricultural insurance."
    },
    {
      question: "What geographic areas does SoilSidekick Pro cover?",
      answer: "Our SSURGO soil database covers all US states and territories including Alaska, Hawaii, American Samoa, Republic of the Marshall Islands, Federated States of Micronesia, Republic of Palau, Guam, and Northern Mariana Islands. EPA SDWIS water data currently covers 297 counties with full territorial expansion rolling out in Q3–Q4 2025."
    },
    {
      question: "Do you still offer white-label solutions?",
      answer: "Absolutely—now with dual soil + water endpoints plus ADAPT Standard 1.0 integration APIs. Our API tier includes white-label ready solutions with custom branding. Contact enterprise@soilsidekickpro.com for custom branding and revenue-share agreements."
    },
    {
      question: "How does ADAPT integration help with vendor lock-in?",
      answer: "Instead of being trapped in one manufacturer's ecosystem, ADAPT Standard 1.0 lets you use the best tools for each job. Get soil intelligence from SoilSidekick Pro, planning from John Deere, application records from Case IH—all syncing through the industry-standard ADAPT protocol. True equipment manufacturer independence."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel in the customer portal; access continues until the end of the current billing period, then you drop back to the free tier. Your ADAPT integrations will switch to basic export-only mode."
    },
    {
      question: "Does your API have end-to-end encryption?",
      answer: "Our API uses industry-standard encryption in transit (HTTPS/TLS) and encryption at rest for all data storage. ADAPT integration data is encrypted and follows agricultural data security best practices. While not true end-to-end encryption (where data is encrypted client-side), our security model provides robust protection suitable for agricultural and environmental data with authentication, secure transmission, and encrypted database storage."
    },
    {
      question: "What's the difference between ADAPT and EFDI standards?",
      answer: "Both are agricultural data standards, but ADAPT (Agricultural Data Application Programming Toolkit) is more widely adopted by major equipment manufacturers like John Deere, Case IH, and AGCO. EFDI (Extended Farm Management Information Systems Data Interface) is another standard we're evaluating for future integration. We chose ADAPT 1.0 first due to broader industry support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about SoilSidekick Pro's Agricultural Intelligence platform and how it optimizes your soil and water quality decisions.
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Common Questions</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Contact our support team for personalized assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8 text-center shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our team is here to help you get the most out of SoilSidekick Pro's Agricultural Intelligence platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/pricing" 
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Pricing Plans
              </Link>
              <Link 
                to="/api-docs" 
                className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                API Documentation
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
