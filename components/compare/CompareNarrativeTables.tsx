'use client'

import Link from 'next/link'
import type { App } from '@/lib/data'
import { CHECK_WITH_SUPPLIER } from '@/lib/data'
import {
  COMPARE_TABLE_SECTIONS,
  type CompareCell,
  type CompareTableSectionDef,
} from '@/lib/compareNarrativeContent'

/**
 * Comparison tables — one NHS responsive table per narrative section
 * (service-manual.nhs.uk/design-system/components/table).
 *
 * Structure:
 *  - Product details (name / Remove / supplier) sit above the narrative sections
 *  - strip and every table share the same <colgroup> so product heads line up
 *    horizontally with the compare-value columns
 *  - each table keeps visually-hidden product col headers for screen readers
 *  - row labels are <th scope="row">; body cell values are the grey compared content
 *
 * Content resolves narrative-first via lib/compareNarrativeContent.ts.
 */

function CellContent({ cell }: { cell: CompareCell }) {
  if (cell.kind === 'tag') {
    return <strong className={`nhsuk-tag nhsuk-tag--${cell.colour}`} style={{ whiteSpace: 'nowrap' }}>{cell.label}</strong>
  }
  if (cell.kind === 'status_detail') {
    if (!cell.detail) {
      return <span className="nhsuk-u-secondary-text-colour">{cell.status}</span>
    }
    return <>{cell.detail}</>
  }
  if (cell.kind === 'link') {
    return (
      <Link href={cell.href} className="hs-compare-product-page-link">
        {cell.label}
      </Link>
    )
  }
  if (cell.missing) {
    return <span className="nhsuk-u-secondary-text-colour">{cell.text}</span>
  }
  if (cell.text.includes('\n')) {
    return (
      <>
        {cell.text.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </>
    )
  }
  return <>{cell.text}</>
}

function ProductColumnHeader({ app, onRemove }: { app: App; onRemove?: (id: string) => void }) {
  return (
    <span className="hs-compare-product-head">
      <span className="hs-compare-product-head__name">{app.app_name}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(app.id)}
          className="hs-compare-product-head__remove"
          aria-label={`Remove ${app.app_name} from the comparison`}
        >
          Remove
        </button>
      ) : null}
    </span>
  )
}

/** Shared column widths — strip and every section table must use the same colgroup. */
function CompareColGroup({ productCount }: { productCount: number }) {
  return (
    <colgroup>
      <col className="hs-compare-dimension-col" style={{ width: '18%' }} />
      {Array.from({ length: productCount }, (_, i) => (
        <col key={i} />
      ))}
    </colgroup>
  )
}

function CompareProductStrip({
  apps,
  onRemove,
}: {
  apps: App[]
  onRemove?: (id: string) => void
}) {
  return (
    <table className="nhsuk-table-responsive" role="table" id="compare-product-details">
      <CompareColGroup productCount={apps.length} />
      <caption className="nhsuk-table__caption nhsuk-table__caption--m">Product details</caption>
      <thead className="nhsuk-table__head" role="rowgroup">
        <tr className="nhsuk-table__row" role="row">
          <th scope="col" className="nhsuk-table__header hs-compare-dimension-col" role="columnheader">
            <span className="nhsuk-u-visually-hidden">Comparison dimension</span>
          </th>
          {apps.map((app) => (
            <th key={app.id} scope="col" className="nhsuk-table__header" role="columnheader">
              <span className="nhsuk-u-visually-hidden">{app.app_name}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        <tr className="nhsuk-table__row" role="row">
          <th scope="row" className="nhsuk-table__header" role="rowheader">
            Name
          </th>
          {apps.map((app) => (
            <td key={app.id} className="nhsuk-table__cell" role="cell">
              <span className="nhsuk-table-responsive__heading" aria-hidden="true">
                {app.app_name}{' '}
              </span>
              <ProductColumnHeader app={app} onRemove={onRemove} />
            </td>
          ))}
        </tr>
        <tr className="nhsuk-table__row" role="row">
          <th scope="row" className="nhsuk-table__header" role="rowheader">
            Supplier
          </th>
          {apps.map((app) => {
            const supplier = typeof app.supplier_name === 'string' ? app.supplier_name.trim() : ''
            return (
              <td key={app.id} className="nhsuk-table__cell hs-compare-value" role="cell">
                <span className="nhsuk-table-responsive__heading" aria-hidden="true">
                  {app.app_name}{' '}
                </span>
                {supplier ? (
                  supplier
                ) : (
                  <span className="nhsuk-u-secondary-text-colour">{CHECK_WITH_SUPPLIER}</span>
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}

function CompareSectionTable({
  section,
  apps,
}: {
  section: CompareTableSectionDef
  apps: App[]
}) {
  return (
    <table className="nhsuk-table-responsive" role="table" id={`compare-${section.id}`}>
      <CompareColGroup productCount={apps.length} />
      <caption className="nhsuk-table__caption nhsuk-table__caption--m">{section.caption}</caption>
      <thead className="nhsuk-table__head" role="rowgroup">
        <tr className="nhsuk-table__row" role="row">
          <th scope="col" className="nhsuk-table__header hs-compare-dimension-col" role="columnheader">
            <span className="nhsuk-u-visually-hidden">Comparison dimension</span>
          </th>
          {apps.map((app) => (
            <th key={app.id} scope="col" className="nhsuk-table__header" role="columnheader">
              <span className="nhsuk-u-visually-hidden">{app.app_name}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {section.rows.map((row) => (
          <tr
            key={row.key}
            className={`nhsuk-table__row${row.key === 'product_profile' ? ' hs-compare-row--product-page' : ''}`}
            role="row"
          >
            <th scope="row" className="nhsuk-table__header" role="rowheader">
              {row.label}
            </th>
            {apps.map((app) => (
              <td key={app.id} className="nhsuk-table__cell hs-compare-value" role="cell">
                <span className="nhsuk-table-responsive__heading" aria-hidden="true">
                  {app.app_name}{' '}
                </span>
                <CellContent cell={row.getCell(app)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function CompareNarrativeTables({
  selected,
  onRemove,
}: {
  selected: App[]
  onRemove?: (id: string) => void
}) {
  return (
    <div className="hs-compare-tables">
      <CompareProductStrip apps={selected} onRemove={onRemove} />
      {COMPARE_TABLE_SECTIONS.map((section) => (
        <CompareSectionTable key={section.id} section={section} apps={selected} />
      ))}
    </div>
  )
}
