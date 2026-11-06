import { Request, SrmUtil } from "srm-mobile-ui";
import Vue from "vue";
import { getToken } from "../api";

const env = SrmUtil.getEnvironment();
const AUX_BASE_URL = env === "PROD" ? "https://open.auxgroup.com/api/dmsapi/" : "https://open.auxgroup.com/api/dmsapitest/";

// aux请求外部接口
export const auxHttp = new Request(AUX_BASE_URL);

const _this = Vue.prototype;

// 提取相同请求报错提示部分
const errFunc = function (err) {
  // 发生网络错误后会走到这里，隐藏loading
  // eslint-disable-next-line rulesdir/no_hips
  _this.$hips.indicator.hide();
  if (err) {
    try {
      if (err.message === "Network Error") {
        _this.$notification.open({
          message: _this.$T("hipspfm.common.view.message.netWorkErr").$D("请检查是否允许使用网络！") || "Error",
          description: "",
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
        });
      } else {
        _this.$notification.open({
          message: _this.$T("hipspfm.common.view.message.systemException").$D("系统异常，请联系管理员") || "Error",
          description: "",
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
        });
      }
      return Promise.reject(err);
    } catch (error) {
      _this.$notification.open({
        message: "Error",
        // eslint-disable-next-line no-undef
        key,
        class: "notification",
      });
      return Promise.reject(err);
    }

  }
  return;
};

const useAuxResponseFunc = function (response, needThrow = false) {
  let result = response.data;

  if (![ 200, 204 ].includes(response.status)) {
    // eslint-disable-next-line rulesdir/no_hips
    _this.$hips.indicator.hide();
    return Promise.reject(result);
  }
  if (result && result.code !== "00") {
    _this.$notification.open({
      message: result.msg,
      // eslint-disable-next-line no-undef
      key,
      class: "notification",
    });
    if (needThrow) {
      // eslint-disable-next-line rulesdir/no_hips
      _this.$hips.indicator.hide();
      throw new Error(result.msg);
    }
  }
  return Promise.resolve(result);

};

auxHttp.interceptors.response.use((response) =>
  // 只将请求结果的data字段返回
  useAuxResponseFunc(response)
, (err) =>
  // 发生网络错误后会走到这里
  errFunc(err)
);

auxHttp.interceptors.request.use(async (config) => {
  // 假设有一个异步函数来获取token
  const res = await getToken(); // 假设这个函数返回Promise
  const { token } = res;
  if (token) {
    // 将token添加到请求头中
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 一定要返回config，以便请求可以继续发送
  return config;
}, (error) =>
  Promise.reject(error)
);

export default auxHttp;
