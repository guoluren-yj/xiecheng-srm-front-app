<template>
  <!-- 订单工作台 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 订单基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('basicInfo')"
          :customize-code="getCodeDefine('basicInfo')"
          @itemClick="clickDetailInfo('basicInfo')"/>
      </srm-scroll-tab-item>
      <!-- 采购方及采买组织信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('organization')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('organization')"
          :customize-code="getCodeDefine('organization')"
          @itemClick="clickDetailInfo('organization')"/>
      </srm-scroll-tab-item>
      <!-- 订单明细信息 -->
      <srm-scroll-tab-item
        :label="getLanguageDefine('detailInfo')">
        <div v-show="headerInfo.changeFlag">
          <srm-tab-bar
            :tabs="tabs"
            class="change-tabs"
            @indexChange="onIndexChange"/>
        </div>
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :show-bottom-bar="false"
          :data-set="detailInfoDataSet"
          :columns="getColumns('detailInfo')"
          :customize-code="getCodeDefine('detailInfo')"
          @itemClick="clickDetailInfo('detailInfo')"/>
      </srm-scroll-tab-item>
      <!-- 收货/收单信息 -->
      <srm-scroll-tab-item v-if="['CATALOGUE','E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('receiptInfo')">
        <receipt-info
          :customize-code="getCodeDefine('receiptInfo')"
          :customize-detail-code="getCodeDefine('receiptDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <!-- 开票信息 -->
      <srm-scroll-tab-item v-if="['E-COMMERCE'].includes(headerInfo.poSourcePlatform)" :label="getLanguageDefine('billingInfo')">
        <billing-info
          :customize-code="getCodeDefine('billingInfo')"
          :customize-detail-code="getCodeDefine('billingDetailInfo')"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <attachment-info
          :data-set="basicInfoDataSet"
          :config="{readOnly:[true, true, true ]}"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item
        v-if="type !== 'add'"
        :label="getLanguageDefine('operationRecord')">
        <div class="record-container">
          <history-record-tiled
            :action-data="operatingData"
            :remark-label="$T('sodr.common.view.tab.operationRecord').$D('操作说明')"
            operation-meaning-field-name="processTypeMeaning"
            process-remark-field-name="processRemark"
            operator-field-name="processUserName"
            process-date-field-name="processedDate"/>
            <!-- <div class="bottom-button-space" /> -->
        </div>
      </srm-scroll-tab-item>
      <div style="height: 20px;"/>
    </srm-scroll-tab>
    <!-- 详情弹框 -->
    <srm-popup
      :visible.sync="visiblePopup"
      :position="'right'"
      :show-header="false"
      :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
    <!-- BOM弹框 -->
    <srm-popup
      rounded
      :visible.sync="visibleBom"
      :position="'bottom'"
      :title="$T('sodr.workspace.view.title.bom').$D('外协BOM')"
      :height="'70%'">
      <bom
        v-if="visibleBom"
        :data-source="bomData"
        :customize-code="getCodeDefine('bom')"/>
    </srm-popup>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/index";
