/**
 * 与 【订单发布】相关的业务接口
 */
import { http } from "srm-mobile-ui";
const storage = window.localStorage;

// 订单头信息
export const getOrderHeadInfo = (poHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`, { params });

// 操作记录
export const getActionsRecordApi = (poHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`, { params });

// 发布按钮
export const publishBtnApi = (params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/po-header/detail-publish`, params);

// 附件查询
export const putUuid = (poHeaderId, uuid) => http.put(`/spuc/v1/${storage.getItem("organizationId")}/po-header//attachmentUUID?poHeaderId=${poHeaderId}&uuid=${uuid}&uuidType=1`);

// 查询是否开启双单位配置
export const queryDoubleUomConfigApi = (params) => {
    const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
    return http.get(url, { params});
};
  
// 双单位计算公式
export async function calculateDoubleUomApi(params) {
    const url = `/smdm/v1/${storage.getItem("organizationId")}/items/uom/calculate/quantity`;
    return http.post(url, params);
}
