import { SrmUtil, $T, SrmMath } from "srm-mobile-ui";
import moment from "moment";
import { isNil, isFunction } from "lodash";
import { EMAIL, NOT_CHINA_PHONE, PHONE } from "../utils/regExp";
import { getPcUnitCodeMap, getStateKeyMap } from "../utils";

const tenantId = SrmUtil.getTenantId();

export const preExcuteFields = (field) => {
  if (!field) {
    return;
  }
  const { fieldCode, fieldType, inputChange, options = {} } = field || {};
  // 框架值集清空在新建数据时有bug
  if ([ "SELECT", "LOV" ].includes(fieldType) && !isFunction(options?.onClear)) {
    field.options = Object.assign(options || {}, {
      onClear: (dataSet) => {
        const record = dataSet.current;
        if (record) {
          record.set(fieldCode, null);
        }
      }
    });
  } else if (fieldType === "SWITCH" && !isFunction(inputChange)) {
    field.inputChange = (value, item, _, record) => {
      record.set(fieldCode, Number(value));
    };
  }
  return field;
};

export const onHeaderUpdate = ({ dataSet, name, value }) => {
  const record = dataSet.current;
  if (!record) {
    return;
  }
  // 框架值集清空在新建数据时有bug
  if (isNil(value)) {
    record.set(name, value);
  }
  if (name === "companyId") {
    record.set("ouId", null);
    record.set("supplierId", null);
    record.set("invOrganizationId", null);
    record.set("purOrganizationId", null);
    const groupMemberDs = dataSet.children?.groupMember;
    if (groupMemberDs) {
      groupMemberDs.records.forEach((item) => {
        item.set("supplierContactId", null);
      });
    }
  }
  if (name === "ouId") {
    record.set("invOrganizationId", null);
  }
  if (name === "supplierNum") {
    const {
      supplierId = null,
      supplierNum = null,
      supplierName = null,
      erpSupplierName = null,
      extSupplierId = null,
      supplierTenantId = null,
      supplierCompanyId = null
    } = value || {};
    record.set("supplierId", supplierId);
    record.set("supplierNum", supplierNum);
    record.set("supplierName", erpSupplierName || supplierName);
    record.set("extSupplierId", extSupplierId);
    record.set("supplierTenantId", supplierTenantId);
    record.set("supplierCompanyId", supplierCompanyId);
    const groupMemberDs = dataSet.children?.groupMember;
    if (groupMemberDs) {
      groupMemberDs.records.forEach((item) => {
        item.set("supplierContactId", null);
      });
    }
  }
  if (name === "itemCode") {
    const {
      itemId = null,
      itemName = null,
      model = null,
      specifications = null,
    } = value || {};
    record.set("itemId", itemId);
    record.set("itemName", itemName);
    record.set("model", model);
    record.set("specifications", specifications);
  }
};

const onGroupMemberUpdate = ({ dataSet: paramDataSet, record: paramRecord, name, value }) => {
  const record = paramRecord || paramDataSet?.current;
  const dataSet = paramDataSet || paramRecord?.$DataSet;
  if (!record || !dataSet) {
    return;
  }
  // 框架值集清空在新建数据时有bug
  if (isNil(value)) {
    record.set(name, value);
  }
  if (name === "camp") {
    const { value: valueStr } = value || {};
    if (valueStr !== "PURCHASER") {
      record.set("visibleFlag", 0);
    }
    record.set("emailFlag", valueStr === "SUPPLIER" ? 1 : 0);
    record.set("memberName", null);
    record.set("phone", null);
    record.set("email", null);
    record.set("memberLoginName", null);
    record.set("supplierContactId", null);
    record.set("memberUserId", null);
  }
  if (name === "memberUserId") {
    const {
      email = null,
      phone = null,
      realName = null,
    } = value || {};
    record.set("email", email);
    record.set("phone", phone);
    record.set("memberName", realName);
  }
  if (name === "supplierContactId") {
    const {
      name: memberName = null,
      mail = null,
      mobilephone = null,
    } = value || {};
    record.set("email", mail);
    record.set("phone", mobilephone);
    record.set("memberName", memberName);
  }
  if (name === "leaderFlag" && Number(value === 1)) {
    dataSet.records.forEach((item) => item.set("leaderFlag", 0));
    record.set("leaderFlag", 1);
  }
};

