import { $T } from "srm-mobile-ui";

// 公司选择后，重新选择供应商、库存等数据
function dataSetComponentDidChanged(ds, companyId) {
  // 设置供应商的参数
  const supplierCompanyId = ds.current && ds.current.getField("supplierCompanyId");
  // 已反馈状态下不允许修改供应商
  if (ds.current.data.evalStatus !== "FEEDBACK") {
    supplierCompanyId.setData(null);
    supplierCompanyId.setLovParam({ companyId });
    // supplierCompanyId.options.queryParams.companyId = companyId;
    const supplierName = ds.current && ds.current.getField("supplierName");
    supplierName.setData(null);
    ds.current.setField("supplierTenantId", null);
  }

  // 选择公司后，重置联系人、邮箱、联系方式
  const supplierContactor = ds.current && ds.current.getField("supplierContactor");
  supplierContactor.setData(null);
  const supplierContactMail = ds.current && ds.current.getField("supplierContactMail");
  supplierContactMail.setData(null);
  const supplierContactPhone = ds.current && ds.current.getField("supplierContactPhone");
  supplierContactPhone.setData(null);

  // 业务主体设置null，设置参数
  const ouId = ds.current && ds.current.getField("ouId");
  const ouName = ds.current && ds.current.getField("ouName");
  ouId.setData(null);
  ouName.setData(null);
  ouId.options.queryParams.companyId = companyId;
  // 库存组织
  const invOrganizationId = ds.current && ds.current.getField("invOrganizationId");
  const organizationName = ds.current && ds.current.getField("organizationName");
  invOrganizationId.setData(null);
  organizationName.setData(null);
  // 库房
  const inventoryId = ds.current && ds.current.getField("inventoryId");
  const inventoryName = ds.current && ds.current.getField("inventoryName");
  inventoryId.setData(null);
  inventoryName.setData(null);
}

// 选择业务实体后，更新库存组织、库房的参数
function businessEntityDidChanged(ds, ouId) {
  // 库存组织
  const invOrganizationId = ds.current && ds.current.getField("invOrganizationId");
  const organizationName = ds.current && ds.current.getField("organizationName");
  invOrganizationId.setData(null);
  organizationName.setData(null);
  invOrganizationId.options.queryParams.ouId = ouId;
  // 库房
  const inventoryId = ds.current && ds.current.getField("inventoryId");
  const inventoryName = ds.current && ds.current.getField("inventoryName");
  inventoryId.setData(null);
  inventoryName.setData(null);
}

// 库存组织变更后，修改库房的参数
function inventoryOrgDidChanged(ds, invOrganizationId) {
  // 库房
  const inventoryId = ds.current && ds.current.getField("inventoryId");
  const inventoryName = ds.current && ds.current.getField("inventoryName");
  inventoryId.setData(null);
  inventoryName.setData(null);
  inventoryId.options.queryParams.organizationId = invOrganizationId;
}

// 供应商变更后，修改供应商联系人信息
function supplierCompanyIdDidChanged(ds, supplier) {
  const { dataType } = supplier;
  ds.current.setField("supplierSource", dataType);

  // 供应商id
  const supplierCompanyId = ds.current && ds.current.getField("supplierCompanyId");
  supplierCompanyId.setData(supplier.dataId);
  const supplierId = ds.current && ds.current.getField("supplierId");
  supplierId.setData(supplier.dataId);
  // 供应商名称
  const supplierName = ds.current && ds.current.getField("supplierName");
  supplierName.setData(supplier.displaySupplierName);

  // 供应商租户ID
  ds.current.setField("supplierTenantId", supplier.supplierTenantId);
  // 本地供应商信息
  ds.current.setField("supplierLov", supplier.unionKey);
  // 联系人
  const supplierContactor = ds.current && ds.current.getField("supplierContactor");
  supplierContactor.setData(supplier.name);
  // 供应商联系邮箱
  const supplierContactMail = ds.current && ds.current.getField("supplierContactMail");
  supplierContactMail.setData(supplier.mail);
  // 供应商联系电话
  const supplierContactPhone = ds.current && ds.current.getField("supplierContactPhone");
  supplierContactPhone.setData(supplier.mobilephone);
  // 供应商注册地址
  const supplierRegisteredAddress = ds.current && ds.current.getField("supplierRegisteredAddress");
  supplierRegisteredAddress.setData((supplier.countryName ? supplier.countryName : "") + (supplier.addressDetail ? supplier.addressDetail : ""));
  // 供应商联系电话
  const internationalTelCode = ds.current && ds.current.getField("internationalTelCode");
  internationalTelCode.setData(supplier.internationalTelCode);
}

