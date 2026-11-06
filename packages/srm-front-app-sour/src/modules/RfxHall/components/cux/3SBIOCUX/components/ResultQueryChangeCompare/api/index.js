import { http, SrmUtil } from "srm-mobile-ui";

// 获取核价结果审批标段信息
export const getHeadInfoApi = (params) => http.post(`/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/R8OlPWPr1ZFtibSpLWrazjwehYCQW1eCPhC0ByoyVhrTErGdgKJMt9FZJecbU0cF6`, params);