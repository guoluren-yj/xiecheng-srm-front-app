import { $T } from "srm-mobile-ui";

import { commonDSQueryFields } from "./commonDSQueryFields";

/**
 * 待发布tab
 *
 * 单据来源类型
 * 1、招投标：BID
 * 2、询报价：RFX
 */

// code
const FilterUnitCode = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.LIST_UNPARTICIPATION_FILTER";

const BidFilterUnitCode = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.LIST_UNPARTICIPATION_FILTER";

// 邀请我的
function inviteDS(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();

  // 个性化编码
  const customizeUnitCode = {
    BID: `${BidFilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.UNRELEASED`,
    RFX: `${FilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.UNRELEASED`,
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
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/quotation/list/invite`,
        method: "get",
      },
    },
  };
}

// 公开招标
function openBiddingDS(type) {
  // 查询条件
  const queryFields = commonDSQueryFields();
  // 个性化编码
  const customizeUnitCode = {
    BID: `${BidFilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.OPENED`,
    RFX: `${FilterUnitCode},SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.OPENED`,
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
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/quotation/list/open`,
        method: "get",
      },
    },
  };
}

export {
  inviteDS,
  openBiddingDS,
};
