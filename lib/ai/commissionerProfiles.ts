export type CommissionerProfile = {
  entityId: string
  icbName: string
  region: string
  odsCode: string
  commissionerName: string
  roleTitle: string
  population: number
  strategicPriorities: string[]
  conditionFocus: string[]
  localHealthChallenges: string[]
  currentDigitalPosition: string
  budgetContext: string
  deprivationProfile: string
  ruralUrbanMix: string
  starterPrompts: { label: string; prompt: string }[]
}

const profiles: Record<string, CommissionerProfile> = {
  'shropshire-telford-wrekin-icb': {
    entityId: 'shropshire-telford-wrekin-icb',
    icbName: 'Shropshire, Telford and Wrekin ICB',
    region: 'Midlands',
    odsCode: 'QOC',
    commissionerName: 'Sarah Thornton',
    roleTitle: 'Associate Director of Digital Transformation',
    population: 510_000,
    strategicPriorities: [
      'Reducing unplanned COPD admissions across rural Shropshire',
      'Expanding pulmonary rehabilitation access beyond Shrewsbury and Telford centres',
      'Digital-first pathways for long-term condition self-management',
      'Addressing health inequalities in former mining communities around Telford',
    ],
    conditionFocus: ['copd', 'cardiac_rehab', 'weight_management'],
    localHealthChallenges: [
      'COPD prevalence 20% above national average in Telford & Wrekin',
      'Face-to-face PR waiting lists at 14 weeks — well above 6-week standard',
      'High emergency admission rates for COPD exacerbations in rural areas',
      'Limited digital literacy in older populations — needs careful onboarding',
      'Two acute trusts (SaTH, RJAH) with different EPR systems',
    ],
    currentDigitalPosition:
      'Early stages. One small myCOPD pilot (n=80) completed in Telford PCN with positive engagement metrics. No scaled digital therapeutics commissioned yet. ICB digital strategy approved January 2026 with LTC self-management as priority workstream.',
    budgetContext:
      'Transformation fund allocation of approximately £2.4m for 2026/27. Digital health earmarked for £350k within this. Additional bids possible through NHSE COPD technology fund and Innovation Fund for LTCs.',
    deprivationProfile: 'Mixed — rural affluent Shropshire alongside significant deprivation in central Telford (IMD decile 1-2 in several wards).',
    ruralUrbanMix: 'Predominantly rural with urban centres at Shrewsbury, Telford and Oswestry. Significant travel times to acute services from rural west.',
    starterPrompts: [
      { label: 'Scale our COPD pilot', prompt: 'We ran a small myCOPD pilot in Telford. How should I think about scaling this across the ICB, and what would the costs look like for our 510,000 population?' },
      { label: 'PR waiting list solution', prompt: 'Our pulmonary rehab waiting list is at 14 weeks. What digital options could help us bring this down and what business change would be needed?' },
      { label: 'Funding for digital health', prompt: 'What funding opportunities could Shropshire, Telford and Wrekin ICB apply for to support digital health commissioning?' },
      { label: 'Cardiac rehab landscape', prompt: 'We want to explore digital cardiac rehabilitation. What options are available and how would they work in a predominantly rural area like ours?' },
    ],
  },

  'cornwall-and-isles-of-scilly-icb': {
    entityId: 'cornwall-and-isles-of-scilly-icb',
    icbName: 'Cornwall and Isles of Scilly ICB',
    region: 'South West',
    odsCode: 'QT6',
    commissionerName: 'James Penrose',
    roleTitle: 'Head of Digital Health & Innovation',
    population: 570_000,
    strategicPriorities: [
      'Remote and rural access to specialist respiratory services',
      'Reducing ambulance conveyance times through digital self-management',
      'Closing the health inequality gap between coastal deprivation pockets and inland areas',
      'Building digital confidence in an aging population',
    ],
    conditionFocus: ['copd', 'cardiac_rehab', 'msk'],
    localHealthChallenges: [
      'Oldest population profile of any English ICB — 25% aged 65+',
      'Extreme rurality: single acute trust (RCHT) serving entire county',
      'Average ambulance response times significantly above national target',
      'Higher than national average COPD and heart failure prevalence',
      'Seasonal population surge of 5m+ tourists impacts acute capacity',
    ],
    currentDigitalPosition:
      'Moderate. Luscii remote monitoring pilot (n=200) running across Truro PCN for HF. No COPD digital therapeutics yet. Strong interest from respiratory clinical leads. ICB digital strategy emphasises remote monitoring and virtual wards.',
    budgetContext:
      'Transformation allocation approximately £1.8m for 2026/27. Health Innovation South West providing match funding support for digital pilots up to £100k. Additional capacity through virtual ward programme budget.',
    deprivationProfile: 'Significant coastal deprivation (Camborne, Redruth, Penzance) alongside relative affluence. Overall IMD broadly average but masks stark local variation.',
    ruralUrbanMix: 'Overwhelmingly rural. No city over 20,000 population. Extreme travel times from west Cornwall to Truro.',
    starterPrompts: [
      { label: 'Rural COPD access', prompt: 'How can digital COPD tools help us improve access for patients in rural west Cornwall who currently travel 90 minutes for pulmonary rehab?' },
      { label: 'Expand our HF monitoring', prompt: 'We have a Luscii heart failure pilot running in Truro. Help me think through what scaling this across Cornwall would involve.' },
      { label: 'Older population challenges', prompt: 'Our population is the oldest in England. Which digital health apps would work best for older patients with limited digital confidence?' },
      { label: 'Available funding', prompt: 'What funding is available that Cornwall and Isles of Scilly ICB could apply for to support digital health programmes?' },
    ],
  },

  'north-east-london-icb': {
    entityId: 'north-east-london-icb',
    icbName: 'North East London ICB',
    region: 'London',
    odsCode: 'QMF',
    commissionerName: 'Priya Chakraborty',
    roleTitle: 'Programme Director, Long-term Conditions & Digital',
    population: 2_100_000,
    strategicPriorities: [
      'Scaling digital therapeutics across all 7 places in NEL',
      'Addressing respiratory health inequalities in Tower Hamlets and Newham',
      'Multilingual and culturally appropriate digital health pathways',
      'Provider collaborative model for digital adoption across Barts Health and BHRUT',
    ],
    conditionFocus: ['copd', 'cardiac_rehab', 'weight_management', 'eating_disorders'],
    localHealthChallenges: [
      'Extreme ethnic and linguistic diversity — 100+ languages spoken',
      'Highest deprivation borough in London (Tower Hamlets) alongside rapid gentrification',
      'Air quality-linked respiratory disease burden above national average',
      'Complex provider landscape: 2 large acute trusts, 3 community providers',
      'High prevalence of diabetes and obesity across Barking, Dagenham and Havering',
    ],
    currentDigitalPosition:
      'Established. Clinitouch remote monitoring commissioned across Tower Hamlets and Waltham Forest for COPD (n=1,200 active patients). Exploring expansion to remaining 5 places. Weight management digital pilots planned for 2026/27. No cardiac rehab digital programme yet.',
    budgetContext:
      'Transformation allocation approximately £8.5m across the system for 2026/27. Digital health programme budget of £1.2m. Access to London regional innovation funding. NHSE COPD fund already drawn down for Clinitouch.',
    deprivationProfile: 'High deprivation across most boroughs. Significant health inequality gradients within the system.',
    ruralUrbanMix: 'Entirely urban. Dense population. Strong public transport connectivity.',
    starterPrompts: [
      { label: 'Scale Clinitouch across NEL', prompt: 'We have Clinitouch running in 2 of our 7 places. What would it cost and take to scale across all of North East London?' },
      { label: 'Health inequalities focus', prompt: 'How can digital health tools help us address respiratory health inequalities in our most deprived boroughs like Tower Hamlets and Newham?' },
      { label: 'Compare COPD options', prompt: 'Should we expand Clinitouch or consider alternatives like myCOPD? Help me compare the options for our population.' },
      { label: 'Weight management digital', prompt: 'We are planning digital weight management services. What options are in the catalogue and how do they compare?' },
    ],
  },

  'west-yorkshire-icb': {
    entityId: 'west-yorkshire-icb',
    icbName: 'West Yorkshire ICB',
    region: 'North East and Yorkshire',
    odsCode: 'QWO',
    commissionerName: 'David Hartley',
    roleTitle: 'Deputy Director of System Transformation',
    population: 2_400_000,
    strategicPriorities: [
      'Provider collaborative approach to digital health commissioning',
      'Respiratory care pathway transformation with digital-first options',
      'Reducing cardiac rehabilitation dropout rates through digital alternatives',
      'Leveraging West Yorkshire Health and Care Partnership for at-scale adoption',
    ],
    conditionFocus: ['copd', 'cardiac_rehab', 'msk', 'insomnia'],
    localHealthChallenges: [
      'Significant variation in COPD outcomes between Bradford and Harrogate',
      'Former industrial communities with high respiratory disease burden',
      'Cardiac rehab completion rates below 50% in some places',
      'Digital exclusion in older populations in Bradford and Kirklees',
      'Multiple acute trusts with different clinical systems and pathways',
    ],
    currentDigitalPosition:
      'Growing. myCOPD commissioned at place-level in Wakefield (n=300 active). COPDhub under evaluation in Bradford. No system-wide digital adoption framework yet. West Yorkshire Health Innovation Network actively supporting business case development.',
    budgetContext:
      'Transformation allocation approximately £9.2m system-wide for 2026/27. Digital programme budget of £1.5m across places. Strong Health Innovation Network partnership providing evaluation and implementation support.',
    deprivationProfile: 'Significant deprivation in Bradford, parts of Leeds (south), Huddersfield. Relative affluence in Harrogate, north Leeds, Ilkley.',
    ruralUrbanMix: 'Mix of major urban centres (Leeds, Bradford, Wakefield, Huddersfield, Halifax) with semi-rural areas in Craven and upper Calderdale.',
    starterPrompts: [
      { label: 'System-wide COPD approach', prompt: 'Wakefield has myCOPD and Bradford is looking at COPDhub. How should we think about a system-wide approach to digital COPD across West Yorkshire?' },
      { label: 'Cardiac rehab dropout', prompt: 'Our cardiac rehab completion rates are below 50%. Which digital alternatives could help and what does the evidence say?' },
      { label: 'Business case support', prompt: 'I need to build a business case for digital long-term condition management for our ICB board. Can you help me structure it?' },
      { label: 'Compare across places', prompt: 'We have different digital health approaches in different places. Help me compare what Wakefield and Bradford are doing and whether we should standardise.' },
    ],
  },
}

