const removeConsolePlugin = [];

// if (process.env.NODE_ENV === 'production') {
//     removeConsolePlugin.push('transform-remove-console')
// }

module.exports = {
  presets: [ "@vue/app" ],
  plugins: [
    [
      "import",
      {
        libraryName: "hips",
        libraryDirectory: "es",
        style: true
      },
      "hips"
    ],
    [
      "import",
      {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: "css"
      }
    ],
    [
      "import",
      {
        libraryName: "@hips/vue-ui",
        libraryDirectory: "es",
        style: true
      },
      "@hips/vue-ui"
    ],
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    ...removeConsolePlugin
  ]
};
