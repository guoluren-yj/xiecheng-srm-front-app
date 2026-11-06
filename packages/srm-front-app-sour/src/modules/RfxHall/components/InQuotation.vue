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
            code="SMBL.INQUIRY_HALL.INQUOTATION_BASICINFO"
            :columns="getBasicInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.model.inquiryHall.quotationParticularss').$D('报价详情')
        ">
        <srm-list
          :data-set="quotationDetailsDataSet"
          customize-code="SMBL.INQUIRY_HALL.INQUOTAION_DETAILS_LIST"
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
import { quotationDetailsDs } from "../datasource/InQuotationDs";
import { getInQuotationBasicInfoApi } from "../api/InQuotation";
import ProcessAttachmentPop from "./commonPop/ProcessAttachmentPop";

export default {
  modules: [ "ssrc.inquiryHall", "sqam.common", "ssrc.queryRfq", "ssrc.common", "hipspfm.common" ],
  name: "InQuotation",
  components: {
    ProcessAttachmentPop
  },
  props: {
    rfxHeaderId: {
      type: String,
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
            {this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}: {val}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "latestQuotationEndDate",
        },
      ];
      return columns;
    },
    getBasicInfoDetailColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
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
          fieldCode: "quotationStatusMeaning",
        },
        {
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
          fieldCode: "quotationStatusMeaning",
        },
        {
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
        const baseInfo = await getInQuotationBasicInfoApi(this.rfxHeaderId);
        this.baseInfo = baseInfo;
      } catch (err) {
        this.$loading.hide();
      } finally {
        this.$loading.hide();
      }
    },
    //获取过程附件信息
    getProcessAttachmentDetailInfo(item) {
      this.processAttachmentPop = false;
      this.processAttachmentData = new DataSet(processAttachmentDs(item.rfxHeaderId));
      this.processAttachmentData.refresh();
      this.processAttachmentPop = true;
    },
    //过程附件下载
    downloadlFileHandler(item) {
      let rfxProcessAttachmentDTOS = item.rfxProcessAttachmentDTOS;
      this.$showFileList({
        fileList: rfxProcessAttachmentDTOS.map((e) => ({
          fileUrl: e.fileUrl,
          fileName: e.fileName,
          fileSize: e.fileSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    showPretrialGroup() {
      this.prequalGroupVisible = !this.prequalGroupVisible;
    },
    goToBasicDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.INQUOTATION_BASICINFO_DETAIL"
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
          customize-code="SMBL.INQUIRY_HALL.INQUOTATION_QUODETAIL_DETAIL"
          customizeType="detail"
          dataSet={this.quotationDetailsDataSet}
          columns={this.getQuotationDetailsPopColumns}
        />,
      });
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
