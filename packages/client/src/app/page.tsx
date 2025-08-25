'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <main className="max-w-4xl space-y-8">
            {/* Logo/Brand area */}
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <svg
                  className="h-10 w-10"
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
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SnapScope
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
                Helping Insurance Adjusters assess vehicles faster, more accurately, and have fun while doing it.
              </p>
              <p className="mx-auto max-w-xl text-base text-slate-500 dark:text-slate-400">
                Streamline your vehicle assessment workflow with our powerful, mobile-first Progressive Web App designed specifically for independent adjusters.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  // Placeholder - does nothing as specified in acceptance criteria
                }}
                className="group relative inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:opacity-50"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
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
                </span>
              </button>
            </div>

            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                  <svg
                    className="h-6 w-6"
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Faster</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Streamlined workflows reduce assessment time by up to 40%
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <svg
                    className="h-6 w-6"
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">More Accurate</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Smart tools and guided processes ensure consistent, thorough assessments
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                  <svg
                    className="h-6 w-6"
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">More Fun</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Intuitive interface and modern tools make your work more enjoyable
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
