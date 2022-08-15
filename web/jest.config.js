module.exports = {
  rootDir: "./src",
  transform: {
    "\\.[jt]sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    // alias from vite.config
    "^@/(.*)$": "<rootDir>/$1",
  },
};
