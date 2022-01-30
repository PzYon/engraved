// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoAlias = require("craco-alias");

// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        /* tsConfigPath should point to the file where "paths" are specified */
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
  ],
  webpack: {
    alias: {
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
};