// manage时编辑basic状态
function isManageEditable(item, useType, readOnly = false) {
  // 新建单据时，始终可编辑
  if (useType === "NEW") {
    return true;
  }
  // 填制单据时，始终不可以编辑
  if (useType === "FILLED") {
    return false;
  }
  // 管理单据时，仅新建和已反馈状态可编辑
  return !readOnly && item.evalStatus === "NEW" || item.evalStatus === "FEEDBACK";
}

// 考察结果编辑状态
function isInspectResultsEditable(item, useType) {
  // 新建单据和填制单据，没有考察结果
  if (useType === "NEW" || useType === "FILLED") {
    return false;
  }
  // 是否需要供应商反馈
  let needFeedbackFlag = Number(item.needFeedbackFlag);
  // 考察结果tab是否可见
  let isVisible = [ "FINAL_COLLECTED", "APPROVALING", "APPROVED", "REJECTED" ].includes(item.evalStatus) || item.evalType !== "ONLINE";
  if (!isVisible) { // 不可见则不允许编辑，防止不可见时触发强制校验
    return false;
  }
  // 已反馈状态时，并且需要供应商反馈时，线下打分可以编辑
  // eslint-disable-next-line no-extra-parens
  return [ "NEW", "FINAL_COLLECTED", "REJECTED" ].includes(item.evalStatus) || (item.evalType === "OFFLINE" && item.evalStatus === "FEEDBACK" && needFeedbackFlag);
}

