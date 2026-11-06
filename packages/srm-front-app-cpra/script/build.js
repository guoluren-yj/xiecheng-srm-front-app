/**
 * 两种构建模式：
 * 非overall模式，即子应用构建模式，每个子应用独立构建一个包，优点：1、子应用隔离 2、可扩展为单独下载； 缺点：1、打包后的代码重复量成倍增加 2、打包后整体体积极大 3、构建极慢
 * overall为整体构建模式，所有的代码构建为一个包；优点：SUB所有缺点取反； 缺点：SUB所有优点取反
 */
process.env.BUILD_SCRIPT === "overall" ? require("srm-front-app-core/script/overallBuild") : require("srm-front-app-core/script/build");