export const headerDS = (problemHeaderId, pageCode) => {
  const createFlag = isNil(problemHeaderId);
  const pcUnitCodeMap = getPcUnitCodeMap(pageCode);
  const menuEntryPointMap = {
    creation: null,
    initiated: "CUSTOMER_OWNED",
    audit: "CUSTOMER_APPROVE_INITIATED",
  };
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "problemNum",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
      },
      {
        fieldType: "TEXT",
        fieldCode: "problemStatusMeaning",
        fieldName: $T("sqam.common.model.qualityRectification.status").$D("状态"),
      },
      {
        fieldCode: "problemTitle",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
        required: true,
        maxLength: 80,
      },
      {
        fieldCode: "problemTypeCode",
        fieldType: "SELECT",
        fieldName: $T("sqam.common.model.qualityRectification.issue").$D("问题类型"),
        lovCode: "SQAM.PROBLEM_TYPE",
        required: true,
      },
      {
        fieldCode: "problemDefectType",
        fieldType: "SELECT",
        fieldName: $T("sqam.common.model.qualityRectification.defectType").$D("缺陷类型"),
        lovCode: "SQAM.PROBLEM_DEFECT_TYPE",
        required: true,
      },
      {
        fieldCode: "problemImportanceCode",
        fieldType: "SELECT",
        fieldName: $T("sqam.common.model.qualityRectification.significance").$D("重视度"),
        lovCode: "SQAM.PROBLEM_IMPORTANCE",
        required: true,
      },
      {
        fieldCode: "problemUrgencyCode",
        fieldType: "SELECT",
        fieldName: $T("sqam.common.model.qualityRectification.urgency").$D("紧急度"),
        lovCode: "SQAM.PROBLEM_URGENCY",
        required: true,
      },
      {
        fieldCode: "problemOccurredDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sqam.common.model.qualityRectification.problemOccurredDate").$D("发生时间"),
        required: true,
        errorMessage: $T("sqam.common.view.message.occurredDateCannotAfterToday").$D("发生时间不能晚于今天"),
        validator: (val) => moment().add(1, "day").isAfter(val, "day"),
        timePicker: true,
      },
      {
        fieldCode: "problemDiscoverBy",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.problemDiscoverBy").$D("发现人员"),
        required: true,
      },
      {
        fieldCode: "problemOccurredSite",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.problemOccurredSite").$D("发生地点"),
        required: true,
      },
      {
        fieldCode: "problemIdentifyCauses",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.problemIdentifyCauses").$D("识别原因"),
        required: true,
      },
      {
        fieldCode: "problemIdentification",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.problemSketch").$D("问题简述"),
        required: true,
      },
      {
        fieldCode: "problemDetail",
        fieldType: "TEXT_AREA",
        fieldName: $T("sqam.common.model.qualityRectification.detail").$D("问题详述"),
        required: true,
      },
      {
        fieldCode: "problemEmergencyAction",
        fieldType: "TEXT_AREA",
        fieldName: $T("sqam.common.model.qualityRectification.emergency").$D("紧急处理"),
      },
      {
        fieldCode: "createdName",
        fieldType: "TEXT",
        fieldName: $T("entity.roles.creator").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("hzero.common.date.creationDate").$D("创建日期"),
        editor: false,
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("entity.company.tag").$D("公司"),
        lovCode: "SPFM.USER_AUTH.COMPANY",
        displayField: "companyName",
        required: true,
        editor: (_, item) => {
          const { sourceCode, problemStatus } = item;
          return createFlag || [ "SITE_EVAL", "KPI_EVAL" ].includes(sourceCode) && problemStatus === "NEW";
        },
        options: {
          queryParams: { enabledFlag: 1 },
          callback: (selected, valueField, displayField, dataSet) => {
            onHeaderUpdate({ dataSet, name: "companyId", value: selected[0] });
          },
          onClear: (dataSet) => {
            onHeaderUpdate({ dataSet, name: "companyId" });
          }
        },
      },
      {
        fieldCode: "ouId",
        fieldType: "LOV",
        fieldName: $T("entity.business.tag").$D("业务实体"),
        lovCode: "SODR.USER_AUTH.OU",
        displayField: "ouName",
        editor: (_, item) => {
          const { sourceCode, problemStatus } = item;
          return createFlag ||
            [ "SITE_EVAL", "KPI_EVAL" ].includes(sourceCode) && problemStatus === "NEW";
        },
        options: {
          callback: (selected, valueField, displayField, dataSet) => {
            onHeaderUpdate({ dataSet, name: "ouId", value: selected[0] });
          },
          onClear: (dataSet) => {
            onHeaderUpdate({ dataSet, name: "ouId" });
          }
        },
      },
      {
        fieldCode: "invOrganizationId",
        fieldType: "LOV",
        fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
        lovCode: "SPFM.USER_AUTH.INVORG",
        displayField: "invOrganizationName",
        disabled: (_, item) => isNil(item?.companyId),
        editor: (_, item) => {
          const { sourceCode, problemStatus } = item;
          return createFlag || [ "SITE_EVAL", "KPI_EVAL" ].includes(sourceCode) && problemStatus === "NEW";
        },
      },
      {
        fieldCode: "supplierNum",
        fieldType: "LOV",
        fieldName: $T("entity.supplier.tag").$D("供应商"),
        lovCode: "SQAM.SUPPLIER_COMPANY",
        required: true,
        displayField: "supplierName",
        disabled: (_, item) => isNil(item?.companyId),
        editor: (_, item) => {
          const { sourceCode } = item;
          return createFlag || sourceCode === "EXTERNAL_IMPORT";
        },
        options: {
          textField: "erpSupplierName",
          callback: (selected, valueField, displayField, dataSet) => {
            onHeaderUpdate({ dataSet, name: "supplierNum", value: selected[0] });
          },
          onClear: (dataSet) => {
            onHeaderUpdate({ dataSet, name: "supplierNum" });
          }
        },
      },
      {
        fieldCode: "sourceCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.qualityRectification.dataSource").$D("创建方式"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "LOV",
        fieldName: $T("entity.item.code").$D("物料编码"),
        lovCode: "SQAM.ITEM",
        displayField: "itemCode",
        options: {
          callback: (selected, valueField, displayField, dataSet) => {
            onHeaderUpdate({ dataSet, name: "itemCode", value: selected[0] });
          },
          onClear: (dataSet) => {
            onHeaderUpdate({ dataSet, name: "itemCode" });
          }
        },
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("entity.item.name").$D("物料名称"),
      },
      {
        fieldCode: "openDays",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.qualityRectification.open.date").$D("开放天数"),
      },
      {
        fieldCode: "icaDemandDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sqam.common.model.qualityRectification.icaDemandDate").$D("ICA要求时间"),
        required: true,
        timePicker: true,
      },
      {
        fieldCode: "icaDelayDays",
        fieldType: "INPUT_NUMBER",
        fieldName: `${$T("sqam.common.model.qualityRectification.icaDelayDays").$D("ICA累计延期")}/${$T("hzero.common.date.unit.day").$D("天")}`,
        editor: false,
      },
      {
        fieldCode: "pcaDemandDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sqam.common.model.qualityRectification.pcaDemandDate").$D("PCA要求日期"),
        required: true,
        errorMessage: $T("sqam.common.view.message.pcaDemandDateCannotBeforeIca").$D("PCA要求日期不能早于ICA要求日期"),
        validator: (val, record) => moment(record.get("icaDemandDate")).isBefore(val, "second"),
        options: {
          format: "YYYY-MM-DD",
          valueFormat: "YYYY-MM-DD HH:mm:ss"
        }
      },
      {
        fieldCode: "pcaDelayDays",
        fieldType: "INPUT_NUMBER",
        fieldName: `${$T("sqam.common.model.qualityRectification.pcaDelayDays").$D("PCA累计延期")}/${$T("hzero.common.date.unit.day").$D("天")}`,
        editor: false,
      },
      {
        fieldCode: "publishedName",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.qualityRectification.publishedName").$D("发布人"),
      },
      {
        fieldCode: "purOrganizationId",
        fieldType: "LOV",
        fieldName: $T("entity.organization.class.purchase").$D("采购组织"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_ORG",
        displayField: "purOrganizationName",
        disabled: (_, item) => isNil(item?.companyId),
        editor: (_, item) => {
          const { sourceCode, problemStatus } = item;
          return createFlag || [ "SITE_EVAL", "KPI_EVAL" ].includes(sourceCode) && problemStatus === "NEW";
        },
      },
      {
        fieldCode: "unitId",
        fieldType: "LOV",
        fieldName: $T("sqam.common.model.qualityRectification.unitName").$D("所属部门"),
        lovCode: "SPRM.USER_DEPARTMENT",
        displayField: "unitName",
        disabled: (_, item) => isNil(item?.problemNum),
      },
      {
        fieldCode: "specifications",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.specifications").$D("规格"),
      },
      {
        fieldCode: "model",
        fieldType: "INPUT",
        fieldName: $T("sqam.common.model.qualityRectification.model").$D("型号"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT_AREA",
        fieldName: $T("sqam.common.model.qualityRectification.remark").$D("备注"),
      },
      {
        fieldCode: "rectifyTypeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.qualityRectification.rectifyTypeCodeMeaning").$D("整改单类型"),
      },
      {
        fieldCode: "approvedRemark",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.incomingInspectionQuery.auditOpinion").$D("审核意见"),
      },
      {
        fieldCode: "validateResultFlag",
        fieldType: "SELECT",
        fieldName: $T("sqam.common.model.qualityRectification.validationResults").$D("验证结果"),
        options: {
          valueField: "value",
          displayField: "meaning",
          subDisplayField: "value",
          listData: [
            { value: 1, meaning: $T("sqam.common.model.qualityRectification.verificationPassed").$D("验证通过") },
            { value: 0, meaning: $T("sqam.common.model.qualityRectification.verificationNoPassed").$D("验证不通过") },
          ]
        },
      },
      {
        fieldCode: "validateAttachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("sqam.common.model.qualityRectification.effectTrackUpload").$D("成效验证附件"),
        bucketName: "private-bucket",
        editor: false,
      },
      {
        fieldCode: "validateRemark",
        fieldType: "TEXT_AREA",
        fieldName: $T("sqam.common.model.qualityRectification.validateRemark").$D("验证情况说明"),
        editor: false,
      },
      {
        fieldCode: "validateCount",
        fieldType: "TEXT",
        fieldName: $T("sqam.common.model.verifyCount").$D("验证次数"),
      },
    ].map(preExcuteFields),
    queryParameter: {
      customizeUnitCode: [
        pcUnitCodeMap.basicInfo,
        pcUnitCodeMap.problemDesc,
        pcUnitCodeMap.congratulation,
        pcUnitCodeMap.effectTrack,
        pcUnitCodeMap.otherInfo,
        pcUnitCodeMap.customFormA,
        pcUnitCodeMap.customFormB,
        pcUnitCodeMap.customFormC,
      ].filter(Boolean).join(),
      menuEntryPoint: menuEntryPointMap[pageCode],
    },
    transport: {
      read: {
        url: `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/detail`,
        method: "get",
      },
    },
  };
};

