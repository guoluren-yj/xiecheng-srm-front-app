<template>
  <div class="pricing-approval">
    <srm-scroll-tab>
      <div v-if="projectSection.length" class="tab" :style="{whiteSpace: showAllTabs ? 'normal' : 'nowrap'}">
        <div class="tab-container">
          <div v-for="(section, index) in projectSection" :key="index" class="tab-item-box">
            <touch-feedback active-class-name="tab-item-active">
              <span :class="['tab-item', {
                'tab-item-active': index === tabIndex
              }]" @click="changeTab(section, index)">
                {{ section.sectionName }}
              </span>
            </touch-feedback>
          </div>
        </div>
        <touch-feedback active-class-name="tab-trigger-active">
          <div class="tab-trigger" @click="triggerTab">
            <em class="srm-icon icon-grid"/>
          </div>
        </touch-feedback>
      </div>
      <!-- <div style="background: #f5f5f5;padding: 5px 16px;">
      <srm-button @click="showFileList">{{ $T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件") }}</srm-button>
    </div> -->
      <srm-scroll-tab-item :show-title="false" :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
        <div class="header-box" @click="showHeaderDetail()">
          <srm-flex justify="between">
            <span class="title-bold">{{ headInfo.rfxNum }}
              <!-- <em style="margin-left: 12px;" class="srm-icon icon-chevron-right"/> -->
              <!-- <span style="border-radius: 2px; background: #F6F6F6; padding: 2px; font-size: 10px">轮次：1</span> -->
              <srm-tag size="small">{{ $T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次") }}：{{
                headInfo.quotationRoundNumber
              }}</srm-tag>
            </span>
            <!-- <span>
          {{ $T("ssrc.inquiryHall.model.inquiryHall.round").$D("轮次") }}：
          {{
            headInfo.roundNumber
          }}
        </span> -->
            <span style="color: #276EF1; font-size: 10px" @click.stop="showFileList">{{
              $T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件")
            }}</span>
          </srm-flex>
          <srm-flex justify="between" align="end">
            <span class="rfx-title" style="flex:1">
              {{ headInfo.rfxTitle }}
            </span>
            <srm-upload :show-icon="false"
                        :show-count="false"
                        :desc-title="$T('ssrc.inquiryHall.model.inquiryHall.checkAttachment').$D('核价附件')"
                        :attachment-uuid="headInfo.checkAttachmentUuid"
                        type="primary"
                        style="color: #276EF1;
                          font-size: 10px;
                          flex: 1;
                          display: flex;
                          justify-content: flex-end;
                          align-items: center;
                          margin-right: 0px;"/>
          </srm-flex>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.lineInfo').$D('标的物信息')">
        <srm-list :data-set="dataSet"
                  :clickable="false"
                  :columns="getLineInfoColumns()" :scrollable="false" height="auto" style="height: auto"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 附件 -->
    <history-record
      v-model="fileListFlag"
      :show-file-btn="true"
      :action-data="fileListData"
      operator-field-name="realName"
      process-date-field-name="creationDate"
      operation-meaning-field-name="nodeMeaning"/>

    <srm-popup :visible="bargainProcessPopupFlag" :title="$T('ssrc.priceComparison.view.message.button.thisQuoteProcess').$D('本次报价过程')" width="100%" :show-header="true" :show-close="true" position="right" :on-close="()=>bargainProcessPopupFlag=false">
      <!--      <srm-tab-bar> -->
      <!--        <srm-tab-item :label="$T('ssrc.priceComparison.view.tab.unitPrice').$D('单价')"> -->
      <srm-list :data-set="bargainProcessDataSet"
                :clickable="false"
                :columns="getBargainProcessPriceColumns()" :scrollable="false" height="auto" style="height: auto"/>
      <!--      </srm-tab-item> -->
      <!--        <srm-tab-item :label="$T('ssrc.priceComparison.view.tab.totalPrice').$D('总价')"> -->
      <!--          <srm-list :data-set="bargainProcessTotalDataSet" -->
      <!--                    :clickable="false" -->
      <!--                    :columns="getBargainProcessPriceTotalColumns()" :scrollable="false" height="auto" style="height: auto"/> -->
      <!--        </srm-tab-item> -->
      <!--      </srm-tab-bar> -->
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { getProjectSection, getRfxHeader, getRfxItemLinesCheck, getProcessFileApi } from "./api/index";
import rfxItemsDS from "./datasource/items";
import bargainProcessDS from "./datasource/bargainProcessDS";
// import bargainProcessTotalDS from "./datasource/bargainProcessTotalDS";
import HistoryRecord from "@/components/HistoryRecord";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.pricingApproval", "hipspfm.common", "ssrc.common", "ssrc.priceComparison", "smbl.common" ],
  name: "PricingApproval",
  components: {
    HistoryRecord
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    topHeight: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      headInfo: {},
      itemLines: [], //供应商分类信息
      tabIndex: 0,
      projectSection: [],
      uuid: uuid(),
      showAllTabs: false,
      dataSet: new DataSet(rfxItemsDS()),
      bargainProcessDataSet: new DataSet(bargainProcessDS(this)),
      // bargainProcessTotalDataSet: new DataSet(bargainProcessTotalDS()),
      //fileListDataSet: new DataSet(fileListDs(this.sourceHeaderId)),
      sourceHeaderId: null,
      headPopupVisible: false,
      sourceProject: {},
      multipleLanguage: {
        taxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncluded").$D("含税"),
        nonTaxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.noTaxRate").$D("不含税"),
      },
      showDetailValue: {},
      fileListFlag: false,
      fileListData: [],
      bargainProcessPopupFlag:false,
      filterItem:"",
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getProjectSection();
        await this.getPricingOrderHead(this.sourceHeaderId);
        await this.getLineCheckInfo(this.sourceHeaderId);
        await this.getProcessFile(this.sourceHeaderId);
        this.dataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
        this.dataSet.addQueryParameter("rfxHeaderId", this.sourceHeaderId);
        this.dataSet.refresh();
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.pricingApproval.view.message.title.checkPriceApproval").$D("寻源核价审批"));
  },
  methods: {
    //比价助手-报价过程
    showBargainProcess(item) {
      console.info("######", item);
      this.filterItem = item.itemCode ? item.itemCode : item.itemName;
      this.bargainProcessPopupFlag = true;
      this.bargainProcessDataSet.addPathParameter("rfxLineItemId", item.rfxLineItemId);
      this.bargainProcessDataSet.refresh();

      // this.bargainProcessTotalDataSet.addQueryParameter("rfxHeaderId", this.sourceHeaderId);
      // this.bargainProcessTotalDataSet.refresh();
    },
    showHeaderDetail() {
      this.detailPopup = this.$popup({
        title: this.$T("ssrc.inquiryHall.model.inquiryHall.headerInfoDetail").$D("详情"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "80%",
        rounded: true,
        content:
            <div class="header-detail-box">
              <div class="title"> {this.$T("ssrc.inquiryHall.model.inquiryHall.headerBaseInfo").$D("基础信息")}</div>
              <customize data-source={this.headInfo} columns={this.getHeaderBaseInfoColumns()}
                code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL"/>
              <div class="title">{this.$T("ssrc.inquiryHall.model.inquiryHall.headerCostRemark").$D("成本备注")}</div>
              <customize data-source={this.headInfo} columns={this.getHeaderCostInfoColumns()}
                code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_COST_DETAIL"/>
            </div>
      });
    },
    triggerTab() {
      this.showAllTabs = !this.showAllTabs;
    },
    async changeTab(data, index) {
      this.tabIndex = index;
      this.sourceHeaderId = data.sourceHeaderId;
      this.$loading.show();
      this.dataSet.addQueryParameter("rfxHeaderId", data.sourceHeaderId);
      this.dataSet.refresh();
      await this.getLineCheckInfo(this.sourceHeaderId);
      this.getPricingOrderHead(data.sourceHeaderId).finally(() => {
        this.$loading.hide();
      });
    },
    async getProjectSection() {
      return await getProjectSection(this.changeReqId).then((res) => {
        if (res) {
          this.projectSection = res.projectLineSectionList || [];
          this.sourceProject = res.sourceProject || [];
          if (!SrmUtil.isEmpty(res.projectLineSectionList)) {
            this.sourceHeaderId = res.projectLineSectionList[0].sourceHeaderId;
          }
          this.sourceHeaderId = this.sourceHeaderId || this.changeReqId;
        }
      });
    },
    // 获取核价单头信息
    async getPricingOrderHead(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getRfxHeader(rfxHeaderId).then((res) => {
        this.headInfo = res;
        this.$emit("GetAttachmentFileArr", [ {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          attachmentUuid: res.techAttachmentUuid || this.uuid,
          readOnly: true
        }, {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          attachmentUuid: res.businessAttachmentUuid || this.uuid,
          readOnly: true
        }, {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          attachmentUuid: res.pretrialUuid || this.uuid,
          readOnly: true
        } ]);
      });
    },
    async getLineCheckInfo(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getRfxItemLinesCheck(rfxHeaderId).then((res) => {
        if (res && !res.failed) {
          this.itemLines = res.content || [];
        }
      });
    },
    getLineInfoColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            const tags = [];
            const lines = this.itemLines.filter((e) => e.rfxLineItemId === item.rfxLineItemId);
            tags.push(item.rfxQuantity + item.uomName);
            tags.push(item.taxIncludedFlag ? this.multipleLanguage.taxIncluded : this.multipleLanguage.nonTaxIncluded);
            tags.push(item.selectionStrategyMeaning);
            return <SrmFlex direction="column">
              <SrmFlex justify="between" nativeOnClick={() => {
                this.$set(this.showDetailValue, item.rfxLineItemId, !this.showDetailValue[item.rfxLineItemId]);
              }}>
                <span class="title-bold">{`${item.itemCode ? item.itemCode + "-" : ""}${item.itemName}`}</span>
                <span>{this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}：{item.rfxLineItemNum}</span>
              </SrmFlex>
              <SrmFlex justify="between" nativeOnClick={() => {
                this.$set(this.showDetailValue, item.rfxLineItemId, !this.showDetailValue[item.rfxLineItemId]);
              }}><SrmTagGroup tags={tags} type="info"/><SrmButton fill type="primary" size="mini" onClick={() => this.showBargainProcess(item)}>{this.$T("ssrc.priceComparison.view.message.button.thisQuoteProcess").$D("本次报价过程")}</SrmButton></SrmFlex>
              <SrmFlex v-show={!this.showDetailValue[item.rfxLineItemId]} direction="column">
                {
                  lines.map((line) =>
                    <Customize
                      code="SMBL.WORKFLOW.PRICING_APPROVAL.LINE_CHECK_INFO"
                      dataSource={line}
                      columns={this.getLineInfoCheckColumns()}
                    />)
                }
              </SrmFlex>
            </SrmFlex>;
          },
          formRow: 0,
        },
      ];
    },
    getLineInfoCheckColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>
              {item.suggestedFlag ?
                <SrmTag
                  type="success"
                  fill>
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用")}
                </SrmTag> :
                <SrmTag
                  type="danger"
                  fill>
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedNoFlag").$D("不选用")}
                </SrmTag>
              }
              {item.companyName}
            </span>
          </SrmListHeader>,
          formRow: 0,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costPrice").$D("成本单价"),
          fieldCode: "costPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationLineStatusMeaning").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validNetPrice").$D("未税单价"),
          fieldCode: "validNetPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          fieldCode: "validQuotationQuantity",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.LineSum").$D("行金额"),
          fieldCode: "totalAmount",
          render: (val, item) => item.totalPrice || val
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedRemark").$D("选用理由"),
          fieldCode: "suggestedRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationRemark").$D("报价说明"),
          fieldCode: "validQuotationRemark",
        },
      ];
    },
    getHeaderBaseInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceAnnouncementFlag").$D("创建寻源公告"),
          fieldCode: "sourceAnnouncementFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemRemark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
          fieldCode: "pretrailRemark",
        },
      ];
    },
    getHeaderCostInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本"),
          fieldCode: "totalCost",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceProjectTotalAmount").$D("寻源项目总金额"),
          fieldCode: "sourceProject",
          render: () => this.sourceProject.projectCost
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxSectionTotalPrice").$D("标段总金额"),
          fieldCode: "totalPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          fieldCode: "overCostFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldCode: "overCostPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比"),
          fieldCode: "overCostScale",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注"),
          fieldCode: "costRemark",
        },
      ];
    },
    getBargainProcessPriceColumns() {
      return [
        {
          formRow: 10,
          seq:10,
          fieldCode: "supplierCompanyNum",
        },
        {
          formRow: 20,
          seq:10,
          fieldCode: "supplierCompanyName",
        },
        {
          formRow: 30,
          seq:10,
          fieldCode: "itemCode",
        },
        {
          formRow: 40,
          seq:20,
          fieldCode: "itemName",
        },
        {
          formRow: 50,
          seq:20,
          fieldCode: "roundNumber",
        },
        {
          formRow: 50,
          seq:20,
          fieldCode: "num",
        },
        {
          formRow: 60,
          seq:10,
          fieldCode: "quotationNodeMeaning",
        },
        {
          formRow: 70,
          seq:10,
          fieldCode: "quotationPrice",
        },
        {
          formRow: 80,
          seq:10,
          fieldCode: "quotationDate",
        },
        {
          fieldCode: "rfxLadderQuotations",
          render:(val, item) => <div>
            {item.rfxLadderQuotations && item.rfxLadderQuotations.map((object) => <SrmFlex><div style={{ width:"130px" }}>{object.ladderFrom + "-" + (object.ladderTo ? object.ladderTo : "")}</div> <div style={{ marginRight:"10px" }}>|</div> <div> {object.currentLadderPrice}</div></SrmFlex>)}
          </div>
        },
      ];
    },
    getBargainProcessPriceTotalColumns() {
      return [
        {
          formRow: 10,
          seq:10,
          fieldCode: "supplierCompanyNum",
        },
        {
          formRow: 20,
          seq:10,
          fieldCode: "supplierCompanyName",
        },
        {
          formRow: 50,
          seq:20,
          fieldCode: "roundNumber",
        },
        {
          formRow: 50,
          seq:20,
          fieldCode: "num",
        },
        {
          formRow: 60,
          seq:10,
          fieldCode: "quotationNodeMeaning",
        },
        {
          formRow: 70,
          seq:10,
          fieldCode: "totalQuotationTaxAmount",
        },
        {
          formRow: 80,
          seq:10,
          fieldCode: "totalQuotationNetAmount",
        },
        {
          formRow: 90,
          seq:10,
          fieldCode: "quotationDate",
        },
      ];
    },
    // 查看附件
    showFileList() {
      // this.fileListDataSet = new DataSet(fileListDs(this.sourceHeaderId));
      this.fileListFlag = true;

    },
    getProcessFile(rfxHeadId) {
      getProcessFileApi(rfxHeadId).then((res) => {
        this.fileListData = res.content || [];
      });
    },
    // 获取附件
    getFileListColumns() {
      return [
        {
          fieldName: this.$T("ssrc.common.model.common.node").$D("节点"),
          fieldCode: "nodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.uploadBy").$D("上传人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.creationDate").$D("上传时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.attachmentType").$D("附件类型"),
          fieldCode: "fileType",
          render: (val, record) => <SrmUpload
            type="primary"
            showIcon={false}
            showCount={false}
            descTitle={record.type}
            attachmentUuid={record.rfxProcessAttachmentDTOS}/>
        },
      ];
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl"

