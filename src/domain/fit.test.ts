import { describe, expect, it } from 'vitest'
import { buildFitBoard, checkServiceArea, stageProjectBrief } from './fit'
import { ProjectInputSchema, ServiceAreaInputSchema } from './validation'

describe('service area', () => {
  it('classifies known, excluded, and unclassified cities', () => {
    expect(checkServiceArea({ city: ' Dallas ' }).status).toBe('eligible')
    expect(checkServiceArea({ city: 'Austin' }).status).toBe('ineligible')
    expect(checkServiceArea({ city: 'Denton' }).status).toBe('unknown')
  })

  it('rejects unexpected and oversized input', () => {
    expect(() => ServiceAreaInputSchema.parse({ city: 'Dallas', address: 'private' })).toThrow()
    expect(() => ServiceAreaInputSchema.parse({ city: 'x'.repeat(81) })).toThrow()
  })
})

describe('deterministic fit board', () => {
  const project = {
    city: 'Dallas',
    projectType: 'restaurant' as const,
    squareFeet: 1500,
    shutdownDays: 3,
    priorities: ['short-shutdown', 'heat-resistance', 'slip-resistance'] as const,
  }

  it('ranks a short-shutdown restaurant consistently', () => {
    const board = buildFitBoard({ ...project, priorities: [...project.priorities] }, 1)
    expect(board.serviceArea.status).toBe('eligible')
    expect(board.recommendations.map((item) => item.id)).toEqual([
      'fast-cure-polyaspartic',
      'urethane-cement',
      'epoxy-quartz',
      'polished-concrete',
    ])
    expect(board.missingInformation).toContain('Current slab moisture and vapor-emission condition')
    expect(JSON.stringify(buildFitBoard({ ...project, priorities: [...project.priorities] }, 1))).toBe(JSON.stringify(board))
  })

  it('stages a non-binding brief tied to the board revision', () => {
    const board = buildFitBoard({ ...project, priorities: [...project.priorities] }, 7)
    const brief = stageProjectBrief(board, 4)
    expect(brief.fitBoardRevision).toBe(7)
    expect(brief.revision).toBe(4)
    expect(brief.disclaimer).toContain('not a quote')
  })

  it('strictly validates range, enums, arrays, and unknown fields', () => {
    expect(ProjectInputSchema.safeParse({ ...project, priorities: [...project.priorities], squareFeet: 99 }).success).toBe(false)
    expect(ProjectInputSchema.safeParse({ ...project, priorities: [...project.priorities], squareFeet: 1500, address: 'do not collect' }).success).toBe(false)
    expect(ProjectInputSchema.safeParse({ ...project, priorities: ['made-up'] }).success).toBe(false)
    expect(ProjectInputSchema.safeParse({ ...project, priorities: ['short-shutdown', 'short-shutdown'] }).success).toBe(false)
    expect(ProjectInputSchema.safeParse({ ...project, priorities: [...project.priorities], shutdownDays: 31 }).success).toBe(false)
  })
})