export const relatedQIReportDS = (problemHeaderId, pageCode) => ({
  autoQuery: !isNil(problemHeaderId),
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "problemNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
    },
    {
      fieldCode: "problemTitle",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
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
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.creationDate").$D("创建日期"),
      editor: false,
    },
    {
      fieldCode: "createdName",
      fieldType: "TEXT",
      fieldName: $T("entity.roles.creator").$D("创建人"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("entity.company.tag").$D("公司"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("entity.business.tag").$D("业务实体"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
    },
    {
      fieldCode: "sourceNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.qualityRectification.sourceNum").$D("来源单据编号"),
    },
    {
      fieldCode: "problemDetail",
      fieldType: "TEXT",
      fieldName: $T("sqam.common.model.8d.problemDetail").$D("问题详述"),
    },
  ],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap(pageCode).relatedQIReport,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/header-associates/${problemHeaderId}/assocaite`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/header-associates`,
      method: "delete",
    },
  },
});

export const relatedPurOrderDS = (problemHeaderId) => ({
  autoQuery: !isNil(problemHeaderId),
  enableQuery: false,
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
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-relation-pos/${problemHeaderId}/query`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-relation-pos`,
      method: "delete",
    },
  },
});

export const relatedQCDocDS = (problemHeaderId, pageCode) => ({
  paging: false,
  pageSize: 0,
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
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
      fieldCode: "assessmentResultMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.assessmentResult").$D("评估结果"),
    },
    {
      fieldCode: "decisionResultMeaning",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.decisionResult").$D("决策结果"),
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
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.creationDate").$D("创建日期"),
      editor: false,
    },
    {
      fieldCode: "startDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.startDate").$D("检验开始日期"),
      editor: false,
    },
    {
      fieldCode: "endDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.endDate").$D("检验结束日期"),
      editor: false,
    },
  ],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap(pageCode).relatedQCDoc,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-inspections/${problemHeaderId}`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-inspections`,
      method: "delete",
    },
  }
});

