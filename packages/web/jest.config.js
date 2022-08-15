module.exports = {
  rootDir: "./src",
  transform: {
    // "\\.tsx?$": ["esbuild-jest", { sourcemap: true }],
    // switched to swc until issue with jest.mock is fixed: https://github.com/aelbore/esbuild-jest/issues/54
    "\\.[jt]sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    // alias from vite.config
    "^@/(.*)$": "<rootDir>/$1",
  },
};
