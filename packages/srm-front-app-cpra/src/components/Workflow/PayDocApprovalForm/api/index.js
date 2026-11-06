import { http, SrmUtil } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

export const queryMapIdpValue = async (lovCodes) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value/batch`;
  return http.get(url, { params: lovCodes });
};

export const queryOperationRecords = (payHeaderId) => {
  const url = `/sbdm/v1/${tenantId}/pay-header-actions/${payHeaderId}/list`;
  return http.get(url);
};

export const queryBatchInfo = (batchId) => {
  const url = `/sbdm/v1/${tenantId}/pay-headers/batch-approve/${batchId}`;
  return http.get(url);
};
