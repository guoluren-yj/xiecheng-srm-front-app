import { SrmUtil, $T } from "srm-mobile-ui";
import moment from "moment";

const tenantId = SrmUtil.getTenantId();

export const relatedQIReportAddDS = ({ problemHeaderId, supplierTenantId }) => ({
  autoQuery: true,
  selection: Infinity,
  fields: [
    {
      fieldCode: "problemNum",
      fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
    },
    {
      fieldCode: "problemTitle",
      fieldName:$T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
    },
    {
      fieldCode: "createdName",
      fieldName:$T("entity.roles.creator").$D("创建人"),
    },
  ],
  queryFields: [
    {
      fieldCode: "problemTitle",
      fieldType: "TEXT",
      fieldName:$T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
    },
  ],
  fastQueryField: [
    {
      fieldCode: "problemNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
    },
  ],
  queryParameter: { problemHeaderId, supplierTenantId },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/problem-headers/page/completed`,
      method: "get",
    },
    submit: {
      url: `/sqam/v1/${tenantId}/header-associates/${problemHeaderId}/create`,
      method: "post",
    },
  }
});

export const relatedPurOrderAddDS = ({ problemHeaderId, companyId, extSupplierId, supplierCompanyId }) => ({
  autoQuery: true,
  selection: Infinity,
  fields: [
    {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.orderNum").$D("订单号"),
    },
    {
      fieldCode: "statusCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.orderStatus").$D("订单状态"),
      render: (value, item) => {
        const { statusCode, evaluationFlag } = item;
        if (statusCode === "CONFIRMED") {
          return evaluationFlag ?
            $T("sqam.common.view.option.evaluated").$D("已评价") :
            $T("sqam.common.view.option.unEvaluated").$D("待评价");
        }
        return value;
      },
    },
    {
      fieldCode: "orderTypeName",
      fieldType: "TEXT",
      fieldName: $T("entity.order.type").$D("订单类型"),
    },
    {
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.purchaseAgent").$D("采购员"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("entity.business.tag").$D("业务实体"),
    },
    {
      fieldCode: "organizationName",
      fieldType: "TEXT",
      fieldName: $T("entity.organization.class.purchase").$D("采购组织"),
    },
    {
      fieldCode: "poNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.srmPoNum").$D("SRM订单号"),
    },
    {
      fieldCode: "pohPcNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.common.model.common.contractNumber").$D("协议编号"),
    },
    {
      fieldCode: "sourceCode",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.dataSourceCode").$D("来源系统"),
    },
    {
      fieldCode: "releasedDate",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.date.release").$D("发布日期"),
    },
  ],
  queryFields: [
    {
      fieldCode: "statusCode",
      fieldType: "SELECT",
      fieldName: $T("entity.order.status").$D("订单状态"),
      options: {
        valueField: "value",
        displayField: "meaning",
        subDisplayField: "value",
        listData: [
          { value: "CONFIRMED", meaning: $T("sqam.common.view.option.confirmed").$D("已确认") },
          { value: "CLOSED", meaning: $T("sqam.common.view.option.closed").$D("已关闭") },
          {
            value: "UNEVALUATED",
            meaning: $T("sqam.common.view.option.unEvaluated").$D("待评价"),
          },
          { value: "EVALUATED", meaning: $T("sqam.common.view.option.evaluated").$D("已评价") },
        ]
      }
    },
    {
      fieldCode: "releasedDateAfter",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "releasedDateBefore",
      fieldName: $T("hzero.common.date.release").$D("发布时间"),
      defaultValue: moment().subtract(3, "months").format("YYYY-MM-DD 00:00:00"),
    },
    {
      fieldCode: "releasedDateBefore",
      visible: false,
      defaultValue: moment().format("YYYY-MM-DD 23:59:59"),
    }
  ],
  fastQueryField: [
    {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.sendOrder.model.common.orderNum").$D("订单号"),
    },
  ],
  queryParameter: { companyId, supplierId: extSupplierId, supplierCompanyId },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-relation-pos/un-relation-po/query`,
      method: "get",
    },
    submit: {
      url: `/sqam/v1/${tenantId}/ed-problem-relation-pos/${problemHeaderId}/create`,
      method: "post",
    },
  },
  events: {
    beforeQuery(ds, params) {
      const { statusCode } = params;
      const statusObj = {
        statusCode: [ "EVALUATED", "UNEVALUATED" ].includes(statusCode) ? "CONFIRMED" : statusCode,
        confirmedFlag: [ "EVALUATED", "UNEVALUATED" ].includes(statusCode) ? 1 : null,
        evaluationFlag: statusCode === "UNEVALUATED" ? 0 : statusCode === "EVALUATED" ? 1 : null,
      };
      Object.assign(params, statusObj);
    },
    beforeSubmit(ds, data) {
      return data.map(({ poHeaderId }) => ({ tenantId, poHeaderId, problemHeaderId }));
    }
  }
});

export const relatedOQDocAddDS = (headerData, decisionResults) => {
  const {
    companyName,
    supplierNum,
    supplierName,
    invOrganizationName,
    invOrganizationId,
  } = headerData;
  return {
    autoQuery: true,
    fields: [
      {
        fieldCode: "inspectionNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.inspectionNum").$D("检验单号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("entity.item.code").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("entity.item.name").$D("物料名称"),
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.poNum").$D("采购订单编号"),
      },
      {
        fieldCode: "transactionNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.transactionNum").$D("事务编号"),
      },
    ],
    queryFields: [
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("entity.item.code").$D("物料编码"),
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.poNum").$D("采购订单编号"),
      },
    ],
    fastQueryField: [
      {
        fieldCode: "inspectionNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.inspectionNum").$D("检验单号"),
      },
    ],
    queryParameter: {
      tenantId,
      companyName,
      supplierNum,
      supplierName,
      invOrganizationName,
      invOrganizationId,
      createProblemFlag: 1,
      decisionResults,
      customizeUnitCode: "SQAM.CREATE_8D_DETAIL.INSPECT",
    },
    transport: {
      read: {
        url: `/sqam/v1/${tenantId}/incoming-inspections`,
        method: "get",
      },
    },
  };
};
