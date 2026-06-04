/**
 * Seed script for the six About section pages.
 *
 * ROUTING NOTE: route files required for sub-pages:
 *   apps/saidatech/src/app/(frontend)/[locale]/about/[slug]/page.tsx  ← created
 *   apps/saidatech/src/app/(frontend)/[locale]/gallery/page.tsx       ← created
 *
 * RICHTEXT NOTE: Payload 3.x Local API does not accept locale-wrapped richText
 * objects inside block fields when using locale: 'all'. richText fields are
 * stored without locale wrapping (stored in the default locale 'ja'). All plain
 * text fields retain their full { en, ja, bn } locale objects.
 *
 * MEDIA NOTE: Upload fields (image, portrait, gallery images) are omitted.
 * Add actual media IDs via the Payload admin after uploading photos.
 *
 * Run:
 *   pnpm --filter saidatech tsx src/seed/about-section.seed.ts
 */

import { getPayload } from 'payload'
import config from '../../payload.config'

// ---------------------------------------------------------------------------
// Lexical richText helpers — matches the exact format used in blog.ts seed
// ---------------------------------------------------------------------------

function richText(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text,
              version: 1,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richTextMulti(...paragraphs: string[]) {
  return {
    root: {
      type: 'root' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph' as const,
        children: [
          {
            type: 'text' as const,
            text,
            version: 1,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// richText block pass-through helpers (fields are now localized; rt/rtMulti
// return the same Japanese content for all locales as a seed baseline)
function rt(text: string) {
  return richText(text)
}

function rtMulti(...paragraphs: string[]) {
  return richTextMulti(...paragraphs)
}

// ---------------------------------------------------------------------------
// Shared CTA banner — same on all six pages
// ---------------------------------------------------------------------------

const ctaBanner = {
  blockType: 'cta-banner',
  heading: {
    en: 'Find Your Dream Job in Japan',
    ja: '日本で理想の仕事を見つけましょう',
    bn: 'জাপানে আপনার স্বপ্নের চাকরি খুঁজুন',
  },
  body: {
    en: 'Experience the power of innovation and discover how our solutions can revolutionize your journey. Schedule an individual demo now.',
    ja: '革新の力を実際に体験し、Betaのソリューションがどのようにあなたの融資プロセスを革命的に変えることができるかを発見してください。高度な機械学習アルゴリズムとクラウドベースのプラットフォームがどのように動作するかを見るために、個別のデモを今すぐスケジュールしましょう。',
    bn: 'উদ্ভাবনের শক্তি অনুভব করুন এবং আমাদের সমাধান কীভাবে আপনার যাত্রাকে পরিবর্তন করতে পারে তা আবিষ্কার করুন। এখনই একটি ব্যক্তিগত ডেমো নির্ধারণ করুন।',
  },
  primaryButton: {
    label: {
      en: 'Start Your Application',
      ja: '申し込みを始める',
      bn: 'আবেদন শুরু করুন',
    },
    href: '/contact',
  },
  backgroundStyle: 'brand',
  variant: 'gradient',
}

// ---------------------------------------------------------------------------
// Locale helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteBySlug(payload: any, slug: string): Promise<void> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    await payload.delete({ collection: 'pages', id: existing.docs[0].id })
    console.log(`  🗑️  Deleted /${slug}`)
  }
}

function isLocaleMap(val: unknown): val is { en: unknown; ja: unknown; bn: unknown } {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) return false
  const keys = Object.keys(val as object)
  return keys.length === 3 && 'en' in val && 'ja' in val && 'bn' in val
}

function forLocale(data: unknown, locale: 'en' | 'ja' | 'bn'): unknown {
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map((item) => forLocale(item, locale))
  if (isLocaleMap(data)) return forLocale((data as Record<string, unknown>)[locale], locale)
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as object)) {
    result[key] = forLocale(value, locale)
  }
  return result
}

function withIds(seed: unknown, created: unknown): unknown {
  if (!created || typeof created !== 'object') return seed
  if (Array.isArray(seed) && Array.isArray(created)) {
    return (seed as unknown[]).map((item, i) => withIds(item, (created as unknown[])[i]))
  }
  if (typeof seed === 'object' && seed !== null) {
    const c = created as Record<string, unknown>
    const result: Record<string, unknown> = {}
    if (c['id']) result['id'] = c['id']
    for (const [key, value] of Object.entries(seed as object)) {
      const cv = c[key]
      if (typeof value === 'object' && value !== null && typeof cv === 'object' && cv !== null) {
        result[key] = withIds(value, cv)
      } else {
        result[key] = value
      }
    }
    return result
  }
  return seed
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createPage(
  payload: unknown,
  slug: string,
  title: { en: string; ja: string; bn: string },
  layout: unknown[],
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = payload as any
  const doc = await p.create({
    collection: 'pages',
    locale: 'ja',
    data: { title: title.ja, slug, status: 'published', layout: forLocale(layout, 'ja') },
  })
  for (const locale of ['en', 'bn'] as const) {
    await p.update({
      collection: 'pages',
      id: doc.id,
      locale,
      data: {
        title: title[locale],
        layout: withIds(forLocale(layout, locale), doc.layout),
      },
    })
  }
  console.log(`  ✅ Seeded /${slug} — done`)
}

// ---------------------------------------------------------------------------
// 1. /about  (slug: about)
// ---------------------------------------------------------------------------

async function seedAboutPage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'about')
  await createPage(payload, 'about', { en: 'About', ja: '会社概要', bn: 'আমাদের সম্পর্কে' }, [
        // ── 1. Hero with profile card ────────────────────────────────────
        {
          blockType: 'page-hero',
          variant: 'hero',
          heading: {
            en: 'Our Story',
            ja: '私たちのストーリー',
            bn: 'আমাদের গল্প',
          },
          coloredSubtitle: {
            en: 'Passion and Innovation',
            ja: '情熱と革新',
            bn: 'আবেগ ও উদ্ভাবন',
          },
          body: {
            en: 'We are on a mission to transform people\'s technology experience. Since our founding in 2005, our journey has been shaped by creativity, dedication, and a relentless pursuit of excellence.',
            ja: '私たちは、人々のテクノロジー体験を変革することを使命としています。2005年に設立されて以来、私たちの歩みは創造性、 献身、そして卓越性を追求し続ける姿勢によって形づくられてきました。',
            bn: 'আমরা মানুষের প্রযুক্তি অভিজ্ঞতা রূপান্তর করার লক্ষ্যে কাজ করছি। ২০০৫ সালে প্রতিষ্ঠার পর থেকে, আমাদের যাত্রা সৃজনশীলতা, নিষ্ঠা এবং উৎকর্ষের অদম্য অনুসরণ দ্বারা গড়ে উঠেছে।',
          },
          // REPLACE: backgroundImage — upload hero background photo to Payload media and set ID here
          overlayOpacity: 50,
          overlayColor: 'black',
          primaryButton: {
            label: {
              en: 'Our Mission',
              ja: '私たちのミッション',
              bn: 'আমাদের লক্ষ্য',
            },
            href: '/about/organization-overview',
          },
          secondaryButton: {
            label: {
              en: 'Meet Our Team',
              ja: '私たちのチームをご紹介します',
              bn: 'আমাদের দলের সাথে পরিচিত হোন',
            },
            href: '/about/organization-overview',
          },
          profileCard: {
            badgeText: {
              en: 'Since 2005',
              ja: 'Since 2005',
              bn: '২০০৫ সাল থেকে',
            },
            cardHeading: {
              en: 'Corporate Profile',
              ja: 'Corporate Profile',
              bn: 'কর্পোরেট প্রোফাইল',
            },
            rows: [
              {
                label: { en: 'Corporate Name', ja: 'Corporate Name', bn: 'কর্পোরেট নাম' },
                value: { en: 'Sadiatec Co., Ltd.', ja: 'Sadiatec Co., Ltd.', bn: 'সাদিয়াটেক কো., লি.' },
              },
              {
                label: { en: 'Corporate Type', ja: 'Corporate Type', bn: 'কর্পোরেট ধরন' },
                value: { en: 'Private Company', ja: 'Private Company', bn: 'প্রাইভেট কোম্পানি' },
              },
              {
                label: { en: 'Established', ja: 'Established', bn: 'প্রতিষ্ঠিত' },
                value: { en: 'April 7th, 2005', ja: 'April 7th, 2005', bn: '৭ এপ্রিল, ২০০৫' },
              },
              {
                label: { en: 'Capital', ja: 'Capital', bn: 'মূলধন' },
                value: { en: '30,000,000 Yen', ja: '30,000,000 Yen', bn: '৩ কোটি ইয়েন' },
              },
              {
                label: { en: 'President & CEO', ja: 'President & CEO', bn: 'প্রেসিডেন্ট ও সিইও' },
                value: { en: 'Md Sanaul Haque', ja: 'Md Sanaul Haque', bn: 'মো. সানাউল হক' },
              },
            ],
          },
          textAlignment: 'left',
          minHeight: 'lg',
          showBreadcrumb: false,
        },

        // ── 2. Partners & Certifications marquee ─────────────────────────
        // REPLACE: items[].logo — upload partner logos to Payload media and set IDs here
        {
          blockType: 'affiliates',
          heading: {
            en: 'Partners & Certifications',
            ja: 'Partners & Certifications',
            bn: 'অংশীদার ও সার্টিফিকেশন',
          },
          layout: 'logos',
          columns: '4',
          animation: 'marquee',
          items: [
            { name: { en: 'KDDI Corporation', ja: 'KDDI株式会社', bn: 'কেডিডিআই কর্পোরেশন' } },
            { name: { en: 'SoftBank Corp.', ja: 'ソフトバンク株式会社', bn: 'সফটব্যাংক কর্পোরেশন' } },
            { name: { en: 'au (KDDI)', ja: 'au（KDDI）', bn: 'এইউ (কেডিডিআই)' } },
            { name: { en: 'NTT Communications', ja: 'NTTコミュニケーションズ', bn: 'এনটিটি কমিউনিকেশনস' } },
            { name: { en: 'NTT Comware', ja: 'NTT Comware株式会社', bn: 'এনটিটি কমওয়্যার' } },
            { name: { en: 'Cosmo Bridge', ja: 'コスモブリッジ', bn: 'কসমো ব্রিজ' } },
            { name: { en: 'Marubeni Telecom', ja: '丸紅テレコム株式会社', bn: 'মারুবেনি টেলিকম' } },
            { name: { en: 'J:COM (Jupiter Telecom)', ja: 'ジュピター・テレコム株式会社', bn: 'জেকম (জুপিটার টেলিকম)' } },
            { name: { en: 'Japan Fuji International', ja: 'Japan Fuji International株式会社', bn: 'জাপান ফুজি ইন্টারন্যাশনাল' } },
            { name: { en: 'MCI International Services', ja: 'MCIインターナショナルサービス社', bn: 'এমসিআই ইন্টারন্যাশনাল সার্ভিসেস' } },
            { name: { en: 'Telstra Corporation', ja: 'Telstra Corporation（オーストラリア）', bn: 'টেলস্ট্রা কর্পোরেশন' } },
            { name: { en: 'Tata Communications', ja: 'Tata Communications（インド）', bn: 'টাটা কমিউনিকেশনস' } },
            { name: { en: 'REVE Systems', ja: 'REVE Systems（バングラデシュ）', bn: 'রিভ সিস্টেমস' } },
            { name: { en: 'Skyvia Telcom Communications', ja: 'Skyvia Telcom Communications Co., Ltd.', bn: 'স্কাইভিয়া টেলকম কমিউনিকেশনস' } },
          ],
        },

        // ── 3. Company description + PDF downloads ────────────────────────
        // REPLACE: image — upload company/team photo to Payload media and set ID here
        // NOTE: Japanese PDF also at: https://sadiatec.com/wp-content/uploads/2022/03/20220215_JPSadiatec_Company_Profile-Feb-2022-v1.1-.pdf
        {
          blockType: 'image-text-split',
          imageAlt: {
            en: 'Sadiatec company profile',
            ja: 'サディアテック会社概要',
            bn: 'সাদিয়াটেক কোম্পানি প্রোফাইল',
          },
          imagePosition: 'right',
          heading: {
            en: 'International HR Solutions Provider',
            ja: '国際HRソリューションプロバイダー',
            bn: 'আন্তর্জাতিক এইচআর সমাধান প্রদানকারী',
          },
          // richText: stored without locale wrapper (default locale 'ja') — add en/bn via admin
          body: rt(
            'Sadiatecは、技術および通信分野におけるIT人材の採用とタレントマネジメントに強く焦点を当てた、国際的なHRソリューションプロバイダーです。通信製品、インターネットベースのマーケットプラットフォーム、輸出入、出版、アパレル製造、非営利団体の取り組みなど、多岐にわたるポートフォリオを展開していますが、当社の中核はHRの専門知識にあります。2005年の設立以来、世界中のクライアントに向けて、優秀な人材の発掘・育成・配属に尽力してきました。',
          ),
          primaryButton: {
            label: {
              en: 'Company Profile (English)',
              ja: '会社概要（英語）',
              bn: 'কোম্পানি প্রোফাইল (ইংরেজি)',
            },
            href: 'https://sadiatec.com/wp-content/uploads/2022/03/20220205_Sadiatec_Company_Profile-Feb-2022-v1.1.pdf',
          },
          backgroundStyle: 'white',
          imageSplit: '50/50',
          verticalAlign: 'center',
        },

        // ── 4. CEO Message ────────────────────────────────────────────────
        // REPLACE: portrait — upload CEO photo to Payload media and set ID here
        {
          blockType: 'ceo-message',
          portraitAlt: {
            en: 'Md Sanaul Haque — President & CEO, Sadiatec Co., Ltd.',
            ja: 'Md Sanaul Haque — Sadiatec Co., Ltd. 代表取締役社長',
            bn: 'মো. সানাউল হক — প্রেসিডেন্ট ও সিইও, সাদিয়াটেক কো., লি.',
          },
          name: {
            en: 'Md Sanaul Haque',
            ja: 'Md Sanaul Haque',
            bn: 'মো. সানাউল হক',
          },
          title: {
            en: 'President & CEO',
            ja: 'President & CEO',
            bn: 'প্রেসিডেন্ট ও সিইও',
          },
          // richText: stored without locale wrapper (default locale 'ja') — add en/bn via admin
          message: rtMulti(
            'ようこそ！Sadiatec Co. Ltd.では、長年にわたる成功と伝統は、健全な企業統治、倫理、誠実さ、敬意の原則に基づいて築かれてきました。私たちは相互利益のために働いています。取締役会は、会社の管理と従業員を監督し、事業と株主の長期的な最善の利益に沿って業務が行われていることを確認します。取締役会の役割、ガバナンスポリシー、指針、慣行は、『コーポレート・ガバナンス・ガイドライン』で定義されています。これらのガイドラインは、意思決定の効果を最大化するという取締役会の継続的な取り組みを反映しています。すべての従業員は、当社の倫理規範に強化された最高の倫理基準に従って業務を行うことが求められています。これらの原則は、世界中のすべての拠点、従業員、役員、取締役に適用されます。私たちは、通信分野においてスマートで最新のサービスを提供することを目指しています。この分野で既に大きな成功を収めています。ガバナンス、誠実性、責任、説明責任の最高水準を維持することは、今後の長期的な成長と成功にとって重要です。これらの価値観こそが、Sadiatec Co. Ltd.が築かれた基盤であり、今後も私たちを前進させる原動力です。引き続きのご関心とご支援に感謝いたします！',
          ),
          portraitPosition: 'left',
          backgroundStyle: 'white',
        },

        // ── 5. Placement Statistics ──────────────────────────────────────
        {
          blockType: 'placement-statistics',
          heading: {
            en: 'Success Story',
            ja: 'Success Story',
            bn: 'সাফল্যের গল্প',
          },
          subtitle: {
            en: 'Backed by Data',
            ja: 'Backed by Data',
            bn: 'তথ্য দ্বারা প্রমাণিত',
          },
          backgroundStyle: 'dark',
          industriesHeading: {
            en: 'Placements Across Industries',
            ja: 'Placements Across Industries',
            bn: 'শিল্প জুড়ে নিয়োগ',
          },
          industries: [
            { name: { en: 'Construction Industry', ja: 'Construction Industry', bn: 'নির্মাণ শিল্প' }, percentage: 53 },
            { name: { en: 'Food Manufacturing Industry', ja: 'Food Manufacturing Industry', bn: 'খাদ্য উৎপাদন শিল্প' }, percentage: 30 },
            { name: { en: 'Manufacturing Industry', ja: 'Manufacturing industry', bn: 'উৎপাদন শিল্প' }, percentage: 11 },
            { name: { en: 'Interior Decoration Industry', ja: 'Interior Decoration Industry', bn: 'অভ্যন্তরীণ সজ্জা শিল্প' }, percentage: 2 },
            { name: { en: 'Construction and Horticulture Industry', ja: 'Construction and Horticulture Industry', bn: 'নির্মাণ ও উদ্যানতত্ত্ব শিল্প' }, percentage: 1 },
            { name: { en: 'Industrial Furnace Construction Industry', ja: 'Industrial Furnace Construction Industry', bn: 'শিল্প চুল্লি নির্মাণ শিল্প' }, percentage: 1 },
            { name: { en: 'Automotive Industry', ja: 'Automotive Industry', bn: 'মোটরযান শিল্প' }, percentage: 1 },
            { name: { en: 'Logistics Industry', ja: 'Logistics Industry', bn: 'লজিস্টিক্স শিল্প' }, percentage: 1 },
            { name: { en: 'Agriculture Industry', ja: 'Agriculture Industry', bn: 'কৃষি শিল্প' }, percentage: 0 },
          ],
          regionsHeading: {
            en: 'Placements Across Regions',
            ja: 'Placements Across Regions',
            bn: 'অঞ্চল জুড়ে নিয়োগ',
          },
          // Values estimated from visual bar chart (scale 0–60)
          regions: [
            { name: { en: 'AICHI', ja: '愛知', bn: 'আইচি' }, value: 2 },
            { name: { en: 'TOCHIGI', ja: '栃木', bn: 'তোচিগি' }, value: 13 },
            { name: { en: 'IBARAKI', ja: '茨城', bn: 'ইবারাকি' }, value: 14 },
            { name: { en: 'FUKUOKA', ja: '福岡', bn: 'ফুকুওকা' }, value: 45 },
          ],
        },

        // ── 6. Mission + Impact cards ─────────────────────────────────────
        {
          blockType: 'stats-bar',
          backgroundStyle: 'light',
          layout: 'grid',
          items: [
            {
              label: {
                en: 'Our Mission Is Clear',
                ja: '私たちの使命は明確です',
                bn: 'আমাদের লক্ষ্য সুস্পষ্ট',
              },
              body: {
                en: 'To promote efficiency, accuracy and sustainability, redefining the lending experience for a brighter financial future.',
                ja: '効率性、正確性、持続可能性を推進し、より明るい金融の未来のために貸付体験を再定義することです。',
                bn: 'দক্ষতা, নির্ভুলতা ও টেকসই উন্নয়নকে এগিয়ে নিয়ে, একটি উজ্জ্বল আর্থিক ভবিষ্যতের জন্য অভিজ্ঞতাকে নতুনভাবে সংজ্ঞায়িত করা।',
              },
            },
            {
              label: {
                en: 'Our Impact Reaches the World',
                ja: '私たちの影響力は世界に広がっています',
                bn: 'আমাদের প্রভাব বিশ্বজুড়ে বিস্তৃত',
              },
              body: {
                en: 'From bustling metropolises to every corner of the world, our solutions transcend geographical barriers.',
                ja: '賑やかな大都市から世界の隅々まで、私たちのソリューションは地理的な障壁を超えています。',
                bn: 'ব্যস্ত মহানগর থেকে বিশ্বের প্রতিটি কোণ পর্যন্ত, আমাদের সমাধানগুলি ভৌগোলিক বাধা অতিক্রম করে।',
              },
            },
          ],
        },

        // ── 7. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// 2. /about/message-from-the-ceo  (slug: message-from-the-ceo)
// ---------------------------------------------------------------------------

async function seedCeoMessagePage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'message-from-the-ceo')
  await createPage(payload, 'message-from-the-ceo', { en: 'CEO Message', ja: 'CEOメッセージ', bn: 'সিইও বার্তা' }, [
        // ── 1. Plain page title ───────────────────────────────────────────
        {
          blockType: 'page-hero',
          variant: 'page-title',
          pageTitle: {
            en: 'Official Publication',
            ja: 'Official Publication',
            bn: 'সরকারি প্রকাশনা',
          },
          showBreadcrumb: false,
        },

        // ── 2. CEO Message ────────────────────────────────────────────────
        // REPLACE: portrait — upload CEO photo to Payload media and set ID here
        {
          blockType: 'ceo-message',
          portraitAlt: {
            en: 'Md Sanaul Haque — President & CEO, Sadiatec Co., Ltd.',
            ja: 'Md Sanaul Haque — Sadiatec Co., Ltd. 代表取締役社長',
            bn: 'মো. সানাউল হক — প্রেসিডেন্ট ও সিইও, সাদিয়াটেক কো., লি.',
          },
          name: {
            en: 'Md Sanaul Haque',
            ja: 'Md Sanaul Haque',
            bn: 'মো. সানাউল হক',
          },
          title: {
            en: 'President & CEO',
            ja: 'President & CEO',
            bn: 'প্রেসিডেন্ট ও সিইও',
          },
          // richText: stored without locale wrapper (default locale 'ja') — add en/bn via admin
          message: rtMulti(
            'ようこそ！サディアテック株式会社では、長年の遺産と成功は、優れた企業統治、健全な倫理観、強い誠実さ、そして敬意の原則に基づいて構築されてきました。私たちは相互利益のために働いています。',
            '当社の名誉ある取締役会は、サディアテックの経営陣と従業員を監督し、事業と株主の長期的な最善の利益を確保しています。取締役会のガバナンス方針と原則は、あらゆるレベルでの効果的な意思決定への取り組みを反映しています。',
            'サディアテックの従業員は、当社の倫理規定に概説されている最高の倫理基準を守っています。これらの価値観は、当社のビジネスに不可欠であり、世界中で私たちを導き、通信分野でのイノベーションへの取り組みを推進しています。',
            '誠実さ、説明責任、責任を維持することは、持続的な成功のために不可欠です。これらはサディアテック株式会社が築き上げ、今後も維持していく価値観です。',
          ),
          portraitPosition: 'left',
          backgroundStyle: 'white',
        },

        // ── 3. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// 3. /about/organization-overview  (slug: organization-overview)
// ---------------------------------------------------------------------------

async function seedOrganizationOverviewPage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'organization-overview')
  await createPage(payload, 'organization-overview', { en: 'Organization Overview', ja: '組織概要', bn: 'সংগঠন পরিচিতি' }, [
        // ── 1. Plain page title ───────────────────────────────────────────
        {
          blockType: 'page-hero',
          variant: 'page-title',
          pageTitle: {
            en: 'Organization Overview',
            ja: '組織概要',
            bn: 'সংগঠন পরিচিতি',
          },
          showBreadcrumb: false,
        },

        // ── 2. Image + Text — "Support for Careers in Japan" (image right) ─
        // REPLACE: image — upload Technology Innovation photo and set ID here
        {
          blockType: 'image-text-split',
          imageAlt: {
            en: 'Technology Innovation — Sadiatec team at work',
            ja: 'テクノロジーイノベーション — サディアテックチーム',
            bn: 'প্রযুক্তি উদ্ভাবন — সাদিয়াটেক দল কর্মরত',
          },
          imagePosition: 'right',
          heading: {
            en: 'Supporting Careers and Opportunities in Japan',
            ja: '日本でのキャリアと機会を支援',
            bn: 'জাপানে ক্যারিয়ার ও সুযোগে সহায়তা',
          },
          // richText: stored without locale wrapper (default locale 'ja')
          body: rt(
            'Sadiatec株式会社は、グローバル人材と日本の活気ある労働市場との橋渡しを目的とした、革新的な人材サービス企業です。2005年に設立され、日本での留学や就労の機会を支援することで高い評価を得ています。日本、バングラデシュ、マレーシアに拠点を持ち、国際的なネットワークを活かして企業と人材のニーズに応える包括的なソリューションを提供しています。',
          ),
          backgroundStyle: 'white',
          imageSplit: '50/50',
          verticalAlign: 'center',
        },

        // ── 3. Image + Text — "Our Mission" (image left) ─────────────────
        // REPLACE: image — upload Team Collaboration photo and set ID here
        {
          blockType: 'image-text-split',
          imageAlt: {
            en: 'Team Collaboration — Sadiatec staff',
            ja: 'チームコラボレーション — サディアテックスタッフ',
            bn: 'দলীয় সহযোগিতা — সাদিয়াটেক কর্মীবৃন্দ',
          },
          imagePosition: 'left',
          heading: {
            en: 'Our Mission',
            ja: '私たちの使命',
            bn: 'আমাদের লক্ষ্য',
          },
          // richText: stored without locale wrapper (default locale 'ja')
          body: rt(
            'Sadiatecの使命は、グローバル人材が日本の競争的な産業で成功できるように道を開くことです。バングラデシュやその他の国々の優秀な人材を日本企業と結びつけ、異文化の協働と相互成長を促進しています。人材紹介、コンサルティング、トレーニングを通じて、求職者のキャリア実現と日本の労働力の発展に貢献します。',
          ),
          backgroundStyle: 'light',
          imageSplit: '50/50',
          verticalAlign: 'center',
        },

        // ── 4. Values grid — 4 cards ──────────────────────────────────────
        {
          blockType: 'stats-bar',
          backgroundStyle: 'light',
          layout: 'grid',
          items: [
            {
              label: {
                en: 'HR Recruitment Services',
                ja: '人材紹介サービス',
                bn: 'মানব সম্পদ নিয়োগ সেবা',
              },
              body: {
                en: 'Recruitment services for general workers, technical interns, and Specified Skilled Workers.',
                ja: '一般労働者、技能実習生、特定技能労働者向けの採用サービス。',
                bn: 'সাধারণ কর্মী, কারিগরি ইন্টার্ন এবং বিশেষ দক্ষ কর্মীদের জন্য নিয়োগ সেবা।',
              },
            },
            {
              label: {
                en: 'Visa Application Support',
                ja: 'ビザ申請サポート',
                bn: 'ভিসা আবেদন সহায়তা',
              },
              body: {
                en: 'Comprehensive support for visa acquisition and document procedures.',
                ja: 'ビザ取得や書類手続きの全面的な支援。',
                bn: 'ভিসা প্রাপ্তি এবং নথি প্রক্রিয়াকরণে ব্যাপক সহায়তা।',
              },
            },
            {
              label: {
                en: 'Language Support',
                ja: '言語サポート',
                bn: 'ভাষা সহায়তা',
              },
              body: {
                en: 'Expanding employment opportunities through Japanese language training.',
                ja: '日本語研修を通じて就職機会を拡大。',
                bn: 'জাপানি ভাষা প্রশিক্ষণের মাধ্যমে কর্মসংস্থানের সুযোগ বিস্তার।',
              },
            },
            {
              label: {
                en: 'Corporate Partnerships',
                ja: '企業との連携',
                bn: 'কর্পোরেট অংশীদারিত্ব',
              },
              body: {
                en: 'Introducing talent matched to the needs of Japanese companies.',
                ja: '日本企業のニーズに合った人材の紹介。',
                bn: 'জাপানি কোম্পানিগুলির চাহিদা অনুযায়ী প্রতিভাবান কর্মী সরবরাহ।',
              },
            },
          ],
        },

        // ── 5. Why Choose + Vision (BusinessLineListBlock) ────────────────
        {
          blockType: 'business-line-list',
          displayMode: 'list',
          items: [
            {
              title: {
                en: 'Why Choose Sadiatec',
                ja: 'Sadiatecを選ぶ理由',
                bn: 'কেন সাদিয়াটেক বেছে নেবেন',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                'Sadiatecは日本で20年以上の経験を持ち、日本の文化やビジネス習慣に精通しています。NTTコミュニケーションズ、ソフトバンク、J:COM、大幸機械工業などの企業とのパートナーシップは、その信頼の証です。 高品質な人材プールへのアクセス。 多言語対応のスタッフによるスムーズなコミュニケーション。 短期から長期までの柔軟な人材ソリューション。 Sadiatecは、新しい挑戦を求める個人と、優れた人材を必要とする企業にとって信頼できるパートナーです。',
              ),
            },
            {
              title: {
                en: 'Our Vision for the Future',
                ja: '未来へのビジョン',
                bn: 'ভবিষ্যতের জন্য আমাদের দৃষ্টিভঙ্গি',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                '私たちはWebサイトの再設計と、日本での学習・就労の機会に焦点を当て、さらなる革新と成長を目指します。今後は、最先端技術を採用プロセスに導入し、世界中の人材と日本の産業との結びつきをさらに強化していきます。',
              ),
            },
          ],
        },

        // ── 6. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// 4. /about/business-contents  (slug: business-contents)
// ---------------------------------------------------------------------------

async function seedBusinessContentsPage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'business-contents')
  await createPage(payload, 'business-contents', { en: 'Our Business', ja: '私たちのビジネス', bn: 'আমাদের ব্যবসা' }, [
        // ── 1. Plain page title ───────────────────────────────────────────
        {
          blockType: 'page-hero',
          variant: 'page-title',
          pageTitle: {
            en: 'Our Business',
            ja: '私たちのビジネス',
            bn: 'আমাদের ব্যবসা',
          },
          showBreadcrumb: false,
        },

        // ── 2. Business lines ─────────────────────────────────────────────
        // REPLACE: items[].image — upload business line photos and set IDs here
        {
          blockType: 'business-line-list',
          displayMode: 'alternating',
          items: [
            {
              title: {
                en: 'HR Recruitment & Consulting',
                ja: '人材採用とコンサルティング',
                bn: 'মানব সম্পদ নিয়োগ ও পরামর্শ',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                'Sadiatec の事業の中心には、人材採用とコンサルティングの専門知識があります。IT、通信、成長産業などの分野で、優秀な人材と日本企業をつなぐことに特化しています。主なサービスは次の通りです： - 一般労働者、技能実習生、特定技能者の採用 - ビザ申請や書類のサポート - Sadiya Nihongo Training Center による日本語研修 効率的な採用プロセスにより、候補者は自分のスキルやキャリアに合った職に就き、企業は質の高い人材を確保できます。',
              ),
              imagePosition: 'auto',
            },
            {
              title: {
                en: 'Study and Work Opportunities in Japan',
                ja: '日本での留学と就労の機会',
                bn: 'জাপানে পড়াশোনা ও কাজের সুযোগ',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                'Sadiatec は、バングラデシュをはじめとする多国籍の方々に向けて、日本での留学と就労の道を提供しています。登録支援機関（SSW）と技能実習生送り出し機関の認可を持ち、以下のような包括的なサポートを提供しています： 1. 履歴書の収集と日本企業への送付 2. ダッカオフィスでのスキルテストと面接 3. 日本大使館へのビザ申請支援 4. 日本での職場環境に適応するための継続的なガイダンス また、候補者には競争力を高めるために日本語学習を推奨しています。',
              ),
              imagePosition: 'auto',
            },
            {
              title: {
                en: 'Export-Import Business',
                ja: '輸出入業務',
                bn: 'আমদানি-রপ্তানি ব্যবসা',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                '日本、バングラデシュ、マレーシアの市場に関する深い知識を活かし、Sadiatec は車両部品や産業機器などの輸出入を支援しています。信頼・品質・競争力ある価格を重視し、多言語による交渉や市場洞察を通じて、クライアントの貿易を円滑にサポートします。',
              ),
              imagePosition: 'auto',
            },
            {
              title: {
                en: 'Telecommunications Solutions',
                ja: '通信ソリューション',
                bn: 'টেলিযোগাযোগ সমাধান',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                'Sadiatec は、日本国内で信頼される通信製品のプロバイダーです。主な提供内容： - 国際電話カード：Subarashi や Smartcall などの VOIP ベースのカードは、日本国内外の利用者の通信ニーズに応えます。 - ポケットWiFi：自宅や旅行時にも対応した高速インターネットを提供。 - ソフトバンクSIM：ニーズに合わせた手頃な価格のモバイルプラン。 最新技術を活用し、信頼性の高い接続を提供しています。',
              ),
              imagePosition: 'auto',
            },
            {
              title: {
                en: 'NPO Doshdik Japan',
                ja: 'NPO Doshdik Japan',
                bn: 'এনপিও দোশদিক জাপান',
              },
              // richText: stored without locale wrapper (default locale 'ja')
              description: rt(
                '社会貢献の一環として、Sadiatec は NPO Doshdik Japan を運営しています。この非営利団体は、教育・栄養・衛生・文化の保護活動を通じて、恵まれない子供たちを支援しています。また、日本に住むバングラデシュの子供たちに母国語や文化を伝える教育活動も行っています。',
              ),
              imagePosition: 'auto',
            },
          ],
        },

        // ── 3. 3-column pillar cards (Experience, Innovation, Support) ────
        {
          blockType: 'stats-bar',
          backgroundStyle: 'brand',
          layout: 'grid',
          items: [
            {
              label: {
                en: 'Experience',
                ja: '経験',
                bn: 'অভিজ্ঞতা',
              },
              body: {
                en: 'Over 10 years of delivering advanced technical solutions',
                ja: '10年以上にわたる高度な技術ソリューションの提供実績',
                bn: '১০ বছরেরও বেশি সময় ধরে উন্নত প্রযুক্তি সমাধান প্রদানের অভিজ্ঞতা',
              },
            },
            {
              label: {
                en: 'Innovation',
                ja: '革新',
                bn: 'উদ্ভাবন',
              },
              body: {
                en: 'Cutting-edge solutions leveraging the latest technology and best practices',
                ja: '最新技術とベストプラクティスを活用した最先端のソリューション',
                bn: 'সর্বশেষ প্রযুক্তি এবং সেরা অনুশীলন ব্যবহার করে অত্যাধুনিক সমাধান',
              },
            },
            {
              label: {
                en: 'Support',
                ja: 'サポート',
                bn: 'সহায়তা',
              },
              body: {
                en: 'Dedicated support available 24 hours a day, 365 days a year for all services',
                ja: 'すべてのサービスに対して24時間365日対応の専任サポート',
                bn: 'সকল সেবার জন্য দিনে ২৪ ঘণ্টা, বছরে ৩৬৫ দিন নিবেদিত সহায়তা',
              },
            },
          ],
        },

        // ── 4. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// 5. /gallery  (slug: gallery)
// ---------------------------------------------------------------------------

async function seedGalleryPage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'gallery')
  await createPage(payload, 'gallery', { en: 'Gallery', ja: 'ギャラリー', bn: 'গ্যালারি' }, [
        // ── 1. Photo Gallery Grid ─────────────────────────────────────────
        // REPLACE: items — add actual media IDs after uploading the 6 gallery photos
        {
          blockType: 'gallery-grid',
          heading: {
            en: 'Gallery',
            ja: 'ギャラリー',
            bn: 'গ্যালারি',
          },
          columns: '3',
          enableLightbox: true,
          showFilter: false,
          items: [
            { caption: { en: 'Company event 1', ja: 'イベント写真 1', bn: 'কোম্পানি ইভেন্ট ১' } },
            { caption: { en: 'Company event 2', ja: 'イベント写真 2', bn: 'কোম্পানি ইভেন্ট ২' } },
            { caption: { en: 'Company event 3', ja: 'イベント写真 3', bn: 'কোম্পানি ইভেন্ট ৩' } },
            { caption: { en: 'Company event 4', ja: 'イベント写真 4', bn: 'কোম্পানি ইভেন্ট ৪' } },
            { caption: { en: 'Company event 5', ja: 'イベント写真 5', bn: 'কোম্পানি ইভেন্ট ৫' } },
            { caption: { en: 'Company event 6', ja: 'イベント写真 6', bn: 'কোম্পানি ইভেন্ট ৬' } },
          ],
          aspectRatio: 'auto',
        },

        // ── 2. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// 6. /about/history  (slug: history)
// ---------------------------------------------------------------------------

async function seedHistoryPage(payload: unknown): Promise<void> {
  await deleteBySlug(payload, 'history')
  await createPage(payload, 'history', { en: 'Our Journey', ja: '私たちの歩み', bn: 'আমাদের যাত্রা' }, [
        // ── 1. Plain page title ───────────────────────────────────────────
        {
          blockType: 'page-hero',
          variant: 'page-title',
          pageTitle: {
            en: 'Our Journey',
            ja: '私たちの歩み',
            bn: 'আমাদের যাত্রা',
          },
          showBreadcrumb: false,
        },

        // ── 2. History timeline — 16 entries (2005–2020) ──────────────────
        // richText description fields: stored without locale wrapper (default locale 'ja')
        {
          blockType: 'history',
          layout: 'alternating',
          accentColor: 'brand',
          entries: [
            {
              year: '2005',
              title: {
                en: 'Company Founded',
                ja: '会社設立',
                bn: 'কোম্পানি প্রতিষ্ঠা',
              },
              description: rt('- Sadia Intertec Company Limitedが設立されました'),
              badge: { en: 'Founded', ja: '設立', bn: 'প্রতিষ্ঠিত' },
            },
            {
              year: '2006',
              title: {
                en: 'Licensing & First Partnerships',
                ja: 'ライセンス取得と最初のパートナーシップ',
                bn: 'লাইসেন্স প্রাপ্তি ও প্রথম অংশীদারিত্ব',
              },
              description: rt('- 会社の資本金が1000万日本円に増資されました\n- 電気通信事業者としての正式なライセンスを取得\n- 会社名をSadiatec Co., Ltd.に変更\n- KDDI株式会社との提携契約\n- Cosmo Bridgeとの契約'),
            },
            {
              year: '2007',
              title: {
                en: 'Brand Registration',
                ja: 'ブランド登録',
                bn: 'ব্র্যান্ড নিবন্ধন',
              },
              description: rt('- ブランドロゴ商標登録証を取得\n- MCIインターナショナルサービス社との業務提携契約'),
            },
            {
              year: '2008',
              title: {
                en: 'International Expansion',
                ja: '海外展開',
                bn: 'আন্তর্জাতিক সম্প্রসারণ',
              },
              description: rt('- 骨董品販売業ライセンスを取得\n- NTT Comware株式会社との契約\n- ISPおよびIPTSPライセンスを取得\n- テレコムマレーシア（TM）とのビジネス開始\n- バングラデシュで不動産ビジネスを開始'),
            },
            {
              year: '2009',
              title: {
                en: 'Major Telecom Partnerships',
                ja: '主要通信パートナーシップ',
                bn: 'প্রধান টেলিকম অংশীদারিত্ব',
              },
              description: rt('- ソフトバンク株式会社との国際電話サービス共同事業を開始\n- 丸紅テレコム株式会社との契約\n- NTTコミュニケーションズとの国際電話事業\n- Fuzion Communications（アイルランド）との契約'),
            },
            {
              year: '2010',
              title: {
                en: 'Capital Increase',
                ja: '資本金増資',
                bn: 'মূলধন বৃদ্ধি',
              },
              description: rt('- 資本金を3000万日本円に増資しました'),
            },
            {
              year: '2011',
              title: {
                en: 'NPO Founded & Global Contracts',
                ja: 'NPO設立と海外契約',
                bn: 'এনপিও প্রতিষ্ঠা ও বৈশ্বিক চুক্তি',
              },
              description: rt('- NPO法人Doshdik Japanを設立\n- Telstra Corporation（オーストラリア）とのインターネットサービス契約\n- Tata Communications（インド）とのインターネットサービス提携契約'),
            },
            {
              year: '2012',
              title: {
                en: 'Recruitment Licence',
                ja: '採用ライセンス取得',
                bn: 'নিয়োগ লাইসেন্স অর্জন',
              },
              description: rt('- REVE Systems（バングラデシュ）との契約\n- バングラデシュでの採用ライセンスを取得\n- 採用および日本語教育プログラム（Language Training Center）を開始'),
            },
            {
              year: '2013',
              title: {
                en: 'New Partnership',
                ja: '新パートナーシップ',
                bn: 'নতুন অংশীদারিত্ব',
              },
              description: rt('- Skyvia Telcom Communications Co., Ltd.との業務提携契約を締結'),
            },
            {
              year: '2014',
              title: {
                en: 'New Markets & E-Commerce',
                ja: '新市場とEコマース',
                bn: 'নতুন বাজার ও ই-কমার্স',
              },
              description: rt('- Mainberg Ltd.（香港）との国際電話サービス業務提携契約を締結\n- ECサイト「BIG SALE」の運営を開始'),
            },
            {
              year: '2015',
              title: {
                en: 'Dispatch & Placement Licences',
                ja: '派遣・紹介ライセンス取得',
                bn: 'প্রেরণ ও নিয়োগ লাইসেন্স',
              },
              description: rt('- 中古車販売代理業を開始\n- 派遣・紹介ライセンスを取得\n- 一般労働者派遣事業許可\n- 有料職業紹介事業許可'),
            },
            {
              year: '2016',
              title: {
                en: 'Global Business Expansion',
                ja: 'グローバルビジネス拡大',
                bn: 'বৈশ্বিক ব্যবসা সম্প্রসারণ',
              },
              description: rt('- Songbird Trading Limited（香港）との契約\n- バングラデシュ政府から大型機械の輸出入ライセンスを取得\n- バングラデシュにSadiatecファッション工場を設立\n- バングラデシュに自動車の輸出入ショールームを開設'),
            },
            {
              year: '2017',
              title: {
                en: 'New Industrial Contracts',
                ja: '新産業契約',
                bn: 'নতুন শিল্প চুক্তি',
              },
              description: rt('- 太鼓機械工業株式会社（日本）との契約\n- MCIインターナショナルサービス社との再契約\n- Roots Communication（バングラデシュ）との国際電話業務提携契約を締結'),
            },
            {
              year: '2018',
              title: {
                en: 'Major Telecom Contracts',
                ja: '主要通信契約',
                bn: 'প্রধান টেলিকম চুক্তি',
              },
              description: rt('- ジュピター・テレコム株式会社（J:COM）との契約\n- Japan Fuji International株式会社との契約'),
            },
            {
              year: '2019',
              title: {
                en: 'SSW Certification',
                ja: '特定技能認定',
                bn: 'এসএসডব্লিউ সার্টিফিকেশন',
              },
              description: rt('- 技能実習生および特定技能（SSW）ライセンスを取得\n- 技能実習生送出機関ライセンス\n- 特定技能（SSW）登録支援機関ライセンス'),
              badge: {
                en: 'SSW Licence',
                ja: 'SSWライセンス',
                bn: 'এসএসডব্লিউ লাইসেন্স',
              },
            },
            {
              year: '2020',
              title: {
                en: 'Training Centre Rebrand',
                ja: 'トレーニングセンター改名',
                bn: 'প্রশিক্ষণ কেন্দ্রের পুনর্নামকরণ',
              },
              description: rt('- Language Training Centerの名称をSadia Nihongo Training Centerに変更\n- FacebookとYouTubeでDoshdikTvを開始'),
            },
          ],
        },

        // ── 3. CTA Banner ─────────────────────────────────────────────────
        ctaBanner,
  ])
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

async function seedAboutSection(): Promise<void> {
  const payload = await getPayload({ config })
  console.log('\n🌱 Seeding About section pages...\n')

  await seedAboutPage(payload)
  await seedCeoMessagePage(payload)
  await seedOrganizationOverviewPage(payload)
  await seedBusinessContentsPage(payload)
  await seedGalleryPage(payload)
  await seedHistoryPage(payload)

  console.log('\n✅ About section seed complete.\n')
  process.exit(0)
}

seedAboutSection().catch((err: unknown) => {
  console.error('About section seed failed:', err)
  process.exit(1)
})