import { getDynamicLabel } from "../../../../utils";
import Bom from "@/modules/OrderWorkbench/components/Bom";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ReceiptInfo from "@/modules/OrderWorkbench/components/ReceiptInfo";
import BillingInfo from "@/modules/OrderWorkbench/components/BillingInfo";
import AttachmentInfo from "@/modules/OrderWorkbench/components/AttachmentInfo.vue";
import OrderWorkbenchApprovalMethod from "@/modules/CUX_PART/Method/OrderWorkbenchApprovalMethod";
import { getActionsRecordApi, queryDoubleUomConfigApi } from "../../api";
import { DataSet, $T } from "srm-mobile-ui";
import { STATUS_COLOR_MAP, amountRender, getRecord, renderChangeTip } from "../../components/utils/index";
import { isArray } from "lodash";
import { basicInfoDs, lineDs } from "../../datasource/detail/underApproval";
export default {
  modules: [ "sodr.workspace", "sodr.common", "smbl.common", "hzero.common", "slod.orderExecution", "hipspfm.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "UnderApprovalDetail",
  components: {
    HistoryRecordTiled,
    AttachmentInfo,
    ReceiptInfo,
    BillingInfo,
    Bom
  },
  extends: OrderWorkbenchApprovalMethod,
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      poHeaderId: null,
      basicInfoDataSet: new DataSet(basicInfoDs()), // 订单基础信息
      detailInfoDataSet: new DataSet(lineDs()), // 订单明细信息
      operatingData:[], // 操作记录
      visiblePopup: false,
      visibleBom: false,
      popupData: {},
      bomData:{},
      tabs: [
        this.$T("sodr.common.model.common.changeLineDisplay").$D(
          "仅展示变更行"
        ),
        this.$T("sodr.common.model.common.allDisplay").$D("全部行")
      ],
      isDoubleUnit: false,
      // customVisible: false,
      // customPopupData: {},
      // executorVisible: false,
      // executorPopupData: {},
      // showPage: true,
      // type: "readOnly", // add/新增 edit/编辑 readOnly/只读
    };
  },
  computed: {
    headerInfo() {
      return this.basicInfoDataSet.current && this.basicInfoDataSet.current.toData() || {};
    },
  },
  beforeMount() {
    this.type = this.$route.query.type || this.parameters.type;
    this.poHeaderId =
      this.$route.query.poHeaderId || this.parameters.poHeaderId || "";
  },
  mounted() {
    // 编辑/详情
    if (this.poHeaderId) {
      this.init();
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D(
          "该单据当前状态不可查看"
        )
      });
    }
  },
  // updated() {
  //   console.log("this.visiblePopup", this.visiblePopup);
  // },
  methods: {
    onIndexChange(index) {
      this.getPoLine({ changeEditFlag: index === 0 ? 1 : 0 });
    },
    async init() {
      try {
        this.getPoHeader();
        this.getPoLine();
        this.getActionsRecord();
        await this.queryDoubleUomConfig();
      } catch (error) {
        this.$notification.open({
          message: error,
        });
      }
    },
    // 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        basicInfo: $T("sodr.workspace.view.panel.orderBasicInfo").$D("订单基础信息"),
        organization: $T("sodr.workspace.view.panel.organization").$D(
          "交易方及采买组织信息"
        ),
        detailInfo: $T("sodr.workspace.view.panel.detailInfo").$D("订单明细信息"),
        receiptInfo:$T("sodr.workspace.view.panel.receiptInfo").$D("收货/收单信息"),
        billingInfo:$T("sodr.workspace.view.panel.billingInfo").$D("开票信息"),
        attachInfo: $T("sodr.workspace.model.common.attachmentUuid").$D("附件"),
        operationRecord:$T("sodr.workspace.view.title.operationHistory").$D("操作记录"),
      };
      return languageList[key] || key;
    },
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    // 个性化配置
    getCodeDefine(key) {
      const prefix = "SMBL.ORDER_WORKBENCH.UNDERAPPROVAL";
      const codeMap = {
        bom:`${prefix}.BOM`,
        basicInfo:`${prefix}.BASICINFO`,
        basicInfoDetail:`${prefix}.BASICINFO_DETAIL`,
        detailInfo: `${prefix}.LINEINFO`,
        detailInfoDetail:`${prefix}.LINEINFO_DETAIL`,
        organization:`${prefix}.ORGANIZATIONINFO`,
        organizationDetail:`${prefix}.ORGANIZATION_DETAIL`,
        receiptInfo:`${prefix}.RECEIPTINFO`,
        receiptDetailInfo:`${prefix}.RECEIPTINFO_DETAIL`,
        billingInfo:`${prefix}.BILLINGINFO`,
        billingDetailInfo:`${prefix}.BILLINGINFO_DETAIL`,
      };
      return codeMap[key] || key;
    },
    // 查询头信息
    async getPoHeader() {
      this.basicInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.basicInfoDataSet.setQueryParameter({
        camp: 1,
        poHeaderId:this.poHeaderId,
        poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
        customizeUnitCode: [
          this.getCodeDefine("basicInfo"),
          this.getCodeDefine("basicInfoDetail"),
          this.getCodeDefine("organization"),
          this.getCodeDefine("organizationDetail"),
          this.getCodeDefine("receiptInfo"),
          this.getCodeDefine("receiptDetailInfo"),
          this.getCodeDefine("billingInfo"),
          this.getCodeDefine("billingDetailInfo"),
        ].toString()
      });
      this.basicInfoDataSet.refresh();
    },
    // 查询行信息
    async getPoLine(params) {
      this.detailInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.detailInfoDataSet.setQueryParameter({
        ...params,
        camp: 2,
        sortType: 0,
        poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
        customizeUnitCode:  [ this.getCodeDefine("detailInfo"), this.getCodeDefine("detailInfoDetail") ].toString(),
      });
      this.detailInfoDataSet.refresh();
    },
    // 操作记录查询
    async getActionsRecord() {
      const res = await getActionsRecordApi(this.poHeaderId);
      if (res && !res.failed && isArray(res.content)) {
        this.operatingData = getRecord(res.content);
      }
    },
    // 点击tab块
    clickDetailInfo(name) {
      switch (name) {
      case "basicInfo":
        this.openDetailPopup("basicInfoDetail", this.basicInfoDataSet);
        break;
      case "organization":
        this.openDetailPopup("organizationDetail", this.basicInfoDataSet);
        break;
      case "detailInfo":
        this.openDetailPopup("detailInfoDetail", this.detailInfoDataSet);
        break;
      default:
        break;
      }
    },
    // 详情弹框
    async openDetailPopup(name, item) {
      this.popupData = {
        data: item,
        columns: name,
        code: name
      };
      this.visiblePopup = true;
    },
    // 查看BOM
    openBom(record) {
      this.visibleBom = true;
      this.bomData = record;
    },
    getColumns(name) {
      // console.log("name", name);
      switch (name) {
      case "basicInfo":
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.displayPoNum || "-"}</span>
              </SrmListHeader>,
          },
          {
            fieldCode: "poTypeDesc",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D("订单类型"),
            fieldType: "TEXT",
            render: renderChangeTip
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
            render: renderChangeTip
          },
          {
            fieldCode: "amount",
            fieldName: $T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "quantityTotal",
            fieldName: $T("sodr.workspace.model.common.quantityTotal").$D("总数量"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
            render: renderChangeTip
          },
          {
            fieldCode: "poSourcePlatformMeaning",
            fieldName: $T("sodr.workspace.model.common.poSourcePlatform").$D(
              "来源平台"
            ),
            render: renderChangeTip
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D(
              "备注"
            ),
          },
        ];
      case "organization":
        return [
          {
            fieldCode: "companyName",
            fieldType: "EMPTY",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
            render: (val, item) =>
              <SrmListHeader>
                <span>{ $T("sodr.workspace.model.common.company").$D("公司")}:</span>
                <span>{item.companyName || "-"}</span>
              </SrmListHeader>,
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
            render: renderChangeTip
          },
          {
            fieldCode: "ouName",
            fieldName: $T("sodr.workspace.model.common.ouId").$D("业务实体"),
            render: renderChangeTip,
            editor: false,
          },
          {
            fieldCode: "purchaseOrgName",
            editor:false,
            fieldName: $T("sodr.workspace.model.common.purchaseOrgId").$D("采购组织"),
            render: renderChangeTip
          },
          {
            fieldCode: "agentName",
            render: renderChangeTip,
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
          // 默认隐藏
          // {
          //   fieldCode: "settleCompanyName",
          //   fieldName: $T("sodr.common.model.common.settleCompanyName").$D("结算公司"),
          // },
          // {
          //   fieldCode: "settleSupplierName",
          //   fieldName: $T("sodr.workspace.model.common.settleSupplierId").$D("结算供应商"),
          // },
          // {
          //   fieldCode: "supplierSiteName",
          //   fieldName: $T("sodr.common.model.common.supplierSiteName").$D("供应商地点"),
          // },
        ];
      case "detailInfo":
        return [
          {
            formRow: 0,
            fieldCode: "headerTip",
            fieldType: "EMPTY",
            visible: (val, item) =>
              item && item.changeMap && "insertFlag" in item.changeMap,
            render: () =>
              <div class='change-line-tip'>
                {$T("sodr.common.model.common.newChangeLine").$D(
                  "该行是变更时新增行"
                )}
              </div>,
          },
          {
            formRow: 10,
            fieldCode: "itemName",
            fieldType: "EMPTY",
            render: (val, item) =>
              <SrmListHeader>
                <span>{item.itemName || "-"}</span>
                <SrmButton
                  rect
                  plain
                  slot='right'
                  style={{ fontWeight: "bold" }}
                  type={STATUS_COLOR_MAP[item.statusCode]}
                >
                  {item.displayStatusMeaning || ""}
                </SrmButton>
              </SrmListHeader>,
          },
          {
            formRow: 20,
            fieldCode: "displayLineNum",
            fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
          },
          {
            formRow: 30,
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
            render: renderChangeTip
          },
          {
            formRow: 40,
            fieldCode: "displayLineLocationNum",
            fieldName: $T("sodr.workspace.model.common.displayLineLocationNum").$D("发运号"),
          },
          this.isDoubleUnit && {
            formRow: 45,
            fieldName: this.$T("sodr.workspace.model.common.quantity").$D(
              "数量"
            ),
            fieldCode: "secondaryQuantity",
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            formRow: 50,
            fieldCode: "quantity",
            fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            formRow: 60,
            fieldCode: "unitPrice",
            fieldName: $T("sodr.workspace.model.common.unitPrices").$D("单价(不含税)"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            formRow: 60,
            fieldCode: "enteredTaxIncludedPrice",
            fieldName: $T("sodr.workspace.model.common.enteredTaxIncludedPrices").$D("单价(含税)"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            formRow: 70,
            fieldCode: "needByDate",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
            render: (val, item, field) => {
              const dom = <span>{dateFormat(val)}</span>;
              return renderChangeTip(dom, item, field);
            },
          },
        ].filter((i) => i);
      case "basicInfoDetail":
        return [
          {
            fieldCode: "displayPoNum",
            fieldName: $T("sodr.workspace.model.common.displayPoNum").$D("订单编号"),
          },
          {
            fieldCode: "poTypeDesc",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D("订单类型"),
            render: renderChangeTip
          },
          {
            fieldCode: "amount",
            fieldName: $T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "taxIncludeAmount",
            fieldName: $T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "quantityTotal",
            fieldName: $T("sodr.workspace.model.common.quantityTotal").$D("总数量"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
            render: renderChangeTip
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
            render: renderChangeTip
          },
          {
            fieldCode: "termsName",
            fieldName: $T("sodr.workspace.model.common.termsId").$D(
              "付款条款"
            ),
            render: renderChangeTip
          },
          {
            fieldCode: "poSourcePlatformMeaning",
            fieldName: $T("sodr.workspace.model.common.poSourcePlatform").$D(
              "来源平台"
            ),
            render: renderChangeTip
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D(
              "备注"
            ),
          }
        ];
      case "organizationDetail":
        return [
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
            render: renderChangeTip
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
            render: renderChangeTip
          },
          {
            fieldCode: "ouName",
            fieldName: $T("sodr.workspace.model.common.ouId").$D("业务实体"),
            editor: false,
            render: renderChangeTip
          },
          {
            fieldCode: "purchaseOrgName",
            editor:false,
            fieldName: $T("sodr.workspace.model.common.purchaseOrgId").$D("采购组织"),
            render: renderChangeTip
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
            render: renderChangeTip
          },
        ];
      case "detailInfoDetail":
        return [
          {
            fieldCode: "displayStatusMeaning",
            fieldName: $T("sodr.workspace.model.common.displayStatusCode").$D("状态"),
          },
          {
            fieldCode: "displayLineNum",
            fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
          },
          {
            fieldCode: "displayLineLocationNum",
            fieldName: $T("sodr.workspace.model.common.displayLineLocationNum").$D("发运号"),
          },
          {
            fieldCode: "itemName",
            fieldName: $T("sodr.workspace.model.common.itemName").$D("物料名称"),
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
            render: renderChangeTip
          },
          this.isDoubleUnit && {
            fieldCode: "secondaryQuantity",
            fieldName: $T("sodr.workspace.model.common.quantity").$D("数量"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          this.isDoubleUnit && {
            fieldName: this.$T("sodr.workspace.model.common.uomId").$D("单位"),
            fieldCode: "secondaryUomCodeAndName",
            render: renderChangeTip
          },
          {
            fieldCode: "quantity",
            fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "uomCodeAndName",
            fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
            render: renderChangeTip
          },
          {
            fieldCode: "needByDate",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
            render: (val, item, field) => {
              const dom = <span>{dateFormat(val)}</span>;
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "unitPrice",
            fieldName: $T("sodr.workspace.model.common.unitPrices").$D("单价(不含税)"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "lineAmount",
            fieldName: $T("sodr.workspace.model.common.lineAmounts").$D("行金额(不含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "enteredTaxIncludedPrice",
            fieldName: $T("sodr.workspace.model.common.enteredTaxIncludedPrices").$D("单价(含税)"),
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "taxIncludedLineAmount",
            fieldName: $T("sodr.workspace.model.common.taxIncludedLineAmounts").$D("行金额(含税)"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = this.handleAmountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "taxRate",
            fieldName: $T("sodr.workspace.model.common.taxId").$D("税率"),
            // fieldType: "INPUT_NUMBER",
            // editor: false,
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "unitPriceBatch",
            fieldName: $T("sodr.workspace.model.common.unitPriceBatch").$D("每"),
            fieldType: "INPUT_NUMBER",
            editor: false,
            render: (val, item, field) => {
              const dom = amountRender(val, item, field);
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "currencyCode",
            fieldName: $T("sodr.workspace.model.common.currencyCode").$D("币种"),
            render: renderChangeTip
          },
          {
            fieldCode: "promiseDeliveryDate",
            fieldName: $T("sodr.workspace.model.common.promiseDeliveryDate").$D("承诺交货日期"),
            render: (val, item, field) => {
              const dom = <span>{dateFormat(val)}</span>;
              return renderChangeTip(dom, item, field);
            },
          },
          {
            fieldCode: "categoryName",
            fieldName: $T("sodr.workspace.model.common.categoryId").$D("物料分类"),
            render: renderChangeTip
          },
          {
            fieldCode: "invOrganizationName",
            fieldName: $T("sodr.workspace.model.common.invOrganizationId").$D("库存组织"),
            render: renderChangeTip
          },
          {
            fieldCode: "inventoryName",
            fieldName: $T("sodr.workspace.model.common.invInventoryId").$D("收货库房"),
            render: renderChangeTip
          },
          {
            fieldCode: "locationName",
            fieldName: $T("sodr.workspace.model.common.invLocationId").$D("收货库位"),
            render: renderChangeTip
          },
          {
            fieldCode: "bom",
            fieldName: $T("sodr.workspace.model.common.bom").$D("外协BOM"),
            render: (val, item) => <span style='color: var(--color-other-default-b)' onClick={(e) => {
              e.stopPropagation(); this.openBom(item);
            }}>
              {$T("hzero.common.button.look").$D("查看")}
            </span>
          },
          {
            fieldCode: "remark",
            fieldName: $T("sodr.workspace.model.common.remark").$D("备注"),
            render: renderChangeTip
          },
          {
            fieldCode: "feedback",
            fieldName: $T("sodr.common.model.common.feedback").$D("反馈信息"),
            render: renderChangeTip
          },
        ].filter((i) => i);
      default:
        return [];
      }
    },
    handleAmountRender(...args) {
      if (this.over$handleAmountRender && typeof this.over$handleAmountRender === "function") {
        return this.over$handleAmountRender()(...args);
      }
      return amountRender(...args);
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.line-filter {
  .list-tool-tab {
    width: 100px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
}
.change-line-tip{
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #E11900;
  font-size: 12px;
  font-weight: 500;
  background: #FFEFED;
}

.change-tabs{
  >>>.srm-tab-bar{
    height:32px;
    .srm-tab-bar-box{
      max-width: 134px;
      height: 20px;
      margin: 6px 0 0 6px;
      background: #EEEEEE;
      border-radius: 20px;
    }
    .srm-tab-bar-button{
      height:20px;
      padding: 0 6px;
      font-size:12px;
    }
    .srm-tab-bar-button-active{
      color: #000;
      background: #FFF;
      border:1px solid rgba(226,226,226,1);
      border-radius: 20px;
    }
  }
}
</style>
