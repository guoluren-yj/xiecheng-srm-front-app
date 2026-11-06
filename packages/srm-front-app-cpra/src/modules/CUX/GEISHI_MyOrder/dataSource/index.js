import { $T, SrmUtil } from "srm-mobile-ui";
const createDocumentDs = () => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 20,
  editable: true,
  editFlag: false,
  enableQuery: true,
  data: [],
  queryParameter: {
    poWorkbenchFlag: 1,
    erpControlFlag: 1,
    customizeUnitCode:
      "SODR.WORKSPACE_PURCHASEREQUEST.SEARCH,SODR.WORKSPACE_PURCHASEREQUEST.LIST",
    customizeFilterComparison:
      "itemCode:=,neededDate:~,purchaseAgentId:=,itemName:LIKE,creationDate:desc,companyId:=,prNum:=,categoryId:=,attributeVarchar10:=",
  },
  fields: [
    {
      fieldCode: "prNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.prNum").$D(
        "采购申请编号",
      ),
    },
    {
      fieldCode: "displayLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.displayLineNum",
      ).$D("行号"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.itemCode").$D(
        "物料编码",
      ),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.itemName").$D(
        "物料名称",
      ),
    },
    {
      fieldCode: "attributeVarchar10",
      fieldType: "TEXT",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.attributeVarchar10",
      ).$D("存货代码"),
    },
    {
      fieldCode: "selectSupplierCompanyName",
      required: true,
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.orderSupplierLov",
      ).$D("推荐供应商"),
    },
    {
      fieldCode: "quantity",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.quantity").$D(
        "数量",
      ),
    },
    {
      fieldCode: "thisOrderQuantity",
      fieldType: "INPUT_NUMBER",
      required: true,
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.thisOrderQuantity",
      ).$D("本次下单数量"),
    },
    {
      fieldCode: "restPoQuantity",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.restPoQuantity",
      ).$D("剩余可下单数量"),
    },
    {
      fieldCode: "neededDate",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.neededDate").$D(
        "需求日期",
      ),
    },
    {
      fieldCode: "uomName",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.uomName").$D(
        "单位",
      ),
    },
    {
      fieldCode: "noUnitPrice",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.noUnitPrice").$D(
        "单价（不含税）",
      ),
    },
    {
      fieldCode: "taxIncludedUnitPrice",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.taxIncludedUnitPrice",
      ).$D("预估单价(含税)"),
    },
  ],
  fastQueryField: {
    fieldCode: "prNum",
    fieldType: "TEXT",
    fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.prNum").$D(
      "采购申请编号",
    ),
  },
  // 查询表单字段
  queryFields: [
    {
      fieldCode: "itemCode",
      fieldType: "LOV",
      lovCode: "SODR.PR_PO_ITEM",
      options:{
        valueField: "itemCode",
        queryParams:{
          organizationId:localStorage.getItem("organizationId")
        },
      },
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.itemCode").$D(
        "物料编码",
      ),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.itemName").$D(
        "物料名称",
      ),
    },
    {
      fieldCode: "attributeVarchar10",
      fieldType: "TEXT",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.attributeVarchar10",
      ).$D("存货代码"),
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      lovCode: "SPFM.USER_AUTH.COMPANY",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.companyId").$D(
        "公司",
      ),
    },
    {
      fieldCode: "purchaseAgentId",
      fieldType: "LOV",
      lovCode: "SPRM.PURCHASE_AGENT",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.purchaseAgentId",
      ).$D("采购员"),
    },
    {
      fieldCode: "neededDate",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.neededDate").$D(
        "需求日期",
      ),
    },
    {
      fieldCode: "creationDate_range",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      fieldName: $T(
        "sodr.workspace.gaishi.modal.receivedOrder.creationDate_range",
      ).$D("创建时间"),
    },
    {
      fieldCode: "categoryId",
      fieldType: "LOV",
      lovCode: "SMDM.TREE_ITEM_CATEGORY_TILED",
      fieldName: $T("sodr.workspace.gaishi.modal.receivedOrder.categoryId").$D(
        "物料分类",
      ),
    },
  ],
  transport: {
    read: {
      url: `/sprm/v1/${SrmUtil.getTenantId()}/po-refer-pr/workbench-pr-line`,
      method: "get",
    },
  },
});

