# Content Management Handbook / コンテンツ管理ハンドブック / কন্টেন্ট ম্যানেজমেন্ট হ্যান্ডবুক

---

# English Guide

## Role Overview

| Role | Can do | Cannot do |
|------|--------|-----------|
| **Admin** | Everything | — |
| **Editor** | Create, read, update any content | Delete records, manage users |

All saves are immediately reflected on the website (cache invalidated automatically). There is no publish queue or deployment step.

---

## Logging In

Navigate to `/admin` in your browser. Use the email and password provided by your administrator. To reset your password, use the "Forgot password" link on the login page. Admins can also reset passwords from the Users collection.

---

## Collections Reference

### Pages

Arbitrary website pages built from drag-and-drop blocks.

| Field | Notes |
|-------|-------|
| Title | Localised. Appears in `<title>` and breadcrumbs. |
| Slug | URL-safe identifier (e.g. `about`, `services`). Auto-generated from title; edit with care — changing a live slug breaks incoming links. |
| Layout | Block builder. Available blocks depend on enabled features. |
| SEO | Override the default meta title, description, and OG image per page. |
| Include in AI Corpus | Sidebar checkbox. Uncheck for draft or legally-sensitive pages. |

**Workflow:** Create → fill Title + Slug → build Layout → save. The page is live immediately at `/<slug>` (default locale) or `/<locale>/<slug>`.

---

### Services

Core offering pages. Used by the Services Grid block on the homepage.

| Field | Notes |
|-------|-------|
| Title | Localised. |
| Slug | Used in the Services Grid block's "Learn more" links. |
| Excerpt | Short description; shown in service cards. Localised. |
| Body | Rich text editor. Full content for the service detail page. |
| Icon | Optional icon name (passed to the icon component). |
| Sort Order | Lower number = displayed first. |
| Active | Uncheck to hide from the frontend without deleting. |

---

### Blog Posts

Long-form articles. Feature-gated (`features.blog`).

| Field | Notes |
|-------|-------|
| Title | Localised. |
| Slug | Used in `/blog/<slug>` URL. |
| Excerpt | Used in blog listing cards and meta description. Localised. |
| Featured Image | Upload from Media. Shown at top of post and in OG preview. |
| Body | Rich text. |
| Category | Optional taxonomy. |
| Published Date | Defaults to save date. |
| Active | Controls visibility. |
| Include in AI Corpus | Default true. Uncheck for drafts. |

---

### Case Studies

Client success stories. Feature-gated (`features.caseStudies`).

Same fields as Blog Posts plus:

| Field | Notes |
|-------|-------|
| Client Name | The company or individual featured in the case study. Localised. |
| Industry | Tag for filtering. |
| Results | Short summary of outcomes. Localised. |

---

### News

Press releases and announcements. Always enabled.

Same structure as Blog Posts. Shorter form content is appropriate here.

---

### FAQs

Frequently asked questions. Always enabled. Primary AI corpus source.

| Field | Notes |
|-------|-------|
| Question | Localised. |
| Answer | Rich text. Localised. |
| Category | Optional grouping. |
| Sort Order | Controls display order in the FAQ block. |
| Active | Hide without deleting. |
| Include in AI Corpus | Default true. |

---

### Team

Staff profiles. Feature-gated (`features.team`).

| Field | Notes |
|-------|-------|
| Name | Not localised (proper names). |
| Role / Job Title | Localised. |
| Bio | Short paragraph. Localised. |
| Photo | Upload from Media. |
| Sort Order | Controls display in the Team Grid block. |
| Active | Hide from frontend. |

---

### Seminars & Webinars

Upcoming events with registration. Feature-gated (`features.seminars`).

| Field | Notes |
|-------|-------|
| Title | Localised. |
| Slug | Used in `/seminars/<slug>` URL. |
| Date / End Date | ISO date. Shown on the detail page. |
| Venue | Physical location or leave blank for online. |
| Online Meeting URL | If provided, the event is displayed as online. |
| Registration Status | `open` / `closed` / `full` / `cancelled`. |
| Registration URL | External link for sign-up. |
| Speaker | Name, job title, organization of the presenter. |
| Capacity | Optional seat count. |
| Excerpt | Short description. Localised. |
| Description | Rich text detail. Localised. |
| Thumbnail | Upload from Media. |
| Active | Hide without deleting. |

