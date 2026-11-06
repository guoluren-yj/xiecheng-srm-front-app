
import { SrmUtil } from "srm-mobile-ui";

/**
 * 中煤杭州研究院
srm-front-cux-ccteghzcg
SRM-CCTEGHZCG
*/
function ccQuotationSummaryDataSet(options) {
  const { rfxHeaderId, } = options || {};
  return {
    autoQuery: false,
    editable: false,
    paging: true,
    enableQuery: false,
    hasMore: true,
    fields: [],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/LcjQ6gdxdWfD5nxjicTsCacRibga0Rib6JG5Pshku9A8F4eyv6LD0W5aokOicxkjhXcetK1MmfHAhWH9OpELt7hwag?rfxHeaderId=${rfxHeaderId}&sourceMobileEndFlag=1`,
        method: "get",
      },
    },
  };
}

export {
  ccQuotationSummaryDataSet,
};
