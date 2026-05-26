import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

export async function seedHome(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'pages', 'home', {
    title: { en: 'Home', ja: 'ホーム', bn: 'হোম' },
    status: 'published',
    layout: [
      // ── 1. Hero ──────────────────────────────────────────────────────────
      {
        blockType: 'hero',
        eyebrow: {
          en: 'Saidatech',
          ja: 'サイダテック',
          bn: 'সাইদাটেক',
        },
        headline: {
          en: 'Study and Work\nNavigating to connect Human Resources',
          ja: '学び、働く\n人と企業をつなぐ架け橋',
          bn: 'অধ্যয়ন এবং কাজ\nমানব সম্পদ সংযোগের পথপ্রদর্শক',
        },
        subheadline: {
          en: 'Saidatech bridges skilled professionals from Bangladesh and beyond with trusted Japanese employers. Visa guidance, job matching, and bilingual support — every step of the way.',
          ja: 'バングラデシュをはじめとする優秀な人材と日本の信頼できる企業をつなぎます。ビザ手続き、求人マッチング、バイリンガルサポートを一貫して提供。',
          bn: 'সাইদাটেক বাংলাদেশ ও অন্যান্য দেশের দক্ষ পেশাদারদের জাপানের বিশ্বস্ত নিয়োগকর্তাদের সাথে সংযুক্ত করে। ভিসা সহায়তা, চাকরি ম্যাচিং এবং দ্বিভাষিক সমর্থন — প্রতিটি পদক্ষেপে।',
        },
        primaryCta: {
          label: { en: 'Get Started', ja: 'お問い合わせ', bn: 'শুরু করুন' },
          href: '/contact',
        },
        secondaryCta: {
          label: { en: 'Browse Jobs', ja: '求人を見る', bn: 'চাকরি দেখুন' },
          href: '/jobs',
        },
        inlineStats: [
          {
            value: { en: '5,000+', ja: '5,000社以上', bn: '৫,০০০+' },
            label: { en: 'Clients Served', ja: '支援実績', bn: 'সেবিত গ্রাহক' },
          },
          {
            value: { en: '100%', ja: '100%', bn: '১০০%' },
            label: { en: 'Permit Granted', ja: '許可取得率', bn: 'অনুমতি প্রদান' },
          },
          {
            value: { en: '24/7', ja: '24時間', bn: '২৪/৭' },
            label: { en: 'Support', ja: 'サポート体制', bn: 'সহায়তা' },
          },
        ],
        keywordPills: [
          { text: { en: 'Human Resources', ja: '人材紹介', bn: 'মানব সম্পদ' } },
          { text: { en: 'Study Permit', ja: '就学許可', bn: 'স্টাডি পারমিট' } },
          { text: { en: 'Work in Japan', ja: '日本就労', bn: 'জাপানে কাজ' } },
          { text: { en: 'SSW Visa', ja: '特定技能', bn: 'এসএসডাব্লিউ ভিসা' } },
          { text: { en: 'Job Matching', ja: '求人マッチング', bn: 'চাকরি ম্যাচিং' } },
          { text: { en: 'Language Training', ja: '語学研修', bn: 'ভাষা প্রশিক্ষণ' } },
          { text: { en: 'Visa Support', ja: 'ビザサポート', bn: 'ভিসা সহায়তা' } },
          { text: { en: 'Global Careers', ja: 'グローバル就職', bn: 'গ্লোবাল ক্যারিয়ার' } },
        ],
        showScrollIndicator: true,
      },

      // ── 2. Logo Cloud ────────────────────────────────────────────────────
      {
        blockType: 'logo-cloud',
        eyebrow: {
          en: 'Partners & Certifications',
          ja: 'パートナー・認定機関',
          bn: 'অংশীদার ও সনদপত্র',
        },
        logos: [
          { name: { en: 'Automotive Partner', ja: '自動車メーカー', bn: 'অটোমোটিভ অংশীদার' }, caption: { en: 'Automotive', ja: '自動車', bn: 'অটোমোটিভ' } },
          { name: { en: 'Electronics Corp', ja: '電子機器企業', bn: 'ইলেকট্রনিক্স কর্পোরেশন' }, caption: { en: 'Electronics', ja: '電子機器', bn: 'ইলেকট্রনিক্স' } },
          { name: { en: 'Precision Equipment', ja: '精密機器', bn: 'প্রিসিশন ইকুইপমেন্ট' }, caption: { en: 'Precision', ja: '精密', bn: 'প্রিসিশন' } },
          { name: { en: 'Auto Parts Maker', ja: '自動車部品', bn: 'অটো পার্টস মেকার' }, caption: { en: 'Auto Parts', ja: '部品', bn: 'অটো পার্টস' } },
          { name: { en: 'Manufacturing Group', ja: '製造グループ', bn: 'ম্যানুফ্যাকচারিং গ্রুপ' }, caption: { en: 'Manufacturing', ja: '製造', bn: 'উৎপাদন' } },
          { name: { en: 'Logistics Partner', ja: '物流パートナー', bn: 'লজিস্টিক্স অংশীদার' }, caption: { en: 'Logistics', ja: '物流', bn: 'লজিস্টিক্স' } },
          { name: { en: 'Tech Solutions', ja: 'テックソリューション', bn: 'টেক সমাধান' }, caption: { en: 'Technology', ja: 'テクノロジー', bn: 'প্রযুক্তি' } },
          { name: { en: 'Food Processing', ja: '食品加工', bn: 'ফুড প্রসেসিং' }, caption: { en: 'Food Industry', ja: '食品', bn: 'খাদ্য শিল্প' } },
        ],
        scrollSpeed: 'medium',
      },

      // ── 3. Stats ─────────────────────────────────────────────────────────
      {
        blockType: 'stats',
        eyebrow: {
          en: 'Why Clients Choose Saidatech',
          ja: '選ばれる理由',
          bn: 'কেন সাইদাটেক বেছে নেন',
        },
        sectionHeading: {
          en: 'Trusted by industry leaders across Japan',
          ja: '日本全国の企業から信頼される実績',
          bn: 'জাপান জুড়ে শিল্প নেতাদের বিশ্বাস',
        },
        items: [
          { value: 5000, suffix: '+', label: { en: 'Clients Served', ja: '支援実績', bn: 'সেবিত গ্রাহক' } },
          { value: 250, suffix: '+', label: { en: 'Partner Companies', ja: '提携企業', bn: 'অংশীদার কোম্পানি' } },
          { value: 100, suffix: '%', label: { en: 'Permit Granted', ja: '許可取得率', bn: 'অনুমতি প্রদান' } },
          { value: 15, suffix: '+', label: { en: 'Years Experience', ja: '年の実績', bn: 'বছরের অভিজ্ঞতা' } },
        ],
      },

      // ── 4. Bento Grid ────────────────────────────────────────────────────
      {
        blockType: 'bento-grid',
        eyebrow: {
          en: 'Why Saidatech',
          ja: 'サイダテックが選ばれる理由',
          bn: 'কেন সাইদাটেক',
        },
        heading: {
          en: '5 Reasons Clients Choose Us',
          ja: '5つの選ばれる理由',
          bn: 'আমাদের বেছে নেওয়ার ৫টি কারণ',
        },
        intro: {
          en: 'From your first inquiry to your first payslip in Japan, Saidatech handles every detail so you can focus on building your career.',
          ja: '最初のお問い合わせから日本での最初の給与明細まで、すべての手続きをサイダテックが責任を持ってサポートします。',
          bn: 'আপনার প্রথম অনুসন্ধান থেকে জাপানে প্রথম বেতন পাওয়া পর্যন্ত, সাইদাটেক প্রতিটি বিবরণ পরিচালনা করে যাতে আপনি ক্যারিয়ার গড়তে মনোযোগ দিতে পারেন।',
        },
        layout: 'asymmetric',
        items: [
          {
            number: '01',
            title: { en: 'Verified Japanese Employer Network', ja: '審査済みの日本企業ネットワーク', bn: 'যাচাইকৃত জাপানি নিয়োগকর্তা নেটওয়ার্ক' },
            description: {
              en: 'Every partner company is individually vetted for compliance, workplace culture, and pay standards — so you only connect with employers worth working for.',
              ja: '全提携企業はコンプライアンス・職場環境・給与水準を個別審査済み。信頼できる企業のみをご紹介します。',
              bn: 'প্রতিটি অংশীদার কোম্পানি আনুগত্য, কর্মক্ষেত্র সংস্কৃতি এবং বেতন মানদণ্ডের জন্য পৃথকভাবে যাচাই করা হয়।',
            },
          },
          {
            number: '02',
            title: { en: 'End-to-End Visa & Compliance Support', ja: 'ビザ・法令対応のワンストップサポート', bn: 'সম্পূর্ণ ভিসা ও কমপ্লায়েন্স সহায়তা' },
            description: {
              en: 'We handle all visa categories — SSW, TITP, student, and dependent — along with residence card renewals and regulatory filings.',
              ja: '特定技能・技能実習・留学・家族滞在など全ビザ種別に対応。在留カード更新や各種届出も代行します。',
              bn: 'এসএসডাব্লিউ, টিআইটিপি, ছাত্র এবং নির্ভরশীল সহ সমস্ত ভিসা বিভাগ পরিচালনা করি। বাসস্থান কার্ড নবায়নও করা হয়।',
            },
          },
          {
            number: '03',
            title: { en: 'Bilingual Onboarding & Aftercare', ja: 'バイリンガル入社・アフターケア', bn: 'দ্বিভাষিক অনবোর্ডিং ও আফটারকেয়ার' },
            description: {
              en: 'Our bilingual coordinators guide you through day-one orientation, housing setup, and ongoing check-ins for the first year.',
              ja: '初日のオリエンテーション、住居手配から入社後1年間の定期フォローまで、バイリンガルコーディネーターが伴走します。',
              bn: 'আমাদের দ্বিভাষিক সমন্বয়কারীরা প্রথম দিনের ওরিয়েন্টেশন, আবাসন সেটআপ এবং প্রথম বছরের চেক-ইন পরিচালনা করেন।',
            },
          },
          {
            number: '04',
            title: { en: 'Industry-Specific Training Programs', ja: '業種別研修プログラム', bn: 'শিল্প-নির্দিষ্ট প্রশিক্ষণ কার্যক্রম' },
            description: {
              en: 'Sector-tailored pre-departure training in manufacturing, food processing, construction, and care work prepares candidates before they arrive.',
              ja: '製造・食品・建設・介護など業種別の出国前研修で、即戦力として活躍できる人材を育成します。',
              bn: 'উৎপাদন, খাদ্য প্রক্রিয়াকরণ, নির্মাণ এবং যত্ন কাজে সেক্টর-অনুযায়ী প্রস্থান-পূর্ব প্রশিক্ষণ।',
            },
          },
          {
            number: '05',
            title: { en: 'Transparent Fees & Reporting', ja: '明朗会計と定期レポート', bn: 'স্বচ্ছ ফি ও রিপোর্টিং' },
            description: {
              en: 'No hidden costs. Candidates and employers both receive clear fee schedules, placement reports, and retention metrics.',
              ja: '隠れコスト一切なし。求職者と企業の双方に、明確な費用一覧・採用レポート・定着率データを提供します。',
              bn: 'কোনো লুকানো খরচ নেই। প্রার্থী এবং নিয়োগকর্তা উভয়ই স্পষ্ট ফি সময়সূচি, নিয়োগ প্রতিবেদন এবং ধারণ মেট্রিক্স পান।',
            },
          },
        ],
      },

      // ── 5. Services Grid ─────────────────────────────────────────────────
      {
        blockType: 'services-grid',
        eyebrow: {
          en: 'HR Services',
          ja: '人材サービス',
          bn: 'এইচআর সেবা',
        },
        heading: {
          en: 'Our Comprehensive HR Services',
          ja: '人材に関する包括的なサービス',
          bn: 'আমাদের ব্যাপক এইচআর সেবাসমূহ',
        },
        layout: 'alternating',
        services: [
          {
            title: { en: 'Student Visa Assistance', ja: '留学ビザサポート', bn: 'ছাত্র ভিসা সহায়তা' },
            subheadline: { en: 'Study in Japan', ja: '日本で学ぶ', bn: 'জাপানে পড়াশোনা' },
            description: {
              en: 'We guide students through every stage of the Japanese student visa process — from document preparation and language school enrollment to landing at your new institution.',
              ja: '書類準備・語学学校選び・入学手続きから入国まで、留学ビザ取得の全プロセスを丁寧にサポートします。',
              bn: 'নথি প্রস্তুতি থেকে ভাষা বিদ্যালয়ে ভর্তি পর্যন্ত জাপানী ছাত্র ভিসা প্রক্রিয়ার প্রতিটি ধাপে আমরা গাইড করি।',
            },
            cta: {
              label: { en: 'Learn more', ja: '詳しく見る', bn: 'আরও জানুন' },
              href: '/services/student-visa',
            },
          },
          {
            title: { en: 'SSW & Technical Internship Support', ja: '特定技能・技能実習サポート', bn: 'এসএসডাব্লিউ ও টেকনিক্যাল ইন্টার্নশিপ সহায়তা' },
            subheadline: { en: 'Work-based pathways', ja: '就労在留資格', bn: 'কর্ম-ভিত্তিক পথ' },
            description: {
              en: 'From JLPT preparation and skills testing to employer matching and inbound logistics, our team handles SSW and TITP registrations end-to-end.',
              ja: 'JLPT対策・技能試験から企業マッチング・入国手続きまで、特定技能・技能実習の申請を一括サポートします。',
              bn: 'JLPT প্রস্তুতি ও দক্ষতা পরীক্ষা থেকে নিয়োগকর্তা ম্যাচিং পর্যন্ত, আমাদের দল এসএসডাব্লিউ এবং টিআইটিপি নিবন্ধন পরিচালনা করে।',
            },
            cta: {
              label: { en: 'Learn more', ja: '詳しく見る', bn: 'আরও জানুন' },
              href: '/services/ssw-titp',
            },
          },
          {
            title: { en: 'Employment & Job Matching', ja: '求人マッチング', bn: 'কর্মসংস্থান ও চাকরি ম্যাচিং' },
            subheadline: { en: 'Find the right fit', ja: '最適なマッチング', bn: 'সঠিক ম্যাচ খুঁজুন' },
            description: {
              en: 'Our curated job board and dedicated placement coordinators match your skills and career goals with verified openings at Japanese companies across multiple industries.',
              ja: '厳選された求人情報と専任のコーディネーターが、あなたのスキルとキャリア目標に合った日本企業の求人をご紹介します。',
              bn: 'আমাদের বাছাই করা চাকরির তালিকা এবং নিবেদিত প্লেসমেন্ট সমন্বয়কারীরা আপনার দক্ষতা এবং ক্যারিয়ার লক্ষ্যের সাথে মিলিয়ে দেয়।',
            },
            cta: {
              label: { en: 'Browse jobs', ja: '求人を見る', bn: 'চাকরি দেখুন' },
              href: '/jobs',
            },
          },
          {
            title: { en: 'Visa Processing & Consultation', ja: 'ビザ申請・相談', bn: 'ভিসা প্রক্রিয়াকরণ ও পরামর্শ' },
            subheadline: { en: 'Stay compliant', ja: '在留資格管理', bn: 'কমপ্লায়েন্ট থাকুন' },
            description: {
              en: 'Our certified immigration specialists handle application filing, status-of-residence changes, renewals, and appeals — so your legal status is always in order.',
              ja: '認定入国管理スペシャリストが、在留資格申請・変更・更新・不服申立てまで対応。常に適法な状態を保ちます。',
              bn: 'আমাদের প্রত্যয়িত ইমিগ্রেশন বিশেষজ্ঞরা আবেদন দাখিল, বাসস্থানের মর্যাদা পরিবর্তন, নবায়ন এবং আপিল পরিচালনা করেন।',
            },
            cta: {
              label: { en: 'Learn more', ja: '詳しく見る', bn: 'আরও জানুন' },
              href: '/services/visa',
            },
          },
          {
            title: { en: 'Japanese Language & Cultural Training', ja: '日本語・文化研修', bn: 'জাপানি ভাষা ও সাংস্কৃতিক প্রশিক্ষণ' },
            subheadline: { en: 'Prepare before you arrive', ja: '渡航前準備', bn: 'আসার আগে প্রস্তুত হন' },
            description: {
              en: 'Our structured pre-departure curriculum covers N5–N3 Japanese, workplace etiquette, daily-life navigation, and sector-specific vocabulary to hit the ground running.',
              ja: 'N5〜N3の日本語・ビジネスマナー・日常生活・業種別用語を体系的に学ぶ出国前カリキュラムで、即戦力としてスタートできます。',
              bn: 'আমাদের কাঠামোগত প্রি-ডিপার্চার কারিকুলামে N5-N3 জাপানি, কর্মক্ষেত্র শিষ্টাচার, দৈনন্দিন জীবন পথচলা এবং সেক্টর-নির্দিষ্ট শব্দভাণ্ডার অন্তর্ভুক্ত।',
            },
            cta: {
              label: { en: 'Learn more', ja: '詳しく見る', bn: 'আরও জানুন' },
              href: '/services/language-training',
            },
          },
        ],
      },

      // ── 6. CTA Banner ────────────────────────────────────────────────────
      {
        blockType: 'cta-banner',
        eyebrow: {
          en: 'Get in Touch',
          ja: 'お問い合わせ',
          bn: 'যোগাযোগ করুন',
        },
        heading: {
          en: 'Ready to start your Japan career journey?',
          ja: '日本でのキャリアを始めませんか？',
          bn: 'জাপানে আপনার ক্যারিয়ার শুরু করতে প্রস্তুত?',
        },
        body: {
          en: 'Our team typically responds within one business day. We\'ll review your profile and connect you with the right service path.',
          ja: '通常1営業日以内にご返信いたします。ご状況を確認のうえ、最適なサービスをご案内します。',
          bn: 'আমাদের দল সাধারণত এক কার্যদিবসের মধ্যে সাড়া দেয়। আমরা আপনার প্রোফাইল পর্যালোচনা করে সঠিক সেবার পথে সংযুক্ত করব।',
        },
        primaryButton: {
          label: { en: 'Contact Us', ja: 'お問い合わせ', bn: 'যোগাযোগ করুন' },
          href: '/contact',
        },
        secondaryButton: {
          label: { en: 'Browse Jobs', ja: '求人を見る', bn: 'চাকরি দেখুন' },
          href: '/jobs',
        },
        variant: 'gradient',
      },
    ],
  })
}
