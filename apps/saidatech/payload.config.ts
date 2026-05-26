import { buildConfig } from 'payload'
import { buildCmsConfig } from '@saidatech/cms-core/payload/config-factory'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
    : postgresAdapter({ pool: { connectionString: uri } })

const baseConfig = buildCmsConfig(siteConfig, undefined, db)

const finalConfig = {
  ...baseConfig,
  admin: {
    ...baseConfig.admin,
    // Tell Payload where to find and auto-generate the file map at runtime
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

// ✅ Type-safe check: Ensure Payload config gets an importMap wrapper if it demands one
if ('importMap' in baseConfig) {
  delete (finalConfig as any).importMap
}

export default buildConfig(finalConfig)