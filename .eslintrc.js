module.exports = {
  extends: [
    'next/core-web-vitals',
    // any other extends you might already have
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_" 
    }]
  }
} 