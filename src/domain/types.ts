export type ServiceAreaStatus = 'eligible' | 'ineligible' | 'unknown'

export type ProjectType = 'restaurant' | 'retail' | 'warehouse' | 'office'

export type Priority =
  | 'short-shutdown'
  | 'heat-resistance'
  | 'slip-resistance'
  | 'easy-maintenance'
  | 'appearance'

export interface ProjectInput {
  city: string
  projectType: ProjectType
  squareFeet: number
  shutdownDays: number
  priorities: Priority[]
}

export interface ServiceAreaResult {
  city: string
  status: ServiceAreaStatus
  reason: string
  approvedAt: string
}

export interface FlooringSystem {
  id: 'urethane-cement' | 'epoxy-quartz' | 'polished-concrete' | 'fast-cure-polyaspartic'
  name: string
  bestFor: string[]
  minimumShutdownDays: number
  strengths: string[]
  cautions: string[]
  requiresSiteReview: string[]
}

export interface RankedSystem extends FlooringSystem {
  score: number
  fit: 'strong' | 'conditional' | 'not-recommended'
  rationale: string[]
}

export interface FitBoard {
  revision: number
  project: ProjectInput
  serviceArea: ServiceAreaResult
  recommendations: RankedSystem[]
  assumptions: string[]
  missingInformation: string[]
  disclaimer: string
}

export interface ProjectBrief {
  revision: number
  fitBoardRevision: number
  createdAt: string
  summary: string
  recommendation: string
  tradeoffs: string[]
  questionsForSiteReview: string[]
  disclaimer: string
}

export interface ApprovalReceipt {
  receiptId: string
  draftRevision: number
  contentHash: string
  approvedAt: string
  statement: string
}
