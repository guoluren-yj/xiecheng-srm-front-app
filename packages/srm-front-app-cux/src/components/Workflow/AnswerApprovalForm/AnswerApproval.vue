<!-- 奥克斯纯二开的答疑审批功能- -->
<template>
  <div class="detail-wrap">
    <!-- 基本信息 -->
    <div
      class="content-item"
      @click="
        goDetail(
          getBasicDetailColums,
          basicInfo,
          $T('smbl.common.view.message.basicInformation').$D('基本信息')
        )
      ">
      <div class="card">
        <div class="card-head open-tag">
          {{ $T("smbl.common.view.message.basicInformation").$D("基本信息") }}
        </div>
        <customize
          :columns="getBasicColums"
          :data-source="basicInfo"
          unit-type="FORM"/>
      </div>
    </div>
    <!-- 标的信息 -->
    <div class="content-item">
      <div class="card has-border">
        <div class="card-head open-tag">
          {{
            $T("ssrc.inquiryHall.view.message.tab.allSubjectInformation").$D(
              "标的信息"
            )
          }}
        </div>
        <div
          v-for="(bidInfo, key) in bidInfoList"
          :key="key"
          @click="
            goDetail(
              getBidInfoDetailColums,
              bidInfo,
              $T('ssrc.inquiryHall.view.message.tab.allSubjectInformation').$D(
                '标的信息'
              )
            )
          ">
          <customize :columns="getBidInfoColums" :data-source="bidInfo" />
        </div>
      </div>
    </div>
    <!-- 澄清函答疑审批审批详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :columns="getPopInfoColumns"/>
  </div>
</template>

<script>
import uuid from "uuid";
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import {
  getAnswerBasicInfoApi,
  getBindingInfoListApi,
} from "./api/AnswerApproval";
export default {
  modules: [ "ssrc.planToInquiry", "smodr.frightLine", "smbl.common", "ssrc.inquiryHall", "ssrc.supplierQuotation" ],
  name: "AnswerApproval",
  components: {
    SrmDetailPop,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      attachmentUuid: "", //当前传入的文件uuid
      headTitle: "", //表头标题
      clarificationId: "",
      basicInfo: {}, //澄清函基本信息
      bidInfoList: [], //标的信息信息列表
      srmDetailPop: false, //明细页pop
      getPopInfoColumns: [],
      detailInfo: {},
      clarifyId:"",
      rfxHeaderId:""
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.projectName").$D("项目名称"),
          fieldCode: "rfxTitle",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.recruitment").$D("招采方式"),
          fieldCode: "attributeVarchar1Meaning",
          formRow: 2,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationEndTime").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.biddingTypeMeaning").$D("类型"),
          fieldCode: "attributeVarchar2Meaning",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.isMonopoly").$D("是否垄断"),
          fieldCode: "attributeVarchar3Meaning",
          formRow: 4,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.biddingForm").$D("招标形式"),
          fieldCode: "attributeVarchar4Meaning",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.answerFile").$D("答疑文件"),
          fieldCode: "attachUuid",
          formRow: 5,
          formCol: 2,
          render: () =>
            <div>
              <SrmUpload
                attachment-uuid={this.attachmentUuid}
                show-count={false}
                show-icon={false}
                title={this.$T(
                  "ssrc.planToInquiry.model.inquiry.answerFile"
                ).$D("答疑文件")}
                desc-title={this.$T("smodr.frightLine.model.check").$D(
                  "查看"
                )}
                onShowFilePopup={this.viewAttachment}
              />
            </div>,
          callBack: () => {},
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.projectName").$D("项目名称"),
          fieldCode: "rfxTitle",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.recruitment").$D("招采方式"),
          fieldCode: "attributeVarchar1Meaning",
          formRow: 30,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationEndTime").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
          formRow: 40,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.biddingTypeMeaning").$D("类型"),
          fieldCode: "attributeVarchar2Meaning",
          formRow: 50,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.isMonopoly").$D("是否垄断"),
          fieldCode: "attributeVarchar3Meaning",
          formRow: 60,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.biddingForm").$D("招标形式"),
          fieldCode: "attributeVarchar4Meaning",
          formRow: 70,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.answerFile").$D("答疑文件"),
          fieldCode: "attachUuid",
          formRow: 80,
          render: () =>
            <div>
              <SrmUpload
                attachment-uuid={this.attachmentUuid}
                show-count={false}
                show-icon={false}
                title={this.$T(
                  "ssrc.planToInquiry.model.inquiry.answerFile"
                ).$D("答疑文件")}
                desc-title={this.$T("smodr.frightLine.model.check").$D(
                  "查看"
                )}
                onShowFilePopup={this.viewAttachment}
              />
            </div>,
          callBack: () => {},
        },
      ];

      return columns;
    },
    // 标的信息
    getBidInfoColums() {
      const columns = [
        {
          fieldCode: "itemName",
          formRow: 1,
          formCol: 1,
          fieldType: "EMPTY",
          render: (val) => <span style="color:#333333">{val}</span>,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.ouName").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.inventoryOrg").$D("申请单位"),
          fieldCode: "invOrganizationName",
          formRow: 2,
          formCol: 2,
        },
      ];

      return columns;
    },
    //标信息详情
    getBidInfoDetailColums() {
      const columns = [
        {
          fieldCode: "itemName",
          formRow: 10,
          fieldType: "EMPTY",
          render: (val) => <span style="color:#333333">{val}</span>,
        },
        {
          fieldName: this.$T("ssrc.planToInquiry.model.inquiry.ouName").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.inventoryOrg").$D("申请单位"),
          fieldCode: "invOrganizationName",
          formRow: 30,
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    this.clarifyId = this.changeReqId;
    await this.getBasicInfo();
    await this.getBindingInfoList();
    this.$loading.hide();
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, title) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
    },
    //  获取答疑审批基本信息信息
    async getBasicInfo() {
      await getAnswerBasicInfoApi(this.clarifyId).then((res) => {
        this.basicInfo = res;
        this.rfxHeaderId = res.rfxHeaderId;
      });
    },
    //获取标的信息列表
    async getBindingInfoList() {
      await getBindingInfoListApi(this.rfxHeaderId).then((res) => {
        this.bidInfoList = res;
      });
    },
    //查看合作分析附件
    viewAttachment() {
      this.attachmentUuid = this.basicInfo.attachmentUuid || uuid();
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .srm-upload-title {
  color: #276EF1;
}

.detail-wrap {
  height: calc(100vh - 240px);
  overflow: auto;

  .content-item {
    .card {
      box-sizing: border-box;
      padding: 16px 0 16px 15px;
      background: #FFF;
    }
  }
}
</style>
