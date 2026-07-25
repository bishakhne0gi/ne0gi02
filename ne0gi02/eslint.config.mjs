import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/**
 * Flat config using the Next and react-hooks plugins directly.
 * `eslint-config-next`'s legacy entrypoint pulls in @rushstack/eslint-patch,
 * which does not work under ESLint 9's flat resolution — so it is bypassed.
 */
export default [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
]
