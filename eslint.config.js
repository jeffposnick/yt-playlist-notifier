import {fileURLToPath} from 'node:url';

import {includeIgnoreFile} from '@eslint/compat';
import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	tseslint.configs.recommended,
	prettier,
	{
		files: ['*.config.{js,ts}'],
		languageOptions: {
			globals: globals.node,
		},
	},
	{
		files: ['src/**/*'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: ['./tsconfig.json'],
			},
		},
		extends: [tseslint.configs.recommendedTypeChecked],
		plugins: {react, 'react-hooks': reactHooks},
		settings: {
			react: {version: '18'},
		},
		rules: {
			...reactHooks.configs.recommended.rules,
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
	},
	{
		files: ['src/service-worker/**/*'],
		languageOptions: {
			globals: globals.serviceworker,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: ['./src/service-worker/tsconfig.json'],
			},
		},
		extends: [tseslint.configs.recommendedTypeChecked],
	},
	{
		files: ['tests/**/*'],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				project: ['./tests/tsconfig.json'],
			},
		},
		extends: [tseslint.configs.recommendedTypeChecked],
	},
]);
