import type { Payload } from 'payload'
import { upsertBySlug } from '@saidatech/cms-core/seed'

function para(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
          children: [{ type: 'text', text, format: 0, version: 1 }],
        },
      ],
    },
  }
}

export async function seedFAQs(payload: Payload): Promise<void> {
  await upsertBySlug(payload, 'faqs', 'what-is-ssw-visa', {
    question: {
      en: 'What is the SSW (Specified Skilled Worker) visa and who qualifies?',
      ja: '特定技能ビザとは何ですか？また、誰が対象になりますか？',
      bn: 'SSW (বিশেষায়িত দক্ষ কর্মী) ভিসা কী এবং কারা যোগ্য?',
    },
    answer: {
      en: para(
        'The Specified Skilled Worker (SSW) visa — officially 特定技能 — is a Japanese work visa created in 2019 to address labour shortages in 16 designated industries, including manufacturing, construction, hospitality, and food processing. To qualify, applicants must pass a sector-specific skills test and a Japanese language proficiency test (JLPT N4 or the Japan Foundation Test for Basic Japanese). Saidatech assists candidates throughout the entire qualification and application process.',
      ),
      ja: para(
        '特定技能ビザは、2019年に製造業・建設業・宿泊業・飲食料品製造業など16の特定産業分野における人手不足解消を目的に創設された就労在留資格です。取得には、分野別の技能試験と日本語能力試験（JLPT N4相当または国際交流基金日本語基礎テスト）への合格が必要です。サイダテックは資格取得から申請手続きまで一貫してサポートします。',
      ),
      bn: para(
        'বিশেষায়িত দক্ষ কর্মী (SSW) ভিসা ২০১৯ সালে উৎপাদন, নির্মাণ, আতিথেয়তা এবং খাদ্য প্রক্রিয়াকরণ সহ ১৬টি মনোনীত শিল্পে শ্রম ঘাটতি মোকাবেলার জন্য তৈরি হয়েছিল। যোগ্যতা অর্জনের জন্য আবেদনকারীদের একটি খাত-নির্দিষ্ট দক্ষতা পরীক্ষা এবং জাপানি ভাষা পরীক্ষায় (JLPT N4) উত্তীর্ণ হতে হবে। সাইদাটেক সমগ্র যোগ্যতা ও আবেদন প্রক্রিয়ায় প্রার্থীদের সহায়তা করে।',
      ),
    },
    category: {
      en: 'Visa & Immigration',
      ja: 'ビザ・在留資格',
      bn: 'ভিসা ও অভিবাসন',
    },
    sortOrder: 1,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'faqs', 'ssw-visa-timeline', {
    question: {
      en: 'How long does the SSW visa application process typically take?',
      ja: '特定技能ビザの申請手続きにはどのくらいの時間がかかりますか？',
      bn: 'SSW ভিসা আবেদন প্রক্রিয়া সাধারণত কতদিন লাগে?',
    },
    answer: {
      en: para(
        'The total timeline from starting test preparation to receiving your Certificate of Eligibility (COE) is typically 4 to 8 months. Skills and language tests take 1 to 3 months to prepare for and schedule. Once tests are passed, document preparation and employer matching take approximately 1 to 2 months. The Immigration Services Agency then processes the COE in 1 to 3 months. Saidatech coordinates each step to minimise delays.',
      ),
      ja: para(
        '試験準備の開始から在留資格認定証明書（COE）の取得まで、通常4〜8か月かかります。技能試験・語学試験の準備と受験に1〜3か月、合格後の書類準備と求人マッチングに約1〜2か月、出入国在留管理庁によるCOE審査に1〜3か月が目安です。サイダテックが各ステップを調整し、遅延を最小限に抑えます。',
      ),
      bn: para(
        'পরীক্ষার প্রস্তুতি শুরু থেকে COE পাওয়া পর্যন্ত মোট সময়সীমা সাধারণত ৪ থেকে ৮ মাস। দক্ষতা ও ভাষা পরীক্ষার জন্য ১ থেকে ৩ মাস সময় লাগে। পরীক্ষায় উত্তীর্ণ হলে ডকুমেন্ট প্রস্তুতি এবং নিয়োগকর্তার সাথে মিলিয়ে দিতে প্রায় ১ থেকে ২ মাস লাগে। ইমিগ্রেশন সার্ভিসেস এজেন্সি COE প্রক্রিয়া করতে ১ থেকে ৩ মাস নেয়।',
      ),
    },
    category: {
      en: 'Visa & Immigration',
      ja: 'ビザ・在留資格',
      bn: 'ভিসা ও অভিবাসন',
    },
    sortOrder: 2,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'faqs', 'recruitment-end-to-end-timeline', {
    question: {
      en: 'What is the end-to-end timeline from application to job start?',
      ja: '応募から就業開始までのプロセス全体にはどのくらいかかりますか？',
      bn: 'আবেদন থেকে চাকরি শুরু পর্যন্ত সম্পূর্ণ সময়সীমা কত?',
    },
    answer: {
      en: para(
        'For candidates who already hold a valid work visa or are currently in Japan, the process from initial application to job start typically takes 3 to 6 weeks: CV review and initial interview (1 week), employer introduction and interview (1 to 2 weeks), offer and negotiation (up to 1 week), and onboarding preparation (1 to 2 weeks). For overseas candidates requiring visa sponsorship, add the 4 to 8 month visa timeline.',
      ),
      ja: para(
        '有効な就労ビザをお持ちの方や在日の方の場合、応募から就業開始まで通常3〜6週間です：書類選考・初回面接（1週間）、求人先紹介・面接（1〜2週間）、内定・条件交渉（最大1週間）、入社準備（1〜2週間）。ビザ申請が必要な海外在住者の場合は、別途4〜8か月のビザ手続き期間が加わります。',
      ),
      bn: para(
        'যেসব প্রার্থীর ইতিমধ্যে বৈধ কর্মক্ষমতা ভিসা আছে বা জাপানে আছেন তাদের জন্য আবেদন থেকে চাকরি শুরু পর্যন্ত সাধারণত ৩ থেকে ৬ সপ্তাহ লাগে। ভিসা স্পনসরশিপ প্রয়োজন বিদেশী প্রার্থীদের জন্য ৪ থেকে ৮ মাসের ভিসা সময়সীমা যোগ করুন।',
      ),
    },
    category: {
      en: 'Recruitment Process',
      ja: '採用プロセス',
      bn: 'নিয়োগ প্রক্রিয়া',
    },
    sortOrder: 3,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'faqs', 'fees-for-job-seekers', {
    question: {
      en: 'Does Saidatech charge fees to job seekers?',
      ja: 'サイダテックは求職者に費用を請求しますか？',
      bn: 'সাইদাটেক কি চাকরিপ্রার্থীদের কাছ থেকে ফি নেয়?',
    },
    answer: {
      en: para(
        'No. Saidatech does not charge placement fees to job seekers. Our recruitment service is completely free for candidates. We are compensated by the hiring company upon a successful placement. This model is legally required under Japanese employment law (職業安定法) for licensed recruitment agencies operating in Japan.',
      ),
      ja: para(
        'いいえ。サイダテックは求職者に紹介手数料を請求しておりません。求職者向けのサービスは完全無料です。弊社の報酬は採用成功時に採用企業からいただいています。このモデルは日本の職業安定法において許可を受けた職業紹介事業者に法的に義務付けられています。',
      ),
      bn: para(
        'না। সাইদাটেক চাকরিপ্রার্থীদের কাছ থেকে কোনো নিয়োগ ফি নেয় না। প্রার্থীদের জন্য আমাদের নিয়োগ সেবা সম্পূর্ণ বিনামূল্যে। সফল নিয়োগের পরে নিয়োগকারী কোম্পানি আমাদের পারিশ্রমিক প্রদান করে। এই মডেলটি জাপানি কর্মসংস্থান আইনের অধীনে আইনগতভাবে প্রয়োজনীয়।',
      ),
    },
    category: {
      en: 'Recruitment Process',
      ja: '採用プロセス',
      bn: 'নিয়োগ প্রক্রিয়া',
    },
    sortOrder: 4,
    active: true,
    aiVisible: true,
  })

  await upsertBySlug(payload, 'faqs', 'japanese-language-level-required', {
    question: {
      en: 'What Japanese language level is required for factory or office work?',
      ja: '工場勤務やオフィスワークに必要な日本語レベルはどのくらいですか？',
      bn: 'কারখানা বা অফিসের কাজের জন্য কী স্তরের জাপানি ভাষা প্রয়োজন?',
    },
    answer: {
      en: para(
        'Requirements vary by workplace. For structured factory and manufacturing environments, JLPT N4 (basic daily conversation) is generally sufficient. For office, IT, or client-facing roles, N3 or higher is typically required. Saidatech provides guidance on the minimum language level for each position and offers study material recommendations through our placement counsellors.',
      ),
      ja: para(
        '職場によって異なりますが、工場・製造業などの構造化された環境ではJLPT N4（日常会話の基礎）が一般的に十分とされています。オフィス・IT・接客系の職種にはN3以上が求められることが多いです。サイダテックのプレースメントカウンセラーが各求人における最低語学レベルのご案内を行っています。',
      ),
      bn: para(
        'প্রয়োজনীয়তা কর্মক্ষেত্র অনুযায়ী পরিবর্তিত হয়। কাঠামোগত কারখানা ও উৎপাদন পরিবেশের জন্য JLPT N4 সাধারণত যথেষ্ট। অফিস, আইটি বা ক্লায়েন্ট-সম্মুখীন ভূমিকার জন্য N3 বা উচ্চতর প্রয়োজন। সাইদাটেক প্রতিটি পদের জন্য ন্যূনতম ভাষার স্তর সম্পর্কে নির্দেশনা প্রদান করে।',
      ),
    },
    category: {
      en: 'Life in Japan',
      ja: '日本での生活',
      bn: 'জাপানে জীবন',
    },
    sortOrder: 5,
    active: true,
    aiVisible: true,
  })
}
