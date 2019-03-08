module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'linebreak-style': [0, 'error', 'windows'],
        'indent': ['error', 4],
        'no-plusplus': 'error',
        'prefer-const':0
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
