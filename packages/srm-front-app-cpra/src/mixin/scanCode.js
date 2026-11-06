// /**
//  * 扫码公共方法
//  * callBack为回调方法，执行完成后回调次方法给到执行结果,exceptionCallBack为异常回调
//  * 修改扫码为当前方法原因：
//  * 1 之前的扫码不统一，每个需要的功能都单独写了扫码操作
//  * 2 之前的扫码并没有考虑的微信小程序扫码情况
//  * 3 之前的扫码操作代码不统一，当前将扫码的触发动作都交给壳子，子应用中专注业务逻辑处理，不在调用三方sdk进行扫码
//  * 总结： 向uniApp 借用扫码权限，实际效果可能不如子应用中单独调用快，但是会缺失微信小程序扫码场景；权衡后，牺牲可接受的一点效率，将代码统一，并支持微信小程序场景
//  */
// import { scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
// export default {
//   data() {
//     return {};
//   },
//   methods: {
//     //扫码
//     goScannerNew(callBack, exceptionCallBack) {
//       //来源uinApp壳子需要向uinApp借用扫码权限
//       if (window.localStorage.enterSource === "uniApp") {
//         const o = {
//           //桥接类型-扫码
//           type: "scanCode",
//           //扫码结果存放key
//           storageKey: "scanCodeResult_1114"
//         };
//         let requestValue = encodeURIComponent(JSON.stringify(o));
//         uni.navigateTo({
//           url: "/pages/public/bridgePage?requestValue=" + requestValue
//         });
//         window.localStorage.removeItem(o.storageKey);
//         let i = 0;
//         //如果执行了1200次，也就是触发扫码，10分钟没有结果，清除任务
//         let myVar = window.setInterval(function () {
//           i++;
//           if (i > 1200) {
//             window.localStorage.removeItem(o.storageKey);
//             window.clearInterval(myVar);
//             exceptionCallBack("time out");
//             return;
//           }
//           if (window.localStorage[o.storageKey]) {
//             const result = window.localStorage[o.storageKey];
//             window.localStorage.removeItem(o.storageKey);
//             window.clearInterval(myVar);
//             console.info(result, "scanner result");
//             const resultObjet = JSON.parse(result);
//             if (resultObjet.fail === "1") {
//               exceptionCallBack(resultObjet.result);
//             } else {
//               callBack(resultObjet.result);
//             }
//           }
//         }, 500);
//         //来源原生App壳子需要向App借用扫码权限
//       } else {
//         scanBridge().then((res) => {
//           console.log("APP扫码：" + res);
//           callBack(JSON.parse(res).result);
//         }).catch((err) => {
//           console.info("APP扫码异常：", err);
//           exceptionCallBack(err);
//         });
//       }
//     },
//   }
// };
