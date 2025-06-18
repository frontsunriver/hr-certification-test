module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'react-app',
    'airbnb',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // 👈 Add this last
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // 👈 Enforce Prettier rules as errors
    'react/react-in-jsx-scope': 'off', // Vite doesn't require React import
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
