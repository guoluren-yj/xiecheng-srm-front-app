const HtmlWebpackPlugin = require("html-webpack-plugin");

const envParma = {
  consoleFlag: process.env.VUE_APP_CONSOLE_SWITCH,
  env: process.env.VUE_APP_SRM_ENV,
  baseUrl: process.env.VUE_APP_API_BASE_URL,
  bucketName: process.env.VUE_APP_BUCKET_NAME,
  publicBucketName: process.env.VUE_APP_PUBLIC_BUCKET_NAME,
  clientId: process.env.VUE_APP_CLIENT_ID,
  clientSecret: process.env.VUE_APP_CLIENT_SECRET
};

class EnvPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("EnvPlugin", (compilation) => {
      console.log("The compiler is starting a new compilation...");
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          "EnvPlugin", // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            let envParamStr = JSON.stringify(envParma);
            // Manipulate the content
            let html = data.html.replace("ENV_PARAM", envParamStr);
            data.html = html;
            // Tell webpack to move on
            cb(null, data);
          }
      );
    });
  }
}

module.exports = EnvPlugin;
