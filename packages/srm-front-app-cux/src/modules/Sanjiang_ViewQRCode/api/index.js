
/**
 * 三江农户二维码展示页面
 */
import { http } from "srm-mobile-ui";

/*
获取二维码链接
*/
export const getQrCodeRedirectUrl = (params) => {
  const url = "/smbl/v1/common/get/wechat/url";
  return http.get(url, { params });
};

/*
获取二维码
*/
export const getQrCode = (src) => {
  const url = "/smbl/v1/common/qr/code";
  return http.post(url, { content: src }, { responseType: "arraybuffer" });
};
