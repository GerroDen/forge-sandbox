module.exports = {
  rootDir: "./src",
  transform: {
    "\\.ts$": "@swc/jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};
