import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/no-multiple-empty-lines': 'off',
    'vue/html-self-closing': 'off',
  },
})
