'use client';

import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { FeatureCard } from '@snapscope/ui/feature-card';
import { Icon } from '@snapscope/ui/icon';
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
              <Icon name="plus" size={20} />
              Start New Claim
            </Button>
          </div>

          {/* Feature highlights */}
          <div style={{ width: '100%' }}>
            {/* Visually hidden h2 for screen readers */}
            <Typography 
              variant="h2" 
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: 0,
              }}
            >
              Key Features
            </Typography>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-2xl)',
              width: '100%',
            }}>
            <FeatureCard
              icon={<Icon name="clock" />}
              title="FASTER TURNAROUND. HAPPIER CLIENTS."
              description="Deliver inspection files in record time with auto-labeling, built-in QA, and one-click exports—keeping your partners impressed and your pipeline moving."
              iconBgColor="var(--success)"
            />

            <FeatureCard
              icon={<Icon name="shield" />}
              title="CONSISTENTLY ACCURATE. ZERO GUESSWORK."
              description="With VIN verification, blur detection, and automated quality checks, every file meets carrier and firm standards—reducing costly reinspections and protecting your reputation."
              iconBgColor="var(--info)"
            />

            <FeatureCard
              icon={<Icon name="settings" />}
              title="TAILORED TO YOUR BUSINESS."
              description="Create custom workflows for every carrier or partner. SnapScope adapts to your process, not the other way around."
              iconBgColor="linear-gradient(135deg, var(--primary-start), var(--primary-end))"
            />

            <FeatureCard
              icon={<Icon name="briefcase" />}
              title="ORGANIZED FROM DAY ONE."
              description="Never lose track of a job again. Files are stored locally until you're ready to upload, making it easy to pause, resume, or export anytime."
              iconBgColor="var(--warning)"
            />

            <FeatureCard
              icon={<Icon name="users" />}
              title="BUILT FOR TEAMS, TRUSTED BY PROS."
              description="From new adjusters to industry veterans, SnapScope's intuitive design makes adoption painless—and efficiency gains immediate."
              iconBgColor="var(--error)"
            />
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
