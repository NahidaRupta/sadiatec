import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedHome(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'pages', 'home', {
    title: { en: 'Home', ja: 'ホーム', bn: 'হোম' },
    status: 'published',
    layout: [
      {
        blockType: 'hero',
        heading: {
          en: 'Build Your Career in Japan',
          ja: '日本でキャリアを築こう',
          bn: 'জাপানে আপনার ক্যারিয়ার গড়ুন',
        },
        subheading: {
          en: 'Saidatech connects skilled professionals from abroad with leading Japanese companies. Visa support, job placement, and career guidance — all in one place.',
          ja: '海外の優秀な人材と日本のトップ企業をつなぐサイダテック。ビザサポート・就職斡旋・キャリアガイダンスをワンストップで。',
          bn: 'সাইদাটেক বিদেশী দক্ষ পেশাদারদের সাথে জাপানের শীর্ষ কোম্পানিগুলি সংযুক্ত করে। ভিসা সহায়তা, চাকরি নিয়োগ এবং ক্যারিয়ার গাইডেন্স — একই জায়গায়।',
        },
        ctaPrimary: {
          label: { en: 'Browse Jobs', ja: '求人を探す', bn: 'চাকরি খুঁজুন' },
          href: '/jobs',
        },
        ctaSecondary: {
          label: { en: 'Our Services', ja: 'サービス一覧', bn: 'আমাদের সেবা' },
          href: '/services',
        },
        variant: 'center',
        minHeight: 'large',
        overlayOpacity: 50,
        transparentHeader: false,
      },
      {
        blockType: 'stats',
        items: [
          { value: 0, suffix: '+', label: { en: 'Placements',       ja: '就職実績',   bn: 'নিয়োগ'    } },
          { value: 0, suffix: '+', label: { en: 'Partner Companies', ja: '提携企業',   bn: 'অংশীদার'  } },
          { value: 0, suffix: '+', label: { en: 'Countries Served',  ja: '対応国数',   bn: 'দেশ'      } },
        ],
      },
      {
        blockType: 'services-grid',
        sectionHeading: { en: 'Our Services', ja: 'サービス', bn: 'আমাদের সেবা' },
        columns: '3',
      },
      {
        blockType: 'bento-grid',
        sectionHeading: { en: 'Why Choose Us', ja: '選ばれる理由', bn: 'কেন আমাদের বেছে নিন' },
        items: [
          {
            heading: { en: 'Placeholder', ja: 'プレースホルダー', bn: 'প্লেসহোল্ডার' },
            size: 'large',
          },
        ],
      },
      {
        blockType: 'case-study-carousel',
        autoAdvanceSeconds: 5,
      },
      {
        blockType: 'timeline',
        mode: 'history',
        items: [
          { year: '2024', label: { en: 'Founded', ja: '設立', bn: 'প্রতিষ্ঠিত' } },
        ],
      },
      {
        blockType: 'logo-cloud',
        scrolling: true,
      },
      {
        blockType: 'team-grid',
        columns: '3',
        showBio: false,
      },
      {
        blockType: 'faq',
        variant: 'accordion',
      },
      {
        blockType: 'cta-banner',
        heading: {
          en: 'Ready to Get Started?',
          ja: 'まずはご相談ください',
          bn: 'শুরু করতে প্রস্তুত?',
        },
        primaryButton: {
          label: { en: 'Contact Us', ja: 'お問い合わせ', bn: 'যোগাযোগ করুন' },
          href: '/contact',
        },
        variant: 'filled',
      },
    ],
  })
}
