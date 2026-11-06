import { SrmUtil, $T } from "srm-mobile-ui";

export const Type = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  CONFIRM: "CONFIRM",
};

function listDS(type) {
  const queryUrlMap = {
    CREATE: "/spuc/v1/{tenantId}/plans/query/new",
    UPDATE: "/spuc/v1/{tenantId}/plans/query/release",
    CONFIRM: "/spuc/v1/{tenantId}/plans/from-supplier/all",
  };
  const updateUrlMap = {
    //保存
    CREATE: "/spuc/v1/{tenantId}/plans/batch",
    //取消
    UPDATE: "/spuc/v1/{tenantId}/plans/batch/cancel",
    //反馈
    CONFIRM: "/spuc/v1/{tenantId}/plans/batch/feedback",
  };
  const submitUrlMap = {
    CREATE: "/spuc/v1/{tenantId}/plans/batch/publish",
    UPDATE: "/spuc/v1/{tenantId}/plans/batch/publish",
    CONFIRM: "/spuc/v1/{tenantId}/plans/batch/confirm",
  };
  const uiCustomizeMap = {
    CREATE: "SODR.PLAN_SHEET_CREATE.LIST_NEW",
    UPDATE: "SODR.PLAN_SHEET_UPDATE.LIST",
    CONFIRM: null,
  };

  return {
    autoQuery: true,
    selection: Infinity,
    // 省略配置项
    // pageSize: 10,
    // editable: true,
    // enableQuery: true,
    // showTotalCount: true,
    queryParameter: { customizeUnitCode: uiCustomizeMap[type] },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "serialNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderSeq").$D("序号"),
      },
      {
        fieldCode: "planStatus",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.planStatusCode").$D("状态code"),
      },
      {
        fieldCode: "planStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.planStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "supplierCompanyCode",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.supplierCode").$D("供应商编码"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.categoryName").$D("物料分类"),
      },
      {
        fieldCode: "availableQuantity",
        fieldType: "INPUT_NUMBER",
        editor:false,
        fieldName: $T("sodr.common.model.common.availableQuantity").$D("可计划数量"),
      },
      {
        fieldCode: "planQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sodr.common.model.common.planQuantity").$D("本次计划数量"),
        required: type === Type.CREATE || type === Type.UPDATE,
        editor: type === Type.CREATE || type === Type.UPDATE
      },
      {
        fieldCode: "planDate",
        fieldType: type === Type.CREATE ? "DATE_PICKER" : "TEXT",
        fieldName: $T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
        required: type === Type.CREATE,
        // options: {
        //   format: "yyyy-MM-dd"
        //   // format: "yyyy-MM-dd HH:mm:ss"
        // }
      },
      {
        fieldCode: "purchaserRemark",
        fieldType: "INPUT",
        fieldName: $T("sodr.common.model.common.purchaserHeaderRemark").$D("采购方备注"),
      },
      {
        fieldCode: "supplierRemark",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.suppliersRemark").$D("供应商备注"),
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.displayPoLineNum").$D("订单行号"),
      },
      {
        fieldCode: "lineLocationNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderDisplayLineLocationNum").$D("订单发运号"),
      },
      {
        fieldCode: "netReceivedQuantity",
        fieldType: "INPUT_NUMBER",
        editor:false,
        fieldName: $T("sodr.common.model.common.netReceivedQuantitys").$D("净接收数量"),
      },
      {
        fieldCode: "sendingQuantity",
        fieldType: "INPUT_NUMBER",
        editor:false,
        fieldName: $T("sodr.common.model.common.sendingQuantity").$D("送货中数量"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.uomCode").$D("单位"),
      },
      {
        fieldCode: "needByDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
      },
      {
        fieldCode: "promiseDeliveryDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.promisedDate").$D("承诺交货日期"),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.company").$D("公司"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sodr.orderMaintain.sourceFrom.invOrganizationId").$D("库存组织"),
      },
      {
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.inventoryName").$D("库房"),
      },
      {
        fieldCode: "receivingAddress",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.receivingAddress").$D("收货地址"),
      },
      {
        fieldCode: "asnNums",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.asnNums").$D("关联送货单"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.createDate").$D("创建时间"),
      },
      {
        fieldCode: "createdByName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.creator").$D("创建人"),
      }
    ],
    fastQueryField: {
      fieldCode: "itemCode",
      fieldType: "LOV",
      fieldName: $T("sodr.common.model.common.itemDescription").$D("物料名称"),
      lovCode: "SODR.PO_ITEM",
      options: {
        multiple: false,
        displayField: "itemName",
        queryField: "itemName",
      },
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: "needByDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
        selectType: "start-end",
        endDateFieldCode: "needByDateEnd",
        // options: {
        //   format: "yyyy-MM-dd HH:mm:ss"
        // }
      },
      {
        fieldCode: "categoryId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.categoryName").$D("物料分类"),
        lovCode: "SSRC.QUOTATION_TPL.ITEM_CAT",
        options: {
          multiple: false,
          subDisplayField: "categoryCode",
          queryField: "categoryName",
        },
      },
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        lovCode: "SODR.USER_AUTH.SUPPLIER",
        options: {
          multiple: false,
          subDisplayField: "supplierCompanyCode",
          queryField: "supplierCompanyName",
        },
      },
      // {
      //   fieldCode: "planStatusList",
      //   fieldType: "SELECT",
      //   fieldName: $T("sodr.common.model.common.planStatus").$D("状态"),
      //   lovCode: "SSPL.PLAN_STATUS",
      //   options: {
      //     multiple: true,
      //   },
      // },
      {
        fieldCode: "agentId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
        options: {
          multiple: false,
          subDisplayField: "purchaseAgentCode",
          queryField: "purchaseAgentName",
        },
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.company").$D("公司"),
        lovCode: "SPCM.USER_AUTH.COMPANY",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
          queryField: "companyName",
        },
      },
      // {
      //   fieldCode: "invOrganizationId",
      //   fieldType: "LOV",
      //   fieldName: $T("sodr.orderMaintain.sourceFrom.invOrganizationId").$D("库存组织"),
      //   lovCode: "SPFM.USER_AUTH.INVORG",
      //   options: {
      //     multiple: false,
      //     subDisplayField: "organizationCode",
      //     queryField: "organizationName",
      //   },
      // },
      {
        fieldCode: "inventoryId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.inventoryName").$D("库房"),
        lovCode: "SODR.INVENTORY",
        options: {
          multiple: false,
          subDisplayField: "inventoryCode",
          queryField: "inventoryName",
        },
      },
      // {
      //   fieldCode: "lineNum",
      //   fieldType: "TEXT",
      //   fieldName: $T("sodr.common.model.common.displayPoLineNum").$D("订单行号"),
      // },
    ],
    transport: {
      read: {
        url: queryUrlMap[type],
        method: "get",
      },
      submit: {
        url: submitUrlMap[type],
        method: "put",
      },
      update: {
        url: updateUrlMap[type],
        method: "put",
      },
      destroy: {
        url: "/spuc/v1/{tenantId}/plans/batch",
        method: "delete",
      },
    },
  };
}

export default listDS;
