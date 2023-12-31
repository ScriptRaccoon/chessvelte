/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleDirectories: ["node_modules", "<rootDir>"],
	moduleNameMapper: {
		"^\\$shared/(.*)$": "<rootDir>/shared/$1",
		"^\\$server/(.*)$": "<rootDir>/server/src/$1",
	},
}
