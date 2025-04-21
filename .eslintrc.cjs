// .eslintrc.cjs
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier', // disables ESLint rules that conflict with Prettier
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // custom rules (optional)
        'react/react-in-jsx-scope': 'off', // not needed in React 17+
    },
};
