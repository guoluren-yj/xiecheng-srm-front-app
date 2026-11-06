import SrmAppCore from "srm-front-app-core";
import { $T } from "srm-mobile-ui";

// 跳转商品页面
const routerMall = ({ record, vm }) => {
  const {
    uomCodeAndName,
    currencyCode,
    itemName,
    itemCode,
    productId,
    localCurrencyNoTaxUnit,
    localCurrencyTaxUnit,
    categoryName,
    attributeVarchar40,
    taxRate,
  } = record;
  vm.$router.push({
    path: "/appPlat/skuPreview",
    query: {
      skuId: productId, // 商品id
      unitPrice: localCurrencyTaxUnit, // 含税单价
      unTaxedPrice: localCurrencyNoTaxUnit, // 未税单价
      uom: uomCodeAndName, // 单位
      tax: taxRate, // 税率
      currency: currencyCode, // 币种
      itemName, // 物料编码
      itemCode, // 物料名称
      categoryCode: attributeVarchar40, // 品类编码
      categoryName, // 品类名称
    },
  });
};

function getColumnForXxjt(vm) {
  return [
    {
      fieldCode: "routerMall",
      formRow: 900,
      fieldName: $T("sprm.common.model.cux.routerMall").$D("商品跳转"),
      render: () =>
        <span style="color: #276EF1;">
          {$T("hzero.common.buttonhzero.common.button.look").$D("查看")}
        </span>,
      callBack: (record) => {
        routerMall({ record, vm });
      },
    },
  ];
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-XXJT": {
    getColumns: getColumnForXxjt,
  },
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
