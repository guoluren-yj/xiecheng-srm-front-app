const fs = require("fs");
const path = require("path");

let readline = require("readline");
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let serviceName;
let serviceVersion;
// eslint-disable-next-line rulesdir/check_js
rl.question("请输入服务名(please enter service name)： ", function (name) {
  serviceName = name;
  // eslint-disable-next-line rulesdir/check_js
  rl.question("请输入服务版本号(please enter service version)： ", function (version) {
    serviceVersion = version;
    try {
      if (!serviceVersion.trim() || !serviceVersion.trim()) {
        // eslint-disable-next-line rulesdir/check_js
        throw new Error("未输入必输信息服务名或者版本号");
      }
      //修改服务名、版本号
      fs.readFile(path.resolve(__dirname, "../package.json"), "utf-8", function (err, data) {
        // console.info(err, data);
        let object = JSON.parse(data);
        object.name = serviceName;
        object.version = serviceVersion;
        let newContent = JSON.stringify(object, null, 4);
        fs.writeFile("package.json", newContent, "utf8", (errOne) => {
          if (errOne) {
            throw errOne;
          }
        });
      });
      //修改远程调用子应用名称
      let serviceNameArr = serviceName.split("-");
      let shortName = serviceNameArr[serviceNameArr.length - 1];
      let newShortNameFirt = shortName.substr(0, 1).toLocaleUpperCase();
      let newShortNameLast = shortName.substr(1);
      let newShortName = newShortNameFirt + newShortNameLast;
      let newApplicationName = newShortName + "RemoteEntry";
      fs.renameSync(path.resolve(__dirname, "../src/modules/TemplateRemoteEntry"), path.resolve(__dirname, "../src/modules", newApplicationName), (err) => {
        if (err) {
          throw err;
        }
      });

      fs.readFile(path.resolve(__dirname, "../vue.config.js"), "utf-8", function (err, data) {
        // console.info(err, data);
        let newData = data.replace(/TemplateRemoteEntry/g, newApplicationName);
        newData = newData.replace(/appTemplate/g, "app" + newShortName);
        fs.writeFile("vue.config.js", newData, "utf8", (errOne) => {
          if (errOne) {
            throw errOne;
          }
        });
      });
      console.info("Congratulation，init success");
    } catch (e) {
      console.info("Sorry，init fail", e);
    } finally {
      rl.close();
    }
  });
});

