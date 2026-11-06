import { $T, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";

// const storage = window.localStorage;

function receiveHeaderDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    paging: false,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "acceptStatusMeaning",
        fieldName: $T("scux.acceptBench.model.view.acceptStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "title",
        fieldType: "INPUT",
        fieldName: $T("scux.acceptBench.model.view.title").$D("验收标题"),
      },
      {
        fieldCode: "acceptNum",
        fieldType: "INPUT",
        disabled: true,
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.acceptNum").$D("验收单号"),
      },
      {
        fieldCode: "displayPoNum", // fromDisplayPoNumLov
        // fieldType: "LOV",
        fieldName: $T("scux.acceptBench.model.displayPoNum").$D("订单号"),
        // lovCode: "SCUX.LDJT_ACCEPT_PO",
        required: true,
        // options: {
        //   callback: (val, valueField, displayField, ds) => {
        //     if (val && val[0]) {
        //       ds?.current?.setField("companyName", val[0].companyName);
        //       ds?.current?.setField("supplierCompanyName", val[0].supplierCompanyName);
        //       ds?.current?.setField("supplierCompanyId", val[0].supplierCompanyId);
        //       ds?.current?.setField("supplierTenantId", val[0].supplierTenantId);
        //       ds?.current?.setField("taxIncludeAmount", val[0].taxIncludeAmount);
        //       ds?.current?.setField("companyId", val[0].companyId);
        //       ds?.current?.setField("companyName", val[0].companyName);
        //       ds?.current?.setField("supplierId", val[0].supplierId);
        //       ds?.current?.setField("supplierName", val[0].supplierName);
        //       ds?.current?.setField("displayPoNum", val[0].displayPoNum);
        //       ds?.current?.setField("poHeaderId", val[0].poHeaderId);
        //       ds?.current?.setField("currencyCode", val[0].currencyCode);
        //       ds?.current?.setField("termId", val[0].termsId);
        //     }
        //   },
        //   onClear: (ds) => {
        //     console.log("触发");
        //     ds?.current?.setField("displayPoNum", null);
        //     ds?.current?.setField("poHeaderId", null);
        //     ds?.current?.setField("stageNum", null);
        //     ds?.current?.setField("stageDesc", null);
        //     ds?.current?.setField("acceptStageCompleteFlag", null);
        //   }
        // },
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldName: $T("scux.acceptBench.model.view.taxIncludeAmount").$D("订单金额"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        displayField: "companyName",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
        lovCode: "SPFM.USER_AUTH.COMPANY",
        disabled: true,
        required: true,
        options: {
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          }
        },
      },
      {
        fieldCode: "supplierId",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.supplierId").$D("供应商"),
        // disabled:true,
      },
      // {
      //   fieldCode: "supplierId",
      //   fieldType: "LOV",
      //   displayField: "supplierName",
      //   fieldName: $T("scux.acceptBench.model.view.supplierId").$D("供应商"),
      //   lovCode: "SODR.AUTH_SUPPLIER_LIFE_CYCLE",
      //   disabled: true,
      //   required: true,
      //   options: {
      //     queryParams: {
      //       tenantId: SrmUtil.getTenantId(),
      //       organizationId: storage.getItem("organizationId"),
      //       pageSource: "SODR",
      //     }
      //   },
      // },
      {
        fieldCode: "termMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.termId").$D("付款协议"),
        // disabled:true,
      },
      {
        fieldCode: "currencyCode",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.view.currencyCode").$D("币种"),
      },
      {
        fieldCode: "stageNum",
        // fieldType: "LOV",
        displayField: "stageDesc",
        required: true,
        fieldName: $T("scux.acceptBench.model.view.stageIdLov").$D("本次验收阶段"),
        // lovCode: "SCUX_LDJT_QUERY_PLAN_INFO",
        // options: {
        //   queryParams: {
        //     tenantId: SrmUtil.getTenantId(),
        //   }
        // },
      },
      // {
      //   fieldCode: "stageId",
      //   bind: "stageIdLov.stageId",
      // },
      // {
      //   fieldCode: "stageNum",
      //   bind: "stageIdLov.stageNum",
      // },
      // {
      //   fieldCode: "stageDesc",
      //   bind: "stageIdLov.stageDesc",
      // },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "unitId",
        displayField: "unitName",
        fieldName: $T("scux.acceptBench.model.view.unitName").$D("创建人部门"),
        lovCode: "SPUC.USER_AUTHORITY_UNIT",
        required: true,
        disabled: true,
        fieldType: "LOV",
        // ignore: "always",
        options: {
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          }
        },
      },
      {
        fieldCode: "acceptDate",
        fieldType: "DATE_PICKER",
        required: true,
        fieldName: $T("scux.acceptBench.model.view.acceptDate").$D("验收日期"),
      },
      {
        fieldCode: "acceptTypeCode",
        fieldType: "SELECT",
        required: true,
        displayField: "acceptTypeCodeMeaning",
        fieldName: $T("scux.acceptBench.model.view.acceptTypeCode").$D("验收类型"),
        lovCode: "SCUX_LDJT_ACCEPT_TYPE",
        disabled: true,
      },
      {
        fieldCode: "approveEmployeeId",
        fieldName: $T("scux.acceptBench.model.view.approveEmployeeId").$D("审批人"),
        fieldType: "LOV",
        displayField: "name",
        lovCode: "SPRM.EMPLOYEE_LIST_URL_NUM",
        required: true,
        disabled: true,
        options: {
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          },
          // callback: (val, valueField, displayField, ds) => {
          //   if (val && val[0]) {
          //     ds?.current?.setField("name", val[0].name);
          //     ds?.current?.setField("approveEmployeeId", val[0].approveEmployeeId);
          //   }
          // },
        },
      },
      // 本次验收信息
      {
        fieldCode: "acceptStageCompleteFlag",
        fieldName: $T("scux.acceptBench.model.view.acceptStageCompleteFlag").$D("是否阶段完成验收"),
        lovCode: "HPFM.FLAG",
        fieldType: "SELECT",
        // trueValue: 1,
        // falseValue: 0,
        required: true,
      },
      {
        fieldCode: "acceptStageAmount",
        fieldName: $T("scux.acceptBench.model.view.acceptStageAmount").$D("阶段已验金额"),
        // bind: "stageIdLov.stageAmount",
      },
      {
        fieldCode: "stageTotalAmount",
        fieldName: $T("scux.acceptBench.model.view.stageTotalAmount").$D("阶段总额参考"),
        // bind: "stageIdLov.attributeDecimal2",
      },
      {
        fieldCode: "stagePercent",
        fieldName: $T("scux.acceptBench.model.view.stagePercents").$D("本次阶段比例%"),
        // bind: "stageIdLov.attributeDecimal1",
      },
      {
        fieldCode: "acceptTotalAmount",
        fieldName: $T("scux.acceptBench.model.view.acceptTotalAmount").$D("本次验收金额"),
      },
      {
        fieldCode: "notAcceptStageAmount",
        fieldName: $T("scux.acceptBench.model.view.notAcceptStageAmounts").$D("阶段未验收余额"),
      },
      // 订单验收信息
      {
        fieldCode: "acceptProcess",
        fieldName: $T("scux.acceptBench.model.view.acceptProcess").$D("已验收金额进度%"),
      },
      {
        fieldCode: "acceptOrderAmount",
        fieldName: $T("scux.acceptBench.model.view.acceptOrderAmount").$D("订单已验总额"),
        // bind: "stageIdLov.paymentAmount",
      },
      {
        fieldCode: "addAcceptProcess",
        fieldName: $T("scux.acceptBench.model.view.addAcceptProcess").$D("加本次验收金额进度%"),
      },
      {
        fieldCode: "addAcceptAmount",
        fieldName: $T("scux.acceptBench.model.view.addAcceptAmount").$D("加本次验收总额"),
      },
      {
        fieldCode: "notAcceptProcess",
        fieldName: $T("scux.acceptBench.model.view.notAcceptProcess").$D("订单未验收占比%"),
      },
      {
        fieldCode: "notAcceptOrderAmount",
        fieldName: $T("scux.acceptBench.model.view.orderNotAcceptOrderAmount").$D("订单未验收余额"),
      },
      {
        fieldCode: "acceptCriteria",
        fieldName: $T("scux.acceptBench.model.view.acceptCriteria").$D("验收标准"),
        // bind: "stageIdLov.attributeLongtext1",
      },
      {
        fieldCode: "acceptCriteriaAttachUuid",
        type: "attachment",
        fieldName: $T("scux.acceptBench.model.view.acceptCriteriaAttachUuid").$D("验收标准附件"),
        // bind: "stageIdLov.attributeVarchar1",
      },
      {
        fieldCode: "acceptAttachUuid",
        type: "attachment",
        bucketName: "private-bucket",
        fieldName: $T("scux.acceptBench.model.view.acceptAttachUuid").$D("验收附件"),
      },
      {
        fieldCode: "remark",
        // fieldType: "TEXT_AREA",
        fieldType: "INPUT",
        fieldName: $T("scux.acceptBench.model.view.remark").$D("备注"),
      },
      {
        fieldCode: "purchaseOrgId",
        displayField: "organizationName",
        fieldName: $T("scux.acceptBench.model.view.organizationNames").$D("采购部门"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_ORG",
        disabled: true,
        fieldType: "LOV",
        options: {
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          }
        },
      },
      {
        fieldCode: "agentId",
        displayField: "agentName",
        fieldName: $T("scux.acceptBench.model.view.agentId").$D("采购员"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
        disabled: true,
        fieldType: "LOV",
        options: {
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          }
        },
      },
      {
        fieldCode: "acceptQuality",
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        required: true,
        defaultValue: {
          value: "1",
          meaning: $T("hzero.common.model.yes").$D("是"),
        },
        fieldName: $T("scux.acceptBench.model.view.acceptQuality").$D("验收是否合格"),
      },
      {
        fieldCode: "totalScore",
        fieldName: $T("scux.acceptBench.model.view.scoreAll").$D("评分汇总"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/header-detail/{acceptHeaderId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, params) => {
        const data = params[0];
        const totalAll = data.ldjtAcceptScoreList || [];
        const totalList = totalAll.map((item) => {
          if (item?.score) {
            return item.score;
          }
          return 0;
        });
        const sum = totalList.reduce((accumulator, currentValue) => accumulator + currentValue);
        if (!data?.acceptAttachUuid) {
          return [ {
            ...data,
            totalScore: data?.totalScore || sum,
            acceptAttachUuid: uuid(),
            approveEmployeeId: data.approveEmployeeId || "",
          } ];
        }
        return [ {
          ...data,
          approveEmployeeId: data.approveEmployeeId || "",
          totalScore: data?.totalScore || sum,
        } ];
      },
    },
  };

}

export { receiveHeaderDs };