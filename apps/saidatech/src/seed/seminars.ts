import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedSeminars(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'seminars', 'ssw-visa-seminar-july-2025', {
    title: {
      en: 'Understanding SSW Visa Requirements in 2025',
      ja: '特定技能ビザ要件の解説セミナー（2025年版）',
      bn: '২০২৫ সালে SSW ভিসার প্রয়োজনীয়তা বোঝা',
    },
    excerpt: {
      en: 'A deep-dive into the latest Specified Skilled Worker visa requirements, required documentation, and common rejection points — presented by our in-house compliance team.',
      ja: '特定技能ビザの最新要件・必要書類・よくある不許可事由を、社内コンプライアンスチームが詳しく解説します。',
      bn: 'সর্বশেষ বিশেষায়িত দক্ষ কর্মী ভিসার প্রয়োজনীয়তা, প্রয়োজনীয় ডকুমেন্টেশন এবং সাধারণ প্রত্যাখ্যানের কারণগুলির গভীর আলোচনা।',
    },
    date: '2025-07-15',
    endDate: '2025-07-15',
    onlineMeetingUrl: 'https://forms.sadiatec.com/ssw-seminar-2025',
    speaker: {
      name: 'Saidatech Compliance Team',
      jobTitle: {
        en: 'Visa & Compliance',
        ja: 'ビザ・コンプライアンス',
        bn: 'ভিসা ও সম্মতি',
      },
      organization: {
        en: 'Saidatech',
        ja: 'サイダテック',
        bn: 'সাইদাটেক',
      },
    },
    capacity: 200,
    registrationStatus: 'open',
    registrationUrl: 'https://forms.sadiatec.com/ssw-seminar-2025',
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'seminars', 'hiring-overseas-engineers-webinar-2025', {
    title: {
      en: 'How Japanese Companies Can Hire Overseas Engineers',
      ja: '日本企業が海外エンジニアを採用する方法',
      bn: 'জাপানি কোম্পানিগুলি কীভাবে বিদেশী প্রকৌশলী নিয়োগ করতে পারে',
    },
    excerpt: {
      en: 'Practical guidance for Japanese HR managers on sourcing, screening, and onboarding overseas engineering talent within Japan\'s visa and labour law framework.',
      ja: '日本のHR担当者向けに、ビザ・労働法の枠組みの中で海外エンジニア人材を採用・入社させる実践的な方法を解説します。',
      bn: 'জাপানের ভিসা ও শ্রম আইনের কাঠামোর মধ্যে বিদেশী প্রকৌশল প্রতিভা সোর্সিং, স্ক্রিনিং এবং অনবোর্ডিংয়ের জন্য জাপানি এইচআর ম্যানেজারদের ব্যবহারিক নির্দেশিকা।',
    },
    date: '2025-08-20',
    endDate: '2025-08-20',
    venue: {
      en: 'Shibuya, Tokyo',
      ja: '東京都渋谷区',
      bn: 'শিবুয়া, টোকিও',
    },
    speaker: {
      name: 'Tanaka Hiroshi',
      jobTitle: {
        en: 'Head of Talent Strategy',
        ja: 'タレント戦略部長',
        bn: 'ট্যালেন্ট স্ট্র্যাটেজির প্রধান',
      },
      organization: {
        en: 'Saidatech',
        ja: 'サイダテック',
        bn: 'সাইদাটেক',
      },
    },
    capacity: 50,
    registrationStatus: 'open',
    registrationUrl: 'https://forms.sadiatec.com/overseas-engineer-seminar-2025',
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'seminars', 'jlpt-n4-workplace-readiness-march-2025', {
    title: {
      en: 'JLPT N4 and Workplace Readiness',
      ja: '日本語能力試験N4と職場対応力',
      bn: 'JLPT N4 এবং কর্মক্ষেত্রে প্রস্তুতি',
    },
    excerpt: {
      en: 'A recorded 90-minute session examining whether JLPT N4 is sufficient for structured factory and office environments — with placement data from 120 workers across three prefectures.',
      ja: '3県120人の就業データをもとに、JLPT N4が工場・オフィスなどの構造化された職場環境に十分かを90分で解説した録画セミナーです。',
      bn: 'তিনটি প্রিফেকচার জুড়ে ১২০ জন কর্মীর নিয়োগ তথ্য সহ কাঠামোগত কারখানা ও অফিস পরিবেশের জন্য JLPT N4 যথেষ্ট কিনা তা পরীক্ষা করে ৯০ মিনিটের রেকর্ড করা সেশন।',
    },
    date: '2025-03-08',
    endDate: '2025-03-08',
    onlineMeetingUrl: 'https://forms.sadiatec.com/jlpt-n4-seminar-recording',
    speaker: {
      name: 'Saidatech Language Team',
      jobTitle: {
        en: 'Language Training',
        ja: '語学研修',
        bn: 'ভাষা প্রশিক্ষণ',
      },
      organization: {
        en: 'Saidatech',
        ja: 'サイダテック',
        bn: 'সাইদাটেক',
      },
    },
    capacity: 150,
    registrationStatus: 'closed',
    active: true,
    aiVisible: true,
  })
}
