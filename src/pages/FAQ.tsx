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
      question: "What makes SoilSidekick Pro different from other agricultural analysis tools?",
      answer: "SoilSidekick Pro provides instant, county-level soil AND water quality data from USDA SSURGO and EPA SDWIS databases. Unlike other tools that require GIS expertise or provide only state-level averages, we deliver comprehensive agricultural intelligence for all 3,143 U.S. counties in plain English, with professional PDF exports ready for lenders and advisors."
    },
    {
      question: "How accurate is the soil and water quality data?",
      answer: "Our soil data comes directly from the USDA's Soil Survey Geographic Database (SSURGO), while water quality data comes from the EPA's Safe Drinking Water Information System (SDWIS). Both are the most comprehensive datasets available in the United States, collected by professional scientists and updated regularly by federal agencies."
    },
    {
      question: "What water quality information do you provide?",
      answer: "We provide comprehensive water quality analysis including EPA contaminant levels for lead, chlorine, nitrates, fluoride, and other regulated substances. You'll see current levels vs. EPA Maximum Contaminant Levels (MCL), violation status, and receive personalized filter recommendations based on your county's specific water quality profile."
    },
    {
      question: "What's included in the free tier?",
      answer: "The free tier includes basic soil reports for any U.S. county, showing soil texture, pH levels, organic matter content, basic NPK information, and water quality grades. You can view up to 5 counties per month and access our interactive maps."
    },
    {
      question: "What additional features do I get with Pro?",
      answer: "Pro subscribers get unlimited county lookups, comprehensive water quality analysis with EPA contaminant data, filter recommendations, professional PDF exports perfect for lenders and advisors, historical trend data, soil amendment calculations, and priority customer support. Pro is ideal for serious gardeners, small farmers, and agricultural professionals."
    },
    {
      question: "How does the API pricing work?",
      answer: "Our API is designed for developers and businesses who want to integrate soil data into their applications. We offer usage-based pricing starting at $49/month for up to 1,000 API calls, with volume discounts available for enterprise customers. Revenue-sharing partnerships are available for qualified agricultural retailers."
    },
    {
      question: "Can I use the PDF reports for loan applications?",
      answer: "Yes! Our Pro-tier PDF reports are specifically formatted to meet the documentation requirements of agricultural lenders and include all the technical details needed for loan applications, insurance claims, and land assessments."
    },
    {
      question: "Do you offer white-label solutions?",
      answer: "Yes, we provide white-label API solutions for agricultural software companies, seed retailers, and agronomy platforms. Contact our enterprise team to discuss custom branding, revenue-sharing arrangements, and integration support."
    },
    {
      question: "What happens if the USDA database is unavailable?",
      answer: "We maintain local cached copies of all county data with 30-day refresh cycles to ensure reliable service even during USDA system maintenance. Our edge caching infrastructure provides 99.9% uptime for critical soil data access."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We follow GDPR and CCPA compliance standards, use enterprise-grade encryption, and never sell or share your personal information. All data is stored securely on Supabase's SOC-2 compliant infrastructure."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro subscription at any time through your account dashboard. You'll continue to have Pro access through the end of your current billing period, after which you'll automatically return to our free tier."
    },
    {
      question: "Do you offer discounts for annual subscriptions?",
      answer: "Yes! Annual Pro subscribers save 20% compared to monthly billing. We also offer educational discounts for students and non-profit organizations - contact us for details."
    },
    {
      question: "How often is the soil and water data updated?",
      answer: "USDA SSURGO data is updated on a rolling basis as new soil surveys are completed. EPA water quality data is updated quarterly as utilities report their testing results. Our system automatically syncs with the latest government releases to ensure you always have access to the most current information available."
    },
    {
      question: "Are filter recommendations based on my specific water quality?",
      answer: "Yes! Our filter recommendations are personalized based on your county's specific contaminant profile. We analyze your water's lead, chlorine, nitrate, and other contaminant levels to recommend the most effective filtration solutions, potentially saving you money by avoiding unnecessary over-filtration."
    },
    {
      question: "Can I trust the water quality grades for health decisions?",
      answer: "Our water quality grades are based on EPA compliance data and Maximum Contaminant Levels (MCL). While this provides valuable insight into your water safety, we always recommend consulting with health professionals for specific health concerns and following EPA guidelines for safe drinking water practices."
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
              Everything you need to know about SoilSidekick Pro and how it can help optimize your soil and water quality decisions.
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
              Our team is here to help you get the most out of SoilSidekick Pro.
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