import SrmAppCore from "srm-front-app-core";
import { http, SrmUtil, $T, DataSet } from "srm-mobile-ui";
import uuid from "uuid";
import { isNil } from "lodash";
import quotationDetailsdS from "../DataSource/index.js";
import { fetchSaveSupQuo } from "../DataSource/api.js";

// 获取报价明细信息
const fetchApprovalRecords = (rfxHeaderId, params) => {
  const url = `ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/approval-records`;
  return http.get(url, { params });
};

// 获取报错
const queryMessage = (rfxHeaderId) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/tKavk3q5yIOSUEhP8XR1ndCzb4IXgYxg6WWgkg2eaM8iaBlFTM2dYyCMVoUGhHx0q?rfxHeaderId=${rfxHeaderId}`;
  return http.get(url, { rfxHeaderId });
};

function weiLongMounted(vm) {
  fetchApprovalRecords(vm.rfxHeaderId).then((res) => {
    if (res && res.length && res[0].approvalHistories?.length) {
      const approvalList = res[0].approvalHistories.reverse().map((item) => ({
        ...item,
        historicTaskExtList: item.historicTaskExtList,
      }));
      vm.approvalRecords = approvalList;
    }
  });
}

function WuLiangYeGetAllQuotationDetailsParmas(vm) {
  vm.params = { ...vm.params, isMobile: 1 };
}

function HutchmedGetName() {
  return $T("ssrc.inquiryHall.model.inquiryHall.sourceProjectTotalAmount").$D(
    "寻源项目总金额",
  );
}

function Buy37GetRouteParams(vm) {
  vm.currentDataSet.setQueryParameter({
    sourceNum: (vm.$route.query || {}).sourceNum,
  });
}

function xxjtLoadBusinessData(vm) {
  const {
    bidFlag = false,
    priceIndicDataSet = {},
    businessIndicDataSet = {},
    headInfo = {},
    scoreIndicData = {},
  } = vm || {};
  const { businessIndicList = [] } = scoreIndicData || {};
  if (bidFlag) {
    const { bidRuleType, templateScoreType, attributeTinyint6 } =
      headInfo || {};
    // 数据源拆分成价格+商务 attributeTinyint6 是否启用价格要素
    if (
      bidRuleType === "DIFF" &&
      templateScoreType === "SCORE" &&
      Number(attributeTinyint6)
    ) {
      const priceData = [];
      const businessData = [];
      businessIndicList.forEach?.((item) => {
        if (item.scoreType === "PRICE") {
          priceData.push(item);
        } else {
          businessData.push(item);
        }
      });
      priceIndicDataSet.setData(priceData);
      businessIndicDataSet.setData(businessData);
      return;
    }
    // 走标准逻辑
    businessIndicDataSet.setData(businessIndicList);
    return;
  }
  // 走标准逻辑
  businessIndicDataSet.setData(businessIndicList);
}

// 中科何盈
function zkhyViewAttachment(vm) {
  const { lineAttachmentInfo = {} } = vm || {};
  const line = lineAttachmentInfo;
  vm.$showFileList({
    isTab: true,
    fileArr: [
      {
        // 二开附件
        title: $T("ssrc.common.model.zkhy.businessAttachments").$D("商务附件"),
        attachmentUuid: line.attributeLongtext11 || uuid(),
        readOnly: true,
      },
      {
        title: $T("ssrc.common.model.bidHall.techAttachments").$D("技术附件"),
        attachmentUuid: line.techAttachmentUuid || uuid(),
        readOnly: true,
      },
      {
        title: $T("ssrc.common.model.bidHall.businessAttachments").$D(
          "商务附件",
        ),
        attachmentUuid: line.businessAttachmentUuid || uuid(),
        readOnly: true,
      },
    ],
  });
}

const topstarApproveCheck = async (vm) => {
  const { bidFlag, headInfo } = vm;
  const { rfxHeaderId = null } = headInfo || {};
  if (bidFlag) {
    return true;
  }
  const res = await queryMessage(rfxHeaderId);
  if (res && res.failed) {
    return false;
  } else if (isNil(res?.message) || res?.message === "") {
    return true;
  } else {
    const result = await new Promise((resolve) => {
      vm.$dialog({
        title: "提示",
        content: res?.message,
        onCancel: () => resolve(false),
        onOk: () => resolve(true),
      });
    });
    return result;
  }
};

const getBidDetailColumns = () => {
  return [
    {
      fieldCode: "configCode",
    },
    {
      fieldCode: "configName",
    },
    {
      fieldCode: "Quantity",
    },
    {
      fieldCode: "Price",
    },
    {
      fieldCode: "Remark",
    },
  ];
};

const saveSupQuo = async (vm, record, quotationDetailsDataSet, listPopup) => {
  const {
    headInfo: { quotationHeaderCurrentId },
  } = vm;
  const customizeUnitCode =
    "SSRC.SUPPLIER_QUOTATION_DETAIL_CURRENT.BASE_ITEM_FORM%2CSSRC.SUPPLIER_QUOTATION_DETAIL_CURRENT.BASE_FORM";
  const { rfxLineItemId, quotationLineCurrentId } = record;
  const validateFlag = await quotationDetailsDataSet.validate();
  if (validateFlag) {
    const currentData = {
      pageFrom: "quotationQuery",
      sourceFrom: "RFX",
      quotationHeaderCurrentId,
      saveLinePostFlag: 1,
      rfxLineItemId,
      customizeUnitCode,
      supQuotationDtlCurList: quotationDetailsDataSet.toData()?.map((i) => ({
        ...i,
        quotationLineCurrentId:
          record.quotationLineCurrentId || quotationLineCurrentId,
      })),
    };
    const res = await fetchSaveSupQuo(currentData);
    if (res?.failed) {
      vm.$notification.open({
        message: res.message,
      });
    } else {
      vm.$notification.open({
        message: $T("ssrc.common.jht.validation.save.success").$D("保存成功！"),
      });
      listPopup.closePopup();
    }
  } else {
    vm.$notification.open({
      message: $T("hipspfm.common.validation.enterRequired").$D("请填写必填项"),
    });
  }
};

const openDetails = async (e, vm, val, record, ds, other) => {
  console.log("ds", ds);
  console.log("other", other);
  e.stopPropagation();
  // await vm.saveQuotation();
  const {
    headInfo: { rfxHeaderId, quotationHeaderCurrentId },
  } = vm;
  const { itemId, rfxLineItemId, quotationLineCurrentId } = record;
  const quotationDetailsDataSet = new DataSet(quotationDetailsdS());
  quotationDetailsDataSet.setQueryParameter({
    customizeUnitCode: "SSRC.SUPPLIER_QUOTATION_DETAIL_CURRENT.BASE_FORM",
    from: "SUP_QUOTATION",
    pageFrom: "quotationQuery",
    quotationHeaderCurrentId,
    quotationLineCurrentId,
    rfxHeaderId,
    itemId,
    rfxLineItemId,
    sourceFrom: "RFX",
  });
  await quotationDetailsDataSet.refresh();
  const listPopup = vm.$popup({
    title: $T("ssrc.supplierQuotation.model.supQuo.quotation.details").$D(
      "报价明细",
    ),
    showHeader: true,
    showClose: false,
    position: "right",
    headerAlign: "center",
    showBack: true,
    content: (
      <div style="display: flex; flex-direction: column;height: 100%">
        <div style="flex: 1;overflow: auto;">
          <srmList
            scrollable={false}
            columns={getBidDetailColumns()}
            dataSet={quotationDetailsDataSet}
          />
        </div>
        <div style=" margin-top: auto;justify-content: space-between; height: 7vh; padding: 6px 15px; align-items: center; font-weight: bold; font-size: 16px; color: var(--font-color-default);">
          <srm-button
            fill
            full-width
            style="margin-left: 2px;"
            type="primary"
            size="large"
            onClick={() =>
              saveSupQuo(vm, record, quotationDetailsDataSet, listPopup)
            }
          >
            {$T("ssrc.supplierQuotation.model.supQuo.button.save").$D("保存")}
          </srm-button>
        </div>
      </div>
    ),
  });
};

// 新报价-报价行字段
const getCuxFieldsWithNewSupplierQuotation = async (vm) => {
  const { bidFlag } = vm;
  if (!bidFlag) {
    const cuxFields = [
      {
        formRow: 500,
        formCol: 1,
        fieldName: $T(
          "ssrc.supplierQuotation.model.supQuo.quotation.details",
        ).$D("报价明细"),
        fieldCode: "quotationDetails",
        fieldType: "EMPTY",
        editor: false,
        render: (val, record, ds, other) =>
          record && (
            <a style={{ fontWeight: "600", color: "#276ef1" }} onClick={(e) => openDetails(e, vm, val, record, ds, other)}>
              {$T("ssrc.supplierQuotation.model.supQuo.quotation.details").$D(
                "报价明细",
              )}
            </a>
          ),
      },
    ];
    return cuxFields;
  }
  return [];
};

// 元祖-公司标签展示
const ganSoShowCompanyTag = () => {
  return true
};

// 信泰-二开埋点，隐藏标签组
const sincetechHiddenTagGroupProcessor = () => {
  return true;
};

// 信泰-二开埋点，行号样式
const sincetechItemTitleStyleProcessor = () => {
  return {
    overflow: "visible",
    whiteSpace: "normal",
  };
};

//定义方法映射关系
const cuxFunctions = {
  "SRM-WEILONG": {
    //⼆开租户的编码
    mounted: weiLongMounted, //key 标准方法名称，value二开方法
  },
  "SRM-WULIANGYE": {
    getAllQuotationDetailsParmas: WuLiangYeGetAllQuotationDetailsParmas,
  },
  "SRM-HUTCHMED": {
    getHeaderCostRemarkName: HutchmedGetName,
  },
  "SRM-37BUY": {
    getRouteParams: Buy37GetRouteParams,
  },
  "SRM-XXJT": {
    loadBusinessData: xxjtLoadBusinessData,
  },
  "SRM-ZKHY": {
    viewAttachment: zkhyViewAttachment,
  },
  // 广东拓斯达科技股份有限公司
  "SRM-TOPSTAR": {
    getApproveCheck: topstarApproveCheck,
  },
  // 无锡万斯家居科技股份有限公司
  "SRM-JHT": {
    getCuxFieldsWithNewSupplierQuotation: getCuxFieldsWithNewSupplierQuotation, // 寻源-新报价-报价行
  },
  "SRM-GANSO": {
    showCompanyTag: ganSoShowCompanyTag,
  },
  "SRM-SINCETECH": {
    hiddenTagGroup: sincetechHiddenTagGroupProcessor,
    itemTitleStyle: sincetechItemTitleStyleProcessor,
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
