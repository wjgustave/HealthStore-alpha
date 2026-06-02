import { pgTable, uuid, text, timestamp, unique, jsonb } from 'drizzle-orm/pg-core'

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: text('role'),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orgBookmarks = pgTable(
  'org_bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    appId: text('app_id').notNull(),
    savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
    savedByUserId: uuid('saved_by_user_id').references(() => users.id),
  },
  (t) => [unique().on(t.organizationId, t.appId)],
)

export const orgProfiles = pgTable('org_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .unique()
    .references(() => organizations.id),
  /** Editable OrgProfileSettings subset, stored as JSON. */
  profile: jsonb('profile').notNull(),
  updatedByUserId: uuid('updated_by_user_id').references(() => users.id),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orgExpressionsOfInterest = pgTable('org_expressions_of_interest', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  appId: text('app_id').notNull(),
  appName: text('app_name').notNull(),
  submittedByUserId: uuid('submitted_by_user_id').references(() => users.id),
  submittedByName: text('submitted_by_name'),
  submittedByEmail: text('submitted_by_email'),
  organisationName: text('organisation_name'),
  role: text('role'),
  phone: text('phone'),
  populationEstimate: text('population_estimate'),
  timeline: text('timeline'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
