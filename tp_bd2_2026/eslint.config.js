import nextPlugin from '@next/eslint-plugin-next'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.next/**'] },
  ...tseslint.configs.recommended,
  { plugins: { '@next/next': nextPlugin } },
)
