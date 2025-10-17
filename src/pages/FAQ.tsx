
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
      question: "What is the Seasonal Task Manager and how does it help me?",
      answer: "The Seasonal Task Manager helps you remember and improve farming practices from one season to the next. One of the biggest challenges farmers face is forgetting what needs to be done and when. The Task Manager provides 20+ pre-built task templates, recurring task automation, and task history tracking so you never forget critical seasonal tasks. Free tier allows 10 tasks, Starter tier offers unlimited tasks with annual recurring, and Pro tier adds advanced recurring patterns and AI-powered insights."
    },
    {
      question: "What task templates are available?",
      answer: "SoilSidekick Pro includes 20+ professionally crafted seasonal task templates covering soil preparation, planting (cool and warm season), irrigation setup, fertilization, pest management, harvest operations, cover crop planting, equipment maintenance, and record keeping. Each template includes recommended timing (e.g., '2 weeks before last frost'), estimated duration, and crop-specific guidance. You can customize any template for your specific farm needs."
    },
    {
      question: "How do recurring tasks work?",
      answer: "Recurring tasks automatically remind you of seasonal activities year after year. Starter tier ($29/mo) includes annual recurring tasks - perfect for yearly activities like spring soil testing or fall cover crop planting. Pro tier ($79/mo) unlocks advanced recurring patterns including seasonal (quarterly), monthly, and custom frequencies - ideal for intensive rotations, succession planting, and frequent monitoring tasks. Free tier does not support recurring tasks."
    },
    {
      question: "What's the difference between Free, Starter, and Pro tiers for task management?",
      answer: "Free tier: View templates (read-only) and create up to 10 tasks per season with basic status tracking. Starter tier ($29/mo): Unlimited tasks, full template library access, task history tracking, annual recurring tasks, field assignment, and 50 email reminders/month. Pro tier ($79/mo): Everything in Starter plus advanced recurring patterns (seasonal/monthly/custom), task learnings & notes, year-over-year comparison, AI recommendations, unlimited reminders, and task export. Enterprise tier adds team collaboration and API access."
    },
    {
      question: "Can I track what worked and what didn't for each task?",
      answer: "Yes! The Task History & Learnings feature (available with Starter+ plans, currently in development for Q2 2025) will let you document completion notes, what worked, what to improve, outcome ratings, and attach photos. This creates a personalized farming knowledge base that helps you improve operations year over year. You'll be able to compare tasks across years and get AI-powered insights from your historical data."
    },
    {
      question: "How do I access the Task Manager?",
      answer: "Access the Seasonal Task Manager from three locations: Click 'Manage Seasonal Tasks' button on the Dashboard, use the 'Task Manager' button in Seasonal Planning, or navigate directly to /task-manager. The interface includes three main sections: My Tasks (active/pending), Task Library (pre-built templates), and History & Learnings (completed tasks with notes)."
    },
    {
      question: "How does the Enhanced Agricultural Q&A Chat work?",
      answer: "Our Enhanced Agricultural Q&A Chat uses GPT-5's advanced reasoning to provide sophisticated agricultural insights. It analyzes complex queries about soil health, crop management, pest control, and sustainability practices, delivering detailed, actionable recommendations tailored to your specific location and conditions. The system automatically uses GPT-5 when available, with seamless fallback to GPT-4o for consistent service."
    },
    {
      question: "What are Smart Report Summaries?",
      answer: "Smart Report Summaries automatically generate executive summaries for both soil analysis and water quality reports using GPT-5's intelligent analysis. These summaries highlight key findings, critical issues, priority recommendations, and economic/business impacts in a concise, professional format suitable for farmers, landowners, and agricultural lenders."
    },
    {
      question: "How does the Seasonal Planning Assistant help with crop planning?",
      answer: "The Seasonal Planning Assistant leverages GPT-5 to create comprehensive seasonal strategies including 3-4 year crop rotation plans, month-by-month planting schedules, soil management recommendations, weather considerations, economic optimization, and sustainability practices. It integrates real-time weather data and considers your specific soil conditions and crop preferences."
    },
    {
      question: "What planning options are available in the Seasonal Planning Assistant?",
      answer: "The Seasonal Planning Assistant offers multiple planning types: Crop Rotation Planning for optimized field sequences, Seasonal Planting Calendar for timing optimization, Soil Health Improvement for long-term fertility, Market-Optimized Planning for economic benefits, and Sustainable Practices for environmental stewardship. You can plan for 1-year, 3-year, or 5-year timeframes."
    },
    {
      question: "Are the GPT-5 enhanced features available to all users?",
      answer: "The Enhanced Agricultural Q&A Chat is available to all authenticated users and automatically uses the most advanced AI model available. Smart Report Summaries are auto-generated for all soil and water quality reports. The Seasonal Planning Assistant requires location selection but is accessible to all users once a county is chosen."
    },
    {
      question: "How accurate and reliable are the GPT-5 enhanced recommendations?",
      answer: "Our GPT-5 enhanced features are trained on comprehensive agricultural knowledge and use the latest AI reasoning capabilities. However, they complement rather than replace professional agricultural advice. All recommendations should be validated with local agricultural extension services and adapted to your specific farming conditions and local regulations."
    },
    {
      question: "How do the AI Crop Recommendations work?",
      answer: "Our AI Crop Recommendations system uses GPT-5 to analyze your specific location, soil conditions, weather patterns, and market data to provide personalized crop suitability scores. The system evaluates yield potential, profit opportunities, environmental impact, and growing requirements for traditional crops like corn and soybeans, as well as alternative crops. Each recommendation includes confidence levels, pros/cons analysis, and detailed growing requirements."
    },
    {
      question: "Can I get recommendations for crops not shown in the default list?",
      answer: "Absolutely! Click the 'Add Crop' button in the AI Crop Recommendations section to request analysis for any crop you're considering - from specialty crops like quinoa and hemp to cover crops like buckwheat and clover. The AI will analyze the crop's suitability for your specific location and provide the same detailed assessment as traditional crops, including market outlook and environmental considerations."
    },
    {
      question: "What factors determine crop recommendation scores?",
      answer: "AI crop recommendations consider multiple factors: your county's climate zone and growing season, current soil conditions (pH, organic matter, moisture), weather patterns and forecasts, historical yield data, market prices and demand trends, water and nitrogen requirements, environmental impact including carbon footprint, and regional expertise. Each factor is weighted using GPT-5's advanced reasoning to provide a comprehensive suitability score from 0-100%."
    },
    {
      question: "How fresh is the data in soil health trends and weather forecasts?",
      answer: "SoilSidekick Pro now features live data refresh capabilities. Weather forecast data comes directly from NOAA APIs when available, with real-time updates. Soil health trends integrate live agricultural data from USDA sources. Each chart shows the data source (live vs. simulated) and last refresh time. You can manually refresh data using the refresh buttons on each chart or the main dashboard refresh to force live updates from federal databases."
    },
    {
      question: "What exactly is \"Agricultural Intelligence\"?",
      answer: "It's the new umbrella for SoilSidekick Pro's combined soil + water insights, planting calendars, and eco-fertilizer recommendations—delivered county-by-county, in plain English, with government-grade data from USDA & EPA. Now enhanced with ADAPT Standard 1.0 integration, Google AlphaEarth satellite intelligence, local Gemma AI processing, and GPT-5 powered agricultural intelligence for comprehensive environmental impact analysis."
    },
    {
      question: "What is local AI processing and how does it protect my privacy?",
      answer: "Local AI processing uses Google's Gemma language models that run directly on your device. This means your agricultural data never leaves your computer - all AI analysis happens locally. You get intelligent recommendations and summaries while maintaining complete data privacy, and it works even without internet connectivity."
    },
    {
      question: "Do I need internet connectivity to use SoilSidekick Pro?",
      answer: "While internet connectivity is required for real-time EPA data and satellite imagery, our local AI processing allows you to generate soil analysis summaries and get agricultural guidance offline. The system automatically switches between cloud and local processing based on your connection status and privacy preferences."
    },
    {
      question: "What is AlphaEarth satellite enhancement and how does it work?",
      answer: "Our Google AlphaEarth integration uses advanced satellite embeddings to provide real-time environmental insights including vegetation health, soil moisture levels, erosion risk assessment, and water stress indicators. This satellite intelligence enhances our soil analysis with 10m resolution data, improving the accuracy of environmental impact scores and recommendations by up to 35%."
    },
    {
      question: "How does satellite-enhanced environmental impact analysis improve my farming decisions?",
      answer: "The AlphaEarth integration provides enhanced runoff risk calculations, contamination risk assessments with vegetation health factors, biodiversity impact scores, and carbon footprint analysis with real vegetation carbon sequestration data. This gives you more precise, location-specific recommendations for sustainable farming practices and environmental compliance."
    },
    {
      question: "What environmental insights do I get from the satellite enhancement?",
      answer: "You receive detailed analysis of vegetation health (high/moderate/low), water stress indicators, soil moisture levels, erosion risk assessment, and their impact on runoff potential, contamination risk, and biodiversity. The system also provides confidence scores for each assessment and generates targeted eco-friendly alternatives based on real-time satellite observations."
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
      answer: "Free tier: Basic ADAPT export only. Pro tier: Full bidirectional sync with field boundaries, real-time data exchange, AlphaEarth satellite enhancement, and GPT-5 enhanced features. Enterprise tier: Complete developer access with custom integrations, batch processing, satellite data access, and white-label capabilities. Choose based on your integration complexity needs."
    },
    {
      question: "Can I import field boundaries from my existing farm management system?",
      answer: "Yes! Pro and Enterprise tiers support bidirectional ADAPT sync, meaning you can import field boundaries from John Deere, Case IH, or other ADAPT-compatible systems, then enhance them with our soil intelligence, GPT-5 powered recommendations, and satellite-derived environmental insights, syncing the enriched data back to your primary farm management platform."
    },
    {
      question: "What water-quality information do I get?",
      answer: "For every county you'll see: EPA SDWIS contaminant levels, comparison against Maximum Contaminant Levels (MCLs), impaired-water-body counts, and a 1-10 risk score for fertilizer runoff enhanced with satellite water stress data. This data is now exportable in ADAPT format for integration with farm management systems, and includes GPT-5 generated smart summaries."
    },
    {
      question: "Are the water-quality grades reliable for health decisions?",
      answer: "The grades come from EPA's quarterly SDWIS database and are for educational purposes only. Always consult local water utilities or certified labs for final health decisions. Our Smart Report Summaries provide additional context and interpretation but should not replace professional water quality analysis."
    },
    {
      question: "How do personalized filter recommendations work?",
      answer: "Based on your county's contaminant profile, we suggest 4 vetted filter types (activated-carbon, reverse-osmosis, etc.) and show expected contaminant-removal percentages and price ranges. Our GPT-5 Enhanced Agricultural Q&A Chat can provide detailed guidance on choosing the right filtration system for your specific agricultural needs."
    },
    {
      question: "How often is data updated and synced?",
      answer: "EPA publishes SDWIS updates quarterly; our nightly job refreshes the cache every 24h. Soil data updates monthly from USDA SSURGO. Satellite data from AlphaEarth updates annually with real-time processing for environmental impact analysis. GPT-5 enhanced features provide real-time analysis and recommendations. ADAPT integration sync frequency depends on your tier: Manual (Free), Daily/Weekly (Pro), or Real-time (Enterprise tier)."
    },
    {
      question: "Is the planting calendar available in the free tier?",
      answer: "Basic frost dates are shown, but the full planting-calendar widget (6 crops, harvest windows, color-coded badges) is in the Pro tier. ADAPT export of planting data requires Pro tier or higher. The Seasonal Planning Assistant provides enhanced planning capabilities with GPT-5 powered recommendations available to all users."
    },
    {
      question: "Can I use the PDF reports for loan applications?",
      answer: "Yes. Pro-tier PDFs now include both soil and water-quality sections with GPT-5 generated Smart Report Summaries, formatted for agricultural lenders, insurers, and land appraisers. ADAPT-formatted data exports and satellite-enhanced environmental impact assessments provide additional technical documentation for precision agriculture loan applications."
    },
    {
      question: "What official references support using professional soil and water reports for loan applications?",
      answer: "Multiple federal regulations mandate or recognize professional environmental assessments for agricultural lending: USDA Rural Development (7 CFR 4279.244) requires comprehensive property assessments including environmental factors for loans over $250,000. Farm Credit Administration (12 CFR 614.4265) mandates environmental risk assessment. ASTM E1527-21 sets industry standards for environmental due diligence required by most lenders. EPA Water Quality Standards (40 CFR 131) establish federal compliance benchmarks. These regulations establish that professional soil and water quality reports provide essential risk mitigation, regulatory compliance, and liability protection - making them valuable assets for loan applications, property valuations, and agricultural insurance."
    },
    {
      question: "What geographic areas does SoilSidekick Pro cover?",
      answer: "Our SSURGO soil database covers all US states and territories including Alaska, Hawaii, American Samoa, Republic of the Marshall Islands, Federated States of Micronesia, Republic of Palau, Guam, and Northern Mariana Islands. EPA SDWIS water data currently covers 297 counties with full territorial expansion rolling out in Q3–Q4 2025. AlphaEarth satellite coverage is global with 10m resolution. GPT-5 enhanced features are available for all covered locations."
    },
    {
      question: "Do you still offer white-label solutions?",
      answer: "Absolutely—now with dual soil + water endpoints, ADAPT Standard 1.0 integration APIs, AlphaEarth satellite intelligence, and GPT-5 enhanced agricultural AI features. Our Enterprise tier includes white-label ready solutions with custom branding. Contact enterprise@soilsidekickpro.com for custom branding and revenue-share agreements."
    },
    {
      question: "How does ADAPT integration help with vendor lock-in?",
      answer: "Instead of being trapped in one manufacturer's ecosystem, ADAPT Standard 1.0 lets you use the best tools for each job. Get soil intelligence from SoilSidekick Pro, planning from John Deere, application records from Case IH—all syncing through the industry-standard ADAPT protocol. True equipment manufacturer independence with GPT-5 enhanced recommendations."
    },
    {
      question: "How accurate is the satellite-enhanced environmental analysis?",
      answer: "Our AlphaEarth integration provides confidence scores ranging from 0.5 to 0.95 for each environmental assessment. The system analyzes variance in satellite embeddings to ensure reliability. Typical confidence scores are 0.8+ for vegetation health assessments and 0.7+ for soil moisture indicators, significantly improving traditional soil analysis accuracy. GPT-5 enhanced analysis adds additional interpretation and context."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel in the customer portal; access continues until the end of the current billing period, then you drop back to the free tier. Your ADAPT integrations will switch to basic export-only mode, satellite enhancement features will be disabled, but GPT-5 enhanced features like the Agricultural Q&A Chat remain available."
    },
    {
      question: "Does your API have end-to-end encryption?",
      answer: "Our API uses industry-standard encryption in transit (HTTPS/TLS) and encryption at rest for all data storage. ADAPT integration data, AlphaEarth satellite insights, and GPT-5 enhanced features are encrypted and follow agricultural data security best practices. While not true end-to-end encryption (where data is encrypted client-side), our security model provides robust protection suitable for agricultural and environmental data with authentication, secure transmission, and encrypted database storage."
    },
    {
      question: "What's the difference between ADAPT and EFDI standards?",
      answer: "Both are agricultural data standards, but ADAPT (Agricultural Data Application Programming Toolkit) is more widely adopted by major equipment manufacturers like John Deere, Case IH, and AGCO. EFDI (Extended Farm Management Information Systems Data Interface) is another standard we're evaluating for future integration. We chose ADAPT 1.0 first due to broader industry support and better integration with our GPT-5 enhanced features."
    },
    {
      question: "What is Variable Rate Technology (VRT) and how does it help my farm?",
      answer: "Variable Rate Technology allows GPS-enabled tractors to apply fertilizers, seeds, water, and other inputs at different rates across your field based on soil variability. Our AI-powered VRT prescription maps divide your field into 3-5 management zones with optimized application rates for each zone. This precision approach can reduce input costs by up to 30% while maintaining or improving yields by applying more inputs where needed and less where soil is already optimal."
    },
    {
      question: "How do I create a VRT prescription map?",
      answer: "Navigate to the Variable Rate Technology page, select your field, choose the application type (fertilizer, seed, water, or pesticide), enter your base application rate and crop type, then click 'Generate Prescription Map.' Our AI analyzes your field's soil data and creates zone-specific application rates. You can then export the prescription map in ADAPT, Shapefile, or ISO-XML formats to load into your tractor's precision agriculture system."
    },
    {
      question: "Which equipment is compatible with VRT prescription maps?",
      answer: "Our VRT prescription maps export in industry-standard formats (ADAPT, Shapefile, ISO-XML) that work with most modern precision agriculture equipment including John Deere AutoTrac, Case IH AFS, New Holland IntelliView, AGCO VarioDoc, Trimble, and Raven controllers. Any GPS-enabled planter, sprayer, or fertilizer applicator with variable rate capability can use our prescription maps."
    },
    {
      question: "What's the difference between VRT and ADAPT integration?",
      answer: "ADAPT integration allows you to export soil analysis data to farm management systems. VRT goes further by creating actionable prescription maps that your tractor can follow for variable rate application. ADAPT handles data exchange, while VRT provides the zone-based application instructions. They work together - create VRT maps in SoilSidekick Pro, export via ADAPT to your farm management system, then load into equipment."
    },
    {
      question: "What is SoilSidekick Pro's SOC 2 compliance status?",
      answer: "SoilSidekick Pro maintains SOC 2 Type 1 compliance, which means we undergo rigorous point-in-time security assessments of our controls and processes. This includes comprehensive monitoring of data access controls, encryption protocols, API security, payment processing security, and database security. Our SOC 2 Type 1 compliance demonstrates our commitment to protecting your agricultural data and maintaining enterprise-grade security standards for soil analysis, water quality data, and ADAPT integrations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 slide-in-up">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-smooth mb-6 story-link"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Everything you need to know about SoilSidekick Pro's Agricultural Intelligence platform and how it optimizes your soil and water quality decisions.
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <Card className="shadow-glow-primary card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Common Questions</CardTitle>
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
        <Card className="mt-8 text-center card-elevated hover:shadow-glow-primary animate-fade-in">
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
