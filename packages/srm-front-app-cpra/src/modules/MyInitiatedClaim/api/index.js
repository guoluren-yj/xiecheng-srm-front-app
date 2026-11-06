import { http, SrmUtil } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

export const queryMapIdpValue = async (lovCodes) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value/batch`;
  return http.get(url, { params: lovCodes });
};

export const queryHistoryRecords = async (formHeaderId) => {
  const url = `/sqam/v1/${tenantId}/claim-form-records/${formHeaderId}/records`;
  return http.get(url, { params: { size: 0 } });
};

export async function queryApproveRecords(formHeaderId) {
  const url = `/sqam/v1/${tenantId}/claim-form-records/${formHeaderId}/work/flow/records`;
  return http.get(url, { params: { size: 0 } });
}