const DEFAULT_ENTITY_ID = 'shropshire-telford-wrekin-icb'

export function getCommissionerProfile(entityId: string | undefined): CommissionerProfile {
  if (entityId && profiles[entityId]) return profiles[entityId]
  return profiles[DEFAULT_ENTITY_ID]
}

export function getProfileSummaryForPrompt(profile: CommissionerProfile): string {
  return [
    `## Commissioner context`,
    ``,
    `You are speaking with **${profile.commissionerName}**, ${profile.roleTitle} at **${profile.icbName}** (${profile.region}, ODS: ${profile.odsCode}).`,
    ``,
    `**Local population:** ${profile.population.toLocaleString()}`,
    `**Rural/urban:** ${profile.ruralUrbanMix}`,
    `**Deprivation:** ${profile.deprivationProfile}`,
    ``,
    `**Their strategic priorities:**`,
    ...profile.strategicPriorities.map(p => `- ${p}`),
    ``,
    `**Key local health challenges:**`,
    ...profile.localHealthChallenges.map(c => `- ${c}`),
    ``,
    `**Current digital health position:** ${profile.currentDigitalPosition}`,
    ``,
    `**Budget context:** ${profile.budgetContext}`,
    ``,
    `**Condition areas of interest:** ${profile.conditionFocus.join(', ')}`,
    ``,
    `Use this context to personalise your responses. Reference their local population size when discussing cohort estimates. Acknowledge their existing deployments. Align recommendations to their stated priorities. When discussing costs, scale to their population. When discussing implementation, consider their rural/urban context and deprivation profile.`,
    ``,
    `Address them by name in your first response. After that, use natural conversational flow — you don't need to repeat their name every message.`,
  ].join('\n')
}