---

### Jobs / Recruitment

Job listing posts. Feature-gated (`features.jobListings`).

| Field | Notes |
|-------|-------|
| Title | Position title. Localised. |
| Slug | Used in `/jobs/<slug>` URL. |
| Description | Rich text job description. Localised. |
| Employment Type | Full-time / Part-time / Contract. |
| Location | Office, remote, hybrid. Localised. |
| Salary Range | Optional. Localised. |
| Active | Controls visibility. |
| Include in AI Corpus | Default false for jobs (set explicitly if wanted). |

---

### Downloads

Downloadable resources (PDFs, guides). Feature-gated (`features.downloads`).

| Field | Notes |
|-------|-------|
| Title | Localised. |
| Description | Brief explanation. Localised. |
| File | Upload the downloadable file. |
| Thumbnail | Preview image. |
| Active | Hide without deleting. |
| Include in AI Corpus | Default true. |

---

### Gallery

Photo collections. Feature-gated (`features.gallery`).

| Field | Notes |
|-------|-------|
| Title | Album name. Localised. |
| Images | Multi-upload from Media. |
| Date | When the gallery was shot or published. |
| Active | Hide from frontend. |

---

### Form Submissions

Read-only log of all contact, job application, seminar registration, and download requests.

| Field | Meaning |
|-------|---------|
| Form Type | `contact` / `job-apply` / `seminar` / `download` |
| Email | Submitter's email address |
| Locale | The language the form was submitted in |
| Status | `new` → `replied` → `archived` |
| Submitted At | Timestamp |
| Payload | Full JSON of all submitted fields |

**Workflow:** Review new submissions → change Status to `replied` once actioned → `archived` when done. Deleting submissions requires Admin role.

> Staff notification and user confirmation emails are sent automatically on submission via the Payload after-change hook. No manual action needed.

---

### Inquiries

Legacy contact inquiry collection (preserved for backward compatibility). New submissions use Form Submissions above.

---

## Globals

Globals are site-wide settings edited once. Find them in the sidebar under **Globals**.

| Global | Purpose |
|--------|---------|
| **Header** | Navigation links, logo variant, CTA button label/href |
| **Footer** | Footer nav columns, social links, copyright text |
| **Company Info** | Official company name, address, phone, business hours, map embed URL |
| **SEO Defaults** | Default meta title template, default description per locale, default OG image |

Changes to globals invalidate the Next.js data cache within seconds.

---

## Media Library

All images, PDFs, and files are managed in the **Media** collection.

**Upload guidelines:**

- Images: JPEG or WebP, max 5 MB. Always fill in the **Alt text** field — this is required for accessibility and SEO.
- Logos: SVG preferred. If SVG is not available, PNG at 2× the display size.
- PDFs: For downloads collection. Ensure the filename is meaningful (it becomes the download filename).

**Using uploaded media:** In any Image or Upload field, click **Choose existing** to browse the media library, or **Upload** to add a new file on the spot.

---

## Multilingual Content Entry

Every localisable field shows a language tab row (EN / JA / BN or whichever locales are configured). Click the tab to enter content for that language.

- The **default locale** (typically Japanese / JA) is **required**. The site falls back to it when a translation is absent.
- English and Bengali are optional — if left blank, the page shows the Japanese fallback.
- You do not need to save between switching language tabs; all tabs are saved together.

---

## Live Preview

When editing a Page, Blog Post, or Case Study, click **Preview** (top-right of the editor) to open the live preview in a split panel. The preview renders the actual frontend page. It updates when you save.

Select a breakpoint (Mobile / Tablet / Desktop) from the preview toolbar to check responsive layouts.

---

## AI Corpus Settings

The **Include in AI Corpus** checkbox (sidebar of every content record, default: checked) controls whether this record's content is included when an AI agent queries `/api/ai/corpus`.

- **Checked:** The AI agent can reference this content in responses.
- **Unchecked:** The record is excluded from AI corpus output. Use this for draft content, legally-sensitive text, or confidential documents.

The `/api/ai/corpus` endpoint always requires a `Authorization: Bearer <AI_CORPUS_SECRET>` header and is not publicly accessible.

---

## Important Rules for Editors

