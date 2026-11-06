// 行列表
import { SrmUtil, $T } from "srm-mobile-ui";
import StatusTag from "@/components/StatusTag";
import ListHeader from "@/components/ListHeader";

// changeState说明：0-无变更；1-变更后；2-变更前；
// 没有变更显示黑色，变更后红色，变更前黄色；通过按钮进行切换；有变更默认显示变更后
function changeStateColor(item, fieldCode) {
  // 0无变更
  if (item.changeState === 0) {
    return {
      value: item[fieldCode],
    };
  }
  // 如果changeFiledMap表不存在，默认无变更
  if (!item.changeFiledMap) {
    return {
      value: item[fieldCode],
    };
  }
  let beforeChangeValue = item.changeFiledMap[fieldCode];
  // 如果变更前字段值未定义，视为未变更该字段
  if (typeof beforeChangeValue === "undefined") {
    return {
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
function changeStateRender(
  item,
  fieldCode,
  fieldName,
  type = "NONE",
  precision
) {
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
    displayValue = displayValue ? Number(String(displayValue).replace(/,/g, "")) : displayValue;
  } else if (type === "AMOUNT" && !priceHidden) {
    // 仅SRM来源需要金额精度
    if (precision && item.prSourcePlatform === "SRM") {
      displayValue = SrmUtil.getNumberLocalized(displayValue, item[precision]);
    } else {
      displayValue = SrmUtil.getNumberLocalized(displayValue);
    }
  }
  if (displayValue === 0) {
    return (
      <span>
        <span style={{ color: "var(--font-color-field2)" }}>{fieldName}</span>：
        <span style={{ color: state.color }}>{displayValue}</span>
      </span>
    );
  }
  if (!fieldName) {
    return (
      <span
        style={{
          color: state.color,
        }}
      >
        {displayValue}
      </span>
    );
  }
  return (
    <span>
      <span style={{ color: "var(--font-color-field2)" }}>{fieldName}</span>：
      <span style={{ color: state.color }}>{displayValue || "-"}</span>
    </span>
  );
}

export const getStatusColor = (value) => {
  if (["REJECTED", "SEND_BACK", "CANCELLED", "CLOSED"].includes(value)) {
    return "red";
  } else if (
    ["SUBMIT_SYNC", "EXCUTED", "ASSIGNED", "APPROVED", "SUBMITTED", "FINISHED"].includes(value)
  ) {
    return "green";
  }
  return "yellow";

};

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
    },
    fields: [
      {
        fieldCode: "invOrganizationName",
        fieldType: "EMPTY",
        render: (val, item) => {
          const { color } = changeStateColor(item, "invOrganizationName");
          const { prLineStatusCode, prLineStatusCodeMeaning } = item;
          return (
            <ListHeader showTitle showMoreIcon>
              <span style={{ color }}>{val}</span>
              <StatusTag slot="rightTag" color={getStatusColor(prLineStatusCode)} text={prLineStatusCodeMeaning} />
            </ListHeader>
          );
        },
      },
      {
        fieldCode: "quantity",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "quantity",
            field?.computeFieldName ||
            $T("sprm.common.model.common.purchaseQuantity").$D("申请数量"),
            "COUNT"
          ),
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "quantity",
            field?.computeFieldName ||
            $T("sprm.common.model.common.purchaseQuantity").$D("申请数量"),
            "COUNT"
          ),
      },
      {
        fieldCode: "displayLineNum",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "displayLineNum",
            field?.computeFieldName ||
            $T("sprm.common.model.common.lineNumber").$D("行号")
          ),
      },
      {
        fieldCode: "productName",
        fieldType: "EMPTY",
        visible: (val, item) =>
          item.prSourcePlatform !== "SRM" &&
          item.prSourcePlatform !== "ERP" &&
          item.prSourcePlatform !== "SHOP",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "productName",
            field?.computeFieldName ||
            $T("sprm.common.model.common.productName").$D("商品名称")
          ),
      },
      {
        fieldCode: "productNum",
        fieldType: "EMPTY",
        visible: (val, item) =>
          item.prSourcePlatform !== "SRM" &&
          item.prSourcePlatform !== "ERP" &&
          item.prSourcePlatform !== "SHOP",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "productNum",
            field?.computeFieldName ||
            $T("sprm.common.model.common.productNum").$D("商品编码")
          ),
      },
      {
        fieldCode: "itemName",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "itemName",
            field?.computeFieldName ||
            $T("sprm.common.model.common.itemName").$D("物料名称")
          ),
      },
      {
        fieldCode: "itemCode",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "itemCode",
            field?.computeFieldName ||
            $T("sprm.common.model.common.itemCode").$D("物料编码")
          ),
      },
      {
        fieldCode: "categoryName",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "categoryName",
            field?.computeFieldName ||
            $T("sprm.common.model.common.categoryName").$D("物料分类")
          ),
      },
      {
        fieldCode: "productSpecsJson",
        fieldType: "TEXT",
        fieldName: $T("sprm.common.model.common.productSpecs").$D("商品属性"),
        visible: (val, item) =>
          item.prSourcePlatform !== "SRM" &&
          item.prSourcePlatform !== "ERP" &&
          item.prSourcePlatform !== "SHOP",
      },
      {
        fieldCode: "secondaryTaxInUnitPrice",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "secondaryTaxInUnitPrice",
            field?.computeFieldName ||
            $T("sprm.common.model.common.taxIncludedUnitPricess").$D(
              "预估单价(含税)"
            ),
            "PRICE",
            "defaultPrecision"
          ),
      },
      {
        fieldCode: "taxIncludedUnitPrice",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "taxIncludedUnitPrice",
            field?.computeFieldName ||
            $T("sprm.common.model.common.taxIncludedUnitPricess").$D(
              "预估单价(含税)"
            ),
            "PRICE",
            "defaultPrecision"
          ),
      },
      {
        fieldCode: "lastPurchasePrice",
        fieldType: "TEXT",
        fieldName: $T("sprm.common.model.common.lastPurPrice").$D(
          "上次采购单价"
        ),
        visible: (val, item) =>
          item.prSourcePlatform !== "E-COMMERCE" &&
          item.prSourcePlatform !== "CATALOGUE" &&
          item.prSourcePlatform !== "SHOP",
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("sprm.common.view.panel.attachmentInfo").$D("附件"),
      },
      {
        fieldCode: "executionBillDetail",
        fieldType: "TEXT",
        fieldName: $T("sprm.common.model.common.executionBillDetail").$D(
          "执行单据详情"
        ),
      },
      {
        fieldCode: "budgetIoFlag",
        fieldType: "TEXT",
        fieldName: $T("sprm.common.model.common.budgetInouterFlag").$D(
          "预算内外标识"
        ),
        render: (val) => {
          if (val === null || val === "" || typeof val === "undefined") {
            return val;
          }
          return val ?
            $T("smbl.common.view.yes").$D("是") :
            $T("smbl.common.view.no").$D("否");
        },
      },
      {
        fieldCode: "neededDate",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "neededDate",
            field?.computeFieldName ||
            $T("sprm.common.model.common.needDate").$D("需求日期")
          ),
      },
      {
        fieldCode: "remark",
        fieldType: "EMPTY",
        render: (val, item, field) =>
          changeStateRender(
            item,
            "remark",
            field?.computeFieldName ||
            $T("sprm.common.model.common.remark").$D("备注")
          ),
      },
    ],
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
      },
    },
  };
}

