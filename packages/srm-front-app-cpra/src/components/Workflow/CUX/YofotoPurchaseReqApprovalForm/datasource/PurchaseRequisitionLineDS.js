// 行列表
import { SrmUtil, $T } from "srm-mobile-ui";

// changeState说明：0-无变更；1-变更后；2-变更前；
// 没有变更显示黑色，变更后红色，变更前黄色；通过按钮进行切换；有变更默认显示变更后
function changeStateColor(item, fieldCode) {
  // 0无变更
  if (item.changeState === 0) {
    return {
      color: "var(--font-color-default)",
      value: item[fieldCode],
    };
  }
  // 如果changeFiledMap表不存在，默认无变更
  if (!item.changeFiledMap) {
    return {
      color: "var(--font-color-default)",
      value: item[fieldCode],
    };
  }
  let beforeChangeValue = item.changeFiledMap[fieldCode];
  // 如果变更前字段值未定义，视为未变更该字段
  if (typeof beforeChangeValue === "undefined") {
    return {
      color: "var(--font-color-default)",
      value: item[fieldCode],
    };
  }
  // 变更后红色
  if (item.changeState === 1) {
    return {
      color: "var(--color-danger)",
      value: item[fieldCode],
    };
  }
  // 变更前黄色
  return {
    color: "var(--color-warn)",
    value: item.changeFiledMap[fieldCode],
  };
}

// type: 国际化的类型。COUNT：数量；PRICE：价格；金额：AMOUNT；
function changeStateRender(item, fieldCode, fieldName, type = "NONE", precision) {
  // state：需要显示的颜色、显示的值
  let state = changeStateColor(item, fieldCode);
  let displayValue = state.value;
  // 是否是价格隐藏，如果是价格隐藏，强制将显示值改为meaning
  let priceHidden = item.linePriceHiddenFlag === 1;
  if (type === "PRICE" || type === "AMOUNT") {
    if (priceHidden) {
      displayValue = item[`${fieldCode}Meaning`];
    }
  }
  if (type === "COUNT") {
    displayValue = SrmUtil.getNumberLocalized(displayValue);
  } else if (type === "PRICE" && !priceHidden) {
    if (precision && item.prSourcePlatform === "SRM") {
      displayValue = SrmUtil.getNumberLocalized(displayValue, item[precision]);
    } else {
      displayValue = SrmUtil.getNumberLocalized(displayValue);
    }
  } else if (type === "AMOUNT" && !priceHidden) {
    // 仅SRM来源需要金额精度
    if (precision && item.prSourcePlatform === "SRM") {
      displayValue = SrmUtil.getNumberLocalized(displayValue, item[precision]);
    } else {
      displayValue = SrmUtil.getNumberLocalized(displayValue);
    }
  }
  if (displayValue === 0) {
    return <span style={{
      color: state.color,
    }}>{fieldName}：{displayValue}</span>;
  }
  return <span style={{
    color: state.color,
  }}>{fieldName}：{displayValue || "-"}</span>;
}

// changedFlag：单据变更中总开关
function purchaseRequisitionLineDS(prHeaderId, changedFlag) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASELINE",
      workFlowFlag: 1
    },
    fields: [ {
      fieldCode: "invOrganizationName",
      fieldType: "EMPTY",
      render: (val, item) => {
        let state = changeStateColor(item, "invOrganizationName");
        return <srm-list-header>
          <span style={{
            color: state.color,
          }}>{state.value || "-"}</span>
          <span slot="right">{item.prLineStatusCodeMeaning}</span>
        </srm-list-header>;
      },
    }, {
      fieldCode: "quantity",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "quantity", $T("sprm.common.model.common.purchaseQuantity").$D("申请数量"), "COUNT"),
    }, {
      fieldCode: "displayLineNum",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "displayLineNum", $T("sprm.common.model.common.lineNumber").$D("行号")),
    }, {
      fieldCode: "productName",
      fieldType: "EMPTY",
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "productName", $T("sprm.common.model.common.productName").$D("商品名称")),
    }, {
      fieldCode: "productNum",
      fieldType: "EMPTY",
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "productNum", $T("sprm.common.model.common.productNum").$D("商品编码")),
    }, {
      fieldCode: "itemName",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "itemName", $T("sprm.common.model.common.itemName").$D("物料名称")),
    }, {
      fieldCode: "itemCode",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "itemCode", $T("sprm.common.model.common.itemCode").$D("物料编码")),
    }, {
      fieldCode: "categoryName",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "categoryName", $T("sprm.common.model.common.categoryName").$D("物料分类")),
    }, {
      fieldCode: "productSpecsJson",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.productSpecs").$D("商品属性"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "taxIncludedUnitPrice",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "taxIncludedUnitPrice", $T("sprm.common.model.common.enteredTaxIncludedPrice").$D("含税单价"), "PRICE", "defaultPrecision"),
    }, {
      fieldCode: "lastPurchasePrice",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.lastPurPrice").$D("上次采购单价"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE" && item.prSourcePlatform !== "CATALOGUE" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "attachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("sprm.common.view.panel.attachmentInfo").$D("附件"),
    }, {
      fieldCode: "executionBillDetail",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
    }, {
      fieldCode: "budgetIoFlag",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.budgetInouterFlag").$D("预算内外标识"),
      render: (val) => {
        if (val === null || val === "" || typeof val === "undefined") {
          return val;
        }
        return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
      },
    }, {
      fieldCode: "neededDate",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "neededDate", $T("sprm.common.model.common.needDate").$D("需求日期")),
    }, {
      fieldCode: "remark",
      fieldType: "EMPTY",
      render: (val, item) => changeStateRender(item, "remark", $T("sprm.common.model.common.remark").$D("备注")),
    }, ],
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${prHeaderId}/lines`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, datas) => {
        datas.forEach((item) => {
          // changeState说明：0-无变更；1-变更后；2-变更前
          if (changedFlag && item.changedFlag) {
            item.changeState = 1;
          } else {
            item.changeState = 0;
          }
        });
      }
    }
  };
}

export {
  purchaseRequisitionLineDS,
};