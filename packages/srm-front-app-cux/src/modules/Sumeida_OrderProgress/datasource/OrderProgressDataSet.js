import { $T } from "srm-mobile-ui";
function orderProgressDataSet() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      completeFlag: 0,
      headOrLine: 1,
    },
    fields: [
      {
        fieldName: $T("sodr.common.model.common.purchaseOrderNum").$D("采购订单号"),
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.orderTypeName").$D("订单类型"),
        fieldCode: "orderTypeName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.stageName").$D("阶段名称"),
        fieldCode: "stageName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.orderProcessPlanDate").$D("计划时间"),
        fieldCode: "planDate",
        fieldType: "EMPTY",
        options: {
          format: "yyyy-MM-dd HH:mm:ss",
        },
      },
      {
        fieldName: $T("sodr.common.model.common.actualDate").$D("实际时间"),
        fieldCode: "actualDate",
        fieldType: "EMPTY",
      },
      {
        fieldName: $T("sodr.common.model.common.nodeStatusName").$D("节点状态"),
        fieldCode: "nodeStatusName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.nodeStatusName").$D("节点状态"),
        fieldCode: "nodeStatusCode",
        fieldType: "EMPTY",
        lovCode: "SCUX.PO_EXECUTE_STATUS",
        selectType: "select",
        options: {},
        required: true,
      },
      {
        fieldName: $T("sodr.common.model.common.excutePercentage").$D("执行进度（%）"),
        fieldCode: "excutePercentage",
        fieldType: "TEXT",
        validator: (val) => val <= 100 && val >= 0,
      },
      {
        fieldName: $T("sodr.common.model.common.roleName").$D("负责方"),
        fieldCode: "roleName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.responsibleUser").$D("负责人"),
        fieldCode: "responsibleUser",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.responsibleUser").$D("负责人"),
        fieldCode: "responsiblePartyId",
        fieldType: "EMPTY",
        lovCode: "SPUC.USER_SUB_ACCOUNT",
        options: {},
      },
      {
        fieldName: $T("sodr.common.model.common.updater").$D("更新人"),
        fieldCode: "updater",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.lastUpdateDate").$D("更新时间"),
        fieldCode: "lastUpdateDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.attachment").$D("附件"),
        fieldCode: "attachmentId",
        fieldType: "EMPTY",
      },
      {
        fieldName: $T("sodr.common.model.common.orderProgressRemark").$D("备注"),
        fieldCode: "remark",
        fieldType: "EMPTY",
      },
      {
        fieldName: $T("sodr.common.model.common.companyName").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        fieldCode: "supplierName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.saleOrderNum").$D("销售订单号"),
        fieldCode: "attributeVarchar2",
        fieldType: "TEXT",
      },
      {
        fieldCode: "needByDate",
        fieldType: "EMPTY",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
      },
    ],
    fastQueryField: {
      fieldCode: "poHeaderIds",
      fieldType: "LOV",
      fieldName: $T("sodr.common.model.common.purchaseOrderNum").$D("订单号"),
      lovCode: "SCUX.SUMEC_PO_STAGE_CONDITION",
      options: {
        multiple: true,
        //displayField: "",
        subDisplayField: "poHeaderId",
        //valueField: "",
        queryField: "displayPoNum",
      },
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "needByDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
        selectType: "start-end",
        endDateFieldCode: "needByDateEnd",
        options: {
          format: "yyyy-MM-dd HH:mm:ss",
        },
      },
      {
        fieldName: $T("sodr.common.model.common.saleOrderNum").$D("销售订单号"),
        fieldCode: "attributeVarchar2",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sodr.common.model.common.orderContractNum").$D("合同号"),
        fieldCode: "pcNum",
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.companyName").$D("公司"),
        lovCode: "HPFM.COMPANY",
        options: {
          multiple: false,
          //displayField: "",
          subDisplayField: "companyNum",
          //valueField: "",
          queryField: "companyName",
        },
      },
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: false,
          //displayField: "",
          subDisplayField: "supplierCompanyNum",
          valueField: "supplierCompanyId",
          queryField: "supplierName",
        },
      },
      {
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-excute-stages`,
        method: "get",
      },
      create: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-excute-stages`,
        method: "post",
      },
      update: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-excute-stages`,
        method: "put",
      },
    },
    events: {
      afterQuery: (ds, result) => {
        if (result) {
          result.forEach((e) => {
            if (e.planDate) {
              e.planDate = e.planDate.slice(0, 10);
            }
            if (e.actualDate) {
              e.actualDate = e.actualDate.slice(0, 10);
            }
          });
        }
      },
      beforeSubmit: (da, records) => {
        // eslint-disable-next-line no-unused-vars
        for (let i in records) {
          const planDate = records[i].get("planDate");
          const actualDate = records[i].get("actualDate");
          if (planDate) {
            records[i].set("planDate", planDate + " 00:00:00");
          }
          if (actualDate) {
            records[i].set("actualDate", actualDate + " 00:00:00");
          }
          if (!records[i].get("nodeStatusCode")) {
            return false;
          }
          const excutePercentage = records[i].get("excutePercentage");
          if (excutePercentage && (excutePercentage < 0 || excutePercentage > 100)) {
            return false;
          }
        }
        return true;
      },
    },
  };
}

export default orderProgressDataSet;
