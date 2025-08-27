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
            <Typography variant="h1" style={{ 
              maxWidth: '600px',
              color: 'var(--text-primary)',
            }}>
              Created for appraisers, by appraisers.
            </Typography>
            <Typography variant="body" style={{ 
              maxWidth: '500px',
              color: 'var(--text-secondary)',
            }}>
              We want to revolutionize the way claims are done. Whether it&apos;s a quick photo and scope or a full file, Snapscope aims to reduce turnaround times, simplify uploads and eliminate the need for reinspections.
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Typography variant="h2">FASTER TURNAROUND. HAPPIER CLIENTS.</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Deliver inspection files in record time with auto-labeling, built-in QA, and one-click exports—keeping your partners impressed and your pipeline moving.
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <Typography variant="h2">CONSISTENTLY ACCURATE. ZERO GUESSWORK.</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  With VIN verification, blur detection, and automated quality checks, every file meets carrier and firm standards—reducing costly reinspections and protecting your reputation.
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <Typography variant="h2">TAILORED TO YOUR BUSINESS.</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Create custom workflows for every carrier or partner. SnapScope adapts to your process, not the other way around.
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
                  backgroundColor: 'var(--warning)',
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                    />
                  </svg>
                </div>
                <Typography variant="h2">ORGANIZED FROM DAY ONE.</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Never lose track of a job again. Files are stored locally until you&apos;re ready to upload, making it easy to pause, resume, or export anytime.
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
                  backgroundColor: 'var(--error)',
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <Typography variant="h2">BUILT FOR TEAMS, TRUSTED BY PROS.</Typography>
                <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
                  From new adjusters to industry veterans, SnapScope&apos;s intuitive design makes adoption painless—and efficiency gains immediate.
                </Typography>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
