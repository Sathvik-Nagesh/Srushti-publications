'use client'

interface BookCardSkeletonProps {
  count?: number
}

export default function BookCardSkeleton({ count = 4 }: BookCardSkeletonProps) {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #e0e0e0 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: var(--radius-md);
        }
      `}</style>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Image Skeleton */}
            <div 
              className="skeleton"
              style={{
                height: 200,
                borderRadius: 0
              }}
            />
            
            {/* Content Skeleton */}
            <div style={{ padding: '1rem' }}>
              {/* Category Badge */}
              <div 
                className="skeleton"
                style={{
                  width: 80,
                  height: 20,
                  marginBottom: '0.75rem'
                }}
              />
              
              {/* Title */}
              <div 
                className="skeleton"
                style={{
                  width: '100%',
                  height: 20,
                  marginBottom: '0.5rem'
                }}
              />
              <div 
                className="skeleton"
                style={{
                  width: '70%',
                  height: 20,
                  marginBottom: '0.75rem'
                }}
              />
              
              {/* Author */}
              <div 
                className="skeleton"
                style={{
                  width: '50%',
                  height: 14,
                  marginBottom: '1rem'
                }}
              />
              
              {/* Price and Button Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div 
                    className="skeleton"
                    style={{
                      width: 60,
                      height: 24,
                      marginBottom: '0.25rem'
                    }}
                  />
                  <div 
                    className="skeleton"
                    style={{
                      width: 40,
                      height: 14
                    }}
                  />
                </div>
                <div 
                  className="skeleton"
                  style={{
                    width: 100,
                    height: 36
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// Simple inline skeleton for other uses
export function Skeleton({ 
  width = '100%', 
  height = 20,
  borderRadius = 'var(--radius-md)',
  style = {}
}: {
  width?: number | string
  height?: number | string
  borderRadius?: string
  style?: React.CSSProperties
}) {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
      `}</style>
      <div
        style={{
          width,
          height,
          borderRadius,
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%)',
          backgroundSize: '200px 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
          ...style
        }}
      />
    </>
  )
}
