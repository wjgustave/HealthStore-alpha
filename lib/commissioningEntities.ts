/** Canonical list: alphabetical order (Cornwall, North East London, West Yorkshire). */
export const COMMISSIONING_ENTITIES = [
  { id: 'cornwall-and-isles-of-scilly-icb', name: 'Cornwall and Isles of Scilly ICB' },
  { id: 'north-east-london-icb', name: 'North East London ICB' },
  { id: 'west-yorkshire-icb', name: 'West Yorkshire ICB' },
] as const

export type CommissioningEntityId = (typeof COMMISSIONING_ENTITIES)[number]['id']

const ID_SET = new Set<string>(COMMISSIONING_ENTITIES.map((e) => e.id))

export function isCommissioningEntityId(id: string): id is CommissioningEntityId {
  return ID_SET.has(id)
}
