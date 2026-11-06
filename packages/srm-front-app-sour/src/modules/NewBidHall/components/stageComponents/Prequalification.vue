<template>
  <!-- 资格预审 -->
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
            :code="getCustomizeCode('basicInfo')"
            :data-source="baseInfo"
            :columns="getBasicInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.view.title.prequalDetails').$D('预审详情')
        ">
        <srm-list
          :customize-code="getCustomizeCode('prequalList')"
          :data-set="prequalDetailsDataSet"
          :columns="getPrequalDetailsColumns"
          @itemClick="onListItemClick"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="baseInfo.rfxStatus === 'CLOSED' || baseInfo.rfxStatus === 'CHECK_PENDING' || baseInfo.rfxStatus === 'FINISHED'" :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')">
        <div class="customize-card">
          <customize :need-padding="true" :data-source="baseInfo" :columns="getProcessAttachmentColumns" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 预审小组弹窗 -->
    <srm-popup
      :show-header="false"
      :visible.sync="prequalGroupVisible"
      height="100%">
      <div>
        <srm-list
          :customize-code="getCustomizeCode('prequalGroup')"
          :data-set="prequalGroupDataSet"
          :columns="getPrequalGroupColumns"/>
      </div>
    </srm-popup>
    <!-- 过程附件弹框 -->
    <process-attachment-pop ref="processAttachComRef" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { prequalDetailsDs, prequalGroupDs } from "../../datasource/PrequalificationDs";
import { getPrequalBasicInfoApi } from "../../api/Prequalificate";
import ProcessAttachmentPop from "../commonPop/ProcessAttachmentPop";

export default {
  modules: [ "ssrc.inquiryHall", "sqam.common", "ssrc.queryRfq", "smbl.inquiryHall", "ssrc.common", "hipspfm.common" ],
  name: "Prequalification",
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
      prequalGroupVisible:false,
      prequalDetailsDataSet:new DataSet(prequalDetailsDs()),
      prequalGroupDataSet:new DataSet(prequalGroupDs())
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
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalEndDate").$D("预审截止时间"),
          fieldCode: "prequalEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reviewMethod").$D("审查方法"),
          fieldCode: "reviewMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qualifiedLimit").$D("合格上限"),
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalLocation").$D("申请提交地点"),
          fieldCode: "prequalLocation",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.enableScoreFlag").$D("启用评分细项"),
          fieldCode: "enableScoreFlag",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachmentUuid").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                color="var(--color-other-default-b)"
                title={this.$T("sqam.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "ssrc.inquiryHall.model.inquiryHall.view"
                ).$D("查看")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrialGroup").$D("预审小组"),
          fieldCode: "pretrialGroup",
          render:() => <span style={ { "color":"var(--font-color-primary)" } } on-click={(e) => {
            e.stopPropagation();
            this.showPretrialGroup();
          }}>{this.$T(
              "ssrc.inquiryHall.model.inquiryHall.view"
            ).$D("查看")}</span>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qulifiedRequire").$D("资质要求"),
          fieldCode: "prequalRemark",
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
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalEndDate").$D("预审截止时间"),
          fieldCode: "prequalEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reviewMethod").$D("审查方法"),
          fieldCode: "reviewMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qualifiedLimit").$D("合格上限"),
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalLocation").$D("申请提交地点"),
          fieldCode: "prequalLocation",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.enableScoreFlag").$D("启用评分细项"),
          fieldCode: "enableScoreFlag",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachmentUuid").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                color="var(--color-other-default-b)"
                title={this.$T("sqam.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "ssrc.inquiryHall.model.inquiryHall.view"
                ).$D("查看")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrialGroup").$D("预审小组"),
          fieldCode: "pretrialGroup",
          render:() => <span style={ { "color":"var(--font-color-primary)" } } on-click={(e) => {
            e.stopPropagation();
            this.showPretrialGroup();
          }}>{this.$T(
              "ssrc.inquiryHall.model.inquiryHall.view"
            ).$D("查看")}</span>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qulifiedRequire").$D("资质要求"),
          fieldCode: "prequalRemark",
        },
      ];
      return columns;
    },
    // 预审详情
    getPrequalDetailsColumns() {
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
          fieldCode: "name",
        },
        {
          fieldCode: "mobilephone",
        },
        {
          fieldCode: "prequalStatusMeaning",
        },
        {
          fieldCode: "lineApprovedStatusMeaning",
        },
        {
          fieldCode: "leaderSummaryResMeaning",
        },
      ];
      return columns;
    },
    // 预审详情弹窗
    getPrequalDetailsPopColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "name",
        },
        {
          fieldCode: "mobilephone",
        },
        {
          fieldCode: "prequalStatusMeaning",
        },
        {
          fieldCode: "lineApprovedStatusMeaning",
        },
        {
          fieldCode: "leaderSummaryResMeaning",
        },
      ];
      return columns;
    },
    // 预审小组
    getPrequalGroupColumns() {
      const columns = [
        {
          fieldCode: "realName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{record.loginName}-{val}</span>
              <span style={ { "color":record.leaderFlag ? "#05944F" : "#AFAFAF" }} slot="right">{record.leaderFlagMeaning}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.inquiryHall.mobilePhone").$D("手机号"),
          fieldCode: "phone",
          render:(val, record) => <span>{record.internationalTelCodeMeaning}| {val}</span>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Email").$D("邮箱"),
          fieldCode: "email",
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
    this.prequalDetailsDataSet.addPathParameter("rfxHeaderId", this.rfxHeaderId);
    this.prequalGroupDataSet.addPathParameter("rfxHeaderId", this.rfxHeaderId);
  },
  mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        this.getPrequalBasicInfo();
      } catch (err) {
        this.$loading.hide();
      } finally {
        this.$loading.hide();
      }
    }
  },
  methods: {
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
        // 基础信息
        basicInfo:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.PREQUAL.BASICINFO.BID" : "SMBL.NEW_BID_HALL.PREQUAL.BASICINFO.RFX",
        basicInfoDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.PREQUAL_BASICINFO_DETAIL.BID" : "SMBL.NEW_BID_HALL.PREQUAL_BASICINFO_DETAIL.RFX",
        // 预审详情
        prequalList:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.PREQUAL_DETAILSLIST.BID" : "SMBL.NEW_BID_HALL.PREQUAL_DETAILSLIST.RFX",
        prequalDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.PREQUAL_PREDETAILS_DETAIL.BID" : "SMBL.NEW_BID_HALL.PREQUAL_PREDETAILS_DETAIL.RFX",
        // 预审小组
        prequalGroup:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.PREQUAL_GROUP.BID" : "SMBL.NEW_BID_HALL.PREQUAL_GROUP.RFX",
      };
      return codeList[code] || "";
    },
    //基本信息
    async getPrequalBasicInfo() {
      try {
        this.$loading.show();
        const baseInfo = await getPrequalBasicInfoApi(this.documentType, this.rfxHeaderId);
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
          style="padding: 0 15px"
          code={this.getCustomizeCode("basicInfoDetail")}
          dataSource={this.baseInfo}
          columns={this.getBasicInfoDetailColumns}
        />,
      });
    },
    onListItemClick() {
      this.detailPopup = this.$popup({
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customize-code={this.getCustomizeCode("prequalDetail")}
          dataSet={this.prequalDetailsDataSet}
          columns={this.getPrequalDetailsPopColumns}
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
