import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { detectBlur, quickBlurCheck } from './blur-detection';
import { Button } from './button';
import { Typography } from './typography';
import { cssVars } from './tokens';

// Create a wrapper component for the blur detection utility
const BlurDetectionDemo = () => {
  const [results, setResults] = useState<Array<{
    fileName: string;
    fileSize: number;
    isBlurry: boolean;
    threshold: number;
    processingTime: number;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState(30);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      const startTime = performance.now();
      
      try {
        const isBlurry = await detectBlur(file, threshold);
        const endTime = performance.now();
        const processingTime = endTime - startTime;

        setResults(prev => [...prev, {
          fileName: file.name,
          fileSize: file.size,
          isBlurry,
          threshold,
          processingTime
        }]);
      } catch (error) {
        console.error('Blur detection failed for', file.name, error);
      }
    }

    setIsProcessing(false);
    // Reset file input
    event.target.value = '';
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ 
      padding: cssVars.spaceMd, 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px'
    }}>
      <div style={{ marginBottom: cssVars.spaceLg }}>
        <Typography variant="h2" style={{ marginBottom: cssVars.spaceMd }}>
          Blur Detection Utility
        </Typography>
        <Typography variant="body" style={{ 
          marginBottom: cssVars.spaceMd,
          color: cssVars.textSecondary 
        }}>
          Upload images to test the blur detection algorithm. The utility uses variance of Laplacian 
          to determine image sharpness.
        </Typography>

        <div style={{ 
          display: 'flex', 
          gap: cssVars.spaceMd, 
          alignItems: 'center',
          marginBottom: cssVars.spaceMd,
          flexWrap: 'wrap'
        }}>
          <div>
            <label htmlFor="threshold-slider" style={{ 
              display: 'block', 
              marginBottom: cssVars.spaceXs,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Blur Threshold: {threshold}
            </label>
            <input
              id="threshold-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{ width: '200px' }}
            />
            <div style={{ fontSize: '12px', color: cssVars.textTertiary }}>
              Lower = more sensitive
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isProcessing}
            style={{ 
              padding: cssVars.spaceXs,
              border: `1px solid ${cssVars.borderColor}`,
              borderRadius: cssVars.borderRadiusSm
            }}
          />

          {results.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearResults}
            >
              Clear Results
            </Button>
          )}
        </div>

        {isProcessing && (
          <div style={{
            padding: cssVars.spaceMd,
            background: cssVars.info + '20',
            borderRadius: cssVars.borderRadiusSm,
            marginBottom: cssVars.spaceMd
          }}>
            <Typography variant="body" style={{ color: cssVars.info }}>
              Processing images...
            </Typography>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div>
          <Typography variant="h3" style={{ marginBottom: cssVars.spaceMd }}>
            Results ({results.length} images)
          </Typography>
          
          <div style={{
            display: 'grid',
            gap: cssVars.spaceMd,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: cssVars.spaceMd,
                  border: `1px solid ${cssVars.borderColor}`,
                  borderRadius: cssVars.borderRadiusSm,
                  background: cssVars.bgSurface,
                }}
              >
                <div style={{ marginBottom: cssVars.spaceSm }}>
                  <Typography variant="body" style={{ 
                    fontWeight: '600',
                    marginBottom: cssVars.spaceXs
                  }}>
                    {result.fileName}
                  </Typography>
                  <Typography variant="small" style={{ color: cssVars.textSecondary }}>
                    {(result.fileSize / 1024).toFixed(1)} KB
                  </Typography>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: cssVars.spaceXs
                }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: result.isBlurry ? cssVars.error + '20' : cssVars.success + '20',
                    color: result.isBlurry ? cssVars.error : cssVars.success,
                  }}>
                    {result.isBlurry ? 'BLURRY' : 'SHARP'}
                  </span>
                  <Typography variant="caption" style={{ color: cssVars.textTertiary }}>
                    {result.processingTime.toFixed(0)}ms
                  </Typography>
                </div>

                <Typography variant="caption" style={{ color: cssVars.textTertiary }}>
                  Threshold: {result.threshold}
                </Typography>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: cssVars.spaceLg,
            padding: cssVars.spaceMd,
            background: cssVars.textTertiary + '10',
            borderRadius: cssVars.borderRadiusSm,
          }}>
            <Typography variant="h3" style={{ marginBottom: cssVars.spaceSm }}>
              Statistics
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: cssVars.spaceSm }}>
              <div>
                <Typography variant="small" style={{ color: cssVars.textSecondary }}>
                  Total Images
                </Typography>
                <Typography variant="body" style={{ fontWeight: '600' }}>
                  {results.length}
                </Typography>
              </div>
              <div>
                <Typography variant="small" style={{ color: cssVars.textSecondary }}>
                  Sharp Images
                </Typography>
                <Typography variant="body" style={{ fontWeight: '600', color: cssVars.success }}>
                  {results.filter(r => !r.isBlurry).length}
                </Typography>
              </div>
              <div>
                <Typography variant="small" style={{ color: cssVars.textSecondary }}>
                  Blurry Images
                </Typography>
                <Typography variant="body" style={{ fontWeight: '600', color: cssVars.error }}>
                  {results.filter(r => r.isBlurry).length}
                </Typography>
              </div>
              <div>
                <Typography variant="small" style={{ color: cssVars.textSecondary }}>
                  Avg Processing Time
                </Typography>
                <Typography variant="body" style={{ fontWeight: '600' }}>
                  {results.length > 0 ? (results.reduce((sum, r) => sum + r.processingTime, 0) / results.length).toFixed(0) : 0}ms
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        marginTop: cssVars.space2xl,
        padding: cssVars.spaceMd,
        background: cssVars.textTertiary + '05',
        borderRadius: cssVars.borderRadiusSm,
      }}>
        <Typography variant="h3" style={{ marginBottom: cssVars.spaceSm }}>
          Algorithm Details
        </Typography>
        <Typography variant="body" style={{ marginBottom: cssVars.spaceSm }}>
          The blur detection uses the <strong>variance of Laplacian</strong> method:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: cssVars.spaceMd }}>
          <li style={{ marginBottom: cssVars.spaceXs }}>
            <Typography variant="small">
              Converts image to grayscale for processing efficiency
            </Typography>
          </li>
          <li style={{ marginBottom: cssVars.spaceXs }}>
            <Typography variant="small">
              Applies Laplacian edge detection filter to highlight sharp transitions
            </Typography>
          </li>
          <li style={{ marginBottom: cssVars.spaceXs }}>
            <Typography variant="small">
              Calculates variance of the filtered result (higher variance = sharper image)
            </Typography>
          </li>
          <li style={{ marginBottom: cssVars.spaceXs }}>
            <Typography variant="small">
              Resizes large images to 400px max dimension for performance
            </Typography>
          </li>
        </ul>
        <Typography variant="small" style={{ 
          marginTop: cssVars.spaceSm,
          display: 'block',
          color: cssVars.textSecondary 
        }}>
          <strong>Threshold guidance:</strong> Lower values are more sensitive (detect more blur), 
          higher values are less sensitive. Typical range: 20-50 for most use cases.
        </Typography>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Utilities/BlurDetection',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Blur Detection Utility

