'use client';

import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';

export default function Home() {
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
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-2)',
              color: 'white',
            }}>
              <svg
                width="40"
                height="40"
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
            <Typography variant="h1" style={{ textAlign: 'center' }}>
              Welcome to{" "}
              <span style={{
                background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SnapScope
              </span>
            </Typography>
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
                // Placeholder - does nothing as specified in acceptance criteria
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
