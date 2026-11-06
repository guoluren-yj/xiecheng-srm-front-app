<template>
  <div class="container">
    <srm-step-progress v-if="steps.length > 0" justify="start" :steps="steps" />
    <div class="scroll-tab-container">
      <srm-scroll-tab>
        <srm-scroll-tab-item
          :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
          <srm-form style="min-height: 0vh" :data-set="basicInfoDs" :columns="getBasicInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="$T('ssrc.inquiryHall.view.tab.gradInformation').$D('评分信息')"/>
        <div v-if="flag" style="padding: 10px;border-bottom: 1px solid var(--background-color-empty-second)">
          <srm-button type="primary" @click="handleClick('expert')">{{ $T('ssrc.inquiryHall.view.message.button.switchExpertsDimension').$D('专家维度') }}</srm-button>
          <srm-button type="info" style="background: #fff" @click="handleClick('supplier')">{{ $T('ssrc.inquiryHall.view.message.button.switchSupplierDimension').$D('供应商维度') }}</srm-button>
        </div>
        <div v-else style="padding: 10px;border-bottom: 1px solid var(--background-color-empty-second)">
          <srm-button type="info" style="background: #fff" @click="handleClick('expert')">{{ $T('ssrc.inquiryHall.view.message.button.switchExpertsDimension').$D('专家维度') }}</srm-button>
          <srm-button type="primary" @click="handleClick('supplier')">{{ $T('ssrc.inquiryHall.view.message.button.switchSupplierDimension').$D('供应商维度') }}</srm-button>
        </div>
        <srm-list v-if="flag" :scrollable="false" style="background: red" :data-set="expertDs" :columns="getExpertColumns" />
        <srm-list v-else :scrollable="false" :data-set="supplierDs" :columns="getSupplierColumns" />
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { DataSet, SrmFlex, SrmListHeader, SrmTagGroup, SrmTabBar, SrmTabItem, SrmAttachment, SrmUtil } from "srm-mobile-ui";
import { fetchProgress, fetchExpertInfo, fetchSupplierInfo, fetchHeaderInfo } from "../api/index";
import Image from "@/assets/NoFile@1x.png";
import { basicInfoDS, expertDS, supplierDS } from "../datasource/expertManageDetailsDS";
import CompleteMethod from "../../../modules/CUX_PART/Method/CompleteMethod";
export default {
  modules: [ "hipspfm.common", "ssrc.inquiryHall", "ssrc.supplierQuotation", "ssrc.common" ],
  name: "ExpertManageDetails",
  extends: CompleteMethod,
  data() {
    return {
      headInfo: {}, // 头信息
      filePopup: false,
      steps: [],
      flag: true, // 判断专家维度还是供应商维度
      basicInfoDs: new DataSet(basicInfoDS()),
      expertDs: new DataSet(expertDS()),
      supplierDs: new DataSet(supplierDS()),
      uuidList: [], // 附件列表
      openBidOrder: null, // 判断附件
      lineAttachmentInfo: {}, // 行附件信息 勿动 中科合盈
    };
  },
  computed: {
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "sourceNum",
        },
        {
          fieldCode: "sourceTitle",
        },
      ];

      return columns;
    },
    // 基本信息
    getBasicInfoColumns() {
      return [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
      ];
    },
    // 专家
    getExpertColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "header",
          render: (value, item) => {
            const tags = [
              item.teamMeaning,
              item.expertLevelMeaning,
              item.expertTypeMeaning
            ];
            return <div style={{ width: "100%" }}>
              <SrmFlex justify="between">
                <div style={{ fontWeight: 600 }}>{`${item.loginName}-${item.expertName}`}</div>
                <div style={{ color: this.getColor(item.scoredStatus), marginTop: "5px", fontWeight: 700 }}>{item.scoredStatusMeaning}</div>
              </SrmFlex>
              <SrmTagGroup type="info" tags={tags} />
            </div>;
          }
        },
      ];
    },
    // 供应商
    getSupplierColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "header",
          render: (value, item) =>
            <SrmListHeader showOpenTag={false}>{item.supplierCompanyNum ? `${item.supplierCompanyNum}-${item.supplierCompanyName}` : item.supplierCompanyName}</SrmListHeader>
        },
        {
          fieldCode: "contactName",
        },
        {
          fieldCode: "contactMobilephone",
        },
        {
          fieldCode: "contactMail",
        },
        {
          fieldCode: "sectionAttachmentUuid",
          render: (value, item) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleOpen(item)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.viewAttachments").$D("查看附件")}</a>
        },
      ];
    }
  },
  mounted() {
    this.headInfo = this.$store.getters["ExpertRating/getExpertRatingList"];
    this.getHeaderInfo();
    this.getProcess();
    this.basicInfoDs.create({
      rfxNum: this.headInfo?.sourceNum,
      rfxTitle: this.headInfo?.sourceTitle,
    });
    this.fetchExpert();
    this.fetchSupplier();
  },
  methods: {
    // 获取字体颜色
    getColor(status) {
      if (status === "SCORED") {
        return "#47B881";
      }
      return "rgb(255, 188, 0)";
    },
    // 获取基础信息
    async getHeaderInfo() {
      const res = await fetchHeaderInfo({
        sourceHeaderId: this.headInfo?.sourceHeaderId,
      });
      if (res && !res.failed) {
        this.openBidOrder = res.openBidOrder;
      }
    },
    // 获取进度条
    async getProcess() {
      const res = await fetchProgress({
        sourceFrom: this.headInfo?.sourceFrom,
        sourceHeaderId: this.headInfo?.sourceHeaderId,
      });
      if (res && !res.failed) {
        const currentStep = res.find((ele) => ele.isCurrentFlag);
        this.steps = res.map((ele, index) => ({
          forbiddenState: ele.progressSequence > currentStep.progressSequence,
          nodeDes: ele.progressNameMeaning,
          nodeSeq: index + 1,
          progressName: ele.progressName,
          nodeState: ele.isCurrentFlag === currentStep.isCurrentFlag ? 0 : ele.progressSequence > currentStep.progressSequence ? 1 : -1,
        }));
      }
    },
    // 查询专家
    async fetchExpert() {
      const res = await fetchExpertInfo({
        sourceFrom: this.headInfo?.sourceFrom,
        sourceHeaderId: this.headInfo?.sourceHeaderId
      });
      if (res && !res.failed) {
        this.expertDs.setData(res?.[0]?.evaluateExperts);
      }
    },
    // 查询供应商
    async fetchSupplier() {
      const res = await fetchSupplierInfo({
        sourceFrom: this.headInfo?.sourceFrom,
        sourceHeaderId: this.headInfo?.sourceHeaderId
      });
      if (res && !res.failed) {
        this.supplierDs.setData(res?.[0]?.supplierList);
      }
    },
    // 切换维度
    handleClick(type) {
      if (type === "expert") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    // 打开附件弹框
    handleOpen(item) {
      // 勿动 中科合盈二开用
      this.lineAttachmentInfo = item || {};
      if (this.over$viewAttachment && typeof this.over$viewAttachment === "function") {
        return this.over$viewAttachment();
      }

      const list = [
        {
          id: "businessAttachmentUuid",
          label: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          value: item.businessAttachmentUuid,
        },
        {
          id: "techAttachmentUuid",
          label: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          value: item.techAttachmentUuid,
        },
        {
          id: "roundBusinessAttachmentUuid",
          label: this.$T("ssrc.supplierQuotation.model.supQuo.roundBusiAttach").$D("多轮商务附件"),
          value: item.roundBusinessAttachmentUuid,
        },
        {
          id: "roundTechAttachmentUuid",
          label: this.$T("ssrc.supplierQuotation.model.supQuo.roundTechAttach").$D("多轮技术附件"),
          value: item.roundTechAttachmentUuid,
        },
        {
          id: "bargainBusinessAttachmentUuid",
          label: this.$T("ssrc.supplierQuotation.model.supQuo.barginBusiAttach").$D("议价商务附件"),
          value: item.bargainBusinessAttachmentUuid,
        },
        {
          id: "bargainTechAttachmentUuid",
          label: this.$T("ssrc.supplierQuotation.model.supQuo.barginTechAttach").$D("议价技术附件"),
          value: item.bargainTechAttachmentUuid,
        }
      ];
      this.uuidList = this.setAttachMent(list);
      this.$popup({
        title: this.$T("ssrc.inquiryHall.model.inquiryHall.sectionAttachmentUuid").$D("附件"),
        showHeader: true,
        showClose: true,
        position: "right",
        height: "100vh",
        showBack: true,
        content: <SrmTabBar>
          {this.uuidList.map((ele, index) => <SrmTabItem key={index} label={ele.label}>
            {ele.value ?
              <SrmAttachment attachmentUuid={ele.value} readonly uploadButton="" bucketName={SrmUtil.getDefaultBucketName()} /> :
              <div class="noContent">
                <div>
                  <img src={Image} alt="" />
                  <p>{ this.$T("hipspfm.common.message.noAttachment").$D("暂无附件") }</p>
                </div>
              </div>
            }
          </SrmTabItem>)}
        </SrmTabBar>,
      });
    },
    // 处理附件方法
    setAttachMent(list) {
      const progressName = this.steps.find((ele) => ele.nodeState === 0).progressName;
      switch (this.openBidOrder) {
      case "TECH_FIRST":
        if (
          progressName.startsWith("TECHNOLOGY_SCORING") ||
          progressName.startsWith("TECHNOLOGY_SUMMARY")
        ) {
          list.forEach((ele) => {
            if ([ "businessAttachmentUuid", "roundBusinessAttachmentUuid", "bargainBusinessAttachmentUuid" ].includes(ele.id)) {
              ele.value = null;
            }
          });
        }
        if (
          progressName.startsWith("BUSINESS_SCORING") ||
          progressName.startsWith("BUSINESS_SUMMARY")
        ) {
          list.forEach((ele) => {
            if ([ "techAttachmentUuid", "roundTechAttachmentUuid", "bargainTechAttachmentUuid" ].includes(ele.id)) {
              ele.value = null;
            }
          });
        }
        break;
      case "BUSINESS_FIRST":
        if (
          progressName.startsWith("BUSINESS_SCORING") ||
          progressName.startsWith("BUSINESS_SUMMARY")
        ) {
          list.forEach((ele) => {
            if ([ "techAttachmentUuid", "roundTechAttachmentUuid", "bargainTechAttachmentUuid" ].includes(ele.id)) {
              ele.value = null;
            }
          });
        }
        if (
          progressName.startsWith("TECHNOLOGY_SCORING") ||
          progressName.startsWith("TECHNOLOGY_SUMMARY")
        ) {
          list.forEach((ele) => {
            if ([ "businessAttachmentUuid", "roundBusinessAttachmentUuid", "bargainBusinessAttachmentUuid" ].includes(ele.id)) {
              ele.value = null;
            }
          });
        }
        break;
      default:
        break;
      }
      return list;
    }
  },
};
</script>

<style lang="stylus" scoped>
.container{
  height: 100vh;
  overflow: auto;
}

.button-right-margin{
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 20px;
    width: 20px;
  }
}

.noContent {
  display: flex;
  justify-content: center;
  height: calc(100vh - 120px);
  padding:0 20px 0 0;

  div {
    margin-top: 70px;
    img {
      width: 240px;
      height: 240px;
      padding 30px;
    }

    p {
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default-e);
      letter-spacing: 0;
    }
  }
}

.scroll-tab-container{
  height: calc(100%-56px);
  background: var(--background-color-empty-tab-title);
}
</style>
