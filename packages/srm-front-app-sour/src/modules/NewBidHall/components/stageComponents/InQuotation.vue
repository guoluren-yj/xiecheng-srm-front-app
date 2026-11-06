<template>
  <!-- 报价中 -->
  <div>
    <!-- 内容区 -->
    <srm-scroll-tab class="content">
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.view.title.basicInformation').$D(
            '基本信息'
          )
        ">
        <div v-if="JSON.stringify(baseInfo) === '{}'" class="noContent">
          <span>{{ $T("ssrc.inquiryHall.view.title.noBasicInformation").$D("暂无基本信息") }}</span>
        </div>
        <div v-else class="customize-padding" @click="goToBasicDetail">
          <customize
            :need-padding="true"
            :data-source="baseInfo"
            :code="getCustomizeCode('basicInfo')"
            :columns="getBasicInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          documentType === 'BID' ? $T('smbl.inquiryHall.tab.message.bidDetail').$D('投标详情') : $T('ssrc.inquiryHall.model.inquiryHall.quotationParticularss').$D('报价详情')
        ">
        <srm-list
          :data-set="quotationDetailsDataSet"
          :customize-code="getCustomizeCode('quotationDetails')"
          :columns="getQuotationDetailsColumns"
          @itemClick="onListItemClick"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="baseInfo.rfxStatus === 'CLOSED' || baseInfo.rfxStatus === 'CHECK_PENDING' || baseInfo.rfxStatus === 'FINISHED'" :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')">
        <div class="customize-card">
          <customize :need-padding="true" :data-source="baseInfo" :columns="getProcessAttachmentColumns" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 过程附件弹框 -->
    <process-attachment-pop ref="processAttachComRef" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { quotationDetailsDs } from "../../datasource/InQuotationDs";
import { getInQuotationBasicInfoApi } from "../../api/InQuotation";
import ProcessAttachmentPop from "../commonPop/ProcessAttachmentPop";

export default {
  modules: [ "ssrc.inquiryHall", "sqam.common", "ssrc.queryRfq", "smbl.inquiryHall", "ssrc.bidHall", "ssrc.common", "hipspfm.common" ],
  name: "InQuotation",
  components: {
    ProcessAttachmentPop,
  },
  props: {
    rfxHeaderId: {
      type: String,
    },
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      baseInfo:{},
      detailPopup: null,
      quotationDetailsDataSet:new DataSet(quotationDetailsDs()),
    };
  },
  computed: {
    // 基本信息
    getBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "rfxNum",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader>
            { this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号") }: {val}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          fieldCode: this.documentType === "BID" ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "latestQuotationEndDate",
        },
      ];
      return columns;
    },
    getBasicInfoDetailColumns() {
      const columns = [
        {
          fieldName:this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          fieldCode: this.documentType === "BID" ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "latestQuotationEndDate",
        },
      ];
      return columns;
    },
    // 报价详情
    getQuotationDetailsColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) =>
            <SrmListHeader>
              <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCompanysName").$D("供应商名称") }: { val }</span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "contactName",
        },
        {
          fieldCode: "contactMobilephone",
        },
        {
          fieldCode: "feedbackStatusMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.whetherBid").$D("是否投标") : this.$T("ssrc.inquiryHall.model.inquiryHall.whetherQuotation").$D("是否报价"),
          fieldCode: "quotationStatusMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.inquiryHall.model.inquiryHall.tenderIp").$D("投标IP") : this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyIp").$D("报价IP"),
          fieldCode: "supplierCompanyIp",
        },
      ];
      return columns;
    },
    // 报价详情弹窗
    getQuotationDetailsPopColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "contactName",
        },
        {
          fieldCode: "contactMobilephone",
        },
        {
          fieldCode: "feedbackStatusMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.whetherBid").$D("是否投标") : this.$T("ssrc.inquiryHall.model.inquiryHall.whetherQuotation").$D("是否报价"),
          fieldCode: "quotationStatusMeaning",
        },
        {
          fieldName: this.documentType === "BID" ? this.$T("ssrc.inquiryHall.model.inquiryHall.tenderIp").$D("投标IP") : this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyIp").$D("报价IP"),
          fieldCode: "supplierCompanyIp",
        },
      ];
      return columns;
    },
    //过程附件查看
    getProcessAttachmentColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxHeaderId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ this.$T("ssrc.inquiryHall.view.button.examine").$D("过程附件查看") }：</span>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                this.$refs.processAttachComRef.getProcessAttachmentDetailInfo(item);
              }}>
              { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
            </span>
          </SrmFlex>,
        }
      ];
    },
  },
  beforeMount() {
    this.quotationDetailsDataSet.addPathParameter("rfxHeaderId", this.rfxHeaderId);
  },
  mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        this.getInQuotationBasicInfo();
      } catch (err) {
        this.$loading.hide();
      } finally {
        this.$loading.hide();
      }
    }
  },
  methods: {
    //基本信息
    async getInQuotationBasicInfo() {
      try {
        this.$loading.show();
        const baseInfo = await getInQuotationBasicInfoApi(this.documentType, this.rfxHeaderId);
        this.baseInfo = baseInfo;
      } catch (err) {
        this.$loading.hide();
      } finally {
        this.$loading.hide();
      }
    },
    showPretrialGroup() {
      this.prequalGroupVisible = !this.prequalGroupVisible;
    },
    goToBasicDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code={this.getCustomizeCode("basicInfoDetail")}
          style="padding: 0 15px"
          dataSource={this.baseInfo}
          columns={this.getBasicInfoDetailColumns}
        />,
      });
    },
    onListItemClick() {
      this.detailPopup = this.$popup({
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customize-code={this.getCustomizeCode("quotationDetailDetail")}
          customizeType="detail"
          dataSet={this.quotationDetailsDataSet}
          columns={this.getQuotationDetailsPopColumns}
        />,
      });
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
        // 基础信息
        basicInfo:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.INQUOTATION_BASICINFO.BID" : "SMBL.NEW_BID_HALL.INQUOTATION_BASICINFO.RFX",
        basicInfoDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.INQUOTATION_BASICINFO_DETAIL.BID" : "SMBL.NEW_BID_HALL.INQUOTATION_BASICINFO_DETAIL.RFX",
        // 投标详情
        quotationDetails:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.INQUOTAION_DETAILS_LIST.BID" : "SMBL.NEW_BID_HALL.INQUOTAION_DETAILS_LIST.RFX",
        quotationDetailDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.INQUOTATION_QUODETAIL_DETAIL.BID" : "SMBL.NEW_BID_HALL.INQUOTATION_QUODETAIL_DETAIL.RFX",
      };
      return codeList[code] || "";
    },
  },
};
</script>

<style lang="stylus" scoped>
.noContent {
  height: 78px;
  padding-left: 20px;

  span {
    position: relative;
    top: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: var(--color-font-default-b);
    letter-spacing: 0;
    line-height: 22px;
  }
}
.customize-padding{
  padding:16px 0 6px 0;
}
</style>
