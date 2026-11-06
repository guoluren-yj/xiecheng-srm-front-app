const promisesMap = {};
const loadedScripts = {};

const loadScript = (url, type = "script") => {
  if (loadedScripts[url] && promisesMap[url]) {
    return promisesMap[url];
  }

  const promise = new Promise((resolve, reject) => {
    const scriptElement = document.createElement(type);
    const installTimeoutId = window.setTimeout(() => {
      promisesMap[url] = null;
      reject(new Error(`Failed to load ${url} in 20s`));
    }, 20000);

    scriptElement.onload = () => {
      if (installTimeoutId) {
        window.clearTimeout(installTimeoutId);
      }
      loadedScripts[url] = true;
      resolve();
    };

    scriptElement.onerror = (err) => {
      if (installTimeoutId) {
        window.clearTimeout(installTimeoutId);
      }
      promisesMap[url] = null;
      reject(err);
    };
    scriptElement.src = url;
    document.body.appendChild(scriptElement);
    console.log("脚本加载完毕");
  });

  promisesMap[url] = promise;
  return promise;
};

export default loadScript;