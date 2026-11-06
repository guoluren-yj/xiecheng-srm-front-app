import { SrmUtil, $T } from "srm-mobile-ui";

function commonDs() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},

    fields: [
      // 基本信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptNum").$D("验收单号"),
        fieldType: "TEXT",
        fieldCode: "acceptNum",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptStatusMeaning").$D("单据状态"),
        fieldType: "TEXT",
        fieldCode: "acceptStatusMeaning",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.title").$D("验收标题"),
        fieldType: "TEXT",
        fieldCode: "title",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.companyName").$D("公司"),
        fieldType: "TEXT",
        fieldCode: "companyName",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.supplierName").$D("供应商"),
        fieldType: "TEXT",
        fieldCode: "supplierName",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.displayPoNum").$D("订单号"),
        fieldType: "TEXT",
        fieldCode: "displayPoNum",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.stageDesc").$D("本次验收阶段"),
        fieldType: "TEXT",
        fieldCode: "stageDesc",
      },


      {
        fieldName: $T("scux.acceptBench.model.receipt.creationName").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "creationName",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.creationDate").$D("创建时间"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
      },

      // 补充信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.taxIncludeAmount").$D("订单金额"),
        fieldType: "TEXT",
        fieldCode: "taxIncludeAmount",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.currencyCode").$D("币种"),
        fieldType: "TEXT",
        fieldCode: "currencyCode",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptDate").$D("付款协议"),
        fieldType: "TEXT",
        fieldCode: "acceptDate",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.unitName").$D("部门"),
        fieldType: "TEXT",
        fieldCode: "unitName",
      },



      // 本次验收信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptStageCompleteFlag").$D("是否阶段完成验收"),
        fieldType: "TEXT",
        fieldCode: "acceptStageCompleteFlag",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptStageAmount").$D("阶段已验金额"),
        fieldType: "TEXT",
        fieldCode: "acceptStageAmount",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.stagePercent").$D("本次阶段比例"),
        fieldType: "TEXT",
        fieldCode: "stagePercent",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptTotalAmounts").$D("本次验收金额"),
        fieldType: "TEXT",
        fieldCode: "acceptTotalAmount",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.stageTotalAmount").$D("阶段总额参考"),
        fieldType: "TEXT",
        fieldCode: "stageTotalAmount",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.notAcceptStageAmount").$D("阶段未验收余额"),
        fieldType: "TEXT",
        fieldCode: "notAcceptStageAmount",
      },




      // 订单验收信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptProcess").$D("已验收金额进度%"),
        fieldType: "TEXT",
        fieldCode: "acceptProcess",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptOrderAmount").$D("订单已验总额"),
        fieldType: "TEXT",
        fieldCode: "acceptOrderAmount",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.addAcceptProcess").$D("加本次验收金额进度(%)"),
        fieldType: "TEXT",
        fieldCode: "addAcceptProcess",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.addAcceptAmount").$D("加本次验收总额"),
        fieldType: "TEXT",
        fieldCode: "addAcceptAmount",
      },
      {
        fieldName: $T("scux.acceptBench.model.receipt.notAcceptProcess").$D("订单未验收占比(%)"),
        fieldType: "TEXT",
        fieldCode: "notAcceptProcess",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.notAcceptOrderAmount").$D("订单未验收余额"),
        fieldType: "TEXT",
        fieldCode: "notAcceptOrderAmount",
      },

      {
        fieldName: $T("scux.acceptBench.model.receipt.remark").$D("备注"),
        fieldType: "TEXT",
        fieldCode: "remark",
      },

      // 补充信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptCriteria").$D("验收标准"),
        fieldType: "TEXT",
        fieldCode: "acceptCriteria",
      },

      // 附件信息
      {
        fieldName: $T("scux.acceptBench.model.receipt.acceptCriteriaAttachUuid").$D("验收标准附件"),
        fieldType: "TEXT",
        fieldCode: "acceptCriteriaAttachUuid",
        bucketName: "public-bucket"
      }, {
        fieldName: $T("scux.acceptBench.model.receipt.acceptAttachUuid").$D("验收附件"),
        fieldType: "TEXT",
        fieldCode: "acceptAttachUuid",
        bucketName: "public-bucket"
      },
    ],
    transport: {
      read: {
        // url: `spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/line/{id}/detail`,
        // url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/header-detail/{id}`,
        // method: "get",
      },
    },
  };
}

// 验收行信息
function lineDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate: true,
    fields: [
      {
        fieldCode: "acceptLineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.acceptLineNum").$D("行号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.uoName").$D("物料名称"),
      },
      {
        fieldCode: "acceptAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.acceptAmount").$D("本次验收金额"),
      },
      {
        fieldCode: "referenceAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.referenceAmount").$D("比例参考金额"),
      },
      {
        fieldCode: "acceptTaxIncludedPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.acceptTaxIncludedPrice").$D("验收含税单价"),
      },
      {
        fieldCode: "taxIncludedPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.taxIncludedPrice").$D("含税单价"),
      },

      {
        fieldCode: "quantity",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.quantity").$D("数量"),
      },
      {
        fieldCode: "taxIncludedLineAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.taxIncludedLineAmount").$D("含税行金额"),
      },

      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "displayLineNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.displayLineNum").$D("订单行号"),
      },

      // 补充信息
      {
        fieldCode: "projectTaskNum",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.projectTaskNum").$D("项目编码"),
      },
      {
        fieldCode: "projectTaskName",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.projectTaskName").$D("项目任务名称"),
      },

      {
        fieldCode: "taskCode",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.taskCode").$D("项目任务编码"),
      },
      {
        fieldCode: "specifications",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.specifications").$D("规格"),
      },

      {
        fieldCode: "brand",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.brand").$D("品牌"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/line-detail/{id}`,
        method: "get",
      },
    },
  };
}


// 评分行信息

function rateDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate: true,
    fields: [
      {
        fieldCode: "content",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.content").$D("评分维度"),
      },
      {
        fieldCode: "score",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.score").$D("评分"),
      },
      {
        fieldCode: "opinion",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.opinion").$D("评价说明"),
      },
    ]
  }
}


export {
  commonDs,
  lineDs,
  rateDs
};
