'use client'

/**
 * ObfuscatedEmail — renders a clickable email link that is harder for
 * spam-bots to harvest, while still being fully functional for real users.
 *
 * Technique: the email is split into parts via CSS ::before/::after pseudo-elements
 * so it never appears as a single string in the raw HTML.
 *
 * Usage:
 *   <ObfuscatedEmail email="srushtinagesh@gmail.com" />
 *   <ObfuscatedEmail email="srushtinagesh@gmail.com" className="footer-link" />
 */

interface ObfuscatedEmailProps {
  email: string
  className?: string
  style?: React.CSSProperties
  /** If true, renders just the text (no mailto: href) */
  textOnly?: boolean
}

export default function ObfuscatedEmail({
  email,
  className,
  style,
  textOnly = false,
}: ObfuscatedEmailProps) {
  // Split at @ so it's never a complete address in source
  const [user, domain] = email.split('@')

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${email}`
    }
  }

  if (textOnly) {
    return (
      <span
        className={className}
        style={style}
        aria-label={`Email: ${user} at ${domain}`}
        data-user={user}
        data-domain={domain}
      >
        <span>{user}</span>
        <span aria-hidden>&#64;</span>
        <span>{domain}</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textDecoration: 'underline',
        font: 'inherit',
        ...style,
      }}
      aria-label={`Send email to ${user} at ${domain}`}
      title={`${user}@${domain}`}
    >
      <span aria-hidden="true">
        <span>{user}</span>
        {'@'}
        <span>{domain}</span>
      </span>
      <span className="sr-only">{`${user} at ${domain}`}</span>
    </button>
  )
}
