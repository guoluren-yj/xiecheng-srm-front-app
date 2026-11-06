import { $T } from "srm-mobile-ui";
function supplyCategoryDS(vm) {
  return {
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount:false,
    fields: [
      {
        fieldName: $T("sprm.common.model.common.statusCode").$D("状态"),
        fieldCode: "prLineStatusCodeMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.productName").$D("商品名称"),
        fieldCode: "productName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.productNum").$D("商品编码"),
        fieldCode: "productNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.catalogName").$D("商品目录"),
        fieldCode: "catalogName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
        fieldCode: "itemName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
        fieldCode: "categoryName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),
        fieldCode: "displayLineNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
        fieldCode: "uomName",
        fieldType: "TEXT",
        render:(val, record) => record.uomCode ? `${ record.uomCode}/val` : val
      },
      {
        fieldName: $T("sprm.common.model.common.taxType").$D("税种"),
        fieldCode: "taxCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.includingTaxAndFreightPrice").$D("预估单价（含税含运费）"),
        fieldCode: "taxIncludedUnitPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.taxExcludedFreightPrice").$D("预估单价（含税不含运费）"),
        fieldCode: "taxWithoutFreightPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.unitPriceBatch").$D("每"),
        fieldCode: "unitPriceBatch",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.linePrice").$D("行金额"),
        fieldCode: "taxIncludedLineAmount",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.lineFreight").$D("行运费"),
        fieldCode: "lineFreight",
        fieldType: "TEXT",
        render:(val) => val === 0 ? 0 : val || "",
      },
      {
        fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
        fieldCode: "quantity",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.taxRate").$D("税率"),
        fieldCode: "taxRate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.currencyCode").$D("币种"),
        fieldCode: "currencyCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.budgetIoFlag").$D("预算外标识"),
        fieldCode: "budgetIoFlag",
        fieldType: "TEXT",
        render: (val) => val ?
          vm.$T("hipspfm.common.status.yes").$D("是") :
          vm.$T("hipspfm.common.status.no").$D("否"),
      },
      {
        fieldName: $T("sprm.common.model.common.taxIncludedBudgetUnitPrice").$D("预算单价(含税)"),
        fieldCode: "taxIncludedBudgetUnitPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.budgetAccountName").$D("预算科目"),
        fieldCode: "budgetAccountName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        fieldCode: "neededDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.jdPrice").$D("划线价"),
        fieldCode: "jdPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.costCenter").$D("成本中心"),
        fieldCode: "costName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.projectCategory").$D("项目类别"),
        fieldCode: "projectCategory",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.sumProject").$D("总账科目"),
        fieldCode: "accountSubjectName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.wbs").$D("WBS元素"),
        fieldCode: "wbs",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
        fieldCode: "ouName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.purchaserName").$D("采购员"),
        fieldCode: "agentName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.supplierName").$D("供应商"),
        fieldCode: "supplierName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.xyNum").$D("协议编号"),
        fieldCode: "pcNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
        fieldCode: "prRequestedName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.moneyPayPart").$D("费用承担部门"),
        fieldCode: "expBearDep",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.handleStatus").$D("执行状态"),
        fieldCode: "executionStatusMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
        fieldCode: "displayExecutionBillNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.handlePerson").$D("需求执行人"),
        fieldCode: "executorName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        fieldCode: "executionBillDetail",
        fieldType: "TEXT",
        render:() => <span style="color: var(--color-other-default-b)">{vm.$T("hzero.common.button.details").$D("查看详情") }</span>,
        callBack:async (record) => {
          vm.$loading.show();
          vm.billDetaulDS.setQueryParameter({
            prLineId: record.prLineId
          });
          await vm.billDetaulDS.query();
          vm.billDetailPop = true;
          vm.$loading.hide();
        }
      },
      {
        fieldName: $T("sprm.common.model.common.assignedDate").$D("分配日期"),
        fieldCode: "assignedDate",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.common.infoRecord").$D("信息记录"),
        fieldCode: "infoRecord",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseReqInquiry.model.common.lastPurPrice").$D("上次采购单价"),
        fieldCode: "lastPurPrice",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.common.historicalSheet").$D("历史询价单"),
        fieldCode: "historicalInquirySheet",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.suspendRemark").$D("暂挂原因"),
        fieldCode: "suspendRemark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.closedRemark").$D("关闭原因"),
        fieldCode: "closedRemark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
        fieldCode: "itemModel",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
        fieldCode: "itemSpecs",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.remark").$D("备注"),
        fieldCode: "remark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.enclosure").$D("附件"),
        fieldCode: "enclosure",
        fieldType: "TEXT",
        render:() => <span style="color: var(--color-other-default-b)">{vm.$T("hipspfm.common.button.viewAttachments").$D("查看附件") }</span>,
        callBack:(record, val) => {
          let UUid = "";
          !record.enclosure ? UUid = vm.uuid : UUid = val;
          vm.showFilePop(UUid);
        }
      },
      {
        fieldName: "prLineId",
        fieldCode: "prLineId",
      }
    ],
    transport: {
      read: {
        url: `/sprm/v1/${localStorage.getItem("organizationId")}/purchase-requests/${vm.changeReqId}/lines`,
        method: "get",
        params: {},
      },
    },
    setData(data) {
      vm.data = data;
    },
  };
}

export default supplyCategoryDS;
