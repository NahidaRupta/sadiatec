import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedJobs(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'jobs', 'visa-coordinator-tokyo', {
    title: {
      en: 'Visa Coordinator',
      ja: 'ビザコーディネーター',
      bn: 'ভিসা সমন্বয়কারী',
    },
    department: {
      en: 'Compliance',
      ja: 'コンプライアンス',
      bn: 'সম্মতি বিভাগ',
    },
    excerpt: {
      en: "Support foreign workers through Japan's visa application process, from document preparation to immigration office follow-up.",
      ja: '外国人労働者のビザ申請プロセス全体（書類準備から入国管理局への対応まで）をサポートします。',
      bn: 'বিদেশী কর্মীদের জাপানের ভিসা আবেদন প্রক্রিয়ায় ডকুমেন্ট প্রস্তুতি থেকে ইমিগ্রেশন অফিস ফলো-আপ পর্যন্ত সহায়তা করুন।',
    },
    location: {
      en: 'Tokyo, Japan',
      ja: '東京都',
      bn: 'টোকিও, জাপান',
    },
    employmentType: 'full-time',
    salary: {
      en: '¥3,500,000 – ¥4,500,000 / year',
      ja: '年収350万〜450万円',
      bn: '¥৩,৫০০,০০০ – ¥৪,৫০০,০০০ / বছর',
    },
    salaryMin: 3500000,
    salaryMax: 4500000,
    salaryCurrency: 'JPY',
    publishedAt: '2025-05-01',
    closingDate: '2025-07-31',
    requirements: [
      {
        item: {
          en: 'Business-level Japanese (JLPT N2 or equivalent)',
          ja: 'ビジネスレベルの日本語（JLPT N2以上）',
          bn: 'ব্যবসায়িক স্তরের জাপানি (JLPT N2 বা সমমান)',
        },
      },
      {
        item: {
          en: 'Conversational English or Bengali',
          ja: '英語またはベンガル語での日常会話',
          bn: 'কথোপকথনমূলক ইংরেজি বা বাংলা',
        },
      },
      {
        item: {
          en: 'Experience in immigration, legal, or HR administration',
          ja: '入国管理・法律・人事管理の実務経験',
          bn: 'অভিবাসন, আইনগত বা এইচআর প্রশাসনে অভিজ্ঞতা',
        },
      },
    ],
    benefits: [
      {
        item: {
          en: 'Full social insurance (health, pension, employment)',
          ja: '各種社会保険完備（健康・厚生年金・雇用）',
          bn: 'সম্পূর্ণ সামাজিক বিমা (স্বাস্থ্য, পেনশন, কর্মসংস্থান)',
        },
      },
      {
        item: {
          en: 'Transportation allowance',
          ja: '交通費支給',
          bn: 'পরিবহন ভাতা',
        },
      },
      {
        item: {
          en: 'Annual salary review',
          ja: '年1回の給与見直し',
          bn: 'বার্ষিক বেতন পর্যালোচনা',
        },
      },
    ],
    active: true,
    aiVisible: false,
  })

  await upsertBySlug(payload, 'jobs', 'talent-acquisition-specialist', {
    title: {
      en: 'Talent Acquisition Specialist',
      ja: '採用スペシャリスト',
      bn: 'প্রতিভা অধিগ্রহণ বিশেষজ্ঞ',
    },
    department: {
      en: 'Recruitment',
      ja: '採用部門',
      bn: 'নিয়োগ বিভাগ',
    },
    excerpt: {
      en: 'Source and screen candidates from South and Southeast Asia for placement with Japanese manufacturing, IT, and healthcare employers.',
      ja: '南アジア・東南アジアの候補者を発掘・選考し、日本の製造・IT・医療分野の雇用主への就業をサポートします。',
      bn: 'জাপানের উৎপাদন, আইটি এবং স্বাস্থ্যসেবা নিয়োগকর্তাদের সাথে নিয়োগের জন্য দক্ষিণ ও দক্ষিণ-পূর্ব এশিয়ার প্রার্থী খুঁজুন ও যাচাই করুন।',
    },
    location: {
      en: 'Tokyo, Japan (Remote-friendly)',
      ja: '東京都（リモート相談可）',
      bn: 'টোকিও, জাপান (রিমোট-বান্ধব)',
    },
    employmentType: 'full-time',
    salary: {
      en: '¥4,000,000 – ¥5,500,000 / year',
      ja: '年収400万〜550万円',
      bn: '¥৪,০০০,০০০ – ¥৫,৫০০,০০০ / বছর',
    },
    salaryMin: 4000000,
    salaryMax: 5500000,
    salaryCurrency: 'JPY',
    publishedAt: '2025-05-10',
    closingDate: '2025-08-15',
    requirements: [
      {
        item: {
          en: '2+ years in international recruitment or staffing',
          ja: '国際採用・人材派遣の実務経験2年以上',
          bn: 'আন্তর্জাতিক নিয়োগ বা স্টাফিংয়ে ২+ বছরের অভিজ্ঞতা',
        },
      },
      {
        item: {
          en: 'Fluent in English; Bengali or another South Asian language is a plus',
          ja: '英語ビジネスレベル。ベンガル語または南アジア系言語は歓迎',
          bn: 'ইংরেজিতে দক্ষ; বাংলা বা অন্য দক্ষিণ এশিয়ার ভাষা একটি সুবিধা',
        },
      },
      {
        item: {
          en: 'Familiarity with ATS platforms (e.g. Greenhouse, Lever)',
          ja: 'ATSプラットフォーム（Greenhouse、Leverなど）の使用経験',
          bn: 'ATS প্ল্যাটফর্মের সাথে পরিচিতি (যেমন Greenhouse, Lever)',
        },
      },
    ],
    benefits: [
      {
        item: {
          en: 'Performance bonus (up to 15% of base salary)',
          ja: 'パフォーマンスボーナス（基本給の最大15%）',
          bn: 'পারফরম্যান্স বোনাস (বেস স্যালারির ১৫% পর্যন্ত)',
        },
      },
      {
        item: {
          en: 'Hybrid work policy',
          ja: 'ハイブリッド勤務制度',
          bn: 'হাইব্রিড কাজের নীতি',
        },
      },
      {
        item: {
          en: 'Professional development budget ¥100,000 / year',
          ja: '自己啓発費用年間10万円支給',
          bn: 'পেশাদার উন্নয়ন বাজেট ¥১০০,০০০ / বছর',
        },
      },
    ],
    active: true,
    aiVisible: false,
  })

  await upsertBySlug(payload, 'jobs', 'client-success-manager-b2b', {
    title: {
      en: 'Client Success Manager (B2B)',
      ja: 'クライアントサクセスマネージャー（法人向け）',
      bn: 'ক্লায়েন্ট সাফল্য ম্যানেজার (B2B)',
    },
    department: {
      en: 'Client Services',
      ja: 'クライアントサービス',
      bn: 'ক্লায়েন্ট সেবা',
    },
    excerpt: {
      en: 'Own the post-sale relationship with our Japanese corporate clients — driving successful international talent placements and ensuring high retention and satisfaction.',
      ja: '日本法人クライアントとの契約後の関係を担い、外国人材のスムーズな就業定着と高い満足度を実現します。',
      bn: 'আমাদের জাপানি কর্পোরেট ক্লায়েন্টদের সাথে বিক্রয়োত্তর সম্পর্ক পরিচালনা করুন — সফল আন্তর্জাতিক প্রতিভা নিয়োগ নিশ্চিত করুন এবং উচ্চ ধরে রাখা ও সন্তুষ্টি নিশ্চিত করুন।',
    },
    location: {
      en: 'Tokyo, Japan',
      ja: '東京都',
      bn: 'টোকিও, জাপান',
    },
    employmentType: 'full-time',
    salary: {
      en: '¥5,000,000 – ¥7,000,000 / year',
      ja: '年収500万〜700万円',
      bn: '¥৫,০০০,০০০ – ¥৭,০০০,০০০ / বছর',
    },
    salaryMin: 5000000,
    salaryMax: 7000000,
    salaryCurrency: 'JPY',
    publishedAt: '2025-04-20',
    closingDate: '2025-09-30',
    requirements: [
      {
        item: {
          en: '3+ years in B2B client success, account management, or consulting',
          ja: 'B2Bクライアントサクセス・アカウント管理・コンサルティングの経験3年以上',
          bn: 'B2B ক্লায়েন্ট সাফল্য, অ্যাকাউন্ট ম্যানেজমেন্ট বা পরামর্শে ৩+ বছরের অভিজ্ঞতা',
        },
      },
      {
        item: {
          en: 'Native or near-native Japanese; business English',
          ja: 'ネイティブまたはそれに準ずる日本語。ビジネス英語',
          bn: 'নেটিভ বা নেটিভ-সদৃশ জাপানি; ব্যবসায়িক ইংরেজি',
        },
      },
      {
        item: {
          en: 'Track record of managing accounts worth ¥10M+ annually',
          ja: '年間1,000万円以上のアカウント管理の実績',
          bn: 'বার্ষিক ¥১০M+ মূল্যের অ্যাকাউন্ট পরিচালনার ট্র্যাক রেকর্ড',
        },
      },
    ],
    benefits: [
      {
        item: {
          en: 'Comprehensive health insurance + dental',
          ja: '健康保険完備＋歯科保険',
          bn: 'ব্যাপক স্বাস্থ্য বিমা + ডেন্টাল',
        },
      },
      {
        item: {
          en: 'Stock options (after 1 year)',
          ja: 'ストックオプション（1年後）',
          bn: 'স্টক অপশন (১ বছর পর)',
        },
      },
      {
        item: {
          en: '20 days paid leave + public holidays',
          ja: '有給休暇20日＋祝日',
          bn: '২০ দিন পেইড লিভ + সরকারি ছুটি',
        },
      },
    ],
    active: true,
    aiVisible: false,
  })
}