const benefitEstimationDs = (prHeaderId) => ({
  pageSize: 5,
  dataToJSON: 'all',
  autoQuery: true,
  editable: false,
  editFlag: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "benefitIndex",
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.benefitIndex").$D(
        "效益指标"
      ),
      render: (val, item) => {
        return (
          <ListHeader showTitle>
            <span>{item.benefitIndexMeaning||item.benefitIndex}</span>
          </ListHeader>
        );
      },
    },
    {
      fieldCode: "indexType",
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.indexType").$D("指标类型"),
      render: (val, item) => item.indexTypeMeaning||item.indexType
    },
    {
      fieldCode: "isCoreIndex",
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.isCoreIndex").$D("是否核心指标"),
      render: (val) => {
        if (val === null || val === "" || typeof val === "undefined") {
          return val;
        }
        return val ?
          $T("smbl.common.view.yes").$D("是") :
          $T("smbl.common.view.no").$D("否");
      },
    },
    {
      fieldCode: "historyActivityReference",
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.historyActivityReference").$D("历史活动参考"),

    },
    {
      fieldCode: 'historyExpenses',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.historyExpenses").$D("历史花费（元）"),
    },
    {
      fieldCode: 'historyBenefitReachSituation',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.historyBenefitReachSituation").$D("历史效益达成情况"),
    },
    {
      fieldCode: 'thisExpenses',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.thisExpenses").$D("本次花费（元）"),
    },
    {
      fieldCode: 'thisBenefitEvaluation',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.thisBenefitEvaluation").$D("本次效益预估"),
    },
    {
      fieldCode: 'remark',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.remark").$D("备注"),
    },
  ],
  transport: {
    read: {
      url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/EQtZkGic58pibUfE3BWr9BjRgALIKNGnz3E08cHrSWx1I?prHeaderId=${prHeaderId}&operationType=2`,
      method: "get",
      query: { prHeaderId }
    },
  },
});

//
const benefitReviewDs = (prHeaderId) => {
 return {
  pageSize: 5,
  dataToJSON: 'all',
  autoQuery: true,
  editable: false,
  editFlag: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: 'benefitIndex',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.benefitIndex").$D("效益指标"),
      render: (val, item) => {
        return (
          <ListHeader showTitle>
            <span>{item.benefitIndexMeaning||item.benefitIndex}</span>
          </ListHeader>
        );
      },
    },
    {
      fieldCode: 'indexType',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.indexType").$D("本次效益预估"),
      render: (val, item) => item.indexTypeMeaning||item.indexType
    },
    {
      fieldCode: 'isCoreIndex',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.isCoreIndex").$D("是否核心指标"),
      render: (val) => {
        if (val === null || val === "" || typeof val === "undefined") {
          return val;
        }
        return val ?
          $T("smbl.common.view.yes").$D("是") :
          $T("smbl.common.view.no").$D("否");
      },
    },
    {
      fieldCode: 'evaluation',
      fieldType: "NUMBER",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.evaluation").$D("预估数据"),
    },
    {
      fieldCode: 'actual',
      fieldType: "NUMBER",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.actual").$D("实际数据"),
    },
    {
      fieldCode: 'difference',
      fieldType: "NUMBER",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.difference").$D("差异"),
    },
    {
      fieldCode: 'differenceReasons',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.differenceReasons").$D("差异原因"),
    },
    {
      fieldCode: 'reachSituation',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.reachSituation").$D("达成情况"),
    },
    {
      fieldCode: 'remark',
      fieldType: "TEXT",
      fieldName: $T("scux.shiyue.modal.benefitEstimation.remark").$D("备注"),
    },
  ],
  transport: {

    read: {
      url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/wpKrCV5dAXf04EerI2QtUUCst8uR8Mult8aAruv0I0gT7q1UnCwxgjQ1bn7Qt4In?prHeaderId=${prHeaderId}`,
      method: "get",
      data: { prHeaderId }
    },
  },
}};

export { purchaseRequisitionLineDS, benefitReviewDs, benefitEstimationDs };
