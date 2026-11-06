import { $T } from "srm-mobile-ui";
// import { isNil } from "lodash";
// 基本信息
function formDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "companyName",
        fieldName: $T("small.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "applyUserName",
        fieldName: $T("small.common.model.common.applyUserName").$D("申请人"),
      },
      {
        fieldCode: "deptMeaning",
        fieldName: $T("small.common.model.common.deptMeaning").$D("申请部门"),
      },
      {
        fieldCode: "expDeptMeaning",
        fieldName: $T("small.common.model.common.expDeptMeaning").$D(
          "费用部门"
        ),
      },
      {
        fieldCode: "costCenterMeaning",
        fieldName: $T("small.common.model.common.costCenterMeaning").$D(
          "成本中心"
        ),
      },
      {
        fieldCode: "purposeMeaning",
        fieldName: $T("small.common.model.common.purposeMeaning").$D(
          "业务用途"
        ),
      },
      {
        fieldCode: "productionLineMeaning",
        fieldName: $T("small.common.model.common.productionLineMeaning").$D(
          "产品线"
        ),
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("small.common.model.common.currencyCode").$D("币种"),
      },
      {
        fieldCode: "totalPrice",
        fieldName: $T("small.common.model.common.totalPrice").$D(
          "金额（含税）"
        ),
      },
      {
        fieldCode: "templateCode",
        fieldName: $T("small.common.model.common.templateCode").$D(
          "拼单活动编码"
        ),
      },
      {
        fieldCode: "templateName",
        fieldName: $T("small.common.model.common.templateName").$D(
          "拼单活动名"
        ),
      },
    ],
    // transport: {
    //   read: {
    //     url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5ickrPo4Je2O5QeSpACHAg1zfibKcJKjQQqTLxkbqSpETXnBibibgAPLsTgE28c6KTicD`,
    //     method: "get",
    //   },
    // },
  };
}
// 商品范围
function shopDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: true,
    enableQuery: false,
    showTotalCount: false,
    // 模型字段
    fields: [
      {
        fieldCode: "orderNum",
        fieldName: $T("small.common.model.common.orderNum").$D("序号"),
      },
      {
        fieldCode: "skuName",
        fieldName: $T("small.common.model.common.skuName").$D("商品信息"),
      },
      {
        fieldCode: "skuImage",
        fieldName: $T("small.common.model.common.skuImage").$D("商品图片"),
      },
      {
        fieldCode: "quantity",
        fieldName: $T("small.common.model.common.quantity").$D("数量"),
      },
      {
        fieldCode: "taxIncludedPrice",
        fieldName: $T("small.common.model.common.taxIncludedPrice").$D(
          "单价（含税）"
        ),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldName: $T("small.common.model.common.taxIncludedAmount").$D("金额"),
      },
      {
        fieldCode: "neededDate",
        // fieldType: "DATE",
        fieldName: $T("small.common.model.common.neededDate").$D("需求日期"),
      },
      {
        fieldCode: "addressContactName",
        fieldName: $T("small.common.model.common.addressContactName").$D(
          "收货人姓名"
        ),
      },
      {
        fieldCode: "addressContactMobile",
        fieldName: $T("small.common.model.common.addressContactMobile").$D(
          "联系人电话"
        ),
      },
      {
        fieldCode: "addressDetail",
        fieldName: $T("small.common.model.common.addressDetail").$D("收货地址"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("small.common.model.common.supplierCompanyName").$D(
          "供应商名称"
        ),
      },
      {
        fieldCode: "remark",
        fieldName: $T("small.common.model.common.remark").$D("备注"),
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("small.common.model.common.taxRate").$D("税率"),
      },
    ],
    // transport: {
    //   read: {
    //     url: `/smct/v1/${SrmUtil.getTenantId()}/centralized-fixed-skus?templateId={templateId}`,
    //     method: "get",
    //   },
    // },
  };
}

export { formDs, shopDs };
