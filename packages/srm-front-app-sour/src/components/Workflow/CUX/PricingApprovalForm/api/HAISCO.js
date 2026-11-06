import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;

/**核价审批*/
export const fetchPricingCheckApi = (params, query) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/check`;
  return http.post(url, params, { params: query, });
};

/**核价审批后置校验*/
export const fetchPricingSubmitValidateApi = (params, query) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/check/submit-validate`;
  return http.post(url, params, { params: query, });
};

