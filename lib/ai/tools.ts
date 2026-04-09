/**
 * GPT-5.4 function tool definitions for the HealthStore commissioner advisor.
 * Each tool maps to a server-side executor in toolExecutor.ts.
 */

export const aiTools = [
  {
    type: 'function' as const,
    name: 'search_apps',
    description:
      'Search the HealthStore catalogue for digital health apps. ' +
      'Can filter by clinical condition, keyword, pathway tag, or outcome tag. ' +
      'Returns a summary list — use get_app_detail for full information on a specific app.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Free-text search query (app name, supplier, keyword). Leave empty to list all.',
        },
        condition: {
          type: 'string',
          description:
            'Filter by clinical condition ID: copd, cardiac_rehab, insomnia, weight_management, msk, eating_disorders',
          enum: [
            'copd',
            'cardiac_rehab',
            'insomnia',
            'weight_management',
            'msk',
            'eating_disorders',
          ],
        },
      },
      required: [],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: 'function' as const,
    name: 'get_app_detail',
    description:
      'Get the full product dossier for a specific app by its slug. ' +
      'Includes clinical info, evidence, NICE guidance, context of use, maturity, ' +
      'DTAC/data security, supplier details, and service wrap information.',
    parameters: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The app slug identifier (e.g. "mycopd", "clinitouch", "sleepio")',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: 'function' as const,
    name: 'get_app_financials',
    description:
      'Get the financial and commercial information for a specific app. ' +
      'Includes pricing model, indicative cost, tariff considerations, ' +
      'provider income impact, ROI notes, procurement routes, and service wrap costs. ' +
      'Use this when discussing costs, P&L, business cases, or value for money.',
    parameters: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The app slug identifier',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: 'function' as const,
    name: 'compare_apps',
    description:
      'Compare two or three apps side-by-side on key commissioning dimensions: ' +
      'pricing, evidence strength, maturity, supervision model, DTAC status, and more.',
    parameters: {
      type: 'object',
      properties: {
        slugs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of 2-3 app slugs to compare',
        },
      },
      required: ['slugs'],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: 'function' as const,
    name: 'list_funding',
    description:
      'List available funding opportunities for digital health commissioning. ' +
      'Can filter by clinical condition. Returns open, upcoming, and periodic schemes.',
    parameters: {
      type: 'object',
      properties: {
        condition: {
          type: 'string',
          description: 'Optional condition filter',
          enum: [
            'copd',
            'cardiac_rehab',
            'insomnia',
            'weight_management',
            'msk',
            'eating_disorders',
          ],
        },
      },
      required: [],
      additionalProperties: false,
    },
    strict: false,
  },
  {
    type: 'function' as const,
    name: 'get_funding_detail',
    description:
      'Get full detail on a specific funding scheme by its ID. ' +
      'Includes sponsoring body, total value, eligibility, dates, and application notes.',
    parameters: {
      type: 'object',
      properties: {
        funding_id: {
          type: 'string',
          description: 'The funding scheme ID',
        },
      },
      required: ['funding_id'],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: 'function' as const,
    name: 'get_condition_overview',
    description:
      'Get an overview of a clinical programme area: description, number of apps available, ' +
      'and a list of the apps in that area with their maturity and evidence levels.',
    parameters: {
      type: 'object',
      properties: {
        condition_id: {
          type: 'string',
          description: 'The condition ID',
          enum: [
            'copd',
            'cardiac_rehab',
            'insomnia',
            'weight_management',
            'msk',
            'eating_disorders',
          ],
        },
      },
      required: ['condition_id'],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: 'function' as const,
    name: 'get_enums',
    description:
      'Look up the standard vocabulary and definitions used across the HealthStore. ' +
      'Includes pricing models, maturity levels, evidence strength tiers, ' +
      'supervision models, DTAC statuses, and confidence labels.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Which enum category to retrieve',
          enum: [
            'pricing_models',
            'maturity_levels',
            'evidence_strength',
            'supervision_models',
            'dtac_statuses',
            'referral_modes',
            'onboarding_intensity',
            'all',
          ],
        },
      },
      required: ['category'],
      additionalProperties: false,
    },
    strict: true,
  },
] as const
