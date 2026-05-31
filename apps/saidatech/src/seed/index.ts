import { getPayload } from 'payload'
import config from '../../payload.config'
import { upsertGlobal } from '@saidatech/cms-core/seed'
import { seedBlog } from './blog'
import { seedCaseStudies } from './case-studies'
import { seedDownloads } from './downloads'
import { seedNews } from './news'
import { seedHome } from './pages/home'
import { seedServicesPage, seedServices } from './services'
import { seedSeminars } from './seminars'
import { seedJobs } from './jobs'
import { seedFAQs } from './faqs'

async function seed() {
  // Skip seeding entirely during production builds
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️ Skipping seed in production build');
    return;
  }

  // 🛑 CHANGE HERE: Seeding will ONLY run if you explicitly demand it in your terminal command
  const shouldSeed = process.env.RUN_SEED === 'true' || process.env.FORCE_SEED === 'true';

  if (shouldSeed) {
    const payload = await getPayload({ config });
    payload.logger.info('🌱 Terminal flag detected. Seeding initial data...');

    const existingHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    });

    // Seed collections BEFORE pages so home.ts can query their IDs
    await seedCaseStudies(payload);
    await seedBlog(payload);
    await seedDownloads();
    await seedNews(payload);

    // Homepage Layout Guard
    const homeDoc = existingHome.docs[0];
    const hasHomeLayout = homeDoc && (homeDoc.layout && homeDoc.layout.length > 0);
    
    if (!hasHomeLayout) {
      await seedHome(payload);
    } else {
      payload.logger.info('⏭️ Skipping home page seed — layout blocks already configured.');
    }

    await seedServicesPage(payload);
    await seedServices(payload);

    // Remaining collections
    await seedSeminars(payload);
    await seedJobs(payload);
    await seedFAQs(payload);

    await upsertGlobal(payload, 'company-info', { /* your data */ });
    
    // Header Layout Guard
    const existingHeader = await payload.findGlobal({ slug: 'header' });
    if (!existingHeader || !existingHeader.navItems?.length) {
      await upsertGlobal(payload, 'header', { /* your initial mock data */ });
    }
    
    payload.logger.info('✅ Seed completed successfully.');
  } else {
    // This will now print silently on standard restarts without touching your data!
    console.log('⏭️ Skipping seed — No terminal seed command provided.');
  }
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});