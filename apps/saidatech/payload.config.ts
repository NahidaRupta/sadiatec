import { buildConfig } from 'payload'
import { buildCmsConfig } from '@saidatech/cms-core/payload/config-factory'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import siteConfig from './site.config'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uri = process.env['DATABASE_URI']

if (!uri) {
  throw new Error('[payload] DATABASE_URI is required. Set it in .env.local.')
}

const db =
  uri.startsWith('file:') || uri.endsWith('.db')
    ? sqliteAdapter({ client: { url: uri } })
    : postgresAdapter({
        pool: {
          connectionString: uri,
          max: 5,
          idleTimeoutMillis: 15000,
          connectionTimeoutMillis: 15000,
          ssl: true,
        },
          // push: false,
      })

const baseConfig = buildCmsConfig(siteConfig, undefined, db)

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[]

const finalConfig = {
  ...baseConfig,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    ...baseConfig.admin,
    importMap: {
      baseDir: path.resolve(__dirname, './src/app/(payload)'),
    },
    ...(process.env.NODE_ENV === 'development' ? {
      autoLogin: {
        email: 'admin@payloadcms.com',
        password: 'test',
        prefillOnly: true,
      }
    } : {}),
  },
}

// ✅ R2 Storage Configuration
if (
  process.env.CLOUDFLARE_R2_BUCKET &&
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
  process.env.CLOUDFLARE_R2_ENDPOINT
) {
  finalConfig.plugins = [
    ...(finalConfig.plugins || []),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.CLOUDFLARE_R2_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
        region: 'auto',
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      },
    }),
  ]
} else {
  console.log('⚠️ R2 not configured - using local file storage')
}

// ✅ Type-safe check
if ('importMap' in baseConfig) {
  delete (finalConfig as any).importMap
}

finalConfig.upload = {
  ...finalConfig.upload,
}

export default buildConfig(finalConfig)