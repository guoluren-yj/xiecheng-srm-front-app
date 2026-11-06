import { http, SrmUtil } from "srm-mobile-ui";

//获取数据
export const queryData = (param) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MRnNegkEQm7Qqz8I0picf1kcxG7icAuvCJWMHdZJaeaJg?queryType=page&approveNumber=${param?.approveNumber}`;
  return http.get(url);
};

//获取数据
export const getOperationRecord = (param) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MRnNegkEQm7Qqz8I0picf1kcxG7icAuvCJWMHdZJaeaJg?queryType=operationRecord&id=${param?.id}`;
  return http.get(url);
};