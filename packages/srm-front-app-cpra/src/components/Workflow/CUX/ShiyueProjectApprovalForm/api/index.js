import { http, SrmUtil } from "srm-mobile-ui";

// 获取详情信息
export const getProDetailApi = (projectId, projectReqHeaderId, type) => {

  let url = type!=='change' ? `/siec/v1/${SrmUtil.getTenantId()}/project/base/${projectId}` : `/siec/v1/${SrmUtil.getTenantId()}/project-req/base/${projectReqHeaderId}`;
  const customizeUnitCodeObj = {
    create: 'SIEC.PROJECT_READ.BASE,SIEC.PROJECT_READ.ATTACHMENT',
    change: 'SIEC.PROJECT_CHANGE.BASEINFO,SIEC.PROJECT_CHANGE.ATTACH',
    others: 'SIEC.PROJECT_OTHER_TYPE.ATTACHMENT,SIEC.PROJECT_OTHER_TYPE.BASE'
  }
  let params = {
    customizeUnitCode: customizeUnitCodeObj[type]
  };
  return http.get(url, { params });
};