// 订单基础信息和采买组织信息共用Ds
function basicInfoDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    autoCreate: true,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-header/{poHeaderId}/detail",
        method: "get",
        // transformResponse: ({ response }) => {
        //   if (response && !response.failed) {
        //     console.log("response", response);
        //     const {
        //       poTypeDesc,
        //       termsName,
        //       // purchaseOrgName,
        //     } = response;
        //     return {
        //       ...response,
        //       orderTypeName: poTypeDesc,
        //       termName: termsName,
        //     };
        //   }
        // },
      },
    },
  };
}

function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: true,
    enableQuery: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      poHeaderId: null,
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get",
      },
    },
  };
}

function detailsFormData() {
  return {
    autoQuery: false,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "needByDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.workspace.model.myOrder.needByDate").$D("需求日期"),
      },
      {
        fieldCode: "taxId",
        fieldType: "LOV",
        lovCode: "SMDM.TAX",
        fieldName: $T("sodr.workspace.model.myOrder.taxId").$D("税率"),
        displayField: "taxRate",
        options: {
          displayField: "taxRate",
          valueField: "taxId",
          callback: async (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("taxRate", val[0].taxRate);
              ds.current.setField("taxCode", val[0].taxCode);
              ds.current.setField("taxRateType", val[0].taxRateType);
            }
          },
          onClear: (ds) => {
            ds.current.setField("taxRate", null);
            ds.current.setField("taxCode", null);
            ds.current.setField("taxRateType", null);
          },
        },
      },
      {
        fieldCode: "receiveToleranceQuantityType",
        fieldType: "SELECT",
        lovCode: "SMDM.ALLOW_EXCESS_ORDER_TYPE",
        fieldName: $T("sodr.workspace.model.myOrder.receiveToleranceQuantityType").$D("接收允差类型"),
        options: {
          callback: async (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("receiveToleranceQuantityTypeMeaning", val[0].meaning);
            }
          },
          onClear: (ds) => {
            ds.current.setField("receiveToleranceQuantityTypeMeaning", null);
          },
        },
      },
      {
        fieldCode: "receiveToleranceQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sodr.workspace.model.myOrder.receiveToleranceQuantity").$D("接收允差（%）"),
      },
    ],
  };
}

// 获取筛选器编码
function getFilterCode(type) {
  let codeMap = {
    underApproval: "SMBL.ORDER_WORKBENCH.UNDERAPPROVAL.SEARCH",
    toBeSubmitted: "SODR.WORKSPACE_TOBESUBMITED.SEARCH",
    toBeReleased: "SMBL.ORDER_WORKBENCH.TOBEREKEASED.SEARCH",
    feedbackUnderReview: "SMBL.ORDER_WORKBENCH.FEEDBACKUNDERREVIEW.SEARCH",
    all: "SMBL.ORDER_WORKBENCH.ALL.SEARCH",
  };
  return codeMap[type];
}

// 获取列表个性化编码
function getCustomizeCode(type) {
  switch (type) {
    case "underApproval":
      return "SMBL.ORDER_WORKBENCH.UNDERAPPROVAL.LIST";
    case "toBeReleased":
      return "SMBL.ORDER_WORKBENCH.TOBERELEASED.LIST";
    case "feedbackUnderReview":
      return "SMBL.ORDER_WORKBENCH.FEEDBACKUNDERREVIEW.LIST";
    case "all":
      return "SMBL.ORDER_WORKBENCH.ALL.LIST";
    case "toBeSubmitted":
      return "SODR.WORKSPACE_TOBESUBMITED.LIST";
    default:
      return "";
  }
}

// 拼接查询个性化参数
const getQueryCuzCode = (type) =>
  [getCustomizeCode(type), getFilterCode(type)].toString();

// 查询传参
const getQueryParameter = (type) => ({
  poWorkbenchFlag: 1,
  customizeUnitCode: getQueryCuzCode(type),
  customizeOrderField: "creationDate:desc", // 默认排序规则，可自定义更改
});

const getVal = (val) => (typeof val === "string" && val.length ? val : null);

// 处理筛选参数
const beforeQuery = (ds, params) => {
  const { tempKey } = params;
  if (tempKey) {
    const [supplierId, supplierCompanyId] = tempKey.split("-");
    params["supplierId"] = getVal(supplierId);
    params["supplierCompanyId"] = getVal(supplierCompanyId);
  }
};

// 待提交
function toBeSubmittedDs(type) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    filterCustomizeCode: getFilterCode(type),
    queryParameter: getQueryParameter(type),
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header/maintain",
      },
    },
  };
}

export { createDocumentDs, basicInfoDs, lineDs, detailsFormData, toBeSubmittedDs };
