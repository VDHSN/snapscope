import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './video-player';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A lazy-loading video player component with intersection observer optimization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Video source URL',
    },
    poster: {
      control: 'text',
      description: 'Poster image URL to show before video loads',
    },
    showControls: {
      control: 'boolean',
      description: 'Show or hide video controls',
    },
    aspectRatio: {
      control: 'select',
      options: ['video', 'square', 'widescreen', 'ultrawide'],
      description: 'Aspect ratio of the video container',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Auto-play video when loaded (requires muted)',
    },
    muted: {
      control: 'boolean',
      description: 'Mute video by default',
    },
    loop: {
      control: 'boolean',
      description: 'Loop video playback',
    },
    lazyLoad: {
      control: 'boolean',
      description: 'Enable lazy loading of video (default: true)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample video URLs for demonstration (using publicly available test videos)
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_POSTER = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';

export const Default: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'video',
  },
};

export const WithoutControls: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: false,
    aspectRatio: 'video',
  },
};

export const AutoPlay: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'video',
    autoPlay: true,
    muted: true,
    loop: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-playing video (muted by default for browser compatibility)',
      },
    },
  },
};

export const NoLazyLoading: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'video',
    lazyLoad: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video loads immediately without lazy loading (useful for above-the-fold content)',
      },
    },
  },
};

export const SquareAspectRatio: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'square',
  },
};

export const WidescreenAspectRatio: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'widescreen',
  },
};

export const UltrawideAspectRatio: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    showControls: true,
    aspectRatio: 'ultrawide',
  },
};

export const LoadingState: Story = {
  args: {
    src: '', // Empty src to show loading state
    showControls: true,
    aspectRatio: 'video',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shown when video is not yet in viewport',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url.com/nonexistent-video.mp4',
    showControls: true,
    aspectRatio: 'video',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state shown when video fails to load',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    src: '', // Empty src to show placeholder
    showControls: true,
    aspectRatio: 'video',
    placeholder: (
      <div
        style={{
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          color: '#6b7280',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        🎬 Custom Marketing Video Placeholder
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom placeholder content before video loads',
      },
    },
  },
};

export const ResponsiveSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ width: '300px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Small (300px)</h3>
        <VideoPlayer
          src={SAMPLE_VIDEO}
          poster={SAMPLE_POSTER}
          showControls={true}
          aspectRatio="video"
        />
      </div>
      <div style={{ width: '500px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Medium (500px)</h3>
        <VideoPlayer
          src={SAMPLE_VIDEO}
          poster={SAMPLE_POSTER}
          showControls={true}
          aspectRatio="video"
        />
      </div>
      <div style={{ width: '700px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Large (700px)</h3>
        <VideoPlayer
          src={SAMPLE_VIDEO}
          poster={SAMPLE_POSTER}
          showControls={true}
          aspectRatio="video"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'VideoPlayer at different container widths showing responsive behavior',
      },
    },
  },
};