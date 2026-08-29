import type { FlooringSystem } from './types'

export const VERIFIED_AT = '2026-08-29'

export const BUSINESS_FACTS = {
  businessName: 'SurfacePilot Commercial Flooring',
  status: 'fictional-demo' as const,
  disclosure: 'Synthetic business data for an ATREUS agent-native demonstration. No real contractor is represented.',
  market: 'Dallas–Fort Worth demonstration market',
  capabilities: [
    'Compare commercial flooring systems against stated project constraints',
    'Prepare a non-binding project brief for human review',
    'Flag information that requires an on-site professional assessment',
  ],
  limitations: [
    'No prices, warranties, schedules, or availability are promised',
    'No quote, booking, submission, payment, or message can be made',
    'Every recommendation requires substrate and site-condition review',
  ],
  provenance: {
    source: 'Synthetic SurfacePilot business pack v1',
    verifiedAt: VERIFIED_AT,
    owner: 'ATREUS WebMCP Lab',
  },
} as const

export const ELIGIBLE_CITIES = [
  'addison',
  'arlington',
  'carrollton',
  'dallas',
  'farmers branch',
  'garland',
  'irving',
  'mesquite',
  'plano',
  'richardson',
] as const

export const INELIGIBLE_CITIES = ['austin', 'houston', 'san antonio', 'waco'] as const

export const FLOORING_SYSTEMS: FlooringSystem[] = [
  {
    id: 'urethane-cement',
    name: 'Urethane cement',
    bestFor: ['commercial kitchens', 'thermal cycling', 'wet processing areas'],
    minimumShutdownDays: 4,
    strengths: ['High heat and moisture tolerance', 'Strong chemical resistance', 'Textured slip-resistant finish available'],
    cautions: ['Longer shutdown than rapid-cure systems', 'Utilitarian finish unless a decorative broadcast is added'],
    requiresSiteReview: ['Moisture-vapor condition', 'Drainage and slope', 'Thermal exposure'],
  },
  {
    id: 'epoxy-quartz',
    name: 'Epoxy quartz',
    bestFor: ['dining rooms', 'restrooms', 'front-of-house service zones'],
    minimumShutdownDays: 4,
    strengths: ['Decorative aggregate appearance', 'Seamless and cleanable', 'Texture can improve slip resistance'],
    cautions: ['Performance depends on slab preparation', 'Not the first choice for repeated high-heat washdown'],
    requiresSiteReview: ['Slab profile and cracks', 'Moisture-vapor condition', 'Desired texture and cleanability balance'],
  },
  {
    id: 'polished-concrete',
    name: 'Polished concrete',
    bestFor: ['dry dining areas', 'retail floors', 'open public spaces'],
    minimumShutdownDays: 7,
    strengths: ['Uses the existing slab as the finish', 'Low routine maintenance', 'Natural material variation'],
    cautions: ['Existing slab appearance controls the result', 'Not suited to every wet or grease-prone zone', 'Usually needs the longest shutdown in this comparison'],
    requiresSiteReview: ['Existing slab condition', 'Patch and aggregate variation', 'Wet-zone exposure'],
  },
  {
    id: 'fast-cure-polyaspartic',
    name: 'Fast-cure polyaspartic',
    bestFor: ['short shutdowns', 'dry service zones', 'rapid return-to-use projects'],
    minimumShutdownDays: 2,
    strengths: ['Fast return to service', 'Decorative broadcast options', 'Good abrasion resistance'],
    cautions: ['Short working time increases installation sensitivity', 'Wet kitchens may need a more heat-tolerant system'],
    requiresSiteReview: ['Slab temperature and moisture', 'Operating heat', 'Required texture'],
  },
]
