import type { ApprovalReceipt, ProjectBrief } from './types'

const STORAGE_KEY = 'surfacepilot.localApprovalReceipt.v1'

export function serializeBrief(brief: ProjectBrief): string {
  return JSON.stringify({
    revision: brief.revision,
    fitBoardRevision: brief.fitBoardRevision,
    summary: brief.summary,
    recommendation: brief.recommendation,
    tradeoffs: brief.tradeoffs,
    questionsForSiteReview: brief.questionsForSiteReview,
    disclaimer: brief.disclaimer,
  })
}

export async function hashBrief(brief: ProjectBrief): Promise<string> {
  const bytes = new TextEncoder().encode(serializeBrief(brief))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createApprovalReceipt(brief: ProjectBrief): Promise<ApprovalReceipt> {
  const contentHash = await hashBrief(brief)
  const receipt: ApprovalReceipt = {
    receiptId: crypto.randomUUID(),
    draftRevision: brief.revision,
    contentHash,
    approvedAt: new Date().toISOString(),
    statement: 'Local demo approval only — nothing was sent, booked, submitted, charged, or published.',
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt))
  return receipt
}

export function loadApprovalReceipt(): ApprovalReceipt | null {
  const value = localStorage.getItem(STORAGE_KEY)
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<ApprovalReceipt>
    if (
      typeof parsed.receiptId === 'string' &&
      typeof parsed.draftRevision === 'number' &&
      typeof parsed.contentHash === 'string' &&
      typeof parsed.approvedAt === 'string' &&
      typeof parsed.statement === 'string'
    ) {
      return parsed as ApprovalReceipt
    }
  } catch {
    // Malformed local data is treated as absent.
  }
  localStorage.removeItem(STORAGE_KEY)
  return null
}

export function clearApprovalReceipt(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export async function receiptMatchesBrief(receipt: ApprovalReceipt, brief: ProjectBrief): Promise<boolean> {
  return receipt.draftRevision === brief.revision && receipt.contentHash === (await hashBrief(brief))
}
