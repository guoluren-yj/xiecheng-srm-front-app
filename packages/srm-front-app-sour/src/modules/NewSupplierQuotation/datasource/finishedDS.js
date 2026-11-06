import { $T } from "srm-mobile-ui";

import { commonDSQueryFields } from "./commonDSQueryFields";

/**
 * 进行中tab
 *
 * 单据来源类型
 * 1、招投标：BID
 * 2、询报价：RFX
 */

// code
const FilterUnitCode = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.LIST_FINISH_FILTER";

const BidFilterUnitCode = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.LIST_FINISH_FILTER";

const secondarySourceCategory = {
  BID: "NEW_BID",
  RFX: "",
};

// 已中标
function bidded(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();

  // 个性化编码
  const customizeUnitCode = {
    BID: `${BidFilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.LIST_SUGGEST`,
    RFX: `${FilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.LIST_SUGGEST`,
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    filterCustomizeCode: customizeUnitCode[type],
    fastQueryField: {
      fieldCode: "multiRfxNumOrTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.view.title.rfxTitleBidTitleOrNumQuery", [ type ]).$D("{type}单号或标题"),
      // fieldName: type === "BID" ? $T("smbl.inquiryHall.model.inquiryHallBidTitle").$D("招标书标题") : $T("ssrc.queryRfq.model.queryRfq.inquiryTitle").$D("询价单标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      // page: 0,
      // size: 20,
      sourceMobileEndFlag: 1,
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        let curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          if (![ "customizeUnitCode", "secondarySourceCategory", "page", "size", "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomMergeFilterField.push(key);
          }
        });
        params["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        params["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/quotation/list/suggested`,
        method: "get",
      },
    },
  };
}

// 未中标
function unBidding(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();
  // 个性化编码
  const customizeUnitCode = {
    BID: `${BidFilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.LIST_SUGGEST_FAILED`,
    RFX: `${FilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.LIST_SUGGEST_FAILED`,
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    filterCustomizeCode: customizeUnitCode[type],
    fastQueryField: {
      fieldCode: "multiRfxNumOrTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.view.title.rfxTitleBidTitleOrNumQuery", [ type ]).$D("{type}单号或标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      // page: 0,
      // size: 20,
      sourceMobileEndFlag: 1,
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        let curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          if (![ "customizeUnitCode", "secondarySourceCategory", "page", "size", "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomMergeFilterField.push(key);
          }
        });
        params["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        params["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/quotation/list/un-suggested`,
        method: "get",
      },
    },
  };
}

// 其它
function finOthersDS(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();
  // 个性化编码
  const customizeUnitCode = {
    BID: `${BidFilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.LIST_OTHERS`,
    RFX: `${FilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.LIST_OTHERS`,
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    filterCustomizeCode: customizeUnitCode[type],
    fastQueryField: {
      fieldCode: "multiRfxNumOrTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.view.title.rfxTitleBidTitleOrNumQuery", [ type ]).$D("{type}单号或标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      // page: 0,
      // size: 20,
      sourceMobileEndFlag: 1,
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        let curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          if (![ "customizeUnitCode", "secondarySourceCategory", "page", "size", "multiRfxNumOrTitle", "rfxNum" ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomMergeFilterField.push(key);
          }
        });
        params["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        params["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/quotation/list/other`,
        method: "get",
      },
    },
  };
}

export {
  bidded,
  unBidding,
  finOthersDS,
};
