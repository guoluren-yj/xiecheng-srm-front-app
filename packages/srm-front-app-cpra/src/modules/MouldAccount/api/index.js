import { http, SrmUtil } from "srm-mobile-ui";

const { getTenantId } = SrmUtil;

const tenantId = getTenantId();

// 模具审批通过
export async function approveMould(params) {
    const { approvedRemark, body } = params;
    let url = `/siec/v1/${tenantId}/mould-account/approve/approval?approvedRemark=${approvedRemark}`;
    return http.post(url, body);
}
  
// 模具审批拒绝
export async function rejecteMould(params) {
    const { approvedRemark, body } = params;
    let url = `/siec/v1/${tenantId}/mould-account/approve/reject?approvedRemark=${approvedRemark}`;
    return http.post(url, body);
}

// 模具审批批量通过
export async function approveBatchMould(params) {
    const { approvedRemark, body } = params;
    let url = `/siec/v1/${tenantId}/mould-account/approve/batch/approval-reject?approveResult=APPROVED&approvedRemark=${approvedRemark}`;
    return http.post(url, body);
}
  
// 模具审批批量拒绝
export async function rejecteBactchMould(params) {
    const { approvedRemark, body } = params;
    let url = `/siec/v1/${tenantId}/mould-account/approve/batch/approval-reject?approveResult=REJECT&approvedRemark=${approvedRemark}`;
    return http.post(url, body);
}

// 获取详情数据
export async function getMouldAccountDetailData(maHeaderId, customizeUnitCode) {
    let url = `/siec/v1/${tenantId}/mould-account/${maHeaderId}?customizeUnitCode=${customizeUnitCode}`;
    return http.get(url);
}

// 获取变更详情
export async function getMouldAccountChangData(maHeaderId) {
    let url = `/siec/v1/${tenantId}/mould-account-change/detail/${maHeaderId}?customizeUnitCode=SIEC.MOULD_PLATFORM.APPROVE.MODIFY.HEADER,SIEC.MOULD_PLATFORM.APPROVE.MODIFY.LINE`;
    return http.get(url);
}

// 获取操作记录
export async function getHistoryData(maHeaderId) {
    let url = `/siec/v1/${tenantId}/mould-account-action/${maHeaderId}`;
    return http.get(url);
}