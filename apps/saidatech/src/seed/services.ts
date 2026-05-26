import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedServicesPage(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'pages', 'services', {
    title: { en: 'Services', ja: 'サービス', bn: 'সেবাসমূহ' },
    status: 'published',
    layout: [
      {
        blockType: 'hero',
        heading: {
          en: 'Our Services',
          ja: 'サービス一覧',
          bn: 'আমাদের সেবাসমূহ',
        },
        subheading: {
          en: 'From career placement to visa support and language training — everything you need to build your future in Japan.',
          ja: 'キャリア支援・ビザ申請・日本語研修まで、日本での未来をつくるすべてのサービスを提供します。',
          bn: 'ক্যারিয়ার নিয়োগ থেকে ভিসা সহায়তা এবং ভাষা প্রশিক্ষণ পর্যন্ত — জাপানে আপনার ভবিষ্যৎ গড়তে প্রয়োজনীয় সবকিছু।',
        },
        ctaPrimary: {
          label: { en: 'Contact Us', ja: 'お問い合わせ', bn: 'যোগাযোগ করুন' },
          href: '/contact',
        },
        variant: 'center',
        minHeight: 'medium',
        overlayOpacity: 40,
        transparentHeader: false,
      },
      {
        blockType: 'services-grid',
        sectionHeading: {
          en: 'What We Offer',
          ja: 'サービス内容',
          bn: 'আমরা যা অফার করি',
        },
        columns: '3',
      },
      {
        blockType: 'cta-banner',
        heading: {
          en: 'Unsure which service fits you?',
          ja: 'どのサービスが合っているか迷っていますか？',
          bn: 'কোন সেবাটি আপনার জন্য উপযুক্ত তা নিশ্চিত নন?',
        },
        primaryButton: {
          label: { en: 'Talk to Us', ja: '相談する', bn: 'কথা বলুন' },
          href: '/contact',
        },
        variant: 'filled',
      },
    ],
  })
}

export async function seedServices(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'services', 'job-placement', {
    title: {
      en: 'Job Placement',
      ja: '求人・就職支援',
      bn: 'চাকরি নিয়োগ সেবা',
    },
    excerpt: {
      en: 'We match skilled overseas professionals with leading Japanese companies across technology, manufacturing, and logistics sectors.',
      ja: '海外の優秀な人材と日本の主要企業をマッチング。IT・製造・物流など幅広い分野で就職をサポートします。',
      bn: 'আমরা দক্ষ বিদেশী পেশাদারদের প্রযুক্তি, উৎপাদন এবং লজিস্টিক্স খাতে জাপানের শীর্ষ কোম্পানিগুলির সাথে মিলিয়ে দিই।',
    },
    stats: [
      { value: 500, suffix: '+', label: { en: 'Placements', ja: '就職実績', bn: 'নিয়োগ' } },
      { value: 120, suffix: '+', label: { en: 'Partner Companies', ja: '提携企業', bn: 'অংশীদার কোম্পানি' } },
      { value: 15, suffix: '+', label: { en: 'Industries Covered', ja: '対応業種', bn: 'শিল্প খাত' } },
    ],
    cta: {
      heading: {
        en: 'Ready to start your career in Japan?',
        ja: '日本でキャリアをスタートしませんか？',
        bn: 'জাপানে ক্যারিয়ার শুরু করতে প্রস্তুত?',
      },
      buttonLabel: { en: 'Get Started', ja: '相談する', bn: 'শুরু করুন' },
      buttonHref: '/contact',
    },
    icon: 'briefcase',
    sort: 1,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'services', 'visa-support', {
    title: {
      en: 'Visa Support',
      ja: 'ビザ申請サポート',
      bn: 'ভিসা সহায়তা',
    },
    excerpt: {
      en: 'Expert guidance on work visa applications, renewals, and status changes — from initial documentation through to approval.',
      ja: '就労ビザの申請・更新・変更を徹底サポート。書類準備から許可取得まで専門スタッフが対応します。',
      bn: 'কর্মসংস্থান ভিসা আবেদন, নবায়ন এবং স্থিতি পরিবর্তনে বিশেষজ্ঞ গাইডেন্স — প্রাথমিক নথিপত্র থেকে অনুমোদন পর্যন্ত।',
    },
    stats: [
      { value: 98, suffix: '%', label: { en: 'Approval Rate', ja: '許可取得率', bn: 'অনুমোদনের হার' } },
      { value: 15, suffix: '+', label: { en: 'Visa Categories', ja: '対応ビザ種別', bn: 'ভিসার ধরন' } },
      { value: 7, suffix: '', label: { en: 'Avg. Days to Process', ja: '平均処理日数', bn: 'গড় প্রক্রিয়ার দিন' } },
    ],
    cta: {
      heading: {
        en: 'Need help with your visa?',
        ja: 'ビザのことでお困りですか？',
        bn: 'ভিসা নিয়ে সাহায্য দরকার?',
      },
      buttonLabel: { en: 'Book a Consultation', ja: '無料相談を予約', bn: 'পরামর্শ নিন' },
      buttonHref: '/contact',
    },
    icon: 'file-text',
    sort: 2,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'services', 'language-training', {
    title: {
      en: 'Japanese Language Training',
      ja: '日本語研修プログラム',
      bn: 'জাপানি ভাষা প্রশিক্ষণ',
    },
    excerpt: {
      en: 'Structured Japanese language courses tailored for working professionals — business communication, JLPT preparation, and workplace etiquette.',
      ja: 'ビジネスコミュニケーション・JLPT対策・職場マナーを網羅した、社会人向け日本語研修プログラム。',
      bn: 'কর্মরত পেশাদারদের জন্য কাঠামোগত জাপানি ভাষার কোর্স — ব্যবসায়িক যোগাযোগ, JLPT প্রস্তুতি এবং কর্মক্ষেত্রের শিষ্টাচার।',
    },
    stats: [
      { value: 3, suffix: '', label: { en: 'Proficiency Levels', ja: 'レベル区分', bn: 'দক্ষতার স্তর' } },
      { value: 200, suffix: '+', label: { en: 'Graduates', ja: '修了者数', bn: 'স্নাতক' } },
      { value: 12, suffix: '', label: { en: 'Weeks per Course', ja: 'コース週数', bn: 'কোর্সের সপ্তাহ' } },
    ],
    cta: {
      heading: {
        en: 'Start learning Japanese today',
        ja: '今日から日本語を始めよう',
        bn: 'আজই জাপানি শিখুন',
      },
      buttonLabel: { en: 'Enquire Now', ja: 'お問い合わせ', bn: 'জিজ্ঞেস করুন' },
      buttonHref: '/contact',
    },
    icon: 'book-open',
    sort: 3,
    active: true,
    aiVisible: true,
  })
}
