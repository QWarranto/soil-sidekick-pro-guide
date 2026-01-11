import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  FileCheck, 
  Cloud, 
  TrendingDown, 
  Users,
  Clock,
  Shield,
  Zap,
  DollarSign,
  Target
} from "lucide-react";

interface BenefitMetric {
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
}

const benefits: BenefitMetric[] = [
  {
    title: "Faster Time-to-Market",
    subtitle: "Rapid Deployment",
    metric: "75%",
    metricLabel: "Faster Launch",
    description: "Deploy solutions in 6 months vs 18+ months traditional. Same-day first deploy with pre-built tools and streamlined workflows.",
    icon: <Rocket className="h-8 w-8" />,
    tag: "RAPID DEPLOYMENT",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  },
  {
    title: "No Federal Data Agreements",
    subtitle: "Simplified Access",
    metric: "0",
    metricLabel: "Legal Contracts",
    description: "Bypass complex regulatory hurdles. Access USDA, EPA, and NOAA data sources without cumbersome federal data agreements.",
    icon: <FileCheck className="h-8 w-8" />,
    tag: "SIMPLIFIED ACCESS",
    tagColor: "bg-orange-500/20 text-orange-300 border-orange-500/30"
  },
  {
    title: "No Satellite Pipelines",
    subtitle: "Cloud-Native Delivery",
    metric: "100%",
    metricLabel: "Cloud-Based",
    description: "Eliminate costly custom infrastructure. Leverage cloud-based data delivery without managing proprietary satellite hardware.",
    icon: <Cloud className="h-8 w-8" />,
    tag: "CLOUD-NATIVE DELIVERY",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  },
  {
    title: "Reduced Infrastructure Costs",
    subtitle: "Cost Savings",
    metric: "95%",
    metricLabel: "Lower Costs",
    description: "Minimize hardware investment and maintenance. $40K vs $756K traditional development with scalable, efficient resources.",
    icon: <DollarSign className="h-8 w-8" />,
    tag: "COST SAVINGS",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30"
  },
  {
    title: "Higher User Retention",
    subtitle: "Increased Engagement",
    metric: "5-10x",
    metricLabel: "Features/Week",
    description: "Boost engagement and loyalty. Deliver personalized, high-value precision insights that keep users coming back.",
    icon: <Users className="h-8 w-8" />,
    tag: "INCREASED ENGAGEMENT",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
  }
];

const additionalMetrics = [
  { label: "Development Savings", value: "$715K+", icon: <TrendingDown className="h-5 w-5" /> },
  { label: "Time to Profitability", value: "4-6 mo", icon: <Clock className="h-5 w-5" /> },
  { label: "Team Size Reduction", value: "75-88%", icon: <Target className="h-5 w-5" /> },
  { label: "Bug Fix Turnaround", value: "1-4 hrs", icon: <Zap className="h-5 w-5" /> },
];

export function DeveloperBenefitsInfographic() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-[hsl(210,80%,15%)] via-[hsl(210,70%,12%)] to-[hsl(210,60%,10%)] py-16 relative overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-primary" />
              <path d="M50 0 L50 48 M50 52 L50 100 M0 50 L48 50 M52 50 L100 50" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Shield className="mr-2 h-3 w-3" />
              Developer Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Developer Benefits: Accelerating Innovation & Efficiency
            </h2>
            <p className="text-lg text-blue-200/70 max-w-3xl mx-auto">
              Quantified advantages of building with LeafEngines™ vs. traditional agricultural data infrastructure
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden bg-gradient-to-b from-[hsl(210,50%,20%)] to-[hsl(210,50%,15%)] border-[hsl(210,50%,30%)] hover:border-primary/50 transition-all duration-300 group"
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  index === 0 ? 'bg-emerald-500' :
                  index === 1 ? 'bg-orange-500' :
                  index === 2 ? 'bg-purple-500' :
                  index === 3 ? 'bg-pink-500' :
                  'bg-amber-500'
                }`} />
                
                <div className="p-5">
                  {/* Icon */}
                  <div className="mb-4 text-blue-300/70 group-hover:text-primary transition-colors">
                    {benefit.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                    {benefit.title}
                  </h3>
                  
                  {/* Metric */}
                  <div className="my-4 py-3 border-y border-[hsl(210,50%,30%)]">
                    <div className="text-3xl font-bold text-white">
                      {benefit.metric}
                    </div>
                    <div className="text-sm text-blue-200/70">
                      {benefit.metricLabel}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-blue-200/60 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Tag */}
                  <Badge className={`text-xs ${benefit.tagColor} border`}>
                    {benefit.tag}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom Stats Bar */}
          <div className="relative">
            {/* Connecting line visual */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-transparent to-cyan-500" />
            
            <Card className="bg-gradient-to-r from-[hsl(210,60%,15%)] via-[hsl(200,70%,18%)] to-[hsl(210,60%,15%)] border-cyan-500/30 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
              
              <div className="relative p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {additionalMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 mb-2">
                        {metric.icon}
                      </div>
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div className="text-sm text-blue-200/60">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Source attribution */}
          <p className="text-center text-xs text-blue-200/40 mt-6">
            Metrics based on actual SoilSidekick Pro → LeafEngines™ development (July-December 2025) vs. traditional development estimates
          </p>
        </div>
      </div>
    </section>
  );
}
