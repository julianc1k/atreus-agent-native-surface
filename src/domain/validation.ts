import { z } from 'zod'

const boundedText = z.string().trim().min(1).max(80)

export const EmptyInputSchema = z.object({}).strict()

export const ServiceAreaInputSchema = z
  .object({
    city: boundedText,
  })
  .strict()

export const ProjectInputSchema = z
  .object({
    city: boundedText,
    projectType: z.enum(['restaurant', 'retail', 'warehouse', 'office']),
    squareFeet: z.number().int().min(100).max(100_000),
    shutdownDays: z.number().int().min(1).max(30),
    priorities: z
      .array(z.enum(['short-shutdown', 'heat-resistance', 'slip-resistance', 'easy-maintenance', 'appearance']))
      .max(5)
      .default([]),
  })
  .strict()

export const StageBriefInputSchema = z
  .object({
    fitBoardRevision: z.number().int().positive(),
  })
  .strict()

export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown, signal?: AbortSignal): T {
  if (signal?.aborted) throw new DOMException('Tool execution was cancelled.', 'AbortError')
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`).join('; ')
    throw new TypeError(`Invalid tool input. ${details}`)
  }
  return parsed.data
}

export const jsonSchemas = {
  empty: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  serviceArea: {
    type: 'object',
    properties: {
      city: { type: 'string', minLength: 1, maxLength: 80, description: 'City name only; do not provide an address.' },
    },
    required: ['city'],
    additionalProperties: false,
  },
  project: {
    type: 'object',
    properties: {
      city: { type: 'string', minLength: 1, maxLength: 80, description: 'Project city only; do not provide an address.' },
      projectType: { type: 'string', enum: ['restaurant', 'retail', 'warehouse', 'office'] },
      squareFeet: { type: 'integer', minimum: 100, maximum: 100000 },
      shutdownDays: { type: 'integer', minimum: 1, maximum: 30 },
      priorities: {
        type: 'array',
        maxItems: 5,
        uniqueItems: true,
        items: { type: 'string', enum: ['short-shutdown', 'heat-resistance', 'slip-resistance', 'easy-maintenance', 'appearance'] },
      },
    },
    required: ['city', 'projectType', 'squareFeet', 'shutdownDays', 'priorities'],
    additionalProperties: false,
  },
  stageBrief: {
    type: 'object',
    properties: {
      fitBoardRevision: { type: 'integer', minimum: 1, description: 'The exact visible fit-board revision to stage.' },
    },
    required: ['fitBoardRevision'],
    additionalProperties: false,
  },
} as const
