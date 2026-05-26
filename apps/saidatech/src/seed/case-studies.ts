import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedCaseStudies(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'case-studies', 'manufacturing-talent-placement', {
    title: {
      en: 'Manufacturing Talent Placement 2025',
      ja: '製造業 人材採用事例 2025',
      bn: 'উৎপাদন খাতে প্রতিভা নিয়োগ ২০২৫',
    },
    clientName: {
      en: 'Tanaka Auto Parts Co.',
      ja: '田中部品株式会社',
      bn: 'তানাকা অটো পার্টস কো.',
    },
    industry: {
      en: 'Manufacturing',
      ja: '製造業',
      bn: 'উৎপাদন শিল্প',
    },
    tagline: {
      en: 'Placing 20 skilled engineers from Vietnam in 60 days',
      ja: 'ベトナム人エンジニア20名を60日間で採用',
      bn: '৬০ দিনে ভিয়েতনাম থেকে ২০ জন দক্ষ প্রকৌশলী নিয়োগ',
    },
    results: [
      { value: 20, suffix: '', label: { en: 'Engineers Placed', ja: '採用エンジニア数', bn: 'নিয়োগকৃত প্রকৌশলী' } },
      { value: 60, suffix: '', label: { en: 'Days to Placement', ja: '採用完了日数', bn: 'নিয়োগ সম্পন্নের দিন' } },
      { value: 97, suffix: '%', label: { en: 'Retention at 12 Months', ja: '12ヶ月定着率', bn: '১২ মাসে ধরে রাখার হার' } },
    ],
    publishedAt: '2025-03-01',
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'case-studies', 'caregiver-visa-program', {
    title: {
      en: 'Caregiver Visa Programme 2025',
      ja: '介護士ビザ取得プログラム 2025',
      bn: 'কেয়ারগিভার ভিসা প্রোগ্রাম ২০২৫',
    },
    clientName: {
      en: 'Setagaya General Hospital',
      ja: '世田谷総合病院',
      bn: 'সেটাগায়া জেনারেল হাসপাতাল',
    },
    industry: {
      en: 'Healthcare',
      ja: '医療・介護',
      bn: 'স্বাস্থ্যসেবা',
    },
    tagline: {
      en: '15 caregivers visa-approved and onboarded within a single programme cycle',
      ja: '1プログラムサイクルで介護士15名のビザ取得・入職を実現',
      bn: 'একটি প্রোগ্রাম চক্রে ১৫ জন কেয়ারগিভারের ভিসা অনুমোদন ও অনবোর্ডিং',
    },
    results: [
      { value: 15, suffix: '', label: { en: 'Caregivers Placed', ja: '採用介護士数', bn: 'নিয়োগকৃত কেয়ারগিভার' } },
      { value: 100, suffix: '%', label: { en: 'Visa Approval Rate', ja: 'ビザ許可取得率', bn: 'ভিসা অনুমোদনের হার' } },
      { value: 3, suffix: '', label: { en: 'Months End-to-End', ja: 'トータル所要月数', bn: 'শুরু থেকে শেষ পর্যন্ত মাস' } },
    ],
    publishedAt: '2025-01-15',
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'case-studies', 'it-skills-bridge', {
    title: {
      en: 'IT Skills Bridge Programme 2024',
      ja: 'ITスキルブリッジプログラム 2024',
      bn: 'আইটি দক্ষতা সেতু কর্মসূচি ২০২৪',
    },
    clientName: {
      en: 'Finlink Technologies',
      ja: 'フィンリンク・テクノロジーズ',
      bn: 'ফিনলিংক টেকনোলজিস',
    },
    industry: {
      en: 'Financial Technology',
      ja: 'フィンテック',
      bn: 'আর্থিক প্রযুক্তি',
    },
    tagline: {
      en: '8 bilingual software engineers placed with in-programme Japanese language training',
      ja: '日本語研修込みでバイリンガルエンジニア8名を採用',
      bn: 'প্রোগ্রামে জাপানি ভাষা প্রশিক্ষণ সহ ৮ জন দ্বিভাষী সফটওয়্যার প্রকৌশলী নিয়োগ',
    },
    results: [
      { value: 8, suffix: '', label: { en: 'Engineers Placed', ja: '採用エンジニア数', bn: 'নিয়োগকৃত প্রকৌশলী' } },
      { value: 6, suffix: ' wks', label: { en: 'Language Training', ja: '日本語研修期間', bn: 'ভাষা প্রশিক্ষণের সপ্তাহ' } },
      { value: 4, suffix: 'x', label: { en: 'Interview-to-Offer Ratio', ja: '内定率', bn: 'সাক্ষাৎকার-অফার অনুপাত' } },
    ],
    publishedAt: '2024-11-10',
    active: true,
    aiVisible: true,
  })
}
