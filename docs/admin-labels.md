# Admin Field Label Reference

Trilingual label mappings for the top 20 admin fields across EN / JA / BN.
Used in Payload CMS collection and field definitions.

| Field key | English | 日本語 | বাংলা |
|---|---|---|---|
| `title` | Title | タイトル | শিরোনাম |
| `slug` | Slug | スラッグ | স্লাগ |
| `excerpt` | Excerpt | 概要 | সংক্ষিপ্ত বিবরণ |
| `content` | Content | コンテンツ | বিষয়বস্তু |
| `body` | Body | 本文 | মূল বিষয় |
| `description` | Description | 説明 | বিবরণ |
| `active` | Active | 公開中 | সক্রিয় |
| `publishedAt` | Published Date | 公開日 | প্রকাশের তারিখ |
| `featuredImage` | Featured Image | アイキャッチ画像 | বৈশিষ্ট্য চিত্র |
| `category` | Category | カテゴリー | বিভাগ |
| `status` | Status | ステータス | অবস্থা |
| `name` | Name | 名前 | নাম |
| `email` | Email | メール | ইমেইল |
| `message` | Message | メッセージ | বার্তা |
| `question` | Question | 質問 | প্রশ্ন |
| `answer` | Answer | 回答 | উত্তর |
| `date` | Date | 日付 | তারিখ |
| `sortOrder` | Sort Order | 表示順 | বাছাই ক্রম |
| `role` | Role | 役割 | ভূমিকা |
| `aiVisible` | Include in AI Corpus | AIコーパスに含める | AI কর্পাসে অন্তর্ভুক্ত করুন |

## Where labels are applied

Labels follow Payload CMS `LocalizedLabel` format:

```ts
label: {
  en: 'Title',
  ja: 'タイトル',
  bn: 'শিরোনাম',
}
```

This format is used in:
- `CollectionConfig.fields[].label`
- `SelectField.options[].label`
- `CollectionConfig.labels.singular / plural`

## Collections with full trilingual coverage

| Collection | Singular (EN / JA / BN) |
|---|---|
| Pages | Page / ページ / পেজ |
| Services | Service / サービス / সেবা |
| FAQs | FAQ / よくある質問 / প্রশ্নোত্তর |
| Blog Posts | Blog Post / ブログ記事 / ব্লগ পোস্ট |
| Case Studies | Case Study / 導入事例 / কেস স্টাডি |
| News | News Article / ニュース / সংবাদ |
| Team | Team Member / スタッフ / দলের সদস্য |
| Seminars | Seminar / セミナー / সেমিনার |
| Jobs | Job Listing / 求人 / চাকরির বিজ্ঞাপন |
| Form Submissions | Form Submission / フォーム送信 / ফর্ম জমা |

## Role labels

| Value | English | 日本語 | বাংলা |
|---|---|---|---|
| `admin` | Admin | 管理者 | অ্যাডমিন |
| `editor` | Editor | 編集者 | সম্পাদক |

## aiVisible field

The `aiVisible` field is the shared canonical field defined in
`packages/cms-core/src/payload/fields/ai-visible.ts`. Its label and
admin description are already fully trilingual in the field definition.
