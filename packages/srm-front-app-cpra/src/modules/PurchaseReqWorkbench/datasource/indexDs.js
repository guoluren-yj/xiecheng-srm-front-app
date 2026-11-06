import { $T, SrmUtil } from "srm-mobile-ui";
import { purchaseRequestsApi } from "../api/config";
function indexDs(type) {
  const readUrlMap = {
    awaitSubmit: "/sprm/v1/{tenantId}/purchase-requests/workbench-await-submit",
    approving: "/sprm/v1/{tenantId}/purchase-requests/workbench-approving",
    approved: "/sprm/v1/{tenantId}/purchase-requests/workbench-approved",
    all: "/sprm/v1/{tenantId}/purchase-requests/workbench-all",
  };

  const customizeCode = {
    awaitSubmit: "SPRM.PURCHASE_PLAFORM_ALLBYWHOLE.APP.SEARCHBAR,SPRM.PURCHASE_PLAFORM_BEFORESUBMIT.LIST",
    approving: "SPRM.PURCHASE_PLAFORM_ALLBYWHOLE.APP.SEARCHBAR,SPRM.PURCHASE_PLAFORM_UNDERAPPROVAL.LIST",
    approved: "SPRM.PURCHASE_PLAFORM_ALLBYWHOLE.APP.SEARCHBAR,SPRM.PURCHASE_PLAFORM_APPROVED.LIST",
    all: "SPRM.PURCHASE_PLAFORM_ALLBYWHOLE.APP.SEARCHBAR,SPRM.PURCHASE_PLAFORM_ALLBYWHOLE.LIST",
  };

  const listData = {
    awaitSubmit: [
      {
        meaning: $T("sprm.common.model.common.new").$D("新建"),
        value: "PENDING",
      },
      {
        meaning: $T("sprm.common.model.common.back").$D("退回"),
        value: "SEND_BACK",
      },
      {
        meaning: $T("sprm.common.model.common.rejected").$D("审批拒绝"),
        value: "REJECTED",
      },
    ],
    approving: [
      {
        meaning: $T("sprm.common.model.common.submitted").$D("已提交"),
        value: "SUBMITTED",
      },
      {
        meaning: $T("sprm.common.model.common.work_approval").$D("工作流审批中"),
        value: "WORKFLOW_APPROVAL",
      },
    ],
    approved: [
      {
        meaning: $T("sprm.common.model.common.approved").$D("已审批"),
        value: "APPROVED",
      },
      {
        meaning: $T("sprm.common.model.common.rejected").$D("审批拒绝"),
        value: "REJECTED",
      },
    ],
    all: [
      {
        meaning: $T("sprm.common.model.common.new").$D("新建"),
        value: "PENDING",
      },
      {
        meaning: $T("sprm.common.model.common.submit_sync").$D("提交同步"),
        value: "SUBMIT_SYNC",
      },
      {
        meaning: $T("sprm.common.model.common.submitted").$D("已提交"),
        value: "SUBMITTED",
      },
      {
        meaning: $T("sprm.common.model.common.approved").$D("已审批"),
        value: "APPROVED",
      },
      {
        meaning: $T("sprm.common.model.common.rejected").$D("审批拒绝"),
        value: "REJECTED",
      },
      {
        meaning: $T("sprm.common.model.common.excuted").$D("已执行"),
        value: "EXCUTED",
      },
      {
        meaning: $T("sprm.common.model.common.work_approval").$D("工作流审批中"),
        value: "WORKFLOW_APPROVAL",
      },
      {
        meaning: $T("sprm.common.model.common.back").$D("退回"),
        value: "SEND_BACK",
      },
    ]
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    queryParameter: {
      customizeUnitCode: customizeCode[type],
      customizeFilterComparison: "prStatusCode:IN,purchaseAgentId:IN,companyId:IN,ouId:IN,purchaseOrgId:IN,prRequestedName:IN,unitId:IN,creationDate:~,prSourcePlatform:=",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiSelectHeaderNums",
      fieldType: "TEXT",
      fieldName: $T("sprm.purchasePlatform.model.common.displayPrNum").$D("采购申请编号"),
    },
    queryFields: [
      {
        fieldCode: "companyId_range",
        fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
        fieldType: "LOV",
        lovCode: "SPRM.COMPANY",
        options: {
          multiple: true,
          subDisplayField: "companyNum",
          displayField: "companyName",
          valueField: "companyId",
        }
      },
      {
        fieldCode: "ouId_range",
        fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
        fieldType: "LOV",
        lovCode: "SPRM.OU",
        options: {
          multiple: true,
          subDisplayField: "ouCode",
          displayField: "ouName",
          valueField: "ouId",
          queryParams: {
            enabledFlag: 1
          },
        }
      },
      {
        fieldCode: "purchaseOrgId_range",
        fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        fieldType: "LOV",
        lovCode: "HPFM.PURCHASE_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
          displayField: "organizationName",
          valueField: "purchaseOrgId",
        }
      },
      {
        fieldCode: "purchaseAgentId_range",
        fieldName: $T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        fieldType: "LOV",
        lovCode: "SPRM.PURCHASE_AGENT",
        options: {
          multiple: true,
          subDisplayField: "purchaseAgentCode",
          displayField: "purchaseAgentName",
          valueField: "purchaseAgentId",
        }
      },
      {
        fieldCode: "prRequestedName_range",
        fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
      },
      {
        fieldCode: "unitId_range",
        fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
        fieldType: "LOV",
        lovCode: "SPRM.USER_DEPARTMENT",
        options: {
          multiple: true,
          subDisplayField: "unitCode",
          displayField: "unitName",
          valueField: "unitId",
        }
      },
      {
        fieldCode: "creationDateForm",
        endDateFieldCode: "creationDateTo",
        fieldType: "DATE_PICKER",
        fieldName: $T("sprm.common.model.common.creationDates").$D("创建日期"),
        selectType: "start-end",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "prStatusCode_range",
        fieldName: $T("sprm.common.model.common.prStatusCode").$D("状态"),
        fieldType: "SELECT",
        options: {
          multiple: true,
          displayField: "meaning",
          valueField: "value",
          listData: listData[type],
        },
      },
      {
        fieldCode: "prSourcePlatform",
        fieldName: $T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        fieldType: "SELECT",
        lovCode: "SPRM.SRC_PLATFORM",
      },
    ],
    events: {
      beforeQuery: (ds, params) => {
        params["creationDate_range"] = [];
        if (params.creationDateForm) {
          params["creationDate_range"].push(params.creationDateForm);
        }
        if (params.creationDateTo) {
          params["creationDate_range"].push(params.creationDateTo);
        }
        params["creationDate_range"] = params["creationDate_range"].length ? params["creationDate_range"].join(",") : null;
      },
    },
    transport: {
      read: {
        url: readUrlMap[type],
        method: "get",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      // 整单加急
      update: {
        url: "sprm/v1/{tenantId}/purchase-requests/prHeader/urgent",
        method: "post",
      },
      // 提交
      submit: {
        url: "sprm/v1/{tenantId}/purchase-requests/submit",
        method: "post",
      },
    },
  };
}

function commonDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "displayPrNum",
        fieldName: $T("sprm.common.model.common.displayPrNum").$D("采购申请编号"),
      },
      {
        fieldCode: "title",
        fieldName: $T("sprm.common.model.common.title").$D("标题"),
        fieldType: "INPUT",
        maxLength: 120,
      },
      {
        fieldCode: "createByName",
        fieldName: $T("sprm.common.model.common.createByName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("sprm.common.model.common.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "prTypeName",
        fieldName: $T("sprm.common.model.common.prTypeName").$D("申请类型"),
        fieldType: "LOV",
        lovCode: "SPUC.PR_DEMAND_TYPE",
        options: {
          displayField: "prTypeName",
          subDisplayField: "prTypeCode",
          valueField: "prTypeName",
          queryParams: {
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("prTypeId", val[0].prTypeId);
              ds.current.setField("prTypeName", val[0].prTypeName);
              ds.current.setField("prTypeCode", val[0].prTypeCode);
              ds.current.setField("prTypeLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("prTypeId", null);
            ds.current.setField("prTypeName", null);
            ds.current.setField("prTypeCode", null);
            ds.current.setField("prTypeLov", null);
          }
        },
        disabled: (val, item) => item.prSourcePlatform === "SHOP",
      },
      {
        fieldCode: "originalCurrency",
        fieldName: $T("sprm.common.model.common.originalCurrency").$D("原币币种"),
        fieldType: "LOV",
        lovCode: "SMDM.CURRENCY",
        required: (val, item) => item.prSourcePlatform !== "ERP",
      },
      {
        fieldCode: "amount",
        fieldName: $T("sprm.common.model.common.amount").$D("申请总额"),
        render: (val, item) => {
          let length;
          if (item.headerPriceHiddenFlag === 1) {
            return item.amountMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      },
      {
        fieldCode: "localCurrency",
        fieldName: $T("sprm.common.model.common.newCurrencyCode").$D("本币币种"),
      },
      {
        fieldCode: "localCurrencyTaxSum",
        fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D("本币金额(含税)"),
        fieldType: "TEXT",
        render: (val, item) => {
          let length;
          if (item.headerPriceHiddenFlag === 1) {
            return item.localCurrencyTaxSumMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      },
      {
        fieldCode: "prRequestedName",
        displayField: "prRequestedNumAndName",
        fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
        fieldType: "LOV",
        lovCode: "SPCM.ACCEPT_USER",
        options: {
          displayField: "userName",
          subDisplayField: "loginName",
          valueField: "userName",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("prRequestedName", val[0].userName);
              ds.current.setField("prRequestedNum", val[0].loginName);
              ds.current.setField("prRequestedNumAndName", `${val[0].loginName}-${val[0].userName}`);
              ds.current.setField("userName", `${val[0].loginName}-${val[0].userName}`);
              ds.current.setField("requestedBy", val[0].userId);
              ds.current.setField("requestedByLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("prRequestedName", null);
            ds.current.setField("prRequestedNum", null);
            ds.current.setField("prRequestedNumAndName", null);
            ds.current.setField("userName", null);
            ds.current.setField("requestedBy", null);
            ds.current.setField("requestedByLov", null);
          }
        },
      },
      {
        fieldCode: "requestDate",
        fieldName: $T("sprm.common.model.common.requestDate").$D("申请日期"),
        fieldType: "DATE",
      },
      {
        fieldCode: "unitName",
        fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
        fieldType: "LOV",
        lovCode: "SPRM.USER_UNIT",
        options: {
          displayField: "unitName",
          subDisplayField: "unitCode",
          valueField: "unitName",
          queryParams: {
            companyId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("unitName", val[0].unitName);
              ds.current.setField("unitId", val[0].unitId);
              ds.current.setField("unitLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("unitName", null);
            ds.current.setField("unitId", null);
            ds.current.setField("unitLov", null);
          }
        },
      },
      {
        fieldCode: "remark",
        fieldName: $T("sprm.common.model.common.reqDesc").$D("申请说明"),
        fieldType: "TEXT_AREA",
        maxLength: 480,
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          displayField: "companyName",
          subDisplayField: "companyNum",
          valueField: "companyName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("companyName", val[0].companyName);
              ds.current.setField("companyId", val[0].companyId);
              ds.current.setField("companyLov", val[0]);
              ds.current.getField("unitName").options.queryParams["companyId"] = val[0].companyId;
              ds.current.getField("ouName").options.queryParams["companyId"] = val[0].companyId;
              if (ds.current.getField("invoiceMethodName")?.options) {
                ds.current.getField("invoiceMethodName").options.queryParams["companyId"] = val[0].companyId;
              }
              if (ds.current.getField("invoiceTypeName")?.options) {
                ds.current.getField("invoiceTypeName").options.queryParams["companyId"] = val[0].companyId;
              }
              if (ds.current.getField("invoiceTitleTypeName")?.options) {
                ds.current.getField("invoiceTitleTypeName").options.queryParams["companyId"] = val[0].companyId;
              }
              if (ds.current.getField("invoiceDetailTypeName")?.options) {
                ds.current.getField("invoiceDetailTypeName").options.queryParams["companyId"] = val[0].companyId;
              }
              if (val[0].ouId) {
                purchaseRequestsApi({
                  companyId: val[0].companyId,
                }).then((res) => {
                  if (res.ouId) {
                    ds.current.setField("ouName", res.ouName);
                    ds.current.setField("ouId", res.ouId);
                    ds.current.getField("purchaseOrgName").options.queryParams["ouId"] = res.ouId;
                  }
                  if (res.purchaseOrgId) {
                    ds.current.setField("purchaseOrgName", res.purchaseOrgName);
                    ds.current.setField("purchaseOrgId", res.purchaseOrgId);
                    ds.current.getField("purchaseAgentName").options.queryParams["purchaseOrgId"] = res.purchaseOrgId;
                  }
                });
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("companyName", null);
            ds.current.setField("companyId", null);
            ds.current.setField("companyLov", null);
            ds.current.getField("unitName").options.queryParams["companyId"] = null;
            ds.current.getField("ouName").options.queryParams["companyId"] = null;
            ds.current.setField("ouName", null);
            ds.current.setField("ouId", null);
            ds.current.setField("ouLov", null);
            ds.current.getField("organizationName").options.queryParams["ouId"] = null;
            ds.current.setField("organizationName", null);
            ds.current.setField("purchaseOrgName", null);
            ds.current.setField("purchaseOrgId", null);
            ds.current.setField("purchaseOrgLov", null);
            ds.current.getField("purchaseAgentName").options.queryParams["purchaseOrgId"] = null;
            ds.current.getField("invoiceMethodName").options.queryParams["companyId"] = null;
            ds.current.getField("invoiceTypeName").options.queryParams["companyId"] = null;
            ds.current.getField("invoiceTitleTypeName").options.queryParams["companyId"] = null;
            ds.current.getField("invoiceDetailTypeName").options.queryParams["companyId"] = null;
          }
        },
        disabled: (val, item) => item.prSourcePlatform && item.prSourcePlatform !== "SRM",
        required: (val, item) => item.prSourcePlatform !== "ERP",
      },
      {
        fieldCode: "ouName",
        fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
        fieldType: "LOV",
        disabled: (val, item) =>
          !item["companyName"] ||
          Boolean(item["prSourcePlatform"] && item["prSourcePlatform"] !== "SRM") ||
          Boolean(item["prHeaderId"]),
        lovCode: "SPFM.USER_AUTH.OU",
        options: {
          displayField: "ouName",
          subDisplayField: "ouCode",
          valueField: "ouName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            companyId: null,
            enabledFlag: 1
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("ouName", val[0].ouName);
              ds.current.setField("ouId", val[0].ouId);
              ds.current.setField("ouLov", val[0]);
              ds.current.getField("purchaseOrgName").options.queryParams["ouId"] = val[0].ouId;
            }
          },
          onClear: (ds) => {
            ds.current.setField("ouName", null);
            ds.current.setField("ouId", null);
            ds.current.setField("ouLov", null);
            ds.current.getField("purchaseOrgName").options.queryParams["ouId"] = null;
            ds.current.setField("purchaseOrgName", null);
            ds.current.setField("purchaseOrgId", null);
            ds.current.setField("purchaseOrgLov", null);
            ds.current.getField("purchaseAgentName").options.queryParams["purchaseOrgId"] = null;
          }
        },
        required: (val, item) => item.prSourcePlatform !== "ERP",
      },
      {
        fieldCode: "purchaseOrgName",
        fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        fieldType: "LOV",
        disabled: (val, item) => !item.ouName || !item.companyName,
        lovCode: "HPFM.PURCHASE_ORGANIZATION",
        options: {
          displayField: "organizationName",
          subDisplayField: "organizationCode",
          valueField: "organizationName",
          queryParams: {
            ouId: null
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("purchaseOrgName", val[0].organizationName);
              ds.current.setField("purchaseOrgId", val[0].purchaseOrgId);
              ds.current.setField("purchaseOrgLov", val[0]);
              ds.current.getField("purchaseAgentName").options.queryParams["purchaseOrgId"] = val[0].purchaseOrgId;
              ds.current.setField("purchaseAgentName", null);
              ds.current.setField("purchaseAgentId", null);
              ds.current.setField("purchaseAgentLov", null);
            }
          },
          onClear: (ds) => {
            ds.current.setField("purchaseOrgName", null);
            ds.current.setField("purchaseOrgId", null);
            ds.current.setField("purchaseOrgLov", null);
            ds.current.getField("purchaseAgentName").options.queryParams["purchaseOrgId"] = null;
          }
        },
        required: (val, item) => item.prSourcePlatform !== "ERP",
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: $T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        fieldType: "LOV",
        lovCode: "SPUC.PURCHASE_AGENT",
        options: {
          displayField: "purchaseAgentName",
          subDisplayField: "purchaseAgentCode",
          valueField: "purchaseAgentName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            purchaseOrgIds: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("purchaseAgentName", val[0].purchaseAgentName);
              ds.current.setField("purchaseAgentId", val[0].purchaseAgentId);
              ds.current.setField("purchaseAgentLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("purchaseAgentName", null);
            ds.current.setField("purchaseAgentId", null);
            ds.current.setField("purchaseAgentLov", null);
          }
        },
        required: (val, item) => item.prSourcePlatform !== "ERP",
      },
      // 收货收单信息
      {
        fieldCode: "receiverContactName",
        fieldName: $T("sprm.common.model.common.receiverContactName").$D("收货联系人"),
      },
      {
        fieldCode: "receiverTelNum",
        fieldName: $T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
      },
      {
        fieldCode: "receiverAddressName",
        fieldName: $T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
      },
      {
        fieldCode: "invoiceAddressName",
        fieldName: $T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
        fieldType: "LOV",
        lovCode: "SMAL.INVOICE_ADDRESS_LIST",
        required: (val, item) => item.prSourcePlatform === "E-COMMERCE",
        options: {
          displayField: "areaAddress",
          valueField: "areaAddress",
          queryParams: {
            addressType: "INVOICE",
            companyId: null,
            enabledFlag: 1,
            belongType: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("invoiceAddressId", val[0].addressId);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invoiceAddressId", null);
          }
        },
      },
      {
        fieldCode: "invoiceContactName",
        fieldName: $T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
      },
      {
        fieldCode: "invoiceTelNum",
        fieldName: $T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
      },
      {
        fieldCode: "receiverEmailAddress",
        fieldName: $T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
      },
      {
        fieldCode: "purchaseUnitName",
        fieldName: $T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
      },
      // 开票信息
      {
        fieldCode: "invoiceTitle",
        fieldName: $T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
      },
      {
        fieldCode: "taxRegisterNum",
        fieldName: $T("sprm.common.model.common.taxRegisterNum").$D("税务登记号"),
      },
      {
        fieldCode: "taxRegisterAddress",
        fieldName: $T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
      },
      {
        fieldCode: "taxRegisterTel",
        fieldName: $T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
      },
      {
        fieldCode: "taxRegisterBank",
        fieldName: $T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
      },
      {
        fieldCode: "taxRegisterBankAccount",
        fieldName: $T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
      },
      {
        fieldCode: "invoiceMethodName",
        displayField: "invoiceMethodName",
        fieldName: $T("sprm.common.model.common.invoiceMethodCode").$D("开票方式"),
        fieldType: "SELECT",
        required: (val, item) => item.prSourcePlatform === "E-COMMERCE",
        options: {
          displayField: "valueName",
          valueField: "valueName",
          name: "invoiceMethodName",
          key: "invoiceMethodName",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("invoiceMethodCode", val[0].valueCode);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invoiceMethodCode", null);
          }
        },
      },
      {
        fieldCode: "invoiceTypeName",
        displayField: "invoiceTypeName",
        fieldName: $T("sprm.common.model.common.invoiceTypeCode").$D("发票方式"),
        fieldType: "SELECT",
        required: (val, item) => item.prSourcePlatform === "E-COMMERCE",
        options: {
          subDisplayField: "valueName",
          displayField: "valueName",
          valueField: "valueName",
          listData: [],
          name: "invoiceTypeName",
          key: "invoiceTypeName",
          callback: (val, valueField, displayField, ds) => {
            console.log(val, valueField, displayField, ds);
            if (val && val[0]) {
              ds.current.setField("invoiceTypeCode", val[0].valueCode);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invoiceTypeCode", null);
          }
        }
      },
      {
        fieldCode: "invoiceTitleTypeName",
        displayField: "invoiceTitleTypeName",
        fieldName: $T("sprm.common.model.common.invoiceType").$D("发票类型"),
        fieldType: "SELECT",
        required: (val, item) => item.prSourcePlatform === "E-COMMERCE",
        options: {
          subDisplayField: "1",
          displayField: "valueName",
          valueField: "valueName",
          queryParams: {
            valueType: "INVOICE_TITLE",
            tenantId: SrmUtil.getTenantId(),
            companyId: null,
            platformCode: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("invoiceTitleTypeCode", val[0].valueCode);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invoiceTitleTypeCode", null);
          }
        },
      },
      {
        fieldCode: "invoiceDetailTypeName",
        displayField: "invoiceDetailTypeName",
        fieldName: $T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
        fieldType: "SELECT",
        required: (val, item) => item.prSourcePlatform === "E-COMMERCE",
        options: {
          subDisplayField: "valueName",
          displayField: "valueName",
          valueField: "valueName",
          onClear: (ds) => {
            ds.current.setField("invoiceDetailTypeCode", null);
          }
        }
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      destroy: {
        url: "sprm/v1/{tenantId}/purchase-requests",
        method: "delete",
      },
    },
  };
}

function customListDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("sprm.common.model.common.componentName").$D("属性名称"),
        fieldCode: "componentName",
      },
      {
        fieldName: $T("sprm.common.model.common.cpValue").$D("属性值"),
        fieldCode: "cpValue",
      },
    ],
  };
}

function editDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "neededDate",
        fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        fieldType: "DATE",
      },
      {
        fieldCode: "organizationName",
        displayField: "invOrganizationName",
        fieldName: $T("sprm.common.model.common.invOrganizationName").$D("库存组织"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.INVORG",
        options: {
          displayField: "organizationName",
          subDisplayField: "organizationCode",
          valueField: "organizationName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            enabledFlag: 1,
            ouId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("invOrganizationName", val[0].organizationName);
              ds.current.setField("invOrganizationId", val[0].organizationId);
              ds.current.setField("invOrganizationIdLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invOrganizationName", null);
            ds.current.setField("invOrganizationId", null);
            ds.current.setField("invOrganizationIdLov", null);
          }
        },
      },
      {
        fieldCode: "costId",
        fieldName: $T("sprm.common.model.common.costId").$D("成本中心"),
        fieldType: "LOV",
        lovCode: "SPRM.COST_CENTER",
        options: {
          displayField: "costName",
          subDisplayField: "costCode",
          valueField: "costName",
          queryParams: {
            ouId: null,
            companyId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("costName", val[0].costName);
              ds.current.setField("costCode", val[0].costCode);
              ds.current.setField("costId", val[0].costId);
              ds.current.setField("costLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("costName", null);
            ds.current.setField("costCode", null);
            ds.current.setField("costId", null);
            ds.current.setField("costLov", null);
          }
        },
      },
      {
        fieldCode: "wbsCode",
        fieldName: $T("sprm.common.model.common.wbsLov").$D("WBS元素"),
        fieldType: "LOV",
        lovCode: "SMDM.WBS",
        options: {
          displayField: "wbsName",
          subDisplayField: "wbsCode",
          valueField: "wbsName",
          queryParams: {
            ouId: null,
            companyId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("wbs", val[0].wbsName);
              ds.current.setField("wbsCode", val[0].wbsCode);
              ds.current.setField("wbsLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("wbs", null);
            ds.current.setField("wbsCode", null);
            ds.current.setField("wbsLov", null);
          }
        },
      },
      {
        fieldCode: "innerPoNum",
        fieldName: $T("sprm.common.model.common.innerPoNum").$D("内部订单号"),
        fieldType: "INPUT",
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      destroy: {
        url: "sprm/v1/{tenantId}/purchase-requests",
        method: "delete",
      }
    },
  };
}

function executorDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_REQUISITION_INQUIRY.LIST.EXECUTIONBILL",
      prLineId: null,
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "sprm/v1/{tenantId}/pr-change-historys",
        method: "get",
      },
    },
  };
}

export {
  indexDs,
  commonDs,
  editDs,
  executorDs,
  customListDs,
};