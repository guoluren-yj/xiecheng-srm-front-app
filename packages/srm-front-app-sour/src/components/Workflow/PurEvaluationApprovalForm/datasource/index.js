import { SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

// 基本信息
function basicDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    data: [],
    queryParameter: SrmUtil.getTenantNum() === "SRM-ZMC" ? {
      page: 0,
      size: 10,
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_DETAIL.EX_ATT_FORM,SSLM.PURCHASER_ASSESS_DETAIL.IN_ATT_FORM,SSLM.PURCHASER_ASSESS_DETAIL.BASICINFO,SSLM.PURCHASER_ASSESS_DETAIL.SUPPLIER_INFO,SSLM.PURCHASER_ASSESS_DETAIL.COMPANY_INFO,SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_RESULT",
    } : {
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-headers/eval-report/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

// 评估物料/品类信息
function itemCategoryDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 5,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-item-cates/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

// 评估小组信息
function assessmentPanelDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 5,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-groups/eval-report/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

// 评估信息
function assessmentDS({ evalHeaderId }) {
  const customizeUnitCodeList = [
    "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_INFO",
    "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION",
  ];
  return {
    autoQuery: true,
    pageSize: 5,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      page: 0,
      size: 5,
      customizeUnitCode: customizeUnitCodeList.join(","),
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-lines/eval-report-line/tree/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

// 质量整改
function reformDS({ evalHeaderId }) {
  return {
    autoQuery: true,
    pageSize: 5,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site_eval_external_orders/eval-report/${evalHeaderId}`,
        method: "post",
      },
    },
  };
}

export {
  commonDs,
  basicDS,
  itemCategoryDS,
  assessmentPanelDS,
  assessmentDS,
  reformDS,
};
