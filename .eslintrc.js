module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // This must be last to override other configs
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      require('path').resolve(__dirname, 'tsconfig.json'),
      require('path').resolve(__dirname, 'packages/mobile/tsconfig.eslint.json'),
    ],
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: [
          require('path').resolve(__dirname, 'tsconfig.json'),
          require('path').resolve(__dirname, 'packages/mobile/tsconfig.eslint.json'),
        ],
        alwaysTryTypes: true,
        warnOnMultipleProjects: false,
        createDefaultProgram: true,
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'lf',
      },
    ],
    // Disable conflicting rules that Prettier handles
    quotes: 'off',
    '@typescript-eslint/quotes': 'off',
    'jsx-quotes': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['packages/mobile/src/**/*.{ts,tsx}'],
      rules: {
        // Allow styles to be used before definition (common React Native pattern)
        '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
      },
    },
    {
      files: ['**/*.config.js', '**/jest.setup.js'],
      rules: {
        // Allow require() in config files
        'global-require': 'off',
      },
    },
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        // Allow unused vars in tests that start with underscore
        '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.expo/',
    'coverage/',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
    '.eslintrc.js',
  ],
};