A utility for detecting blurry images using computer vision techniques. This is particularly useful for:

- **Vehicle Assessment Photos**: Ensuring damage photos are clear enough for accurate assessment
- **VIN Scanning**: Validating that VIN photos are readable
- **Document Capture**: Checking that important documents are captured clearly
- **Quality Control**: Automatic filtering of poor-quality images

### How It Works

The blur detection algorithm uses the **Variance of Laplacian** method:

1. **Preprocessing**: Converts image to grayscale and resizes for performance
2. **Edge Detection**: Applies a Laplacian filter to detect sharp edges
3. **Variance Calculation**: Computes the variance of the filtered result
4. **Threshold Comparison**: Higher variance indicates sharper images

### Performance Considerations

- Images are automatically resized to max 400px dimension for speed
- Typical processing time: 50-200ms depending on image size
- Uses web workers when available for non-blocking processing
- Memory efficient with automatic cleanup

### Integration

The blur detection is integrated into the PhotoCaptureScreen component but can also be used independently:

\`\`\`typescript
import { detectBlur } from './blur-detection';

const isBlurry = await detectBlur(imageBlob, threshold);
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: () => <BlurDetectionDemo />,
  parameters: {
    docs: {
      description: {
        story: `
Interactive demo of the blur detection utility. Upload images to test the algorithm with different threshold values.

