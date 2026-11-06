import { $T } from "srm-mobile-ui";

export function tableWaitData() {
  return {
    autoQuery: true,
    // selection: Infinity,
    // editFlag: false,
    // pageSize: 10,
    // editable: true,
    // enableQuery: true,
    queryParameter: {
      actionMethod: 'WORKBENCHES_REPLYING',
    },
    showTotalCount: true,
    fields: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceFromTitle",
        fieldName: $T("scux.expertReply.model.sourceFromTitle").$D("寻源标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime12",
        fieldName: $T("scux.expertReply.model.attributeDatetime12").$D("开标时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar17",
        fieldName: $T("scux.expertReply.model.attributeVarchar17").$D("开标地点"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purName",
        fieldName: $T("scux.expertReply.model.purName").$D("采购联系人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purPhone",
        fieldName: $T("scux.expertReply.model.purPhone").$D("联系人电话"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purEmail",
        fieldName: $T("scux.expertReply.model.purEmail").$D("联系人邮箱"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.expertReply.model.creationDate").$D("抽取时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyEndTime",
        fieldName: $T("scux.expertReply.model.replyEndTime").$D("确认回复截止时间"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
    ],
    queryFields: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceFromTitle",
        fieldName: $T("scux.expertReply.model.sourceFromTitle").$D("寻源标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("scux.expertReply.message.company").$D("公司"),
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        options: {
          valueField: "companyId",
          displayField: "companyName",
          subDisplayField:"companyNum",
          queryField: "companyName"
        },
      },
      {
        fieldCode: "sourceCategory",
        fieldType: "SELECT",
        fieldName: $T("scux.expertReply.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
        lovCode: "SSRC.SECONDARY_SOURCE_CATEGORY",
        options: {
          multiple: false,
        }
      },
       {
        fieldCode: "purName",
        fieldName: $T("scux.expertReply.model.purName").$D("采购联系人"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/o4h0iaJxyEgvc55WDBWoUozoSQqDaDxHPbbKxFrKAAyQ7icPDGRHSgANznKObgIxfX`,
        method: "get",
      },
    },
  };
}

export function tableAllData() {
  return {
    autoQuery: true,
    // selection: Infinity,
    // editFlag: false,
    // pageSize: 10,
    // editable: true,
    // enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      actionMethod: 'WORKBENCHES_ALL',
    },
    fields: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceFromTitle",
        fieldName: $T("scux.expertReply.model.sourceFromTitle").$D("寻源标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime12",
        fieldName: $T("scux.expertReply.model.attributeDatetime12").$D("开标时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar17",
        fieldName: $T("scux.expertReply.model.attributeVarchar17").$D("开标地点"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyStatusMeaning",
        fieldName: $T("scux.expertReply.model.replyStatus").$D("是否出席"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyContent",
        fieldName: $T("scux.expertReply.model.replyContent").$D("原因"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "realStatusMeaning",
        fieldName: $T("scux.expertReply.model.realStatusMeaning").$D("实际出席状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyTime",
        fieldName: $T("scux.expertReply.model.replyTime").$D("回复时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyTypeMeaning",
        fieldName: $T("scux.expertReply.model.replyType").$D("回复类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceMethodMeaning",
        fieldName: $T("scux.expertReply.model.sourceMethodMeaning").$D("寻源方式"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purName",
        fieldName: $T("scux.expertReply.model.purName").$D("采购联系人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purPhone",
        fieldName: $T("scux.expertReply.model.purPhone").$D("联系人电话"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purEmail",
        fieldName: $T("scux.expertReply.model.purEmail").$D("联系人邮箱"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.expertReply.model.creationDate").$D("抽取时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyEndTime",
        fieldName: $T("scux.expertReply.model.replyEndTime").$D("确认回复截止时间"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
    ],
    queryFields: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceFromTitle",
        fieldName: $T("scux.expertReply.model.sourceFromTitle").$D("寻源标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("scux.expertReply.message.company").$D("公司"),
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        options: {
          valueField: "companyId",
          displayField: "companyName",
          subDisplayField:"companyNum",
          queryField: "companyName"
        },
      },
      {
        fieldCode: "sourceCategory",
        fieldType: "SELECT",
        fieldName: $T("scux.expertReply.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
        lovCode: "SSRC.SECONDARY_SOURCE_CATEGORY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "purName",
        fieldName: $T("scux.expertReply.model.purName").$D("采购联系人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyType",
        fieldType: "SELECT",
        fieldName: $T("scux.expertReply.model.inquiryHall.replyType").$D("回复类型"),
        lovCode: "SSRC.EXPERT_EXTRACT_REPLY_TYPE",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "realStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.expertReply.model.inquiryHall.realStatus").$D("实际出席情况"),
        lovCode: "SSRC.EXPERT_EXTRACT_REAL_STATUS",
        options: {
          multiple: false,
        }
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/o4h0iaJxyEgvc55WDBWoUozoSQqDaDxHPbbKxFrKAAyQ7icPDGRHSgANznKObgIxfX`,
        method: "get",
      },
    },
  };
}

export function basicInfoData() {
  return {
    autoQuery: true,
    // queryParameter: {
    //   actionMethod: 'WORKBENCHES_REPLYING',
    // },
    // showTotalCount: true,
    fields: [
      {
        fieldCode: "sourceFromNum",
        fieldName: $T("scux.expertReply.model.sourceFromNum").$D("寻源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceFromTitle",
        fieldName: $T("scux.expertReply.model.sourceFromTitle").$D("寻源标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeDatetime12",
        fieldName: $T("scux.expertReply.model.attributeDatetime12").$D("开标时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar17",
        fieldName: $T("scux.expertReply.model.attributeVarchar17").$D("开标地点"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyStatusMeaning",
        fieldName: $T("scux.expertReply.model.replyStatus").$D("是否出席"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyContent",
        fieldName: $T("scux.expertReply.model.replyContent").$D("原因"),
        // required: true,
        fieldType: "TEXT",
      },
      {
        fieldCode: "realStatusMeaning",
        fieldName: $T("scux.expertReply.model.realStatusMeaning").$D("实际出席状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyTime",
        fieldName: $T("scux.expertReply.model.replyTime").$D("回复时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyTypeMeaning",
        fieldName: $T("scux.expertReply.model.replyType").$D("回复类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceMethodMeaning",
        fieldName: $T("scux.expertReply.model.sourceMethodMeaning").$D("寻源方式"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purName",
        fieldName: $T("scux.expertReply.model.purName").$D("采购联系人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purPhone",
        fieldName: $T("scux.expertReply.model.purPhone").$D("联系人电话"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "purEmail",
        fieldName: $T("scux.expertReply.model.purEmail").$D("联系人邮箱"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.expertReply.model.creationDate").$D("抽取时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "replyEndTime",
        fieldName: $T("scux.expertReply.model.replyEndTime").$D("确认回复截止时间"),
        fieldType: "TEXT",
      },
    ],
    // transport: {
    //   read: {
    //     url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/`,
    //     method: "get",
    //   },
    // },
  };
}