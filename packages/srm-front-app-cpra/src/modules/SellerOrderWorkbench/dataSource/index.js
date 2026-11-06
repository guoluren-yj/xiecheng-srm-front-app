import { $T, SrmUtil } from "srm-mobile-ui";
import { isArray } from "lodash";

const organizationId = localStorage.getItem("organizationId");
const supplierTenantId = localStorage.getItem("supplierTenantId");
const config = [
  {
    type: "toBeFedBack",
    filterCustomizeCode: "SMBL.SELLER_ORDER_WORKBENCH.TOBEFEDBACK_SEARCH",
    customizeCode: "SMBL.SELLER_ORDER_WORKBENCH.TOBEFEDBACK_SEARCH,SMBL.SELLER_ORDER_WORKBENCH.TOBEFEDBACK.LIST",
    statusCodes: null,
    editable: true,
    readUrl: `/spuc/v1/${organizationId}/po-header/confirm-list`,
  },
  {
    type: "feedbackAlready",
    filterCustomizeCode: "SMBL.SELLER_ORDER_WORKBENCH.FEEDBACKALREADY_SEARCH",
    customizeCode: "SMBL.SELLER_ORDER_WORKBENCH.FEEDBACKALREADY_SEARCH,SMBL.SELLER_ORDER_WORKBENCH.FEEDBACKALREADY.LIST",
    statusCodes: "CONFIRMED_ALL",
    editable: false,
    readUrl: `/spuc/v1/${organizationId}/po-header/supplier`,
  },
  {
    type: "all",
    filterCustomizeCode: "SMBL.SELLER_ORDER_WORKBENCH.ALL_SEARCH",
    customizeCode: "SMBL.SELLER_ORDER_WORKBENCH.ALL_SEARCH,SMBL.SELLER_ORDER_WORKBENCH.ALL.LIST",
    statusCodes: [ "PART_FEED_BACK", "PUBLISHED", "DELIVERY_DATE_REVIEW", "DELIVERY_DATE_REJECT", "CONFIRMED,PUBLISH_CANCEL", "CANCELED,CANCELING_WFL,CLOSED,CLOSE_WFL" ],
    editable: false,
    readUrl: `/spuc/v1/${organizationId}/po-header/supplier`,
  },
];
const listDs = (type, vm) => {
  const { actionMeaningMap } = vm;
  const currentConfig = config.find((i) => i.type === type);
  const { filterCustomizeCode, customizeCode, statusCodes, editable, readUrl } = currentConfig;
  const ds = {
    autoQuery: false,
    editable,
    selection: Infinity,
    enableQuery: true,
    queryParameter: {
      supplierTenantId,
      poWorkbenchFlag: 1,
      customizeUnitCode: customizeCode,
      statusCodes: isArray(statusCodes) ? statusCodes.toString() : statusCodes,
    },
    filterCustomizeCode,
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      placeholder: $T("sodr.workspace.view.placeholder.poNumAndNum").$D(
        "请输入订单编号查询"
      ),
      fieldName: $T("slod.orderExecution.model.common.displayPoNum").$D(
        "订单编号"
      ),
    },
    transport: {
      read: {
        url: readUrl,
        method: "get",
      },
      submit: {
        url: `/spuc/v1/${organizationId}/po-header/confirm`,
        method: "post",
      },
      validateUuid:{
        url: `/hfle/v1/${organizationId}/files/check-uuids?bucketName=${SrmUtil.getDefaultBucketName()}`,
        method: "post",
      },
      verification:{
        url: `/spuc/v1/${organizationId}/po-workbench/po-header/feedback/verify/sidebar`,
        method: "post",
      },
    },
  };
  if (actionMeaningMap && isArray(statusCodes)) {
    ds.queryFields = [
      {
        fieldCode: "statusCodes",
        lovCode:"SODR.SALES_ORDER_WORKBENCH_STATUS",
        fieldType: "SELECT",
        displayField:"meaning",
        defaultValue: {
          value: statusCodes.toString(),
          meaning: statusCodes.map((i) => actionMeaningMap[i]).toString(),
        }
      },
    ];
  }
  return ds;
};

const verification = (vue) => ({
  editable: false,
  autoQuery: true,
  enableQuery: false,
  transport:{
    read: {
      url: `/spuc/v1/${organizationId}/po-workbench/po-header/feedback/verify/sidebar`,
      method: "post",
      bodyParameter: vue.body,
    },
  },
});

const detailHeader = (vue) => {
  const { poHeaderId } = vue.$route.query;
  return {
    enableQuery: false,
    showTotalCount: false,
    editable: false,
    forceValidate:true,
    queryParameter:{
      camp:2,
      poEntryPoint: "PURCHASE_PO_CONFIRM",
      customizeUnitCode: "SMBL.SELLER_ORDER_WORKBENCH.BASEINFO,SMBL.SELLER_ORDER_WORKBENCH.ORGANIZATION",
    },
    fields:[
      {
        fieldCode:"taxIncludeAmount",
        precision: (val, item) => {
          const precision = Number(item.financialPrecision);
          return isNaN(precision) ? 20 : precision;
        },
      },
      {
        fieldCode:"amount",
        precision: (val, item) => {
          const precision = Number(item.financialPrecision);
          return isNaN(precision) ? 20 : precision;
        },
      },
    ],
    transport:{
      read: {
        url: `/spuc/v1/${organizationId}/po-header/${poHeaderId}/detail`,
      },
    },
  };
};

const detailLine = (vue) => {
  const { poHeaderId } = vue.$route.query;
  return {
    enableQuery: false,
    forceValidate:true,
    editable: false,
    queryParameter:{
      camp: 2,
      sortType: 4,
      poEntryPoint: "PURCHASE_PO_CONFIRM",
      customizeUnitCode:"SMBL.SELLER_ORDER_WORKBENCH.DETAILINFO",
    },
    fields:[
      {
        fieldCode: "quantity",
        errorMessage: $T("smbl.sellerOrderWorkbench.validate.message.feedbackQuantity").$D("反馈数量必须大于或等于0，小于或等于数量"),
        validator:(val, item) => {
          if (val < 0 || val > item.get("originalQuantity")) {
            return false;
          }
          return true;
        },
      },
    ],
    transport:{
      read: {
        url: `/spuc/v1/${organizationId}/po-line/${poHeaderId}/detail`,
      },
    },
  };
};

export { listDs, verification, detailHeader, detailLine };
