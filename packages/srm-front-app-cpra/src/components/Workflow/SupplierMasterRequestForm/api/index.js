import { http, SrmUtil } from "srm-mobile-ui";

export const queryHeader = ({ id }) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/yic4zQhxiajPbfPVrGLibibYx1uYHiaoibicsYlp5oEHJuXaWg?queryType=detailHead&id=${id}`;
  return http.get(url);
};

export const queryLine = ({ id }) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/yic4zQhxiajPbfPVrGLibibYx1uYHiaoibicsYlp5oEHJuXaWg?queryType=detailLine&id=${id}`;
  return http.get(url);
};
