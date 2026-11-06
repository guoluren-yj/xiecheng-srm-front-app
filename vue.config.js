const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { buildDynamicModule } = require("srm-front-app-core/script/virtualModule");
const VirtualModulesPlugin = require("webpack-virtual-modules");
const { ModuleFederationPlugin } = require("webpack").container;
const EnvPlugin = require("./script/EnvPlugin");
const { defineConfig } = require("@vue/cli-service");
const { exposes, remotes, mobileSrmHost } = require("./remoteConfig");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "development" ? "http://localhost:9596" : !process.env.VUE_APP_TARGET ? `${mobileSrmHost}/appPlat` : process.env.VUE_APP_TARGET === "PlatRemoteEntry" ? `${mobileSrmHost}/PlatRemoteEntry` : "",
  // 不需要生产环境的 source map，将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  transpileDependencies: [ "srm-front-app-core" ],
  devServer: {
    //热更新改为重加载，支持ModuleFederationPlugin信息更新
    hot: false,
    port: "9596",
    liveReload: true,
  },
  // 关闭eslint
  lintOnSave: false,
  configureWebpack: () => {
    const resolve = {
      fallback: {
        "timers": require.resolve("timers-browserify"),
        "path": require.resolve("path-browserify")
      }
    };
    const module = {
      unknownContextCritical: false,
      exprContextCritical: false,
    };
    const optimization = process.env.NODE_ENV === "development" ?
      {
        splitChunks: false
      } : {
        splitChunks: {
          chunks: "initial",
          minSize: 200 * 1024,
          maxSize: 2 * 1024 * 1024,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 5,
          automaticNameDelimiter: "-"
        },
      };
    const plugins = [
      new CompressionWebpackPlugin(),
      new CopyWebpackPlugin(),
      new EnvPlugin()
    ];
    if (process.env.NODE_ENV === "development") {
      plugins.push(new VirtualModulesPlugin({
        "node_modules/vue-dynamic-modules.js": `module.exports = [${buildDynamicModule().join(",")}];`
      }));
    }
    plugins.push(new ModuleFederationPlugin({
      name: process.env.VUE_APP_SERVICE_NAME,
      //文件名不能添加随机后缀名，否则远程访问js名称无法固定； 方案一：固定名称，但是浏览器缓存要排除当前文件，否则使用方无法使用最新代码
      //当前js文件过大后，影响访问速度；方案二：动态自定义版本号，存放指定位置，远程加载的时候动态取对应版本号加载。
      filename: "PlatRemoteEntry.js",
      // 对外暴露的组件
      exposes: process.env.VUE_APP_TARGET === "PlatRemoteEntry" || !process.env.VUE_APP_TARGET || process.env.NODE_ENV === "development" ? exposes : {},
      // 远程引用组件
      remotes: remotes,
      //shared: require('./package.json').dependencies,
      shared: [ "vue", "srm-mobile-ui", "vue-router", "vuex" ]
    }));
    return { resolve, module, plugins, optimization };
  }
});
