import { SrmUtil, $T } from "srm-mobile-ui";
import { isNil } from "lodash";
// 送货单头信息
function nodeDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate:true,
    fields: [
      // 基础信息
      {
        fieldCode: "displayAsnNum",
        fieldName: $T("slod.common.model.common.displayAsnNum").$D("单据编号"),
      },
      {
        fieldCode: "displayPlanNum",
        fieldName: $T("slod.common.model.common.displayAsnNum").$D("单据编号"),
      },
      {
        fieldCode: "nodeConfigName",
        fieldName: $T("slod.common.model.common.nodeConfigName").$D("单据类型"),
      },
      {
        fieldCode: "asnTypeCodeMeaning",
        fieldName: $T("slod.common.model.common.asnTypeCodeMeaning").$D("单据分类"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldName: $T("slod.common.model.common.statusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("slod.common.model.common.creationTime").$D("创建时间"),
      },
      // 发货信息
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "shipDate",
        fieldName: $T("slod.common.model.common.shipDate").$D("发货日期"),
        fieldType: "DATE",
        // required: true,
      },
      {
        fieldCode: "expectedArriveDate",
        fieldName: $T("slod.common.model.common.expectedArriveDate").$D("预计到货时间"),
        fieldType: "DATE_PICKER",
        // options: {
        //   format: "yyyy-MM-dd HH:mm:ss"
        // },
        // required: true,
        timePicker: true,
        placeholder: $T("slod.common.model.common.selectTime").$D("请选择时间")
      },
      {
        fieldCode: "deliveryAddress",
        fieldName: $T("slod.common.model.common.deliveryAddress").$D("发货地址"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "shipTotalQuantity",
        fieldName: $T("slod.common.model.common.shipTotalQuantity").$D("发货总数"),
      },
      {
        fieldCode: "shipTaxIncludedAmount",
        fieldName: $T("slod.common.model.common.shipTaxIncludedAmount").$D("发货总额"),
      },
      {
        fieldCode: "transportType",
        fieldName: $T("slod.common.model.common.transportType").$D("运输类型"),
        fieldType: "SELECT",
        displayField: "transportTypeMeaning",
        lovCode: "SLOD.ASN_TRANSPORT_TYPE",
      },
      {
        fieldCode: "transportTypeMeaning",
        fieldName: $T("slod.common.model.common.transportType").$D("运输类型"),
      },
      {
        fieldCode: "logisticsCompanyCode",
        fieldName: $T("slod.common.model.common.logisticsCompanyCode").$D("物流公司"),
        fieldType: "LOV",
        displayField: "logisticsCompanyName",
        lovCode: "SINV.ASN_SHIPPER_NAME",
        options: {
          queryParams: {
            lovCode:"SINV.ASN_SHIPPER_NAME",
            asyncCountFlag: "N",
            tenantId: SrmUtil.getTenantId(),
          }
        },
      },
      {
        fieldCode: "logisticsCompanyName",
        fieldName: $T("slod.common.model.common.logisticsCompanyCode").$D("物流公司"),
      },
      {
        fieldCode: "expressNum",
        fieldName: $T("slod.common.model.common.expressNumber").$D("物流单号"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "carNumber",
        fieldName: $T("slod.common.model.common.carNum").$D("车牌号"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "logisticsCost",
        fieldName: $T("slod.common.model.common.logisticsCost").$D("物流费用"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "logisticsStaff",
        fieldName: $T("slod.common.model.common.logisticsStaff").$D("配送员"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "logisticsPhoneNum",
        fieldName: $T("slod.common.model.common.logisticsPhoneNumber").$D("配送电话"),
        fieldType: "INPUT_NUMBER",
        validator: (val, record, field) => {
          if (val === "") {
            return true;
          }
          const pattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
          field.errorMessage = $T("slod.common.model.common.phoneErrMsg").$D("手机号格式不正确");
          if (!isNil(val)) {
            if (pattern.test(val)) {
              return true;
            }
          } else {
            return true;
          }
        },
      },
      {
        fieldCode: "logisticsPhoneNumber",
        fieldName: $T("slod.common.model.common.logisticsPhoneNumber").$D("配送电话"),
      },
      {
        fieldCode: "purchaseRemark",
        fieldName: $T("slod.common.model.common.purchaseRemark").$D("采购方备注"),
      },
      {
        fieldCode: "supplierRemark",
        fieldName: $T("slod.common.model.common.supplierRemark").$D("供应商备注"),
        fieldType: "TEXT_AREA",
      },
      // 收货信息
      {
        fieldCode: "companyName",
        fieldName: $T("slod.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("slod.common.model.common.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "receiveAddress",
        fieldName: $T("slod.common.model.common.receiveAddress").$D("收货地址"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "contactName",
        fieldName: $T("slod.common.model.common.contactName").$D("联系人"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "contactTelNum",
        fieldName: $T("slod.common.model.common.contactTelNum").$D("联系人电话"),
        fieldType: "INPUT_NUMBER",
        validator: (val, record, field) => {
          if (val === "") {
            return true;
          }
          const pattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
          field.errorMessage = $T("slod.common.model.common.phoneErrMsg").$D("手机号格式不正确");
          if (!isNil(val)) {
            if (pattern.test(val)) {
              return true;
            }
          } else {
            return true;
          }
        },
      },
      {
        fieldCode: "contactTelNumber",
        fieldName: $T("slod.common.model.common.contactTelNum").$D("联系人电话"),
      },
      // 附件
      {
        fieldCode: "purchaseAttachmentUuid",
        fieldName: $T("slod.common.model.common.purchaseAttachmentUuid").$D("采购方附件"),
      },
      {
        fieldCode: "supplierAttachmentUuid",
        fieldName: $T("slod.common.model.common.supplierAttachmentUuid").$D("供应商附件"),
      },
    ]
  };
}
// 送货单行信息
function asnLineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: false,
    forceValidate:true,
    showTotalCount: false,
    queryParameter: {
      asyncCountFlag: "N",
      cuszTplStageCode: "SUBMIT",
      cuszTplPageCode: "DELIVERY_WORKBENCH.DETAIL",
    },
    pathParameter: {
      nodeConfigId: "",
      id: "",
    },
    // 模型字段
    fields: [
      {
        fieldCode: "displayAsnLineNum",
        fieldName: $T("slod.common.model.common.displayAsnLineNum").$D("行号"),
      },
      {
        fieldCode: "displayPlanLineNum",
        fieldName: $T("slod.common.model.common.displayAsnLineNum").$D("行号"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("slod.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("slod.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "lineStatusMeaning",
        fieldName: $T("slod.common.model.common.lineStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "actualQuantity",
        // fieldName: commonInfo?.node === "ASN" ?
        //   $T("slod.common.model.common.createQuantity").$D("本次创建数量") :
        //   $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "quantity",
        fieldName: $T("slod.common.model.common.affirmQuality").$D("确认数量"),
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "unitPackageQuantity",
        fieldName: $T("slod.common.model.common.unitPackageQuantity").$D("单包装数"),
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "packageQuantity",
        fieldName: $T("slod.common.model.common.packageQuantity").$D("比例份数"),
      },
      {
        fieldCode: "remainderQuantity",
        fieldName: $T("slod.common.model.common.remainderQuantity").$D("尾数"),
      },
      {
        fieldCode: "netWeight",
        fieldName: $T("slod.common.model.common.netWeight").$D("净重（KG)"),
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "grossWeight",
        fieldName: $T("slod.common.model.common.").$D("毛重（KG)"),
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "displayUom",
        fieldName: $T("slod.common.model.common.displayUom").$D("单位"),
      },
      {
        fieldCode: "sourceQuantity",
        fieldName: $T("slod.common.model.common.sourceQuantity").$D("来源单据数量"),
      },
      {
        fieldCode: "canCreateQuantity",
        fieldName: $T("slod.common.model.common.canCreateQuantity").$D("可创建数量"),
      },
      {
        fieldCode: "lotNum",
        fieldName: $T("slod.common.model.common.lotNum").$D("批次号"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "productionDate",
        fieldName: $T("slod.common.model.common.productionDate").$D("生产日期"),
        fieldType: "DATE",
      },
      {
        fieldCode: "lotExpirationDate",
        fieldName: $T("slod.common.model.common.lotExpirationDate").$D("批次有效期"),
        fieldType: "DATE",
      },
      {
        fieldCode: "serialNum",
        fieldName: $T("slod.common.model.common.serialNum").$D("序列号"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "purchaseLineRemark",
        fieldName: $T("slod.common.model.common.purchaseLineRemark").$D("采购方行备注"),
      },
      {
        fieldCode: "supplierLineRemark",
        fieldName: $T("slod.common.model.common.supplierLineRemark").$D("供应商行备注"),
        fieldType: "TEXT_AREA",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("slod.common.model.common.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "deliveryAddress",
        fieldName: $T("slod.common.model.common.deliveryAddress").$D("发货地址"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "receiveAddress",
        fieldName: $T("slod.common.model.common.receiveAddress").$D("收货地址"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "sourceNodeConfigName",
        fieldName: $T("slod.common.model.common.sourceType").$D("来源单据类型"),
      },
      {
        fieldCode: "fromDisplayPoNum",
        fieldName: $T("slod.common.model.common.fromDisplayPoNum").$D("来源订单号-行号"),
      },
      {
        fieldCode: "fromDisplayPoLocationNum",
        fieldName: $T("slod.common.model.common.fromDisplayPoLocationNum").$D("发运号"),
      },
      {
        fieldCode: "sourceDisplayNum",
        fieldName: $T("slod.common.model.common.sourceDisplayNum").$D("来源单据编号-行号"),
      },
      {
        fieldCode: "shipToLocContName",
        fieldName: $T("slod.common.model.common.shipToLocContName").$D("联系人"),
      },
      {
        fieldCode: "shipToLocTelNum",
        fieldName: $T("slod.common.model.common.shipToLocTelNum").$D("联系电话"),
      },
      {
        fieldCode: "productNum",
        fieldName: $T("slod.common.model.common.productNum").$D("商品编码"),
      },
      {
        fieldCode: "productName",
        fieldName: $T("slod.common.model.common.productName").$D("商品名称"),
      },
      {
        fieldCode: "catalogName", // 商品目录 送货  行
        fieldName: $T("slod.common.model.common.catalogName").$D("商品目录"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("slod.common.model.common.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "purchaseLineAttachmentUuid",
        fieldName: $T("slod.common.model.common.purchaseLineAttachmentUuid").$D("采购方行附件"),
        fieldType: "UPLOAD",
        readOnly: true,
      },
      {
        fieldCode: "supplierLineAttachmentUuid",
        fieldName: $T("slod.common.model.common.supplierLineAttachmentUuid").$D("供应商行附件"),
        fieldType: "UPLOAD",
        readOnly: false,
        canUpload: true,
        canDelete: true,
      },
      {
        fieldCode: "splitFlag",
        fieldName: $T("slod.common.model.common.splitFlag").$D("拆分标记"),
      },
      {
        fieldCode: "occupiedQuantity",
        fieldName: $T("slod.common.model.common.occupiedQuantity").$D("占用数量"),
      },
      {
        fieldCode: "changingFlag",
        fieldName: $T("slod.common.model.common.changingFlag").$D("变更标识"),
      },
      {
        fieldCode: "exportRecord",
        fieldName: $T("slod.common.model.common.exportRecord").$D("导出记录"),
      },
      { // 计划
        fieldCode: "plannedArrivalDate",
        fieldName: $T("slod.common.model.common.plannedArrivalDate").$D("本次计划到货日期"),
        fieldType: "DATE",
      },
      { // 计划
        fieldCode: "splitDisplayLineNum",
        fieldName: $T("slod.common.model.common.splitDisplayLineNum").$D("拆分行号"),
      },
      { // 计划
        fieldCode: "neededDate",
        fieldName: $T("slod.common.model.common.neededDate").$D("需求日期"),
      },
      { // 计划
        fieldCode: "promisedDate",
        fieldName: $T("slod.common.model.common.promisedDate").$D("承诺交货日期"),
      },
      { // 计划
        fieldCode: "productionDate",
        fieldName: $T("slod.common.model.common.productionDate").$D("生产日期"),
      },
      { // 计划
        fieldCode: "agentName",
        fieldName: $T("slod.common.model.common.agentName").$D("采购员"),
      },
      { // 计划
        fieldCode: "categoryName",
        fieldName: $T("slod.common.model.common.categoryNames").$D("品类"),
      },
      { // 计划
        fieldCode: "invOrganizationName",
        fieldName: $T("slod.common.model.common.invOrganizationNames").$D("库存组织"),
      },
      { // 计划
        fieldCode: "confirmArrivalDate",
        fieldName: $T("slod.common.model.common.confirmArrivalDate").$D("确认到货日期"),
        fieldType: "DATE",
      },
      { // 计划
        fieldCode: "createCampCodeMeaning",
        fieldName: $T("slod.common.model.common.createCampCodeMeaning").$D("创建方"),
      },
      { // 计划
        fieldCode: "createdName",
        fieldName: $T("slod.common.model.common.createdName").$D("创建人"),
      },
      { // 计划
        fieldCode: "occupiedQuantity",
        fieldName: $T("slod.common.model.common.occupiedQuantity").$D("占用数量"),
      },
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/{node}/{nodeConfigId}/detail/line/{id}?campKey=s`,
        method: "get",
      },
      submit: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/{node}/{id}/create?campKey=s`,
        method: "post",
      },
      update: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/{node}/{id}/create/condition?campKey=s`,
        method: "post",
      }
    },
  };
}
// 导出记录
function exportRecordDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    forceValidate:true,
    queryParameter: {
      asyncCountFlag: "N",
    },
    pathParameter: {
      id: "",
    },
    fields: [
      {
        fieldCode: "exportTypeMeaning",
        fieldName: $T("slod.common.model.common.exportTypeMeaning").$D("接口名称"),
      },
      {
        fieldCode: "exportType",
        fieldName: $T("slod.common.model.common.exportType").$D("接口代码"),
      },
      {
        fieldCode: "exportStatusMeaning",
        fieldName: $T("slod.common.model.common.exportStatusMeaning").$D("导出状态"),
      },
      {
        fieldCode: "synchronous",
        fieldName: $T("slod.common.model.common.synchronous").$D("同步执行"),
      },
      {
        fieldCode: "exportMessage",
        fieldName: $T("slod.common.model.common.exportMessage").$D("反馈信息"),
      },
      {
        fieldCode: "externalSystemCode",
        fieldName: $T("slod.common.model.common.externalSystemCode").$D("外部系统"),
      },
    ],
    transport: {
      read: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/{node}/export-record?campKey=s`,
        method: "get",
      },
      submit: {
        url: `/slod/v1/${SrmUtil.getTenantId()}/delivery/{node}/{id}/re-sync?campKey=s`,
        method: "put",
      },
    },
    events: {
      beforeSubmit(ds, data) {
        return data[0];
      }
    }
  };
}

export {
  nodeDs,
  asnLineDs,
  exportRecordDs,
};
