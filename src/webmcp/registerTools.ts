import { BUSINESS_FACTS } from '../domain/business'
import { buildFitBoard, checkServiceArea, stageProjectBrief } from '../domain/fit'
import { EmptyInputSchema, jsonSchemas, parseOrThrow, ProjectInputSchema, ServiceAreaInputSchema, StageBriefInputSchema } from '../domain/validation'
import type { FitBoard, ProjectBrief } from '../domain/types'

export const WEBMCP_TOOL_NAMES = [
  'get_approved_business_facts',
  'check_service_area',
  'build_project_fit_board',
  'stage_project_brief_for_review',
] as const

export interface ToolBridge {
  getBoard: () => FitBoard | null
  nextBoardRevision: () => number
  nextBriefRevision: () => number
  showBoard: (board: FitBoard) => void
  showBrief: (brief: ProjectBrief) => void
}

function cancelled(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Tool execution was cancelled.', 'AbortError')
}

export async function registerWebMcpTools(bridge: ToolBridge, signal: AbortSignal): Promise<'registered' | 'unsupported'> {
  const context = document.modelContext
  if (!context) return 'unsupported'

  const tools: WebMCP.ModelContextTool[] = [
    {
      name: 'get_approved_business_facts',
      title: 'Get approved business facts',
      description: 'Returns the synthetic SurfacePilot capabilities, limitations, and provenance. It does not return prices, availability, or real business data.',
      inputSchema: jsonSchemas.empty,
      annotations: { readOnlyHint: true },
      execute(input, options?: WebMCP.ToolExecuteCallbackOptions) {
        parseOrThrow(EmptyInputSchema, input, options?.signal)
        return BUSINESS_FACTS
      },
    },
    {
      name: 'check_service_area',
      title: 'Check demonstration service area',
      description: 'Classifies one city as eligible, ineligible, or unknown using the synthetic business pack. Provide a city only, never an address.',
      inputSchema: jsonSchemas.serviceArea,
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input, options?: WebMCP.ToolExecuteCallbackOptions) {
        const parsed = parseOrThrow(ServiceAreaInputSchema, input, options?.signal)
        return checkServiceArea(parsed)
      },
    },
    {
      name: 'build_project_fit_board',
      title: 'Build visible flooring fit board',
      description: 'Deterministically compares flooring systems for a bounded commercial project and updates the visible page. It does not quote, schedule, or promise availability.',
      inputSchema: jsonSchemas.project,
      annotations: { untrustedContentHint: true },
      execute(input, options?: WebMCP.ToolExecuteCallbackOptions) {
        const project = parseOrThrow(ProjectInputSchema, input, options?.signal)
        const board = buildFitBoard(project, bridge.nextBoardRevision())
        cancelled(options?.signal)
        bridge.showBoard(board)
        return board
      },
    },
  ]

  const board = bridge.getBoard()
  if (board) {
    tools.push({
      name: 'stage_project_brief_for_review',
      title: 'Stage project brief for human review',
      description: 'Stages a non-binding draft for the exact visible fit-board revision. It cannot approve, submit, book, message, charge, or publish.',
      inputSchema: jsonSchemas.stageBrief,
      annotations: { untrustedContentHint: true },
      execute(input, options?: WebMCP.ToolExecuteCallbackOptions) {
        const parsed = parseOrThrow(StageBriefInputSchema, input, options?.signal)
        const currentBoard = bridge.getBoard()
        if (!currentBoard || currentBoard.revision !== parsed.fitBoardRevision) {
          throw new DOMException('The requested fit-board revision is stale or unavailable.', 'InvalidStateError')
        }
        const brief = stageProjectBrief(currentBoard, bridge.nextBriefRevision())
        cancelled(options?.signal)
        bridge.showBrief(brief)
        return brief
      },
    })
  }

  const registrationController = new AbortController()
  const unregisterAll = () => registrationController.abort()
  if (signal.aborted) {
    unregisterAll()
    throw new DOMException('Tool registration was cancelled.', 'AbortError')
  }
  signal.addEventListener('abort', unregisterAll, { once: true })

  try {
    await Promise.all(tools.map((tool) => context.registerTool(tool, { signal: registrationController.signal })))
    return 'registered'
  } catch (error) {
    unregisterAll()
    signal.removeEventListener('abort', unregisterAll)
    throw error
  }
}
