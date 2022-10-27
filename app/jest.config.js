export default {
  resetMocks: true,
  resetModules: true,
  rootDir: "./src",
  transform: {
    "\\.ts$": "@swc/jest",
  },
  moduleNameMapper: {
    // alias from vite.config
    "^@/(.*)$": "<rootDir>/$1",
  },
};
