// 行详情
import { $T, SrmUtil } from "srm-mobile-ui";
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
function changeStateRender(item, fieldCode, type = "NONE", precision = null) {
  // state：需要显示的颜色、显示的值
  let state = changeStateColor(item, fieldCode);
  // 需要显示的值
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
    if (precision) {
      let length = item[precision];
      // 仅SRM来源需要金额精度
      if (item.prSourcePlatform === "SRM") {
        displayValue = SrmUtil.getNumberLocalized(displayValue, length);
      } else {
        displayValue = SrmUtil.getNumberLocalized(displayValue);
      }
    } else {
      displayValue = SrmUtil.getNumberLocalized(displayValue);
    }
  } else if (type === "AMOUNT" && !priceHidden) {
    let length = 0;
    if (precision) {
      length = item[precision];
    } else {
      length = item.financialPrecision;
    }
    // 仅SRM来源需要金额精度
    if (item.prSourcePlatform === "SRM") {
      displayValue = SrmUtil.getNumberLocalized(displayValue, length);
    } else {
      displayValue = SrmUtil.getNumberLocalized(displayValue);
    }
  }
  if (displayValue === 0) {
    return <span style={{
      color: state.color,
    }}>{displayValue}</span>;
  }
  return <span style={{
    color: state.color,
  }}>{displayValue || "-"}</span>;
}

function prLineDetailDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "displayLineNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),
      render: (val, item) => changeStateRender(item, "displayLineNum"),
    }, {
      fieldCode: "quantity",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.purchaseQuantity").$D("申请数量"),
      render: (val, item) => changeStateRender(item, "quantity", "COUNT"),
    }, {
      fieldCode: "prLineStatusCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.prStatusCode").$D("状态"),
      render: (val, item) => changeStateRender(item, "prLineStatusCodeMeaning"),
    }, {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
      render: (val, item) => changeStateRender(item, "invOrganizationName"),
    }, {
      fieldCode: "productNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.productNum").$D("商品编码"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "productNum"),
    }, {
      fieldCode: "operable",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.operable").$D("可操作类型"),
      visible: (val, item) => item.prSourcePlatform === "SRM" || item.prSourcePlatform === "ERP",
      render: (val, item) => changeStateRender(item, "operable"),
    }, {
      fieldCode: "productName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.productName").$D("商品名称"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "productName"),
    }, {
      fieldCode: "skuType",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.skuMarkType").$D("定制品标识"),
      visible: (val, item) => item.prSourcePlatform === "CATALOGUE",
      render: (val, item) => changeStateRender(item, "skuType"),
    }, {
      fieldCode: "customUomName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.customUomName").$D("定制单位"),
      visible: (val, item) => item.prSourcePlatform === "CATALOGUE",
      render: (val, item) => changeStateRender(item, "customUomName"),
    }, {
      fieldCode: "customQuantity",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.customQuantity").$D("定制数量"),
      visible: (val, item) => item.prSourcePlatform === "CATALOGUE",
      render: (val, item) => changeStateRender(item, "customQuantity", "COUNT"),
    }, {
      fieldCode: "packageQuantity",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.packageQuantity").$D("份数", "COUNT"),
      visible: (val, item) => item.prSourcePlatform === "CATALOGUE",
      render: (val, item) => changeStateRender(item, "packageQuantity"),
    }, {
      fieldCode: "thirdSkuCode",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.thirdSkuCode").$D("第三方商品编码"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "thirdSkuCode"),
    }, {
      fieldCode: "thirdSkuName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.thirdSkuName").$D("第三方商品名称"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
      render: (val, item) => changeStateRender(item, "thirdSkuName"),
    }, {
      fieldCode: "customSpecsJson",
      fieldName: $T("sprm.common.model.common.customSpecs").$D("定制品属性"),
      fieldType: "TEXT",
      visible: (val, item) => item.prSourcePlatform === "CATALOGUE",
    }, {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
      render: (val, item) => changeStateRender(item, "itemCode"),
    }, {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
      render: (val, item) => changeStateRender(item, "itemName"),
    }, {
      fieldCode: "itemModel",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
      render: (val, item) => changeStateRender(item, "itemModel"),
    }, {
      fieldCode: "itemSpecs",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
      render: (val, item) => changeStateRender(item, "itemSpecs"),
    }, {
      fieldCode: "categoryName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
      render: (val, item) => changeStateRender(item, "categoryName"),
    }, {
      fieldCode: "customMadeFlag",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.customMadeFlag").$D("是否定制标识"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE" && item.prSourcePlatform !== "CATALOGUE" && item.prSourcePlatform !== "SHOP",
      render: (val) => {
        if (val === null || val === "" || typeof val === "undefined") {
          return val;
        }
        return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
      },
    }, {
      fieldCode: "customAttributeList",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.customAttributeList").$D("物料定制属性"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE" && item.prSourcePlatform !== "CATALOGUE" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "catalogName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.catalogName").$D("商品目录名"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "productSpecsJson",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.productSpecs").$D("商品属性"),
      visible: (val, item) => item.prSourcePlatform !== "SRM" && item.prSourcePlatform !== "ERP" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "neededDate",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
      render: (val, item) => changeStateRender(item, "neededDate"),
    }, {
      fieldCode: "occupiedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.occupiedQuantity").$D("已占用数量"),
    }, {
      fieldCode: "changeQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.changeQuantity").$D("变更数量"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE" && item.prSourcePlatform !== "CATALOGUE" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "orderOccupiedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.orderOccupiedQuantity").$D("订单占用数量"),
    }, {
      fieldCode: "sourceOccupiedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.sourceOccupiedQuantity").$D("寻源占用数量"),
    }, {
      fieldCode: "restSourceQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.restSourceQuantity").$D("寻源可用数量"),
    }, {
      fieldCode: "restPoQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.orderRestPoQuantity").$D("订单可用数量"),
    }, {
      fieldCode: "secondLevelStrategyMeaning",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.secondLevelStrategyCode").$D("寻源二级链路"),
    }, {
      fieldCode: "uomCodeAndName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
      render: (val, item) => changeStateRender(item, "uomCodeAndName"),
    }, {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.settle.currencyCode").$D("币种"),
      render: (val, item) => changeStateRender(item, "currencyCode"),
    }, {
      fieldCode: "taxIncludedUnitPrice",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
      render: (val, item) => changeStateRender(item, "taxIncludedUnitPrice", "PRICE", "defaultPrecision"),
    }, {
      fieldCode: "lastPurchasePrice",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.lastPurPrice").$D("上次采购单价"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE" && item.prSourcePlatform !== "CATALOGUE" && item.prSourcePlatform !== "SHOP",
    }, {
      fieldCode: "unitPriceBatch",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.unitPriceBatch").$D("每"),
      render: (val, item) => changeStateRender(item, "unitPriceBatch"),
    }, {
      fieldCode: "taxIncludedLineAmount",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.purLine.taxIncludedLineAmount").$D("含税行金额"),
      render: (val, item) => changeStateRender(item, "taxIncludedLineAmount", "AMOUNT", "financialPrecision"),
    }, {
      fieldCode: "localCurrencyNoTaxSum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币不含税金额"),
      render: (val, item) => changeStateRender(item, "localCurrencyNoTaxSum", "AMOUNT", "localFinancialPrecision"),
    }, {
      fieldCode: "localCurrencyNoTaxUnit",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.localCurrencyNoTaxUnit").$D("本币不含税单价"),
      render: (val, item) => changeStateRender(item, "localCurrencyNoTaxUnit", "PRICE", "localDefaultPrecision"),
    }, {
      fieldCode: "localCurrencyTaxUnit",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.localCurrencyTaxUnit").$D("本币含税单价"),
      render: (val, item) => changeStateRender(item, "localCurrencyTaxUnit", "PRICE", "localDefaultPrecision"),
    }, {
      fieldCode: "localCurrencyTaxSum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D("本币含税金额"),
      render: (val, item) => changeStateRender(item, "localCurrencyTaxSum", "AMOUNT", "localFinancialPrecision"),
    }, {
      fieldCode: "supplierList",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.supplierCompanyId").$D("建议供应商"),
    }, {
      fieldCode: "supplierCompanyIdLov",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.supplierCompanyId").$D("建议供应商"),
      render: (val, item) => {
        if (item.supplierName) {
          return changeStateRender(item, "supplierName");
        }
        return changeStateRender(item, "supplierCompanyName");
      },
    }, {
      fieldCode: "prRequestedName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
      render: (val, item) => {
        // ERP来源，不变更
        if (item.prSourcePlatform === "ERP") {
          return item.prRequestedNum && val ? `${item.prRequestedNum}-${val}` : $T("smbl.common.model.anonymous").$D("匿名用户");
        }
        let prRequestedNameState = changeStateColor(item, "prRequestedName");
        let prRequestedNumState = changeStateColor(item, "prRequestedNum");
        return prRequestedNameState.value && prRequestedNumState.value ? <span style={{
          color: prRequestedNameState.color,
        }}>{`${prRequestedNumState.value || ""}-${prRequestedNameState.value}`}</span> : $T("smbl.common.model.anonymous").$D("匿名用户");
      },
    }, {
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.purchaseAgents").$D("采购员"),
      render: (val, item) => changeStateRender(item, "purchaseAgentName"),
    }, {
      fieldCode: "executorName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.handlePerson").$D("需求执行人"),
    }, {
      fieldCode: "accountSubjectName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.sumProject").$D("总账科目"),
      render: (val, item) => changeStateRender(item, "accountSubjectName"),
    }, {
      fieldCode: "costName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.costName").$D("成本中心"),
      render: (val, item) => changeStateRender(item, "costName"),
    }, {
      fieldCode: "expBearDep",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.moneyPayPart").$D("费用承担部门"),
      render: (val, item) => changeStateRender(item, "expBearDep"),
    }, {
      fieldCode: "projectNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.projectNum").$D("项目号"),
      render: (val, item) => changeStateRender(item, "projectNum"),
    }, {
      fieldCode: "projectName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.projectName").$D("项目名称"),
      render: (val, item) => changeStateRender(item, "projectName"),
    }, {
      fieldCode: "projectCategoryMeaning",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.projectCategory").$D("项目类别"),
      render: (val, item) => changeStateRender(item, "projectCategoryMeaning"),
    }, {
      fieldCode: "wbsCode",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.wbs").$D("WBS编码"),
      render: (val, item) => changeStateRender(item, "wbsCode"),
    }, {
      fieldCode: "taxIncludedBudgetUnitPrice",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.taxIncludedBudgetUnitPrice").$D("预算单价(含税)"),
      // render: (val, item) => changeStateRender(item, "taxIncludedBudgetUnitPrice"),
      render: (val, item) => changeStateRender(item, "taxIncludedBudgetUnitPrice", "PRICE", "defaultPrecision"),
    }, {
      fieldCode: "budgetAccountName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.budgetAccountName").$D("预算科目"),
      render: (val, item) => changeStateRender(item, "budgetAccountName"),
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
      fieldCode: "pcNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.contractNum").$D("协议编号"),
      render: (val, item) => changeStateRender(item, "pcNum"),
    }, {
      fieldCode: "receiveAddress",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.receiveAddress").$D("收货地址"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE",
      render: (val, item) => changeStateRender(item, "receiveAddress"),
    }, {
      fieldCode: "receiveContactName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.receiveContactName").$D("收货联系人"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE",
      render: (val, item) => changeStateRender(item, "receiveContactName"),
    }, {
      fieldCode: "receiveTelNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.receiveTelNum").$D("收货联系电话"),
      visible: (val, item) => item.prSourcePlatform !== "E-COMMERCE",
      // render: (val, item) => changeStateRender(item, "receiveTelNum"),
      render: (val, item) => {
        let telState = changeStateColor(item, "receiveTelNum");
        let telCodeNumState = changeStateColor(item, "internationalTelCode");
        return telState.value ? <span style={{
          color: telState.color,
        }}>{`${telCodeNumState.value} ${telState.value}`}</span> : "-";
      },
    }, {
      fieldCode: "lineFreight",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.lineFreight").$D("行运费"),
      render: (val, item) => changeStateRender(item, "lineFreight", "AMOUNT", "financialPrecision"),
    }, {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.remark").$D("备注"),
      render: (val, item) => changeStateRender(item, "remark"),
    }, {
      fieldCode: "budgetOccupyFlag",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.budgetOccupyFlag").$D("预算占用标识"),
      render: (val) => {
        if (val === null || val === "" || typeof val === "undefined") {
          return val;
        }
        return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
      },
    }, {
      fieldCode: "attachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("sprm.common.model.common.enclosure").$D("附件"),
    }, {
      fieldCode: "changeAttachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("sprm.common.view.attachment.changeAttachmentUuid").$D("变更说明附件"),
    }, {
      fieldCode: "executionBillDetail",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
    }, {
      fieldCode: "productCompareJson",
      fieldType: "TEXT",
      fieldName: $T("sprm.purchaseRequisitionApproval.view.button.priceList").$D("比价单"),
      visible: (val, item) => item.prSourcePlatform === "E-COMMERCE" || item.prSourcePlatform === "CATALOGUE",
    } ],
  };
}

export {
  prLineDetailDS,
};
