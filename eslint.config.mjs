import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
  enableTypescript: true,
})

export default [
  ...baseConfig,
  {
    rules: {
      'n/no-missing-import': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
]
