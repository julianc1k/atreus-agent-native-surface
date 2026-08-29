import { describe, expect, it } from 'vitest'
import { createApprovalReceipt, receiptMatchesBrief } from './receipt'
import type { ProjectBrief } from './types'

const brief: ProjectBrief = {
  revision: 3,
  fitBoardRevision: 2,
  createdAt: '2026-08-29T00:00:00.000Z',
  summary: 'Synthetic project summary',
  recommendation: 'Synthetic recommendation',
  tradeoffs: ['One strength', 'One caution'],
  questionsForSiteReview: ['Moisture condition'],
  disclaimer: 'Local demo only.',
}

describe('approval receipt integrity', () => {
  it('rejects a receipt with a tampered content hash', async () => {
    const receipt = await createApprovalReceipt(brief)
    expect(await receiptMatchesBrief(receipt, brief)).toBe(true)
    expect(await receiptMatchesBrief({ ...receipt, contentHash: '0'.repeat(64) }, brief)).toBe(false)
  })
})
