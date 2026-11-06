import { SrmUtil, $T } from "srm-mobile-ui";

export const Type = {
  CREATE: "CREATE",
  // UPDATE: "UPDATE",
  CONFIRM: "CONFIRM",
};

function listDS(type) {
  const queryUrlMap = {
    CREATE: "/spuc/v1/{tenantId}/plans/from-supplier/all?camp={camp}",
    // UPDATE: "/spuc/v1/{tenantId}/plans/query/release",
    CONFIRM:
      "/spuc/v1/{tenantId}/plans/query/confirm?customizeUnitCode={customizeUnitCode}",
  };
  const updateUrlMap = {
    // 取消
    CREATE: "/spuc/v1/{tenantId}/plans/batch/cancel",
    // 反馈
    CONFIRM: "/spuc/v1/{tenantId}/plans/batch/confirm-feedback",
  };
  const submitUrlMap = {
    // 发布
    CREATE: "/spuc/v1/{tenantId}/plans/batch/publish",
    // UPDATE: "/spuc/v1/{tenantId}/plans/batch/publish",
    // 发布
    CONFIRM: "/spuc/v1/{tenantId}/plans/batch/confirm-feedback",
  };
  const uiCustomizeMap = {
    CREATE: "SODR.PLAN_SHEET_CREATE.LIST_NEW",
    // UPDATE: "SODR.PLAN_SHEET_UPDATE.LIST",
    CONFIRM:
      "SODR.PLAN_SHEET_CONFIRM_SUP.QUERY_FORM,SODR.PLAN_SHEET_CONFIRM_SUP.LIST",
  };

  return {
    autoQuery: true,
    selection: Infinity,
    queryParameter: {},
    pathParameter: {
      customizeUnitCode: uiCustomizeMap[type],
      tenantId: SrmUtil.getTenantId(),
      camp: "SUPPLIER",
    },
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
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemTypeDesc").$D("物料类别"),
      },
      {
        fieldCode: "planQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sodr.common.model.common.planQuantity").$D(
          "本次计划数量"
        ),
        required: type === Type.CREATE,
        editor: type === Type.CREATE,
      },
      {
        fieldCode: "planDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.planDate").$D(
          "本次计划到货日期"
        ),
        options: {
          format: "yyyy-MM-dd",
        },
        required: type === Type.CREATE,
        editor: (val, record) => {
          if (type === Type.CREATE) {
            return true;
          }
          if (record.planConfirmDateOfArrivalFlag === "1") {
            return true;
          }
          if (record.data && record.planConfirmDateOfArrivalFlag === "1") {
            return true;
          }
          return false;
        },
      },
      {
        fieldCode: "supplierRemark",
        fieldType: "INPUT",
        fieldName: $T("sodr.common.model.common.supplierRemark").$D(
          "供应商备注"
        ),
      },
      {
        fieldCode: "purchaserRemark",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.purchaserHeaderRemark").$D(
          "采购方备注"
        ),
      },
      {
        fieldCode: "supplierConfirmQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sodr.common.model.common.supplierConfirmQuantity").$D(
          "供应方确认数量"
        ),
        validator: (val, record, field) => {
          field.errorMessage = $T(
            "sodr.common.model.common.supplierConfirmQuantityBigger"
          ).$D("不能超过本次计划数量");
          if (Number(record.planQuantity) < Number(val)) {
            return false;
          }
          return true;
        },
        required: true,
      },
      {
        fieldCode: "supplierCompanyCode",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.supplierCode").$D("供应商编码"),
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.displayPoLineNum").$D(
          "订单行号"
        ),
      },
      {
        fieldCode: "lineLocationNum",
        fieldType: "TEXT",
        fieldName: $T(
          "sodr.common.model.common.orderDisplayLineLocationNum"
        ).$D("订单发运号"),
      },
      {
        fieldCode: "netReceivedQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sodr.common.model.common.netReceivedQuantitys").$D(
          "净接收数量"
        ),
      },
      {
        fieldCode: "sendingQuantity",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.sendingQuantity").$D(
          "送货中数量"
        ),
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
        fieldName: $T("sodr.common.model.common.promisedDate").$D(
          "承诺交货日期"
        ),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName:
          type === "CONFIRM" ?
            $T("sodr.common.model.common.company").$D("公司") :
            $T("sodr.common.model.common.customer").$D("客户"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sodr.orderMaintain.sourceFrom.invOrganizationId").$D(
          "库存组织"
        ),
      },
      {
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.inventoryOne").$D("库房"),
      },
      {
        fieldCode: "receivingAddress",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.receivingAddress").$D(
          "收货地址"
        ),
      },
      {
        fieldCode: "shipToThirdPartyAddress",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.shipToThirdPartyAddressOne").$D(
          "交货地址"
        ),
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
      },
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
        fieldCode: "categoryId",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemTypeDesc").$D("物料类别"),
      },
      {
        fieldCode: "inventoryId",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.inventoryId").$D("库房"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.poLineId").$D("订单行号"),
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: type === "CONFIRM" ? "planStatus" : "planStatusList",
        fieldType: "SELECT",
        fieldName: $T("sodr.common.model.common.planStatus").$D("状态"),
        displayField: "meaning",
        options: {
          // eslint-disable-next-line no-unneeded-ternary
          multiple: type === "CONFIRM" ? false : true,
          displayField: "meaning",
          subDisplayField: "value",
          valueField: "value",
          listData: [
            {
              value: "RELEASE",
              meaning: $T("sodr.common.model.common.release").$D("已发布"),
              orderSeq: 2,
            },
            {
              value: "CONFIRM",
              meaning: $T("sodr.common.model.common.confirm").$D("已确认"),
              orderSeq: 4,
            },
            {
              value: "FEEDBACK",
              meaning: $T("sodr.common.model.common.feedback").$D("已反馈"),
              orderSeq: 5,
            },
            {
              value: "CLOSE",
              meaning: $T("sodr.common.model.common.close").$D("已关闭"),
              orderSeq: 7,
            },
            {
              value: "PENDING",
              meaning: $T("sodr.common.model.common.pending").$D("待确认"),
              orderSeq: 80,
            },
          ],
        },
        defaultValue: {
          value: type === "CONFIRM" ? "RELEASE" : "CONFIRM,PENDING,FEEDBACK",
          meaning:
            type === "CONFIRM" ?
              $T("sodr.common.model.common.release").$D("已发布") :
              $T("sodr.common.model.common.releaseAndPendingAndFeedback").$D(
                "已确认,待确认,已反馈"
              ),
        },
      },
      {
        fieldCode: "agentId",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
      },
      {
        fieldCode: "invOrganizationId",
        fieldType: "TEXT",
        fieldName: $T("sodr.orderMaintain.sourceFrom.invOrganizationId").$D(
          "库存组织"
        ),
      },
      {
        fieldCode: "needByDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
        selectType: "start-end",
        endDateFieldCode: "needByDateEnd",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "creationDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.creationDate").$D("创建日期"),
        selectType: "start-end",
        endDateFieldCode: "creationDateEnd",
        // eslint-disable-next-line no-unneeded-ternary
        visible: type === "CONFIRM" ? false : true,
        options: {
          format: "yyyy-MM-dd",
        },
      },
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
        method: type === "CONFIRM" ? "post" : "put",
      },
      destroy: {
        url: "/spuc/v1/{tenantId}/plans/batch",
        method: "delete",
      },
    },
  };
}

export default listDS;
