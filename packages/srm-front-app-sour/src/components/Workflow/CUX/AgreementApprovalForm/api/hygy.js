
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//协议审批详情接口
export const getAgreementDetailApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}?customizeUnitCode=SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL`;
  return http.get(url);
};

/**
 * 服务拆分
 */
//获取附件预览文件流
export const getPdfFile = (bucketName, fileUrl) => {
  const url = `/hfle/v1/${window.localStorage.organizationId}/file-preview/by-url?&bucketName=${bucketName}&url=${encodeURIComponent(fileUrl)}`;
  return http.get(url, { responseType:"arraybuffer" });
};