.pricing-approval {
  background #fff;

  .header-box {
    padding: 16px;
    font-size: 14px;

    .rfx-title {
      display block;
      margin-top 10px;
    }
  }

  .tab {
    position relative;
    display block;
    width 100%;
    border-bottom #f5f5f5 solid 1px;
    font-size 14px;

    .tab-container {
      width calc(100% - 46px);
      overflow-x scroll;
      -webkit-overflow-scrolling: touch;
      padding 0 5px;

      .tab-item-box {
        margin 8px;
        display inline-block;

        .tab-item {
          color #333;
          font-size 12px;
          height 24px;
          display inline-flex;
          align-items center;
          justify-content: center;
          padding 0 8px;
          border-radius 12px;
          font-family: PingFangSC-Medium;
          line-height: 16px;
          min-width 50px;
        }

        .tab-item-active {
          color $srm-theme-color-primary;
          background $srm-theme-color-primary-fill;
        }
      }
    }

    .tab-trigger {
      position absolute;
      height 40px;
      width 46px;
      right 0;
      top 0;
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.06);
      font-size 16px;
      display flex;
      align-items center;
      justify-content center;
      background white;
    }

    .tab-trigger-active {
      background #f5f5f5;
    }
  }
}

.header-detail-box {
  padding: 16px;
  font-size 14px;

  .title {
    color #333;
    font-weight 700;
    font-family: PingFangSC-Regular;
    margin-top 10px;
  }
}

.title-bold {
  width 80%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

>>> .srm-list-item-card-head-left {
  max-width: 80%;
  white-space nowrap
  overflow hidden;
  word-break all;
  text-overflow: ellipsis;
  margin-left 0 !important;

  .srm-tag {
    margin-right 5px;
  }
}
</style>
