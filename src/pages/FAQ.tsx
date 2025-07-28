
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
      answer: "It's the new umbrella for SoilSidekick Pro's combined soil + water insights, planting calendars, and eco-fertilizer recommendations—delivered county-by-county, in plain English, with government-grade data from USDA & EPA."
    },
    {
      question: "What water-quality information do I get?",
      answer: "For every county you'll see: EPA SDWIS contaminant levels, comparison against Maximum Contaminant Levels (MCLs), impaired-water-body counts, and a 1-10 risk score for fertilizer runoff."
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
      question: "How often is water-quality data updated?",
      answer: "EPA publishes SDWIS updates quarterly; our nightly job refreshes the cache every 24 h. Soil data continues to update monthly from USDA SSURGO."
    },
    {
      question: "Is the planting calendar available in the free tier?",
      answer: "Basic frost dates are shown, but the full planting-calendar widget (6 crops, harvest windows, color-coded badges) is in the Pro tier."
    },
    {
      question: "Can I use the PDF reports for loan applications?",
      answer: "Yes. Pro-tier PDFs now include both soil and water-quality sections, formatted for agricultural lenders, insurers, and land appraisers."
    },
    {
      question: "Why only 297 counties for water data?",
      answer: "EPA SDWIS 2024 covers public water systems in 297 counties first. We're rolling out the remaining ~2,800 counties in Q3–Q4 2025 as new EPA datasets arrive."
    },
    {
      question: "Do you still offer white-label solutions?",
      answer: "Absolutely—now with dual soil + water endpoints. Contact enterprise@soilsidekick.com for custom branding and revenue-share agreements."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel in the customer portal; access continues until the end of the current billing period, then you drop back to the free tier."
    },
    {
      question: "Does your API have end-to-end encryption?",
      answer: "Our API uses industry-standard encryption in transit (HTTPS/TLS) and encryption at rest for all data storage. While not true end-to-end encryption (where data is encrypted client-side), our security model provides robust protection suitable for agricultural and environmental data with authentication, secure transmission, and encrypted database storage."
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
