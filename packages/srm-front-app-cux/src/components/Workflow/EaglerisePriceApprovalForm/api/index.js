import { http } from "srm-mobile-ui";

const storage = window.localStorage;
//获取头信息
export const getEadglePriceHead = (modelPricingId) => {
  let params = {
    modelPricingId: modelPricingId
  };

  return http.get(`/scux/v1/${storage.getItem("organizationId")}/eaglerise-model-pricings/${modelPricingId}`, { params });
};