export const relatedQCAffairDS = (pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "inspectionNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.trxNumandLine").$D("事务编号｜行号"),
      render: (_, record) => `${record.trxNum}|${record.trxLineNum}`
    },
    {
      fieldCode: "supplierNum",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.code").$D("供应商编码"),
    },
    {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("entity.supplier.supplierName").$D("供应商名称"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("entity.company.tag").$D("公司"),
    },
    {
      fieldCode: "organizationName",
      fieldType: "TEXT",
      fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
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
      fieldCode: "rcvTypeName",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.rcvTypeName").$D("事务类型"),
    },
    {
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("hzero.common.date.trxQuantity").$D("执行数量"),
      editor: false,
    },
    {
      fieldCode: "executeReverseQuantity",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.executeReverseQuantity").$D("执行退回数量"),
      editor: false,
    },
    {
      fieldCode: "nodeConfigName",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.nodeConfigName").$D("执行退回节点"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("hzero.common.date.creationDate").$D("创建日期"),
      editor: false,
    },
    {
      fieldCode: "sourceHeaderNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.sourceHeaderNum").$D("事务来源单号"),
    },
    {
      fieldCode: "displayTrxNum",
      fieldType: "TEXT",
      fieldName: $T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.displayTrxNum").$D("事务编号"),
    },
    {
      fieldCode: "sinvLineAttachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("sqam.common.model.common.attachment").$D("附件"),
      bucketName: "private-bucket",
      directory: "create8D",
      editor: false,
    },
  ],
  queryParameter: {
    withOutAuthFlag: 1,
    customizeUnitCode: getPcUnitCodeMap(pageCode).relatedQCAffair,
  },
  transport: {
    read: {
      url: `/spuc/v1/${tenantId}/sinv/rcv/trx/workbench/trx/finish/line`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-inspections`,
      method: "delete",
    },
  },
});

export const siteVisitResultDS = () => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "evalStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.status").$D("状态"),
    },
    {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.code").$D("考察报告编码"),
    },
    {
      fieldCode: "evalDescription",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
    },
    {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierName").$D("供应商"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
    },
    {
      fieldCode: "evalTplName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板"),
    },
    {
      fieldCode: "finalScore",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
    },
    {
      fieldCode: "grade",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.grade").$D("等级"),
    },
    {
      fieldCode: "approvedDate",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.approvedDate").$D("审批时间"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
    },
    {
      fieldCode: "realName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
    },
  ],
  transport: {
    read: {
      url: `/sslm/v1/${tenantId}/site-eval-headers/result/evaluating`,
      method: "get",
    },
  }
});

export const appraisalReportDS = () => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编码"),
    },
    {
      fieldCode: "evalStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.status").$D("状态"),
    },
    {
      fieldCode: "evalDescription",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalDescription").$D("评估报告描述"),
    },
    {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierName").$D("供应商"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
    },
    {
      fieldCode: "evalTplName",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalTpl").$D("评分模板"),
    },
    {
      fieldCode: "finalScore",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
    },
    {
      fieldCode: "grade",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.grade").$D("等级"),
    },
    {
      fieldCode: "approvedDate",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.approvedDate").$D("审批时间"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
    },
    {
      fieldCode: "realName",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
    },
  ],
  transport: {
    read: {
      url: `/sslm/v1/${tenantId}/site-eval-headers/eval-report-header`,
      method: "get",
    },
  }
});

export const supEvaluationFileDS = (problemHeaderId) => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.evaluationQuery.model.archive.num").$D("档案编码"),
    },
    {
      fieldCode: "evalStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("sslm.evaluationQuery.model.archive.status").$D("档案状态"),
    },
    {
      fieldCode: "evalName",
      fieldType: "TEXT",
      fieldName: $T("sslm.evaluationQuery.model.archive.describe").$D("档案描述"),
    },
    {
      fieldCode: "evalCycleMeaning",
      fieldType: "TEXT",
      fieldName: $T("sslm.evaluationQuery.model.evaluation.cycle").$D("考评周期"),
    },
    {
      fieldCode: "evalDateFrom",
      fieldType: "DATE_PICKER",
      fieldName: $T("sslm.evaluationQuery.model.evaluation.startDate").$D("考评日期从"),
      editor: false,
    },
    {
      fieldCode: "evalDateTo",
      fieldType: "DATE_PICKER",
      fieldName: $T("sslm.evaluationQuery.model.evaluation.endDate").$D("考评日期至"),
      editor: false,
    },
    {
      fieldCode: "processUserName",
      fieldType: "TEXT",
      fieldName: $T("sslm.evaluationQuery.model.evaluation.charger").$D("考评负责人"),
    },
  ],
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/problem-headers/associate/kipEvalHeader/${problemHeaderId}`,
      method: "get",
    },
  }
});

