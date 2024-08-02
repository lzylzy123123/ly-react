const { defaults } = require('jest-config');

module.exports = {
	...defaults,
	// eslint-disable-next-line no-undef
	rootDir: process.cwd(),
	modulePathIgnorePatterns: ['<rootDir>/.history','<rootDir>/package.json'],
	moduleDirectories: [...defaults.moduleDirectories, 'dist/node_modules'],
	testEnvironment: 'jsdom'
};
