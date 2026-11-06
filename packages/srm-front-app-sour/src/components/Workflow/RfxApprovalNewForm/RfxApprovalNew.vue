<template>
  <!-- 寻源单审批 - 新 -->
  <div v-loading="initLoading" style="min-height: 100%;">
    <section v-if="loading">
      <srm-scroll-tab customize-code="SMBL.WORKFLOW.RFX_APPROVAL_NEW.TABS">
        <!-- 基础信息 -->
        <srm-scroll-tab-item :label="getLanguageDefine('refBasicInfo')" code="basicInfo">
          <ul style="padding: 15px;">
            <customize
              :data-source="headInfo"
              :columns="getColumns('refBasicInfo')"
              :code="getCustomizeCode('demandPublishApproval-refBasicInfo')"
              type="list"
              :need-padding="false"/>
          </ul>
        </srm-scroll-tab-item>
        <!-- 采购组织及人员 -->
        <srm-scroll-tab-item :label="getLanguageDefine('purOrganizationAndStaff')" code="purOrganizationAndStaff">
          <h2>{{ $T("ssrc.inquiryHall.view.inquiryHall.demandSide").$D("需求方") }}</h2>
          <ul class="rfx-approval-ul-padding">
            <customize
              :data-source="headInfo"
              :columns="getColumns('demandSide')"
              :code="getCustomizeCode('demandPublishApproval-demandSide')"
              type="list"
              :need-padding="false"/>
          </ul>
          <h2>{{ $T("ssrc.inquiryHall.view.inquiryHall.purchaseExecute").$D("采购执行人") }}</h2>
          <ul class="rfx-approval-ul-padding">
            <customize
              :data-source="headInfo"
              :columns="getColumns('procureExec')"
              :code="getCustomizeCode('demandPublishApproval-procureExec')"
              type="list"
              :need-padding="false"/>
          </ul>
        </srm-scroll-tab-item>
        <!-- 标段  -->
        <srm-scroll-tab-item v-if="headInfo.projectLineSections && headInfo.projectLineSections.length > 0" :label="getLanguageDefine('section')" code="section">
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="sectionDataSet"
                    :columns="getColumns('section')"
                    :customize-code="getCustomizeCode('demandPublishApproval-section')"/>
        </srm-scroll-tab-item>
        <!-- 标的物 -->
        <srm-scroll-tab-item v-else :label="getLanguageDefine('sectionItem')" code="item">
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="sectionItemDataSet"
                    :columns="getColumns('sectionItem')"
                    :customize-code="getCustomizeCode('demandPublishApproval-sectionItem')"/>
        </srm-scroll-tab-item>
        <!-- 对供应商要求 -->
        <srm-scroll-tab-item :label="getLanguageDefine('supplierWithRequest')" code="supplierWithRequest">
          <ul class="rfx-approval-ul-padding">
            <customize
              :columns="getColumns('supplierRequireHead')"
              :data-source="headInfo"
              :code="getCustomizeCode('demandPublishApproval-supplierRequireHead')"
              type="list"
              :need-padding="false"/>
          </ul>
          <ul v-if="supplierInfoDataSet.data.length > 0" class="rfx-approval-border-top-space">
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="supplierInfoDataSet"
                      :columns="getColumns('supplierList')"
                      :customize-code="getCustomizeCode('demandPublishApproval-supplierList')"/>
          </ul>
        </srm-scroll-tab-item>
        <!-- 询价要求 -->
        <srm-scroll-tab-item :label="getLanguageDefine('rfxDeamnd')" code="rfxDemand">
          <h2>{{ $T("ssrc.inquiryHall.view.inquiryHall.rfxPrepare").$D("寻源准备") }}</h2>
          <!-- 寻源准备 -->
          <ul v-if="headInfo.rfxHeaderId" class="rfx-approval-ul-padding">
            <customize
              :columns="getColumns('rfxPrepare')"
              :data-source="headInfo"
              :code="getCustomizeCode('demandPublishApproval-rfxPrepare')"
              type="list"
              :need-padding="false"/>
          </ul>
          <!-- 资格预审 -->
          <ul v-if="headInfo.preQualificationFlag && headInfo.rfxHeaderId">
            <h2>{{ $T("ssrc.inquiryHall.view.message.tab.preQualification").$D("资格预审") }}</h2>
            <ul class="rfx-approval-ul-padding">
              <customize
                :columns="getColumns('preQualification')"
                :data-source="headInfo"
                :code="getCustomizeCode('demandPublishApproval-preQualification')"
                type="list"
                :need-padding="false"/>
            </ul>
          </ul>
          <!-- 报价 -->
          <h2>{{ bidFlag ?$T("ssrc.common.model.common.tender").$D("投标") : $T("ssrc.common.model.common.quotation").$D("报价") }}</h2>
          <ul v-if="headInfo.rfxHeaderId" class="rfx-approval-ul-padding">
            <customize
              :columns="getColumns('quotation')"
              :data-source="headInfo"
              :code="getCustomizeCode('demandPublishApproval-quotation')"
              type="list"
              :need-padding="false"/>
          </ul>
          <!-- 专家 -->
          <ul v-if="expertInfoDataSet.data.length > 0">
            <h2>{{ $T("ssrc.inquiryHall.view.message.tab.professional").$D("专家") }}</h2>
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="expertInfoDataSet"
                      :columns="getColumns('expert')"
                      :customize-code="getCustomizeCode('demandPublishApproval-expert')"/>
          </ul>
          <!-- 符合性检查 -->
          <ul v-if="scoreIndicDataSet.data.length > 0">
            <h2>{{ $T("ssrc.inquiryHall.view.message.tab.initialReviewIndic").$D("符合性检查") }}</h2>
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="scoreIndicDataSet"
                      :columns="getColumns('initialReviewIndic')"
                      :customize-code="getCustomizeCode('demandPublishApproval-initialReviewIndic')"/>
          </ul>
          <!-- 评分要素 -->
          <ul v-if="indicsInfoDataSet.data.length > 0">
            <h2>{{ $T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素") }}</h2>
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="indicsInfoDataSet"
                      :columns="getColumns('scoringElements')"
                      :customize-code="getCustomizeCode('demandPublishApproval-scoringElements')"/>
          </ul>
          <price-score-element :data-set="priceIndicDataSet" :columns="getColumns('scoringElements')" :head-info="headInfo" :bid-flag="bidFlag" />
          <ul v-if="businessIndicDataSet.data.length > 0">
            <h2>{{ `${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.businessGroup").$D("商务组")}: ${businessIndicDataSet.data[0] && businessIndicDataSet.data[0].businessWeight}%` }}</h2>
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="businessIndicDataSet"
                      :columns="getColumns('scoringElements')"
                      :customize-code="getCustomizeCode('demandPublishApproval-scoringElements')"/>
          </ul>
          <ul v-if="technologyIndicDataSet.data.length > 0">
            <h2>{{ `${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.technicalGroup").$D("技术组")}: ${technologyIndicDataSet.data[0] && technologyIndicDataSet.data[0].technologyWeight}%` }}</h2>
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="technologyIndicDataSet"
                      :columns="getColumns('scoringElements')"
                      :customize-code="getCustomizeCode('demandPublishApproval-scoringElements')"/>
          </ul>
          <div v-cloak/>
        </srm-scroll-tab-item>
        <!-- 附件 -->
        <srm-scroll-tab-item :label="getLanguageDefine('attachment')" code="attachment">
          <customize
            :columns="getColumns('attachment')"
            :data-source="headInfo"
            :code="getCustomizeCode('demandPublishApproval-attachment')"
            :row-col-to-seq="true"
            type="list"
            :need-padding="false"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </section>

    <!-- 物料 -->
    <srm-popup :visible.sync="visibleItem"
               :title="customizeInfo.title"
               :height="customizeInfo.height"
               :rounded="customizeInfo.height !== '100%'">
      <srm-list v-if="visibleItem"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="itemDataSet"
                :columns="getColumns('item')"
                :customize-code="getCustomizeCode('item')"/>
    </srm-popup>
    <srm-popup :visible.sync="visible"
               :title="customizeLineInfo.title"
               :height="customizeLineInfo.height"
               :rounded="customizeLineInfo.height !== '100%'">
      <!-- 报价明细 -->
      <template v-if="customizeLineInfo.visibleQuotaion">
        <div class="card-distribution" style="border-bottom: 10px solid var(--color-border-default);">
          <customize
            :data-source="customizeLineInfo.headInfo"
            :columns="getColumns('quotationDetailHead')"
            :code="getCustomizeCode('quotationDetailHead')"
            type="list"
            :need-padding="false"/>
        </div>
        <div v-for="(item, index) in lineList"
             :key="index" class="card-distribution">
          <customize
            :data-source="item"
            :columns="getColumns('quotationDetail')"
            :code="getCustomizeCode('quotationDetail')"
            type="list"
            :need-padding="false"/>
        </div>
      </template>

      <!-- 阶梯报价 -->
      <div v-if="customizeLineInfo.visibleLadder">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="customizeLineInfo.headInfo"
            :columns="getColumns('ladderQuotationHead')"
            :code="getCustomizeCode('ladderQuotationHead')"
            type="list"
            :need-padding="false"/>
        </ul>
        <div v-for="(item, index) in lineList"
             :key="index" class="card-ladder">
          <customize
            :data-source="item"
            :columns="getColumns('ladderQuotation')"
            :code="getCustomizeCode('ladderQuotation')"
            type="list"
            :need-padding="false"/>
        </div>
      </div>

      <!-- 评分细则 -->
      <div v-if="customizeLineInfo.visibleIndicate" class="score-indicate">
        {{ customizeLineInfo.content }}
      </div>

      <!-- 分配专家 -->
      <template v-if="customizeLineInfo.visibleExpert">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="allocatedExpertDataSet"
                  :columns="getColumns('allocatedExpert')"
                  :customize-code="getCustomizeCode('allocatedExpert')"/>
      </template>

      <!-- 分配物料 -->
      <template v-if="customizeLineInfo.visibleItem">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="allocatedItemDataSet"
                  :columns="getColumns('allocatedItem')"
                  :customize-code="getCustomizeCode('allocatedItem')"/>
      </template>

      <!-- 分配标段 -->
      <template v-if="customizeLineInfo.visibleSection">
        <div v-for="(item, index) in lineList"
             :key="index" class="card-distribution">
          <customize
            :data-source="item"
            :columns="getColumns('allocatedLot')"
            :code="getCustomizeCode('allocatedLot')"
            type="list"
            :need-padding="false"/>
        </div>
      </template>

      <!-- 评分要素细项 -->
      <template v-if="customizeLineInfo.visibleScore">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="scoringElementDataSet"
                  :columns="getColumns('scoringElement')"
                  :customize-code="getCustomizeCode('scoringElement')"/>
      </template>
    </srm-popup>
  </div>
</template>
<script>
import mx from "./mixin/mx";
import {
  getQuotationDetailApi,
  getLadderQuotationApi,
} from "./api";
import { queryDoubleUnit } from "@/utils/utils";
import { DataSet, $T } from "srm-mobile-ui";
import { sectionItemDs, supplierInfoDs, itemDs, allocatedExpertDs, allocatedItemDs, scoringElementDs, scoringElementDetailDs } from "./datasource/ds";
import CompleteMethod from "../../../modules/CUX_PART/Method/CompleteMethod";
import PriceScoreElement from "./components/PriceScoreElement.vue";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common", "ssrc.priceLibraryNew", "hipspfm.expertScoring", "ssrc.common" ],
  name: "RfxApprovalNew",
  components: {
    PriceScoreElement,
  },
  extends: CompleteMethod,
  mixins: [ mx ],
  data() {
    return {
      customizeInfo: {},
      list: [],
      visibleItem: false,
      customizeLineInfo: {},
      lineList: [],
      visible: false,
      // 标的物
      sectionItemDataSet: {},
      // 供应商列表
      supplierInfoDataSet: {},
      // 物料
      itemDataSet: {},
      // 分配专家
      allocatedExpertDataSet: {},
      // 分配物料
      allocatedItemDataSet: {},
      // 评分细项
      scoringElementDataSet: {},
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  async mounted() {
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    this.sectionItemDataSet = new DataSet(sectionItemDs(this.changeReqId));
    this.sectionItemDataSet.refresh();
    this.supplierInfoDataSet = new DataSet(supplierInfoDs(this.changeReqId));
    this.supplierInfoDataSet.refresh();
  },
  methods: {
    handleQuotationDetailData(data = []) {
      return data.map((item) => {
        const obj = { ...item };
        if (Array.isArray(item.quotationColumns)) {
          item.quotationColumns.forEach((i) => {
            switch (i.columnCode) {
            case "Quantity": obj.configQuantity = i.supColumnDefaultValue;
              break;
            case "Price": obj.configUnitPrice = i.supColumnDefaultValue;
              break;
            case "Remark": obj.remark = i.supColumnDefaultValue;
              break;
            default: return null;
            }
          });
        }
        return obj;
      });
    },
    // 查看 XXX 弹框
    async lookSomePop(name, val = {}) {
      switch (name) {
      case "quotationDetail":
        this.$loading.show();
        await getQuotationDetailApi(this.changeReqId, {
          page: 0,
          size: 10,
          itemCategoryId: val.itemCategoryId,
          itemId: val.itemId,
          rfxLineItemId: val.rfxLineItemId,
          sourceFrom: "RFX"
        }).then((res) => {
          if (res && res.templateNum) {
            if (res.supQuotationDetailPage && res.supQuotationDetailPage.content && res.supQuotationDetailPage.content.length > 0) {
              this.lineList = this.handleQuotationDetailData(res.supQuotationDetailPage.content);
            } else {
              this.lineList = [];
            }
            this.customizeLineInfo = {
              visibleQuotaion: true,
              title: $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细"),
              height: "100%",
              headInfo: {
                templateNum: res.templateNum,
                templateName: res.templateName,
                attachmentNeedFlag: res.attachmentNeedFlag,
                allowCreateFlag: res.allowCreateFlag,
                attachmentUuid: res.attachmentUuid || "",
              }
            };
            this.visible = true;
            this.$loading.hide();
          }
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      case "ladderQuotation":
        this.$loading.show();
        await getLadderQuotationApi(val.rfxLineItemId).then((res) => {
          if (res && res.content.length > 0) {
            this.lineList = [ ...res.content ];
          } else {
            this.lineList = [];
          }
          this.customizeLineInfo = {
            title: $T("ssrc.inquiryHall.model.inquiryHall.ladderQuotation").$D("阶梯报价"),
            height: "50%",
            visibleLadder: true,
            headInfo: {
              itemCode: val.itemCode,
              itemName: val.itemName
            }
          };
          this.visible = true;
          this.$loading.hide();
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      case "scoringRubric":
        this.customizeLineInfo = {
          visibleIndicate: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
          height: "50%",
          content: val.indicateRemark
        };
        this.visible = true;
        break;
      case "allocatedExpert":
        this.allocatedExpertDataSet = new DataSet(allocatedExpertDs({
          evaluateIndicId: val.evaluateIndicId,
          evaluateIndicCategory: val.evaluateIndicCategory,
          sourceHeaderId: this.changeReqId,
        }));
        this.allocatedExpertDataSet.refresh();
        this.customizeLineInfo = {
          visibleExpert: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.allocatedExpert").$D("分配专家"),
          height: "80%",
        };
        this.visible = true;
        break;
      case "allocatedItem":
        this.allocatedItemDataSet = new DataSet(allocatedItemDs({
          rfxHeaderId: this.changeReqId,
          rfxLineSupplierId: val.rfxLineSupplierId,
        }));
        this.allocatedItemDataSet.refresh();
        this.customizeLineInfo = {
          visibleItem: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.allocatedItem").$D("分配物料"),
          height: "80%",
        };
        this.visible = true;
        break;
      case "allocatedLot":
        this.lineList = this.sectionBiding && this.sectionBiding.length > 0 ? [ ...this.sectionBiding ] : [];
        this.customizeLineInfo = {
          visibleSection: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.allocatedLot").$D("分配标段"),
          height: "80%",
        };
        this.visible = true;
        break;
      case "scoringItem":
        this.scoringElementDataSet = new DataSet(scoringElementDs(val.prequalHeaderId));
        this.scoringElementDataSet.refresh();
        this.customizeLineInfo = {
          visibleScore: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.scoringItem").$D("评分细项"),
          height: "80%"
        };
        this.visible = true;
        break;
      case "scoringElement":
        this.scoringElementDataSet = new DataSet(scoringElementDetailDs({
          parentIndicateId: val.evaluateIndicId,
          sourceIndicateId: val.indicateId,
          indicateLevel: "TWO",
          lovChangeFlag: "0",
          templateEleDetailFlag: 1, // 模板评分要素下的评分要素细项标志
          sourceType: val.calculateType, // 存在tmplAssignId 即TEMPLATE_MANUAL
          customizeUnitCode: this.getCustomizeCode("scoringElement"),
        }));
        this.scoringElementDataSet.refresh();
        this.customizeLineInfo = {
          visibleScore: true,
          title: $T("ssrc.inquiryHall.model.inquiryHall.scoringElement").$D("评分要素细项"),
          height: "80%"
        };
        this.visible = true;
        break;
      case "item":
        this.itemDataSet = new DataSet(itemDs(this.changeReqId, val.projectLineSectionId));
        this.itemDataSet.refresh();
        this.customizeInfo = {
          title: $T("ssrc.inquiryHall.model.inquiryHall.item").$D("物料"),
          height: "100%",
        };
        this.visibleItem = true;
        break;
      default:
        break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.card-personalized {
  width: 100%;
  color: #333333;
  padding 12px 15px;
  background: var(--color-bg-default);
  border-bottom: 1px solid var(--color-border-default);
  border-top: 10px solid var(--color-border-default);
}
.card-ladder {
  width: 100%;
  color: #333333;
  padding 6px 15px;
  background: var(--color-bg-default);
}
.card-distribution {
  width: 100%;
  color: #333333;
  padding 12px 15px;
  background: var(--color-bg-default);
  border-bottom: 1px solid var(--color-border-default);
  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.distr {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #EFF3FE;
  border-radius: 2px;
  width: 44px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #276EF1;
  line-height: 20px;
  margin-right: 8px;
}
.rfx-approval-border-space{
  border-bottom: 2px solid var(--background-color-empty-tab-title);
}
.rfx-approval-border-top-space{
  border-top: 2px solid var(--background-color-empty-tab-title);
}
.rfx-approval-ul-padding{
  padding: 15px;
}
.rfx-approval-ul-padding-top{
  padding-top: 16px;
}
</style>