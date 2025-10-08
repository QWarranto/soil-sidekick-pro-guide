export type GuideCategory = 'quickstart' | 'feature' | 'integration' | 'validation';

export interface GuideStep {
  title: string;
  content: string;
  action?: {
    label: string;
    route?: string;
    external?: string;
  };
  tips?: string[];
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  steps: GuideStep[];
  requiredTier?: string[];
}

export const guides: Guide[] = [
  {
    id: 'new-farmer-quickstart',
    title: 'New Farmer Quick Start',
    description: 'Get started with SoilSidekick Pro in just 5 minutes',
    category: 'quickstart',
    estimatedTime: '5 min',
    difficulty: 'beginner',
    icon: 'Sprout',
    steps: [
      {
        title: 'Select Your County',
        content: 'Start by selecting your county to get localized soil and environmental data. This ensures all recommendations are specific to your region.',
        action: {
          label: 'Go to Soil Analysis',
          route: '/soil-analysis'
        },
        tips: [
          'Use the search function to quickly find your county',
          'Make sure to select the correct state first'
        ]
      },
      {
        title: 'Review Your First Analysis',
        content: 'Explore the comprehensive soil analysis including pH levels, organic matter, and nutrient content. Each metric includes actionable recommendations.',
        tips: [
          'Green indicators show optimal ranges',
          'Yellow/red indicators highlight areas needing attention',
          'Click on any metric for detailed explanations'
        ]
      },
      {
        title: 'Understand the Results',
        content: 'Learn to interpret soil pH, organic matter percentage, and NPK (Nitrogen, Phosphorus, Potassium) levels. These are the foundation of soil health.',
        action: {
          label: 'View User Guide',
          external: '/SoilSidekick_Pro_User_Guide.pdf'
        },
        tips: [
          'pH affects nutrient availability',
          'Organic matter improves soil structure',
          'NPK ratios vary by crop type'
        ]
      },
      {
        title: 'Export Your Report',
        content: 'Generate a PDF report of your soil analysis to share with agronomists or keep for your records.',
        tips: [
          'Reports include all metrics and recommendations',
          'Save reports to track changes over time',
          'Share with consultants for expert review'
        ]
      },
      {
        title: 'Explore Additional Features',
        content: 'Check out satellite intelligence, environmental assessments, and task management to get the most from SoilSidekick Pro.',
        action: {
          label: 'View All Features',
          route: '/features'
        }
      }
    ]
  },
  {
    id: 'trial-success-path',
    title: '7-Day Trial Success Path',
    description: 'Make the most of your trial period with this day-by-day guide',
    category: 'quickstart',
    estimatedTime: '7 days',
    difficulty: 'beginner',
    icon: 'Calendar',
    steps: [
      {
        title: 'Day 1: Setup & First Analysis',
        content: 'Complete your profile, select your primary field location, and run your first soil analysis. Familiarize yourself with the dashboard.',
        action: {
          label: 'Start Dashboard Tour',
          route: '/dashboard'
        },
        tips: [
          'Add multiple fields if you manage more than one location',
          'Enable notifications for important updates',
          'Bookmark frequently used features'
        ]
      },
      {
        title: 'Day 2: Satellite Intelligence',
        content: 'Explore AlphaEarth satellite data for your fields. Review vegetation health (NDVI), soil moisture, and environmental risk scores.',
        action: {
          label: 'View Field Mapping',
          route: '/field-mapping'
        },
        tips: [
          'Compare satellite data with your field observations',
          'Check historical data for seasonal patterns',
          'Note areas with consistent issues'
        ]
      },
      {
        title: 'Day 3: Compare with Field Data',
        content: 'Take field samples or compare recommendations with your current practices. Validate the accuracy of AI-generated insights.',
        tips: [
          'Document differences between AI and field observations',
          'Test recommendations on a small area first',
          'Track baseline metrics for comparison'
        ]
      },
      {
        title: 'Day 4: Environmental Assessment',
        content: 'Review EPA water quality data and fertilizer runoff risk for your area. Learn about sustainable farming practices.',
        action: {
          label: 'Check Water Quality',
          route: '/water-quality'
        },
        tips: [
          'Identify potential contamination sources',
          'Review historical water quality trends',
          'Plan mitigation strategies'
        ]
      },
      {
        title: 'Day 5: Advanced Features',
        content: 'Try carbon credit calculations, cost monitoring, and seasonal planning tools to maximize your farming efficiency.',
        action: {
          label: 'Explore Features',
          route: '/features'
        },
        tips: [
          'Calculate potential carbon credits',
          'Set up cost tracking for inputs',
          'Create seasonal task schedules'
        ]
      },
      {
        title: 'Day 6: Task Management',
        content: 'Set up your seasonal task schedule using pre-built templates. Plan your upcoming season with data-driven insights.',
        action: {
          label: 'Open Task Manager',
          route: '/task-manager'
        },
        tips: [
          'Use templates as starting points',
          'Customize tasks for your specific crops',
          'Set reminders for critical activities'
        ]
      },
      {
        title: 'Day 7: ROI Calculation & Decision',
        content: 'Calculate your return on investment based on trial usage. Review the value delivered and consider upgrading to continue access.',
        action: {
          label: 'View Pricing',
          route: '/pricing'
        },
        tips: [
          'Compare feature usage across tiers',
          'Consider seasonal needs and budget',
          'Review your most-used features'
        ]
      }
    ]
  },
  {
    id: 'soil-analysis-validation',
    title: 'Soil Analysis Validation Guide',
    description: 'Learn to validate and calibrate soil analysis results',
    category: 'validation',
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    icon: 'FlaskConical',
    steps: [
      {
        title: 'Upload Lab Results',
        content: 'If you have professional lab results, compare them with USDA database values to understand regional variations and calibrate recommendations.',
        tips: [
          'Lab results provide point-in-time accuracy',
          'USDA data shows regional averages',
          'Variations are normal and expected'
        ]
      },
      {
        title: 'Compare Data Points',
        content: 'Review pH, organic matter, and nutrient levels side-by-side. Identify significant differences and understand why they occur.',
        tips: [
          'Differences of 0.5 pH units are significant',
          'Organic matter varies by sampling depth',
          'Recent amendments affect nutrient levels'
        ]
      },
      {
        title: 'Understand Variations',
        content: 'Learn when to trust AI analysis vs. lab results. USDA data is averaged across counties, while lab results are field-specific.',
        tips: [
          'Use lab results for precise applications',
          'Use USDA data for regional comparisons',
          'Combine both for comprehensive planning'
        ]
      },
      {
        title: 'Calibrate Recommendations',
        content: 'Adjust fertilizer and amendment recommendations based on your validated data and crop requirements.',
        action: {
          label: 'View Fertilizer Analysis',
          route: '/fertilizer-footprint'
        },
        tips: [
          'Start with conservative applications',
          'Monitor crop response',
          'Adjust based on results'
        ]
      },
      {
        title: 'Track Changes Over Time',
        content: 'Document seasonal changes in soil properties. Export reports regularly to build a historical record.',
        tips: [
          'Test at the same time each year',
          'Keep detailed application records',
          'Note weather and management changes'
        ]
      }
    ]
  },
  {
    id: 'satellite-intelligence',
    title: 'Satellite Intelligence Interpretation',
    description: 'Master AlphaEarth satellite data analysis',
    category: 'feature',
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    icon: 'Satellite',
    steps: [
      {
        title: 'Understanding NDVI',
        content: 'NDVI (Normalized Difference Vegetation Index) measures plant health and vigor. Values range from -1 to +1, with higher values indicating healthier vegetation.',
        tips: [
          'NDVI > 0.6 indicates healthy, dense vegetation',
          'NDVI 0.2-0.4 suggests sparse or stressed vegetation',
          'NDVI < 0.2 indicates bare soil or dead vegetation'
        ]
      },
      {
        title: 'Soil Moisture Analysis',
        content: 'Review soil moisture levels to optimize irrigation timing and identify drainage issues. Satellite data provides field-scale moisture patterns.',
        tips: [
          'Compare with rainfall data',
          'Identify consistently wet or dry areas',
          'Plan irrigation scheduling'
        ]
      },
      {
        title: 'Environmental Risk Scores',
        content: 'Understand composite risk scores that combine multiple environmental factors including drought risk, disease pressure, and pest likelihood.',
        tips: [
          'High risk areas need preventive action',
          'Monitor risk trends over time',
          'Correlate with field observations'
        ]
      },
      {
        title: 'Confidence Scores',
        content: 'Each satellite measurement includes a confidence score. Use this to understand data reliability and when to verify with field observations.',
        tips: [
          'Cloud cover reduces confidence',
          'Recent data is generally more reliable',
          'Cross-reference low-confidence readings'
        ]
      },
      {
        title: 'Seasonal Patterns',
        content: 'Review historical satellite data to identify seasonal trends and plan for recurring issues.',
        action: {
          label: 'View Seasonal Planning',
          route: '/seasonal-planning'
        },
        tips: [
          'Track year-over-year changes',
          'Identify problem areas early',
          'Plan interventions proactively'
        ]
      }
    ]
  },
  {
    id: 'environmental-assessment',
    title: 'Environmental Assessment Guide',
    description: 'Interpret EPA water quality and runoff risk data',
    category: 'feature',
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    icon: 'Droplet',
    steps: [
      {
        title: 'EPA Water Quality Monitoring',
        content: 'Access real-time water quality data for nearby water bodies. Monitor pH, dissolved oxygen, nutrient levels, and contaminants.',
        action: {
          label: 'Check Water Quality',
          route: '/water-quality'
        },
        tips: [
          'Weekly monitoring shows trends',
          'Seasonal variations are normal',
          'Report unusual readings'
        ]
      },
      {
        title: 'Fertilizer Runoff Risk',
        content: 'Assess runoff risk based on soil type, slope, rainfall patterns, and application timing. Minimize environmental impact.',
        tips: [
          'Apply before moderate rain, not heavy storms',
          'Use buffer zones near water bodies',
          'Consider slow-release formulations'
        ]
      },
      {
        title: 'Sustainable Practices',
        content: 'Learn about cover crops, conservation tillage, and precision application techniques to reduce environmental impact.',
        tips: [
          'Cover crops prevent erosion',
          'No-till preserves soil structure',
          'Precision ag reduces waste'
        ]
      },
      {
        title: 'Organic Alternatives',
        content: 'Explore organic fertilizer options and biological amendments that reduce runoff risk while maintaining soil health.',
        action: {
          label: 'View Fertilizer Options',
          route: '/fertilizer-footprint'
        },
        tips: [
          'Compost improves soil structure',
          'Biochar enhances water retention',
          'Green manures add nutrients'
        ]
      },
      {
        title: 'Compliance & Reporting',
        content: 'Understand environmental regulations and maintain records for compliance with local, state, and federal requirements.',
        tips: [
          'Keep application records',
          'Document conservation practices',
          'Report spills immediately'
        ]
      }
    ]
  },
  {
    id: 'api-integration',
    title: 'API Integration Checklist',
    description: 'Step-by-step guide to integrate SoilSidekick with your systems',
    category: 'integration',
    estimatedTime: '20 min',
    difficulty: 'advanced',
    icon: 'Code',
    requiredTier: ['pro', 'enterprise'],
    steps: [
      {
        title: 'Generate API Key',
        content: 'Create a secure API key from your account settings. Store it safely - it will only be displayed once.',
        action: {
          label: 'API Documentation',
          route: '/api-docs'
        },
        tips: [
          'Use environment variables for keys',
          'Never commit keys to version control',
          'Rotate keys periodically'
        ]
      },
      {
        title: 'Test Authentication',
        content: 'Make a test API call to verify your authentication is working correctly. Start with a simple GET request.',
        tips: [
          'Use curl or Postman for testing',
          'Check response status codes',
          'Review error messages carefully'
        ]
      },
      {
        title: 'Set Up Webhooks',
        content: 'Configure webhook endpoints to receive real-time notifications for soil updates, satellite data, and environmental alerts.',
        tips: [
          'Secure endpoints with signatures',
          'Implement retry logic',
          'Log all webhook events'
        ]
      },
      {
        title: 'Handle Rate Limits',
        content: 'Implement proper rate limiting and error handling to ensure reliable integration.',
        tips: [
          'Respect rate limit headers',
          'Implement exponential backoff',
          'Cache responses when appropriate'
        ]
      },
      {
        title: 'Monitor & Optimize',
        content: 'Set up monitoring for API usage, errors, and performance. Optimize calls to reduce costs and improve reliability.',
        tips: [
          'Track API usage metrics',
          'Set up error alerts',
          'Batch requests when possible'
        ]
      }
    ]
  },
  {
    id: 'sensor-integration',
    title: 'Soil Sensor Integration',
    description: 'Connect and calibrate soil sensors for real-time monitoring',
    category: 'integration',
    estimatedTime: '25 min',
    difficulty: 'advanced',
    icon: 'Radio',
    requiredTier: ['pro', 'enterprise'],
    steps: [
      {
        title: 'Choose Compatible Sensors',
        content: 'Select from our list of compatible professional and DIY soil sensor systems. Ensure they support the required data protocols.',
        action: {
          label: 'View User Guide',
          external: '/SoilSidekick_Pro_User_Guide.pdf'
        },
        tips: [
          'Professional sensors offer higher accuracy',
          'DIY sensors are cost-effective for testing',
          'Ensure cellular/wifi connectivity'
        ]
      },
      {
        title: 'Physical Installation',
        content: 'Install sensors at appropriate depths and locations. Follow manufacturer guidelines for soil preparation and placement.',
        tips: [
          'Install at multiple depths for profiles',
          'Avoid rocks and roots',
          'Ensure good soil contact',
          'Protect from equipment damage'
        ]
      },
      {
        title: 'Configure API Connection',
        content: 'Set up webhook or polling integration to push sensor data to SoilSidekick. Configure data format and update frequency.',
        tips: [
          'Webhooks provide real-time updates',
          'Polling works for simpler setups',
          'Test with sample data first'
        ]
      },
      {
        title: 'Calibrate Readings',
        content: 'Calibrate sensor readings against lab samples and field observations. Adjust thresholds for your specific conditions.',
        tips: [
          'Compare with soil samples',
          'Account for soil type differences',
          'Recalibrate seasonally'
        ]
      },
      {
        title: 'Set Up Alerts',
        content: 'Configure automated alerts for critical conditions like low moisture, extreme temperatures, or nutrient depletion.',
        tips: [
          'Set appropriate thresholds',
          'Avoid alert fatigue',
          'Test notification delivery'
        ]
      }
    ]
  },
  {
    id: 'seasonal-planning',
    title: 'Seasonal Planning Workflow',
    description: 'Create data-driven seasonal plans for optimal results',
    category: 'feature',
    estimatedTime: '18 min',
    difficulty: 'intermediate',
    icon: 'CalendarRange',
    steps: [
      {
        title: 'Pre-Season Analysis',
        content: 'Start with comprehensive soil analysis and review historical data. Identify areas needing amendments before planting.',
        action: {
          label: 'Seasonal Planning',
          route: '/seasonal-planning'
        },
        tips: [
          'Test soil 2-3 months before planting',
          'Review previous season results',
          'Plan crop rotation'
        ]
      },
      {
        title: 'Create Task Schedule',
        content: 'Use pre-built templates to create your seasonal task schedule. Customize for your specific crops and conditions.',
        action: {
          label: 'Task Manager',
          route: '/task-manager'
        },
        tips: [
          'Include all critical activities',
          'Add buffer time for weather',
          'Assign responsibilities'
        ]
      },
      {
        title: 'Monitor Progress',
        content: 'Track task completion and adjust plans based on weather, crop development, and field observations.',
        tips: [
          'Update tasks weekly',
          'Document changes and reasons',
          'Share updates with team'
        ]
      },
      {
        title: 'In-Season Adjustments',
        content: 'Use satellite data and environmental monitoring to make timely adjustments to irrigation, fertilization, and pest management.',
        tips: [
          'Review satellite data weekly',
          'Respond to weather forecasts',
          'Document all applications'
        ]
      },
      {
        title: 'Post-Season Review',
        content: 'Document results, calculate ROI, and identify improvements for next season. Export reports for record-keeping.',
        tips: [
          'Calculate actual vs. planned costs',
          'Note what worked well',
          'Plan improvements for next year'
        ]
      }
    ]
  }
];

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return guides.filter(guide => guide.category === category);
}

export function getGuideById(id: string): Guide | undefined {
  return guides.find(guide => guide.id === id);
}

export function getRecommendedGuides(userTier?: string): Guide[] {
  return guides.filter(guide => {
    if (!guide.requiredTier) return true;
    if (!userTier) return false;
    return guide.requiredTier.includes(userTier);
  }).slice(0, 3);
}
