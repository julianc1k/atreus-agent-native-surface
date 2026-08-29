import { BUSINESS_FACTS, ELIGIBLE_CITIES, FLOORING_SYSTEMS, INELIGIBLE_CITIES, VERIFIED_AT } from './business'
import { ProjectInputSchema, ServiceAreaInputSchema } from './validation'
import type { FitBoard, ProjectBrief, ProjectInput, RankedSystem, ServiceAreaResult } from './types'

function normalizeCity(city: string): string {
  return city.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ')
}

export function checkServiceArea(input: { city: string }): ServiceAreaResult {
  const { city } = ServiceAreaInputSchema.parse(input)
  const normalized = normalizeCity(city)
  if ((ELIGIBLE_CITIES as readonly string[]).includes(normalized)) {
    return {
      city: city.trim(),
      status: 'eligible',
      reason: `${city.trim()} is inside the synthetic SurfacePilot demonstration area. This is not a promise of availability.`,
      verifiedAt: VERIFIED_AT,
    }
  }
  if ((INELIGIBLE_CITIES as readonly string[]).includes(normalized)) {
    return {
      city: city.trim(),
      status: 'ineligible',
      reason: `${city.trim()} is outside the synthetic demonstration area.`,
      verifiedAt: VERIFIED_AT,
    }
  }
  return {
    city: city.trim(),
    status: 'unknown',
    reason: `${city.trim()} is not classified in the synthetic business pack. A human would need to verify service availability.`,
    verifiedAt: VERIFIED_AT,
  }
}

function rankSystem(system: (typeof FLOORING_SYSTEMS)[number], project: ProjectInput): RankedSystem {
  let score = 45
  const rationale: string[] = []

  if (project.shutdownDays >= system.minimumShutdownDays) {
    score += 18
    rationale.push(`Fits the stated ${project.shutdownDays}-day shutdown window.`)
  } else {
    score -= 28
    rationale.push(`Needs about ${system.minimumShutdownDays} days in this demonstration, longer than the stated window.`)
  }

  if (project.projectType === 'restaurant') {
    if (system.id === 'urethane-cement') {
      score += 25
      rationale.push('Strong match for heat, moisture, and commercial-kitchen service.')
    }
    if (system.id === 'epoxy-quartz') {
      score += 18
      rationale.push('Strong front-of-house and restroom fit when slab conditions allow.')
    }
    if (system.id === 'polished-concrete') {
      score -= 8
      rationale.push('Best limited to dry public zones rather than a whole restaurant.')
    }
  }

  if (project.priorities.includes('short-shutdown') && system.id === 'fast-cure-polyaspartic') score += 24
  if (project.priorities.includes('heat-resistance') && system.id === 'urethane-cement') score += 18
  if (project.priorities.includes('slip-resistance') && ['urethane-cement', 'epoxy-quartz'].includes(system.id)) score += 12
  if (project.priorities.includes('easy-maintenance') && ['epoxy-quartz', 'polished-concrete'].includes(system.id)) score += 8
  if (project.priorities.includes('appearance') && ['epoxy-quartz', 'polished-concrete'].includes(system.id)) score += 10

  if (project.squareFeet > 20_000 && system.id === 'fast-cure-polyaspartic') {
    score -= 5
    rationale.push('Large area increases coordination sensitivity for a fast-curing installation.')
  }

  const boundedScore = Math.max(0, Math.min(100, score))
  return {
    ...system,
    score: boundedScore,
    fit: boundedScore >= 76 ? 'strong' : boundedScore >= 48 ? 'conditional' : 'not-recommended',
    rationale,
  }
}

export function buildFitBoard(rawProject: ProjectInput, revision: number): FitBoard {
  const project = ProjectInputSchema.parse(rawProject)
  const serviceArea = checkServiceArea({ city: project.city })
  const recommendations = FLOORING_SYSTEMS.map((system) => rankSystem(system, project)).sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name),
  )

  const assumptions = [
    'The existing slab is structurally suitable for a resinous or polished finish.',
    'The stated shutdown window includes preparation, installation, cure, and reopening.',
    'No pricing, crew availability, warranty, or construction schedule has been checked.',
  ]

  const missingInformation = [
    'Current slab moisture and vapor-emission condition',
    'Kitchen heat, grease, drainage, and washdown exposure by zone',
    'Existing coatings, cracks, patches, slope, and transitions',
    'Required texture, cleaning process, appearance, and accessibility needs',
  ]

  if (serviceArea.status !== 'eligible') missingInformation.unshift('Human confirmation of service-area availability')

  return {
    revision,
    project,
    serviceArea,
    recommendations,
    assumptions,
    missingInformation,
    disclaimer: BUSINESS_FACTS.limitations.join(' '),
  }
}

export function stageProjectBrief(board: FitBoard, revision: number): ProjectBrief {
  const top = board.recommendations[0]
  if (!top) throw new Error('No flooring recommendations are available.')

  return {
    revision,
    fitBoardRevision: board.revision,
    createdAt: new Date().toISOString(),
    summary: `${board.project.squareFeet.toLocaleString('en-US')} sq ft ${board.project.projectType} in ${board.project.city}; ${board.project.shutdownDays}-day shutdown requested.`,
    recommendation: `${top.name} is the strongest deterministic fit (${top.score}/100), subject to on-site substrate and operating-condition review.`,
    tradeoffs: [...top.strengths.slice(0, 2), ...top.cautions.slice(0, 2)],
    questionsForSiteReview: board.missingInformation,
    disclaimer: 'Draft for local human review only. This is not a quote, specification, booking, warranty, or submission.',
  }
}
