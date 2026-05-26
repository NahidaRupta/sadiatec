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
  // Skip seeding entirely during production builds
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️ Skipping seed in production build');
    return;
  }

  const payload = await getPayload({ config });

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  });

  const shouldSeed = existingHome.totalDocs === 0 || process.env.RUN_SEED === 'true' || process.env.FORCE_SEED === 'true';

  if (shouldSeed) {
    payload.logger.info('🌱 Seeding initial data...');
    
    await seedHome(payload);
    await seedServicesPage(payload);
    await seedServices(payload);
    await seedCaseStudies(payload);
    await seedBlog(payload);
    await seedSeminars(payload);
    await seedJobs(payload);
    await seedFAQs(payload);

    await upsertGlobal(payload, 'company-info', { /* your data */ });
    await upsertGlobal(payload, 'header', { /* your data */ });

    payload.logger.info('✅ Seed completed successfully.');
  } else {
    payload.logger.info('⏭️ Skipping seed — content already exists in database.');
  }
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});