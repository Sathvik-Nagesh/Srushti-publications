import Script from 'next/script'
import { safeJsonLdStringify } from '@/lib/jsonld'

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Component to inject JSON-LD structured data into the page head
 * Supports single schema or array of schemas
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonLdArray = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLdArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(item)
          }}
        />
      ))}
    </>
  )
}

export default JsonLd
