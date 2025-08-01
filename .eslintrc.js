// ESLint Configuration for Timely Flag Explorer

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    rules: {
        // Code Quality
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'no-alert': 'warn',
        
        // Style
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        
        // Best Practices
        'eqeqeq': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        'arrow-spacing': 'error',
        
        // ES6+
        'no-duplicate-imports': 'error',
        'prefer-template': 'error',
        'template-curly-spacing': 'error',
        'object-shorthand': 'error'
    },
    globals: {
        'CONFIG': 'readonly'
    }
};
