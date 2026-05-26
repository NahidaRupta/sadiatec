import { getPayload } from 'payload'
import config from '../../payload.config'
import { upsertGlobal } from '@saidatech/cms-core/seed'
import { seedHome } from './pages/home'
import { seedServicesPage, seedServices } from './services'
import { seedCaseStudies } from './case-studies'
import { seedBlog } from './blog'
import { seedSeminars } from './seminars'
import { seedJobs } from './jobs'
import { seedFAQs } from './faqs'

async function seed() {
  // 1. CRUCIAL GUARD: Never run seeding during production builds or in a production environment
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const payload = await getPayload({ config })

  // IMPORTANT: Only seed if in development AND no content exists yet
  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (existingHome.totalDocs === 0 || process.env.RUN_SEED === 'true') {
    payload.logger.info('🌱 Seeding initial data...')
    await seedHome(payload)
    await seedServicesPage(payload)
    await seedServices(payload)
    await seedCaseStudies(payload)
    await seedBlog(payload)
    await seedSeminars(payload)
    await seedJobs(payload)
    await seedFAQs(payload)

    await upsertGlobal(payload, 'company-info', { /* ... your data ... */ })
    await upsertGlobal(payload, 'header', { /* ... your data ... */ })

    payload.logger.info('✅ Seed complete.')
  } else {
    payload.logger.info('⏭️  Skipping seed - content already exists.')
  }

  // REMOVED process.exit(0) from here completely to let Next.js processes live naturally
}
seed().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})