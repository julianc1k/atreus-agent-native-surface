import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function installWebMcpMock(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const tools = new Map<string, { name: string; execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => unknown; annotations?: { readOnlyHint?: boolean } }>()
    const context = {
      registerTool: async (tool: { name: string; execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => unknown; annotations?: { readOnlyHint?: boolean } }, options?: { signal?: AbortSignal }) => {
        tools.set(tool.name, tool)
        options?.signal?.addEventListener('abort', () => tools.delete(tool.name), { once: true })
      },
      getTools: async () => [...tools.values()].map(({ name, annotations }) => ({ name, annotations })),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      ontoolchange: null,
    }
    Object.defineProperty(document, 'modelContext', { configurable: true, value: context })
    Object.defineProperty(window, '__surfacePilotTools', { configurable: true, value: tools })
  })
}

test.describe('SurfacePilot normal workflow', () => {
  for (const direction of ['ledger', 'floorplan']) {
    test(`${direction} direction completes the local review path`, async ({ page }) => {
      await page.goto(`/?direction=${direction}`)
      await expect(page.getByRole('heading', { name: 'Plan the floor. Keep the decision.' })).toBeVisible()
      await expect(page.getByText('Manual mode — complete')).toBeVisible()
      await page.getByRole('button', { name: 'Build fit board' }).click()
      await expect(page.getByRole('heading', { name: 'Material fit board' })).toBeVisible()
      await expect(page.locator('.recommendation-list article').first()).toContainText('Fast-cure polyaspartic')
      await page.getByRole('button', { name: 'Stage review draft' }).click()
      await expect(page.getByRole('heading', { name: 'Prepared, not submitted.' })).toBeVisible()
      await page.getByRole('button', { name: 'Approve local demo receipt' }).click()
      await expect(page.getByText('Local receipt created')).toBeVisible()
      await expect(page.getByText('Local demo approval only — nothing was sent, booked, submitted, charged, or published.')).toBeVisible()
      await page.getByLabel('Project summary').fill('Edited summary')
      await expect(page.getByText('Local receipt created')).toBeHidden()
      await expect(page.evaluate(() => localStorage.getItem('surfacepilot.localApprovalReceipt.v1'))).resolves.toBeNull()
    })
  }

  test('reset restores the deterministic initial state', async ({ page }) => {
    await page.goto('/?direction=ledger')
    await page.getByRole('button', { name: 'Build fit board' }).click()
    await page.getByRole('button', { name: 'Stage review draft' }).click()
    await page.getByRole('button', { name: 'Reset demonstration' }).click()
    await expect(page.getByRole('heading', { name: 'Material fit board' })).toBeHidden()
    await expect(page.getByLabel('City')).toHaveValue('Dallas')
    await expect(page.getByLabel('Floor area')).toHaveValue('1500')
  })

  test('both directions have no automatically detectable accessibility violations', async ({ page }) => {
    for (const direction of ['ledger', 'floorplan']) {
      await page.goto(`/?direction=${direction}`)
      await page.getByRole('button', { name: 'Build fit board' }).click()
      await expect(page.getByRole('heading', { name: 'Material fit board' })).toBeVisible()
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    }
  })
})

test.describe('WebMCP boundary', () => {
  test.beforeEach(async ({ page }) => {
    await installWebMcpMock(page)
  })

  test('registers only the approved tools and dynamically stages the fourth', async ({ page }) => {
    await page.goto('/?direction=floorplan')
    await expect(page.getByText('Page tools ready')).toBeVisible()

    const initialNames = await page.evaluate(async () => {
      const tools = await document.modelContext?.getTools()
      return tools?.map((tool) => tool.name)
    })
    expect(initialNames).toEqual([
      'get_approved_business_facts',
      'check_service_area',
      'build_project_fit_board',
    ])
    expect(initialNames?.some((name) => /^(approve|submit|message|charge|book|publish)(_|$)/.test(name))).toBe(false)

    await page.evaluate(async () => {
      const registry = (window as unknown as { __surfacePilotTools: Map<string, { execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => unknown }> }).__surfacePilotTools
      const tool = registry.get('build_project_fit_board')
      await tool?.execute(
        { city: 'Dallas', projectType: 'restaurant', squareFeet: 1500, shutdownDays: 3, priorities: ['short-shutdown', 'heat-resistance', 'slip-resistance'] },
        { signal: new AbortController().signal },
      )
    })
    await expect(page.getByRole('heading', { name: 'Material fit board' })).toBeVisible()

    await expect.poll(async () => page.evaluate(async () => (await document.modelContext?.getTools())?.map((tool) => tool.name))).toContain('stage_project_brief_for_review')
    const namesAfterBoard = await page.evaluate(async () => (await document.modelContext?.getTools())?.map((tool) => tool.name))
    expect(namesAfterBoard?.some((name) => /^(approve|submit|message|charge|book|publish)(_|$)/.test(name))).toBe(false)
  })

  test('rejects unknown fields and honors an already-aborted call', async ({ page }) => {
    await page.goto('/?direction=ledger')
    await expect(page.getByText('Page tools ready')).toBeVisible()
    const messages = await page.evaluate(async () => {
      const registry = (window as unknown as { __surfacePilotTools: Map<string, { execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => unknown }> }).__surfacePilotTools
      const tool = registry.get('check_service_area')
      const failures: string[] = []
      try {
        await tool?.execute({ city: 'Dallas', address: 'must reject' }, { signal: new AbortController().signal })
      } catch (error) {
        failures.push(String(error))
      }
      const controller = new AbortController()
      controller.abort()
      try {
        await tool?.execute({ city: 'Dallas' }, { signal: controller.signal })
      } catch (error) {
        failures.push(error instanceof DOMException ? error.name : String(error))
      }
      return failures
    })
    expect(messages[0]).toContain('Unrecognized key')
    expect(messages[1]).toBe('AbortError')
  })
})
