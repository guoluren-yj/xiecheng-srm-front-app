import { $T } from "srm-mobile-ui";

import { commonDSQueryFields } from "./commonDSQueryFields";

/**
 * 进行中tab
 *
 * 单据来源类型
 * 1、招投标：BID
 * 2、询报价：RFX
 */

// 已中标
function bidded(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();

  // 个性化编码
  const customizeUnitCode = {
    BID:"SSLM.BIDDING_TABLE_BID.SUGGEST,SSLM.BIDDING_TABLE_BID.FILTER",
    RFX:""
  };
  const secondarySourceCategory = {
    BID:"NEW_BID",
    RFX:""
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    fastQueryField: {
      fieldCode: type === "BID" ? "multiRfxNumOrTitle" : "rfxTitle",
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
      // size: 20
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
    BID:"SSLM.BIDDING_TABLE_BID.SUGGEST_FAILED,SSLM.BIDDING_TABLE_BID.FILTER",
    RFX:""
  };
  const secondarySourceCategory = {
    BID:"NEW_BID",
    RFX:""
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    fastQueryField: {
      fieldCode: type === "BID" ? "multiRfxNumOrTitle" : "rfxTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.view.title.rfxTitleBidTitleOrNumQuery", [ type ]).$D("{type}单号或标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      // page: 0,
      // size: 20
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
    BID:"SSLM.BIDDING_TABLE_BID.OTHERS,SSLM.BIDDING_TABLE_BID.FILTER",
    RFX:""
  };
  const secondarySourceCategory = {
    BID:"NEW_BID",
    RFX:""
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    fastQueryField: {
      fieldCode: type === "BID" ? "multiRfxNumOrTitle" : "rfxTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.view.title.rfxTitleBidTitleOrNumQuery", [ type ]).$D("{type}单号或标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      // page: 0,
      // size: 20
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