1. **You cannot delete records.** If you accidentally create a duplicate or unwanted record, uncheck **Active** to hide it and notify an administrator.
2. **Changing a slug on a live page breaks its URL.** Avoid editing slugs of published pages unless you have set up a redirect.
3. **The cache invalidates automatically on save.** You do not need to do anything after saving. Changes appear within a few seconds.
4. **Alt text is mandatory for all images.** The accessibility audit will flag missing alt text in CI.

---
---

# 日本語ガイド

## 役割と権限

| 役割 | できること | できないこと |
|------|-----------|------------|
| **管理者** | すべての操作 | — |
| **編集者** | コンテンツの作成・閲覧・更新 | 削除・ユーザー管理 |

保存後、ウェブサイトのキャッシュは自動的に更新されます。追加の公開操作は不要です。

---

## ログイン

ブラウザで `/admin` にアクセスし、管理者から提供されたメールアドレスとパスワードでログインします。パスワードを忘れた場合は「パスワードを忘れた方はこちら」リンクを使用してください。

---

## コレクション別ガイド

### ページ

ブロックを組み合わせて自由にレイアウトを構築できるページです。

| フィールド | 説明 |
|-----------|------|
| タイトル | 多言語入力可。`<title>` タグやパンくずリストに表示。 |
| スラッグ | URLの識別子（例: `about`, `services`）。公開中のページのスラッグ変更はリンク切れの原因になるため注意。 |
| レイアウト | ブロックビルダー。有効な機能に応じてブロックが表示。 |
| SEO | ページ個別のメタタイトル・説明・OG画像を設定可。 |
| AIコーパスに含める | 右サイドバーのチェックボックス。下書きや法的審査中のページはオフ推奨。 |

---

### サービス

ホームページのサービスグリッドに表示されるコアサービスページです。

| フィールド | 説明 |
|-----------|------|
| タイトル | 多言語入力可。 |
| スラッグ | 「詳細を見る」リンクのURLに使用。 |
| 概要 | サービスカードに表示される短い説明。多言語入力可。 |
| 本文 | リッチテキスト。サービス詳細ページの本文。 |
| 表示順 | 数値が小さいほど上位に表示。 |
| 公開中 | チェックを外すと非表示（削除なし）。 |

---

### ブログ記事・ニュース・導入事例

各コレクションの基本構造は同じです。

| フィールド | 説明 |
|-----------|------|
| タイトル | 多言語入力可。 |
| スラッグ | URLに使用（例: `/blog/<スラッグ>`）。 |
| 概要 | 一覧カードとmeta descriptionに使用。多言語入力可。 |
| アイキャッチ画像 | メディアライブラリからアップロード。 |
| 本文 | リッチテキスト。多言語入力可。 |
| 公開日 | デフォルトは保存日時。 |
| 公開中 | チェックを外すと非表示。 |

---

### よくある質問（FAQ）

AIコーパスの主要なデータソースです。

| フィールド | 説明 |
|-----------|------|
| 質問 | 多言語入力可。 |
| 回答 | リッチテキスト。多言語入力可。 |
| 表示順 | FAQブロック内の並び順を制御。 |
| 公開中 | チェックを外すと非表示。 |

---

### セミナー・ウェビナー

| フィールド | 説明 |
|-----------|------|
| タイトル | 多言語入力可。 |
| 開催日・終了日 | ISO形式の日付。 |
| 会場 | 実会場の場合は住所を入力。オンラインの場合は空白。 |
| オンライン開催URL | 入力するとオンラインイベントとして表示。 |
| 登録状況 | `open`（受付中）/ `closed`（終了）/ `full`（満員）/ `cancelled`（中止）。 |
| 登録URL | 申し込み先の外部リンク。 |
| 公開中 | チェックを外すと非表示。 |

---

### フォーム送信

お問い合わせ・求人応募・セミナー登録・ダウンロード申請の全記録が自動保存されます。

**ワークフロー:** 新着を確認 → 対応後に「返信済み」へ変更 → 完了後に「アーカイブ」。

スタッフへの通知メールと申込者への確認メールは保存時に自動送信されます。

---

## グローバル設定

サイドバーの**グローバル**からアクセスします。

