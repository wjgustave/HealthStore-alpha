import { describe, it, expect } from 'vitest'
import { extractFundingArray } from '../parse'

const obj = (name: string) =>
  `{"fund_name":"${name}","provider":"NHSE","eligibility_summary":"Open to ICBs","amount_range":null,"deadline":"Ongoing","region_scope":"National","match_type":"condition","match_rationale":"Targets COPD"}`

describe('extractFundingArray', () => {
  it('parses a clean JSON array', () => {
    const text = `[${obj('Fund A')},${obj('Fund B')}]`
    const result = extractFundingArray(text)
    expect(result).toHaveLength(2)
    expect(result[0].fund_name).toBe('Fund A')
  })

  it('strips markdown code fences', () => {
    const text = '```json\n[' + obj('Fenced') + ']\n```'
    const result = extractFundingArray(text)
    expect(result).toHaveLength(1)
    expect(result[0].fund_name).toBe('Fenced')
  })

  it('ignores preamble and postamble prose', () => {
    const text = `Here are the results you asked for:\n[${obj('Wrapped')}]\nLet me know if you need more.`
    const result = extractFundingArray(text)
    expect(result).toHaveLength(1)
    expect(result[0].fund_name).toBe('Wrapped')
  })

  it('recovers complete objects from a truncated array', () => {
    // Array is cut off mid-way through the third object (no closing ]).
    const text = `[${obj('One')},${obj('Two')},{"fund_name":"Three","provi`
    const result = extractFundingArray(text)
    expect(result).toHaveLength(2)
    expect(result.map(r => r.fund_name)).toEqual(['One', 'Two'])
  })

  it('is string-aware: braces inside strings do not break parsing', () => {
    const text = `[{"fund_name":"Brace } in text","provider":"NHSE","eligibility_summary":"x","amount_range":null,"deadline":null,"region_scope":"National","match_type":"condition","match_rationale":"y"}]`
    const result = extractFundingArray(text)
    expect(result).toHaveLength(1)
    expect(result[0].fund_name).toBe('Brace } in text')
  })

  it('throws a useful error when no JSON is present', () => {
    expect(() => extractFundingArray('Sorry, I could not find any funding.')).toThrowError(
      /No JSON array found/,
    )
  })
})
