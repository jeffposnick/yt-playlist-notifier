const {readGitignoreFiles} = require('eslint-gitignore');

/** @type import('eslint').ESLint.ConfigData */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	ignorePatterns: readGitignoreFiles(),
	overrides: [
		{
			files: ['**/*.cjs'],
			env: {commonjs: true},
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
		{
			files: ['src/**/*'],
			env: {browser: true},
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			parserOptions: {
				tsconfigRootDir: '.',
				project: ['./tsconfig.json'],
			},
		},
		{
			files: ['src/service-worker/**/*'],
			env: {serviceworker: true},
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			parserOptions: {
				tsconfigRootDir: '.',
				project: ['./src/service-worker/tsconfig.json'],
			},
		},
		{
			files: ['tests/**/*'],
			env: {node: true},
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			parserOptions: {
				tsconfigRootDir: '.',
				project: ['./tests/tsconfig.json'],
			},
		},
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react'],
	root: true,
	rules: {
		'react/no-deprecated': 2,
		'react/react-in-jsx-scope': 0,
		'react/display-name': [
			1,
			{
				ignoreTranspilerName: false,
			},
		],
		'react/jsx-no-bind': [
			1,
			{
				ignoreRefs: true,
				allowFunctions: true,
				allowArrowFunctions: true,
			},
		],
		'react/jsx-no-comment-textnodes': 2,
		'react/jsx-no-duplicate-props': 2,
		'react/jsx-no-target-blank': 2,
		'react/jsx-no-undef': 2,
		'react/jsx-tag-spacing': [
			2,
			{
				beforeSelfClosing: 'always',
			},
		],
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react/jsx-key': [
			2,
			{
				checkFragmentShorthand: true,
			},
		],
		'react/self-closing-comp': 2,
		'react/prefer-es6-class': 2,
		'react/prefer-stateless-function': 1,
		'react/require-render-return': 2,
		'react/no-danger': 1,
		'react/no-did-mount-set-state': 2,
		'react/no-did-update-set-state': 2,
		'react/no-find-dom-node': 2,
		'react/no-is-mounted': 2,
		'react/no-string-refs': 2,
	},
	settings: {
		react: {version: '18'},
	},
};