| グローバル | 用途 |
|-----------|------|
| **ヘッダー** | ナビゲーションリンク・CTAボタン |
| **フッター** | フッターナビ・SNSリンク・コピーライト |
| **会社情報** | 社名・住所・電話番号・営業時間・地図埋め込みURL |
| **SEOデフォルト** | デフォルトのメタタイトルテンプレートと説明文 |

---

## 多言語コンテンツの入力

各フィールドには言語タブ（EN / JA / BN）があります。

- **日本語（JA）は必須**です。他言語が未入力の場合は日本語にフォールバックします。
- 英語・ベンガル語はオプションです。
- タブを切り替えて入力し、まとめて「保存」してください。

---

## 編集者向け注意事項

1. **削除はできません（編集者権限）。** 誤って作成した場合は「公開中」のチェックを外して管理者に連絡してください。
2. **公開中ページのスラッグを変更するとリンク切れになります。** 変更が必要な場合は管理者に相談してください。
3. **保存後、数秒以内にウェブサイトに反映されます。** 追加操作は不要です。
4. **画像のaltテキストは必ず入力してください。** アクセシビリティとSEOに影響します。

---
---

# বাংলা গাইড

## ভূমিকা ও অনুমতি

| ভূমিকা | করতে পারবেন | করতে পারবেন না |
|--------|------------|----------------|
| **অ্যাডমিন** | সব কিছু | — |
| **সম্পাদক** | কন্টেন্ট তৈরি, দেখা, আপডেট করা | মুছে ফেলা, ব্যবহারকারী পরিচালনা |

সংরক্ষণের পর ওয়েবসাইটের ক্যাশ স্বয়ংক্রিয়ভাবে আপডেট হয়।

---

## লগইন

ব্রাউজারে `/admin` খুলুন। অ্যাডমিনের দেওয়া ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।

---

## বিভাগ অনুযায়ী গাইড

### পেজ

ব্লক ব্যবহার করে কাস্টম পেজ তৈরি করুন।

| ফিল্ড | বিবরণ |
|-------|-------|
| শিরোনাম | বহুভাষিক ইনপুট সম্ভব। `<title>` ট্যাগে প্রদর্শিত হবে। |
| স্লাগ | URL-এর পরিচিতি (যেমন `about`, `services`)। প্রকাশিত পেজের স্লাগ পরিবর্তনে লিঙ্ক ভেঙে যাবে। |
| লেআউট | ব্লক বিল্ডার। |
| SEO | পেজ-নির্দিষ্ট মেটা টাইটেল ও বিবরণ। |
| AI কর্পাসে অন্তর্ভুক্ত | ডান সাইডবারে চেকবক্স। ড্রাফট কন্টেন্টের জন্য বন্ধ রাখুন। |

---

### সেবাসমূহ

হোমপেজের সার্ভিস গ্রিডে প্রদর্শিত মূল সেবাগুলো।

| ফিল্ড | বিবরণ |
|-------|-------|
| শিরোনাম | বহুভাষিক। |
| সংক্ষিপ্ত বিবরণ | সার্ভিস কার্ডে প্রদর্শিত। বহুভাষিক। |
| বিষয়বস্তু | রিচ টেক্সট। সেবার বিস্তারিত বিবরণ। |
| বাছাই ক্রম | ছোট সংখ্যা = আগে প্রদর্শিত। |
| সক্রিয় | আনচেক করলে ফ্রন্টএন্ড থেকে লুকানো হবে। |

---

### ব্লগ পোস্ট / সংবাদ / কেস স্টাডি

মূল ফিল্ডগুলো একই রকম।

| ফিল্ড | বিবরণ |
|-------|-------|
| শিরোনাম | বহুভাষিক। |
| স্লাগ | URL-এ ব্যবহৃত (যেমন `/blog/<slug>`)। |
| সংক্ষিপ্ত বিবরণ | তালিকা কার্ড ও meta description-এ ব্যবহৃত। বহুভাষিক। |
| বৈশিষ্ট্য চিত্র | মিডিয়া লাইব্রেরি থেকে আপলোড। |
| মূল বিষয় | রিচ টেক্সট। বহুভাষিক। |
| সক্রিয় | আনচেক করলে অদৃশ্য হবে। |

---

### প্রশ্নোত্তর (FAQ)

AI কর্পাসের প্রধান ডেটা উৎস।

