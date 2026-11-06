
import { SrmUtil } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function baseDs(params) {
  const { evalHeaderId, submitUserId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      code: "COMPLETED",
      submitUserId: submitUserId,
      customizeUnitCode: "SSLM.ARCHIVE_FILLING_DETAIL.FILLING_DETAIL,SSLM.ARCHIVE_FILLING_DETAIL.FILLING_SEARCH_FORM,SSLM.ARCHIVE_FILLING_DETAIL.LIST_NEW"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/evaluation/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

function scoreDataSet(params) {
  const { evalHeaderId, submitUserId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      code: "COMPLETED",
      submitUserId: submitUserId,
      customizeUnitCode: "SSLM.ARCHIVE_FILLING_DETAIL.FILLING_DETAIL,SSLM.ARCHIVE_FILLING_DETAIL.FILLING_SEARCH_FORM,SSLM.ARCHIVE_FILLING_DETAIL.LIST_NEW"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/evaluation/${evalHeaderId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        setTimeout(() => {
          // 修正是否有下一页
          // 获取当前ds加载数据页码
          const currentPage = ds.currentPage || 0;
          // 获取总页码
          const totalPages = data[0] && data[0].kpiEvalDetailLineDTOPage ? data[0].kpiEvalDetailLineDTOPage.totalPages : 0;
          // 是否分页标识
          const ispaging = currentPage < totalPages - 1;
          // 设置分页参数
          ds.hasMore = ispaging;
          ds.paging = ispaging;
          ds.isList = true;
        }, 0);
        const header = data[0] || {};
        const line = header.kpiEvalDetailLineDTOPage && data[0].kpiEvalDetailLineDTOPage.content || [];
        return line;
      }
    }
  };
}

export {
  commonDs,
  baseDs,
  scoreDataSet,
};
