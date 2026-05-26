// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BeforeDashboard(_props: Record<string, any>) {
  return (
    <div
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        CMS Workspace
      </p>
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
        Manage content, media, and form submissions. Every save automatically invalidates
        the Next.js data cache for the affected collection.
      </p>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
        Editors may create and update. Only admins may delete records or manage users.
      </p>
    </div>
  )
}