| ফিল্ড | বিবরণ |
|-------|-------|
| প্রশ্ন | বহুভাষিক। |
| উত্তর | রিচ টেক্সট। বহুভাষিক। |
| বাছাই ক্রম | FAQ ব্লকে প্রদর্শনের ক্রম নিয়ন্ত্রণ করে। |
| সক্রিয় | আনচেক করলে অদৃশ্য। |

---

### সেমিনার ও ওয়েবিনার

| ফিল্ড | বিবরণ |
|-------|-------|
| শিরোনাম | বহুভাষিক। |
| তারিখ | ISO ফরম্যাটে। |
| স্থান | অনলাইন হলে খালি রাখুন। |
| অনলাইন মিটিং URL | দিলে অনলাইন ইভেন্ট হিসেবে প্রদর্শিত হবে। |
| নিবন্ধন অবস্থা | `open` / `closed` / `full` / `cancelled`। |
| সক্রিয় | আনচেক করলে ফ্রন্টএন্ড থেকে লুকানো হবে। |

---

### ফর্ম জমা

সব ধরনের ফর্ম জমার স্বয়ংক্রিয় রেকর্ড।

**ওয়ার্কফ্লো:** নতুন জমা দেখুন → পদক্ষেপ নেওয়ার পর "উত্তর দেওয়া হয়েছে" করুন → সম্পন্ন হলে "সংরক্ষণাগারে" রাখুন।

কর্মীকে বিজ্ঞপ্তি ইমেইল এবং ব্যবহারকারীকে নিশ্চিতকরণ ইমেইল স্বয়ংক্রিয়ভাবে পাঠানো হয়।

---

## গ্লোবাল সেটিংস

সাইডবারের **গ্লোবাল** থেকে অ্যাক্সেস করুন।

| গ্লোবাল | উদ্দেশ্য |
|--------|----------|
| **হেডার** | নেভিগেশন লিঙ্ক ও CTA বোতাম |
| **ফুটার** | ফুটার নেভিগেশন ও সোশ্যাল লিঙ্ক |
| **কোম্পানি তথ্য** | ঠিকানা, ফোন, কার্যঘণ্টা |
| **SEO ডিফল্ট** | ডিফল্ট মেটা টাইটেল ও বিবরণ |

---

## বহুভাষিক কন্টেন্ট ইনপুট

প্রতিটি ফিল্ডে ভাষা ট্যাব (EN / JA / BN) রয়েছে।

- **জাপানি (JA) অবশ্যই পূরণ করুন।** অন্য ভাষা না দিলে জাপানি ব্যবহার হবে।
- ইংরেজি ও বাংলা ঐচ্ছিক।
- ট্যাব পরিবর্তন করে আলাদাভাবে ইনপুট করুন, তারপর একসাথে "সংরক্ষণ করুন" ক্লিক করুন।

---

## AI কর্পাস সেটিং

প্রতিটি কন্টেন্ট রেকর্ডের ডান সাইডবারে "AI কর্পাসে অন্তর্ভুক্ত করুন" চেকবক্স রয়েছে।

- ✅ চেক করা: AI এজেন্ট এই কন্টেন্ট দেখতে পাবে।
- ☐ আনচেক: AI-এর কাছে দেখানো হবে না। ড্রাফট বা আইনি পর্যালোচনাধীন কন্টেন্টের জন্য বন্ধ রাখুন।

---

## গুরুত্বপূর্ণ নোট

1. **সম্পাদক মুছে ফেলতে পারবেন না।** ভুলে তৈরি কন্টেন্টের জন্য "সক্রিয়" আনচেক করুন এবং অ্যাডমিনকে জানান।
2. **প্রকাশিত পেজের স্লাগ পরিবর্তন করলে লিঙ্ক ভেঙে যাবে।** প্রয়োজনে অ্যাডমিনের সাথে যোগাযোগ করুন।
3. **সংরক্ষণের কয়েক সেকেন্ডের মধ্যে সাইটে পরিবর্তন দেখা যাবে।** কোনো অতিরিক্ত পদক্ষেপ নেই।
4. **সব ছবির alt টেক্সট অবশ্যই পূরণ করুন।** অ্যাক্সেসিবিলিটি ও SEO-র জন্য আবশ্যক।