// useType: 1，新建(NEW)，2、填制(FILLED)，3、管理(MANAGE)
function reportBasicDS(basicInfo, useType, readOnly = false) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    fields: [
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.code").$D("考察报告编码"),
        fieldType: "TEXT",
        fieldCode: "evalNum",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
        fieldType: "INPUT",
        fieldCode: "evalDescription",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("smbl.common.message.status").$D("状态"),
        fieldType: "TEXT",
        fieldCode: "evalStatusMeaning",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "realName",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.createDepartment").$D("创建人部门"),
        fieldType: "LOV",
        lovCode: "SPRM.USER_DEPARTMENT",
        fieldCode: "unitId",
        displayField: "unitName",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        disabled: useType === "NEW", // 新建时不允许选择创建人部门
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.businessEntity").$D("业务实体"),
        fieldType: "LOV",
        lovCode: "HPFM.OU",
        fieldCode: "ouId",
        displayField: "ouName",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        disabled: (val, item) => !item.companyId,
        options: {
          queryParams: {
            companyId: basicInfo.companyId,
          },
          onClear: (ds) => {
            // 设置库存、库房参数和数据
            businessEntityDidChanged(ds, null);
          },
          callback: (val, fieldCode, display, ds) => {
            // 设置库存、库房参数和数据
            let ouId = null;
            if (val.length) {
              ouId = val[0].ouId;
            }
            businessEntityDidChanged(ds, ouId);
          },
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.inventoryOrg").$D("库存组织"),
        fieldType: "LOV",
        lovCode: "HPFM.INV_ORG",
        fieldCode: "invOrganizationId",
        displayField: "organizationName",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        disabled: (val, item) => !item.ouId,
        options: {
          queryParams: {
            ouId: basicInfo.ouId,
          },
          onClear: (ds) => {
            // 设置库房参数和数据
            inventoryOrgDidChanged(ds, null);
          },
          callback: (val, fieldCode, display, ds) => {
            // 设置库房参数和数据
            let invOrganizationId = null;
            if (val.length) {
              invOrganizationId = val[0].organizationId;
            }
            inventoryOrgDidChanged(ds, invOrganizationId);
          },
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.warehouse").$D("库房"),
        fieldType: "LOV",
        lovCode: "SODR.INVENTORY",
        fieldCode: "inventoryId",
        displayField: "inventoryName",
        disabled: (val, item) => !item.invOrganizationId,
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        options: {
          queryParams: {
            organizationId: basicInfo.invOrganizationId,
          }
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
        fieldType: "LOV",
        lovCode: "SPCM.USER_AUTH.COMPANY",
        fieldCode: "companyId",
        displayField: "companyName",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        options: {
          subDisplayField: "companyNum",
          onClear: (ds) => {
            dataSetComponentDidChanged(ds, null);
            // 如果是新建，切换公司后重新选择考察模板
            if (useType === "NEW") {
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              evalTplId.setLovParam({ });
              ds.current.setField("evalTplId", null);
              ds.current.setField("evalTplName", null);
            }
          },
          callback: (val, fieldCode, display, ds) => {
            let companyId = null;
            if (val.length) {
              companyId = val[0].companyId;
            }
            dataSetComponentDidChanged(ds, companyId);
            // 如果是新建，切换公司后重新选择考察模板
            if (useType === "NEW") {
              const evalTplId = ds.current && ds.current.getField("evalTplId");
              evalTplId.setLovParam({ companyId, });
              ds.current.setField("evalTplId", null);
              ds.current.setField("evalTplName", null);
            }
          },
        }
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
        fieldType: "SELECT",
        fieldCode: "evalType",
        displayField: "evalTypeMeaning",
        editor: (val, item) => {
          if (useType === "NEW") {
            return true;
          }
          if (useType === "FILLED") {
            return false;
          }
          return !readOnly && Number(item.externalFlag) && item.evalStatus === "NEW";
        },
        required: (val, item) => {
          if (useType === "NEW") {
            return true;
          }
          if (useType === "FILLED") {
            return false;
          }
          return !readOnly && Number(item.externalFlag) && item.evalStatus === "NEW";
        },
        lovCode: "SSLM.SITE_EVAL_TYPE",
        options: {
          onClear: (ds) => {
            ds.current.setField("evalTplId", null);
            ds.current.setField("evalTplName", null);
          },
          callback: (val, fieldCode, display, ds) => {
            ds.current.setField("evalTplId", null);
            ds.current.setField("evalTplName", null);
          }
        }
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板"),
        fieldType: "LOV",
        fieldCode: "evalTplId",
        displayField: "evalTplName",
        editor: (val, item) => {
          if (useType === "NEW") {
            return true;
          }
          if (useType === "FILLED") {
            return false;
          }
          return !readOnly && Number(item.externalFlag) && item.evalStatus === "NEW";
        },
        required: (val, item) => {
          if (useType === "NEW") {
            return item.evalType === "ONLINE";
          }
          if (!readOnly && Number(item.externalFlag) && item.evalStatus === "NEW" && useType === "MANAGE") {
            return item.evalType === "ONLINE";
          }
          return false;
        },
        disabled: (val, item) => item.evalType !== "ONLINE",
        lovCode: "SSLM.SITE_EVAL_TPL",
        options: {
          displayField: "evalTplName",
          subDisplayField: "evalTplCode",
          onClear: (ds) => {
            let weightedFlag = ds.current.getField("weightedFlag");
            weightedFlag.setData(null);
            let weightedFlagMeaning = ds.current.getField("weightedFlagMeaning");
            weightedFlagMeaning.setData(null);
            // const supplierCompanyId = ds.current && ds.current.getField("supplierCompanyId");
            // supplierCompanyId.setLovParam({ ...companyId });
            // supplierCompanyId.options.queryParams.evalTplId = null;
          },
          callback: (val, fieldCode, display, ds) => {
            if (val && val.length) {
              let weightedFlag = ds.current.getField("weightedFlag");
              weightedFlag.setData(val[0].weightedFlag ? "1" : "0");
              let weightedFlagMeaning = ds.current.getField("weightedFlagMeaning");
              weightedFlagMeaning.setData(val[0].weightedFlag ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"));
              // const supplierCompanyId = ds.current && ds.current.getField("supplierCompanyId");
              // supplierCompanyId.setLovParam({ ...companyId });
              // supplierCompanyId.options.queryParams.evalTplId = val[0].evalTplId;
            }
          }
        }
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.weightCalculation").$D("权重式计算"),
        fieldType: "SELECT",
        fieldCode: "weightedFlag",
        displayField: "weightedFlagMeaning",
        editor: false,
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [ {
            meaning: $T("smbl.common.view.yes").$D("是"),
            value: "1",
          }, {
            meaning: $T("smbl.common.view.no").$D("否"),
            value: "0",
          }, ],
        }
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.surveyTimeFrom").$D("考察时间从"),
        fieldType: "DATE",
        fieldCode: "evalDateFrom",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.surveyTimeTo").$D("考察时间至"),
        fieldType: "DATE",
        fieldCode: "evalDateTo",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
        fieldType: "LOV",
        fieldCode: "supplierCompanyId",
        displayField: "supplierName",
        lovCode: "SSLM.SITE_SUPPLIER",
        editor: (val, item) => {
          if (useType === "NEW") {
            return true;
          }
          if (useType === "FILLED") {
            return false;
          }
          return !readOnly && item.evalStatus === "NEW";
        },
        required: (val, item) => {
          if (useType === "NEW") {
            return true;
          }
          if (useType === "FILLED") {
            return false;
          }
          return !readOnly && item.evalStatus === "NEW";
        },
        options: {
          valueField: "dataId",
          displayField: "supplierCompanyName",
          subDisplayField: "supplierName",
          queryParams: {
            companyId: basicInfo.companyId,
            // evalTplId: basicInfo.evalTplId,
          },
          onClear: (ds) => {
            // 供应商修改后，供应商对应的联系人信息及供应商地址自动填充
            supplierCompanyIdDidChanged(ds, {});
          },
          callback: (val, fieldCode, display, ds) => {
            // 供应商修改后，供应商对应的联系人信息及供应商地址自动填充
            let supplier = {};
            if (val.length) {
              supplier = val[0];
            }
            supplierCompanyIdDidChanged(ds, supplier);
          },
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierContact").$D("供应商联系人"),
        fieldType: "INPUT",
        fieldCode: "supplierContactor",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierContactMail").$D("供应商联系邮箱"),
        fieldType: "INPUT",
        fieldCode: "supplierContactMail",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierContactPhone").$D("供应商联系电话"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "supplierContactPhone",
        // editor: (val, item) => isManageEditable(item, useType),
        disabled: (val, item) => !isManageEditable(item, useType),
        prefixField:{
          lovCode:"HPFM.IDD",
          defaultValue:{ value: "+86", meaning:$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
          // displayField:"internationalTelCodeMeaning",
          fieldCode:"internationalTelCode",
          fieldType: "SELECT"
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.needSupplierFeedback").$D("需要供应商反馈信息"),
        fieldType: "SELECT",
        fieldCode: "needFeedbackFlag",
        displayField: "needFeedbackFlagMeaning",
        editor: (val, item) => {
          const needFeedbackDisabled = item.evalStatus !== "FEEDBACK" && isManageEditable(item, useType);
          const supplierSourceFlag = item.supplierSource ? item.supplierSource !== "local" : true;
          return !readOnly && needFeedbackDisabled && supplierSourceFlag;
        },
        clearButton: false,
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [ {
            meaning: $T("smbl.common.view.yes").$D("是"),
            value: "1",
          }, {
            meaning: $T("smbl.common.view.no").$D("否"),
            value: "0",
          }, ],
          onClear: (ds) => {
            // 最终考察结果发布至供应商
            const callSuppliersFlag = ds.current && ds.current.getField("callSuppliersFlag");
            callSuppliersFlag.setData("0");
            const callSuppliersFlagMeaning = ds.current && ds.current.getField("callSuppliersFlagMeaning");
            callSuppliersFlagMeaning.setData($T("smbl.common.view.no").$D("否"));
          },
          callback: (val, fieldCode, display, ds) => {
            let data = val[0];
            const callSuppliersFlag = ds.current && ds.current.getField("callSuppliersFlag");
            callSuppliersFlag.setData(data.value);
            const callSuppliersFlagMeaning = ds.current && ds.current.getField("callSuppliersFlagMeaning");
            callSuppliersFlagMeaning.setData(data.meaning);
          }
        }
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.releasedToSupplier").$D("最终考察结果发布至供应商"),
        fieldType: "SELECT",
        fieldCode: "callSuppliersFlag",
        displayField: "callSuppliersFlagMeaning",
        editor: (val, item) => {
          const supplierSourceFlag = item.supplierSource ? item.supplierSource !== "local" : true;
          if (useType === "NEW") {
            return supplierSourceFlag;
          }
          if (useType === "MANAGE") {
            return !readOnly && [ "NEW", "APPROVED", "FEEDBACK" ].includes(item.evalStatus) && supplierSourceFlag;
          }
          return false;
        },
        clearButton: false,
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [ {
            meaning: $T("smbl.common.view.yes").$D("是"),
            value: "1",
          }, {
            meaning: $T("smbl.common.view.no").$D("否"),
            value: "0",
          }, ],
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierType").$D("供应商类型"),
        fieldType: "SELECT",
        fieldCode: "supplierType",
        displayField: "supplierTypeMeaning",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        lovCode: "SSLM.SUPPLIER_TYPE",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.investigationType").$D("考察类型"),
        fieldType: "SELECT",
        fieldCode: "investigationType",
        displayField: "investigationTypeMeaning",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        lovCode: "SSLM.INVESTIGATION_TYPE",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierProfile").$D("供应商概况"),
        fieldType: "TEXT_AREA",
        fieldCode: "supplierOverview",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierRegistAddress").$D("供应商注册地址"),
        fieldType: "TEXT_AREA",
        fieldCode: "supplierRegisteredAddress",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        disabled: true,
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.actualSurveyAddress").$D("实际考察地址"),
        fieldType: "TEXT_AREA",
        fieldCode: "evalAddress",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.inspectionInstruct").$D("考察说明"),
        fieldType: "TEXT_AREA",
        fieldCode: "evalRemark",
        editor: (val, item) => isManageEditable(item, useType, readOnly),
        required: (val, item) => isManageEditable(item, useType, readOnly),
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.backRemark").$D("反馈说明"),
        fieldType: "TEXT_AREA",
        fieldCode: "backRemark",
        editor: false, // 反馈说明，不允许编辑
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.finalScore").$D("最终得分"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "finalScore",
        editor: (val, item) => !readOnly && isInspectResultsEditable(item, useType) && item.evalType === "OFFLINE",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.grade").$D("等级"),
        fieldType: "INPUT",
        fieldCode: "grade",
        editor: (val, item) => !readOnly && isInspectResultsEditable(item, useType) && item.evalType === "OFFLINE",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.results").$D("考察结果"),
        fieldType: "SELECT",
        fieldCode: "resultsFlag",
        displayField: "resultsFlagMeaning",
        lovCode: "SSLM.INVESTIGATION.RESULTS",
        editor: (val, item) => !readOnly && isInspectResultsEditable(item, useType),
        required: (val, item) => {
          // 如果不可编辑（不显示时也不可编辑），不必校验。此处因为各级判断互相冲突增加；
          if (!isInspectResultsEditable(item, useType)) {
            return false;
          }
          let needFeedbackFlag = Number(item.needFeedbackFlag);
          return !readOnly && (!(item.evalType === "OFFLINE" && needFeedbackFlag && item.evalStatus === "NEW") ||
          // eslint-disable-next-line no-extra-parens
          (item.evalType === "OFFLINE" && needFeedbackFlag && item.evalStatus === "FEEDBACK"));
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.compositeOpinion").$D("综合意见"),
        fieldType: "INPUT",
        fieldCode: "opinion",
        editor: (val, item) => !readOnly && isInspectResultsEditable(item, useType),
        required: (val, item) => {
          // 如果不可编辑（不显示时也不可编辑），不必校验。此处因为各级判断互相冲突增加；
          if (!isInspectResultsEditable(item, useType)) {
            return false;
          }
          let needFeedbackFlag = Number(item.needFeedbackFlag);
          return !readOnly && (!(item.evalType === "OFFLINE" && needFeedbackFlag && item.evalStatus === "NEW") ||
          // eslint-disable-next-line no-extra-parens
          (item.evalType === "OFFLINE" && needFeedbackFlag && item.evalStatus === "FEEDBACK"));
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.view.message.cc").$D("抄送人"),
        fieldType: "LOV",
        fieldCode: "informUserIds",
        displayField: "informUserNames",
        lovCode: "SPUC.ACCEPT_USER",
        editor: (val, item) => !readOnly && isInspectResultsEditable(item, useType),
        options: {
          multiple: true,
        },
      }, {
        fieldName: $T("sslm.siteInvestigateReport.model.mange.resultAttachment").$D("评审结果附件"),
        fieldType: "UPLOAD",
        fieldCode: "resultLinkUuid",
        // editor: (val, item) => isInspectResultsEditable(item, useType),
        disabled: (val, item) => !isInspectResultsEditable(item, useType),
        showCount: true,
      },
    ],
  };
}

export {
  reportBasicDS,
};