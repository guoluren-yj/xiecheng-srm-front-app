/**
 * 与 【轻松筹采购申请】相关的业务接口
 */
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//获取采购申请明细
const getEasyPreparePurchasingDetailApi = (reqHeaderId) => {
  const url = `scux/v1/${storage.getItem("organizationId")}/qschou-req-headers/mobile/detail/${reqHeaderId}`;

  return http.get(url);
};

export {
  getEasyPreparePurchasingDetailApi,
};
