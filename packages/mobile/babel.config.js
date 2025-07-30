module.exports = function (api) {
  const isTest = api.env("test");
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Add Flow type stripping for test environment
      isTest && "@babel/plugin-transform-flow-strip-types",
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@services": "./src/services",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@types": "./src/types",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ].filter(Boolean),
  };
};