**Try different images:**
- Sharp photos (should be detected as "SHARP")
- Motion-blurred images (should be detected as "BLURRY") 
- Out-of-focus images (should be detected as "BLURRY")
- Screenshots or text (usually detected as "SHARP")

**Threshold tuning:**
- **Low (0-20)**: Very sensitive, may flag slightly soft images as blurry
- **Medium (20-40)**: Good balance for most use cases
- **High (40-100)**: Less sensitive, only obvious blur detected
        `
      }
    }
  }
};

// Performance benchmark story
export const PerformanceBenchmark: Story = {
  render: () => {
    const [benchmarkResults, setBenchmarkResults] = useState<Array<{
      imageSize: string;
      processingTime: number;
      threshold: number;
    }>>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runBenchmark = async () => {
      setIsRunning(true);
      setBenchmarkResults([]);

      // Create test images of different sizes
      const testSizes = [
        { width: 400, height: 300, label: '400x300' },
        { width: 800, height: 600, label: '800x600' },
        { width: 1200, height: 900, label: '1200x900' },
        { width: 1920, height: 1080, label: '1920x1080' },
      ];

      for (const size of testSizes) {
        // Create a test canvas with some content
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d')!;
        
        // Draw some test pattern
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 50,
            Math.random() * 50
          );
        }

        // Convert to blob
        await new Promise<void>((resolve) => {
          canvas.toBlob(async (blob) => {
            if (blob) {
              const startTime = performance.now();
              await detectBlur(blob, 30);
              const endTime = performance.now();
              
              setBenchmarkResults(prev => [...prev, {
                imageSize: size.label,
                processingTime: endTime - startTime,
                threshold: 30
              }]);
            }
            resolve();
          }, 'image/jpeg', 0.8);
        });

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setIsRunning(false);
    };

    return (
      <div style={{ padding: cssVars.spaceLg }}>
        <Typography variant="h2" style={{ marginBottom: cssVars.spaceMd }}>
          Performance Benchmark
        </Typography>
        
        <Button
          onClick={runBenchmark}
          disabled={isRunning}
          variant="primary"
          style={{ marginBottom: cssVars.spaceLg }}
        >
          {isRunning ? 'Running Benchmark...' : 'Run Performance Test'}
        </Button>

        {benchmarkResults.length > 0 && (
          <div>
            <Typography variant="h3" style={{ marginBottom: cssVars.spaceMd }}>
              Results
            </Typography>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: cssVars.spaceMd
            }}>
              {benchmarkResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: cssVars.spaceMd,
                    border: `1px solid ${cssVars.borderColor}`,
                    borderRadius: cssVars.borderRadiusSm,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body" style={{ fontWeight: '600' }}>
                    {result.imageSize}
                  </Typography>
                  <Typography variant="h3" style={{ 
                    color: cssVars.info,
                    margin: `${cssVars.spaceXs} 0`
                  }}>
                    {result.processingTime.toFixed(0)}ms
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance benchmark testing blur detection speed with different image sizes. Click "Run Performance Test" to see how processing time scales with image dimensions.'
      }
    }
  }
};