'use client';

import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { Logo } from '@snapscope/ui/logo';
import { VideoPlayer } from '@snapscope/ui/video-player';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      padding: 'var(--space-md)',
    }}>
      {/* Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: 'var(--space-md)', 
        right: 'var(--space-md)' 
      }}>
        <ThemeToggle />
      </div>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <main style={{ 
          maxWidth: '800px', 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2xl)',
        }}>
          {/* Logo/Brand area */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-lg)',
          }}>
            <Logo size="xl" variant="icon" showText={false} />
          </div>

          {/* Marketing Video */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
          }}>
            <div id="video-description" style={{ display: 'none' }}>
              Marketing video demonstrating SnapScope&apos;s vehicle assessment tools for insurance adjusters, 
              showcasing features that help assess vehicles faster, more accurately, and with improved user experience.
            </div>
            <VideoPlayer
              src="/marketing-video.mp4"
              poster="/video-poster.jpg"
              showControls={true}
              aspectRatio="video"
              lazyLoad={false}
              autoPlay={true}
              muted={true}
              aria-label="SnapScope marketing video showcasing vehicle assessment features"
              aria-describedby="video-description"
              style={{
                boxShadow: 'var(--shadow-2)',
                borderRadius: 'var(--border-radius-lg)',
              }}
              placeholder={
                <div
                  style={{
                    aspectRatio: '16 / 9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-1)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    border: '2px dashed var(--border-color)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-start)' }}
                      aria-hidden="true"
                    >
                      <path
                        d="M8 5v14l11-7L8 5z"
                        fill="currentColor"
                      />
                    </svg>
                    <p style={{ margin: 0 }}>
                      🎬 Marketing Video Coming Soon
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Description */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <Typography variant="body" style={{ 
              maxWidth: '600px',
              color: 'var(--text-secondary)',
            }}>
              Helping Insurance Adjusters assess vehicles faster, more accurately, and have fun while doing it.
            </Typography>
            <Typography variant="small" style={{ 
              maxWidth: '500px',
              color: 'var(--text-tertiary)',
            }}>
              Streamline your vehicle assessment workflow with our powerful, mobile-first Progressive Web App designed specifically for independent adjusters.
            </Typography>
          </div>

          {/* CTA Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                router.push('/assessments');
              }}
              style={{
                borderRadius: '50px',
                padding: '16px 32px',
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Start New Claim
            </Button>
          </div>

          {/* Feature highlights */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-2xl)',
            width: '100%',
          }}>
            <Card elevation={1} padding="lg" style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0.9,
                }}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <Typography variant="h3">Faster</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Streamlined workflows reduce assessment time by up to 40%
                </Typography>
              </div>
            </Card>

            <Card elevation={1} padding="lg" style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0.9,
                }}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Typography variant="h3">More Accurate</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Smart tools and guided processes ensure consistent, thorough assessments
                </Typography>
              </div>
            </Card>

            <Card elevation={1} padding="lg" style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0.9,
                }}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Typography variant="h3">More Fun</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Intuitive interface and modern tools make your work more enjoyable
                </Typography>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