export const groupMemberDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "camp",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.representor").$D("代表方"),
      lovCode: "SQAM.EDPROBLEM.CAMP",
      defaultValue: "PURCHASER",
      displayField: "campMeaning",
      clearButton: false,
      required: true,
      options: {
        callback: (selected, valueField, displayField, dataSet) => {
          onGroupMemberUpdate({ value: selected?.[0], dataSet, name: "camp" });
        },
        onClear: (dataSet) => {
          onGroupMemberUpdate({ value: null, dataSet, name: "camp" });
        }
      },
    },
    {
      fieldCode: "memberUserId",
      fieldType: "LOV",
      fieldName: $T("sqam.common.model.qualityRectification.account").$D("账号"),
      lovCode: "SQAM.TENANT_USER",
      displayField: "memberLoginName",
      disabled: (_, item) => item?.camp === "SUPPLIER",
      options: {
        callback: (selected, valueField, displayField, dataSet) => {
          onGroupMemberUpdate({ value: selected?.[0], dataSet, name: "memberUserId" });
        },
        onClear: (dataSet) => {
          onGroupMemberUpdate({ dataSet, name: "memberUserId" });
        }
      },
    },
    {
      fieldCode: "supplierContactId",
      fieldType: "LOV",
      fieldName: $T("sqam.common.model.qualityRectification.supplierContactId").$D("供应商联系人"),
      lovCode: "SSLM.SUPPLIER_MAIN_DATA_CONTACT",
      displayField: "supplierContactName",
      options: {
        callback: (selected, valueField, displayField, dataSet) => {
          onGroupMemberUpdate({ value: selected?.[0], dataSet, name: "supplierContactId" });
        },
        onClear: (dataSet) => {
          onGroupMemberUpdate({ dataSet, name: "supplierContactId" });
        }
      },
    },
    {
      fieldCode: "memberName",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.qualityRectification.name").$D("姓名"),
      required: true,
    },
    {
      fieldCode: "leaderFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.qualityRectification.leader").$D("组长"),
      inputChange: (value, item, field, record) => {
        onGroupMemberUpdate({ value, record, name: "leaderFlag" });
      },
    },
    {
      fieldCode: "memberResp",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.qualityRectification.responsibility").$D("职责"),
    },
    {
      fieldCode: "participantNode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.qualityRectification.participantNode").$D("参与节点"),
      lovCode: "SQAM.FEEDBACK_JOIN_POINT",
    },
    {
      fieldCode: "phone",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.qualityRectification.phone").$D("电话"),
      errorMessage: $T("hzero.common.validation.phone").$D("手机号码格式不正确"),
      validator: (val, record) => {
        const internationalTelCode = record?.get("internationalTelCode");
        const pattern = internationalTelCode === "+86" ? PHONE : NOT_CHINA_PHONE;
        return isNil(val) || pattern.test(val);
      },
      prefixField:{
        fieldCode: "internationalTelCode",
        lovCode: "HPFM.IDD",
        fieldType: "SELECT",
        defaultValue: { value: "+86", meaning: `${$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
      },
    },
    {
      fieldCode: "email",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.qualityRectification.email").$D("邮箱"),
      required: (_, item) => Number(item?.emailFlag) === 1,
      pattern: EMAIL,
    },
    {
      fieldCode: "emailFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.qualityRectification.emailFlag").$D("邮件提醒"),
      disabled: (_, item) => ![ "PURCHASER", "SUPPLIER" ].includes(item?.camp),
    },
    {
      fieldCode: "visibleFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.qualityRectification.visibleFlag").$D("供应商不可见"),
      disabled: (_, item) => item?.camp === "SUPPLIER" || Number(item?.leaderFlag) === 1,
    },
    {
      fieldCode: "remark",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.qualityRectification.explain").$D("说明"),
    },
  ].map(preExcuteFields),
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap(pageCode).groupMember,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-teams/${problemHeaderId}`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-teams`,
      method: "delete",
      params: { optcamp: "PURCHASER" },
    }
  }
});

export const continueProvideDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "inventoryCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.8d.inventoryCode").$D("库存分布"),
      lovCode: "SQAM.PROBLEM_INVENTORY_DISTRIBUTION",
      required: true,
    },
    {
      fieldCode: "effectFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.8d.effectFlag").$D("是否影响"),
      disabled: true,
    },
    {
      fieldCode: "doubtfulQuantity",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("sqam.common.model.8d.doubtfulQuantity").$D("可疑数量"),
      errorMessage: $T("sqam.common.validation.cannotLessThanZero").$D("不能小于零"),
      validator: (val) => isNil(val) || SrmMath.gte(val, 0),
    },
    {
      fieldCode: "badQuantity",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("sqam.common.model.8d.badQuantity").$D("不良品数量"),
      errorMessage: $T("sqam.common.validation.cannotLessThanZero").$D("不能小于零"),
      validator: (val) => isNil(val) || SrmMath.gte(val, 0),
      inputChange: (value, item, field, record) => {
        record.set("effectFlag", value ? 1 : 0);
      },
    },
    {
      fieldCode: "measures",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.handleMeasure").$D("处理措施"),
      required: true,
    },
    {
      fieldCode: "supplyChargeName",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.chargeName").$D("责任人"),
      required: true,
    },
    {
      fieldCode: "suppliyEndDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.model.8d.finishDate").$D("完成时间"),
      required: true,
    },
    {
      fieldCode: "supplyActionRemark",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.remark").$D("备注"),
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).continueProvide,
    stateKey: getStateKeyMap(pageCode).continueProvide,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-supply-actions`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-supply-actions`,
      method: "delete",
    }
  }
});

export const shortMeatureDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "measuresDesc",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.measureDesc").$D("措施详述"),
    },
    {
      fieldCode: "produceActionRemark",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.measureCheck").$D("措施验证"),
      required: true,
    },
    {
      fieldCode: "produceChargeName",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.chargeName").$D("责任人"),
      required: true,
    },
    {
      fieldCode: "produceEndDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.model.8d.finishDate").$D("完成时间"),
      required: true,
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).shortMeature,
    stateKey: getStateKeyMap(pageCode).shortMeature,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-produce-actions`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-produce-actions`,
      method: "delete",
    }
  }
});

export const reasonAnalyzeDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "rootCauseTypeCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.8d.rootCauseType").$D("原因类型"),
      lovCode: "SQAM.ROOT_CAUSE_TYPE",
    },
    {
      fieldCode: "occurCause",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.occurCause").$D("发生原因"),
    },
    {
      fieldCode: "flowOutCause",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.flowOutCause").$D("流出原因"),
    },
    {
      fieldCode: "preventCause",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.preventCause").$D("未预防的原因"),
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).reasonAnalyze,
    stateKey: getStateKeyMap(pageCode).reasonAnalyze,
  },
  transport : {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-root-causes`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-root-causes`,
      method: "delete",
    }
  }
});
export const correctMeatureDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "pcaActionDesc",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.measureDesc").$D("措施详述"),
      required: true,
    },
    {
      fieldCode: "pcaActionRemark",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.measureCheck").$D("措施验证"),
      required: true,
    },
    {
      fieldCode: "pcaChangeName",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.chargeName").$D("责任人"),
    },
    {
      fieldCode: "pcaActionEndDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sqam.common.model.8d.finishDate").$D("完成时间"),
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).correctMeature,
    stateKey: getStateKeyMap(pageCode).correctMeature,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-pca-actions`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-pca-actions`,
      method: "delete",
    }
  }
});
export const applyItemDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "applicationItemCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.8d.otherItem").$D("其他项目"),
      lovCode: "SQAM.OTHER_PROJECT",
    },
    {
      fieldCode: "itemDesc",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.itemDesc").$D("项目说明"),
    },
    {
      fieldCode: "handleFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.8d.handleFlag").$D("是否已处理"),
    },
    {
      fieldCode: "itemRemark",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.remark").$D("备注")
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).applyItem,
    stateKey: getStateKeyMap(pageCode).applyItem,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-applicable-items`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-applicable-items`,
      method: "delete",
    }
  },
});
export const standardDS = (problemHeaderId, pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "standardCode",
      fieldType: "SELECT",
      fieldName: $T("sqam.common.model.8d.standard").$D("标准化项"),
      lovCode: "SQAM.PROBLEM_STANDARD_PROJECT",
    },
    {
      fieldCode: "standardActionDesc",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.8d.standardActionDesc").$D("措施详情"),
    },
    {
      fieldCode: "handleFlag",
      fieldType: "SWITCH",
      fieldName: $T("sqam.common.model.8d.handleFlag").$D("是否已处理"),
    },
    {
      fieldCode: "standardRemark",
      fieldType: "INPUT",
      fieldName: $T("sqam.common.model.8d.remark").$D("备注"),
    },
  ].map(preExcuteFields),
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap(pageCode).standard,
    stateKey: getStateKeyMap(pageCode).standard,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-relevant-standards`,
      method: "get",
    },
    destroy: {
      url: `/sqam/v1/${tenantId}/ed-problem-relevant-standards`,
      method: "delete",
    }
  },
});
export const congratulationDS = () => ({
  autoQuery: false,
  fields: [
    {
      fieldCode: "tmcPerformance",
      fieldType: "TEXT_AREA",
      fieldName: $T("sqam.common.model.qualityRectification.teamAccept").$D("团队合作成果认可"),
    }
  ],
});

export const otherInfoDS = (pageCode) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap(pageCode).otherInfo,
  },
  transport: {
    destroy: {
      url: `/sqam/v1/${tenantId}/edproblemheaderdetaillines/delete/lines`,
      method: "post",
    }
  }
});

export const emptyFormDS = () => ({
  autoQuery: false,
  enableQuery: false,
  selection: false,
  fields: [],
});