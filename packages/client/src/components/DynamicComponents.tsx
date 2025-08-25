/**
 * Dynamic component loading for code splitting
 */

'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Dynamic imports for heavy components
export const DynamicClaimList = dynamic(() => import('./ClaimList'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for client-side only components
});

// Placeholder components for not-yet-created modules
const PlaceholderComponent = memo<{ name: string }>(({ name }) => (
  <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <p className="text-gray-600">{name} component will be implemented here</p>
  </div>
));
PlaceholderComponent.displayName = 'PlaceholderComponent';

export const DynamicClaimEditor = dynamic(() => Promise.resolve({ default: () => <PlaceholderComponent name="ClaimEditor" /> }), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const DynamicPhotoGallery = dynamic(() => Promise.resolve({ default: () => <PlaceholderComponent name="PhotoGallery" /> }), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const DynamicReportGenerator = dynamic(() => Promise.resolve({ default: () => <PlaceholderComponent name="ReportGenerator" /> }), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Lazy load heavy analytics components
export const DynamicAnalyticsDashboard = dynamic(() => Promise.resolve({ default: () => <PlaceholderComponent name="AnalyticsDashboard" /> }), {
  loading: () => (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <LoadingSpinner />
      <span className="ml-3">Loading analytics dashboard...</span>
    </div>
  ),
  ssr: false,
});

// Dynamic import with error boundary
export const DynamicChartComponent = dynamic(
  () => Promise.resolve({ default: () => <PlaceholderComponent name="ChartComponent" /> }),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

const DynamicComponents = {
  ClaimList: DynamicClaimList,
  ClaimEditor: DynamicClaimEditor,
  PhotoGallery: DynamicPhotoGallery,
  ReportGenerator: DynamicReportGenerator,
  AnalyticsDashboard: DynamicAnalyticsDashboard,
  ChartComponent: DynamicChartComponent,
};

export default DynamicComponents;