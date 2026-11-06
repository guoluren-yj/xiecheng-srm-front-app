
<template>
  <!-- 初审 -->
  <div>
    <!-- 内容区域      -->
    <srm-scroll-tab class="content">
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.headerBaseInfo').$D('基础信息')" >
        <div class="customize-card" @click="goToPreliminaryBasicInfoDetail">
          <customize :need-padding="true" type="list" :data-source="headInfo" code="SMBL.INQUIRY_HALL.PRELIMINARY_BASEINFO" :columns="getPretralBasicInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.costRemark').$D('成本备注')" >
        <div class="customize-card" @click="goToPreliminaryCostRemarkDetail">
          <customize :need-padding="true" :data-source="headInfo" code="SMBL.INQUIRY_HALL.PRELIMINARY_COSTREMARK" :columns="getPretralCostRemarkColumns" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import { getHeaderApi } from "../api/Preliminary";
import { $T, SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common" ],
  name: "Preliminary",
  props: {
    rfxHeaderId: {
      type: String,
    }
  },
  data() {
    return {
      // 基础信息
      headInfo: {},
      detailPopup: null, //详情弹窗
    };
  },
  computed: {
    //基础信息
    getPretralBasicInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{val ? val : "-"}
            </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          formRow: 20,
          fieldCode: "secondarySourceCategoryMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
        },
        {
          formRow: 30,
          fieldCode: "sourceMethodMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
        },
        {
          formRow: 30,
          fieldCode: "pretrialUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          formRow: 40,
          fieldCode: "checkRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          formRow: 40,
          fieldCode: "checkAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
      ];
    },
    //基础信息详情弹窗
    getPretralBasicInfoPopColumns() {
      return [
        {
          fieldCode: "rfxNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
        },
        {
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          fieldCode: "secondarySourceCategoryMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
        },
        {
          fieldCode: "pretrialUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          fieldCode: "checkRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          fieldCode: "checkAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
      ];
    },
    //成本备注
    getPretralCostRemarkColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "totalCost",
          fieldType: "EMPTY",
          render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本") }：{ val }</span>
        },
        {
          formRow: 20,
          fieldCode: "totalPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 30,
          fieldCode: "overCostFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "overCostScale",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比")
        },
        {
          formRow: 40,
          fieldCode: "overCostPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 50,
          fieldCode: "costRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注")
        },
      ];
    },
    //成本备注详情弹窗
    getPretralCostRemarkPopColumns() {
      return [
        {
          fieldCode: "totalCost",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本"),
        },
        {
          fieldCode: "totalPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "overCostFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldCode: "overCostScale",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比")
        },
        {
          fieldCode: "overCostPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "costRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注")
        },
      ];
    },
  },
  async mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        getHeaderApi(this.rfxHeaderId).then((res) => {
          this.headInfo = { ...res };
        });
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    //初审头信息详细页面
    goToPreliminaryBasicInfoDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.PRELIMINARY_BASEINFO"
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPretralBasicInfoPopColumns}
        />,
      });
    },
    //初审成本备注信息详细页面
    goToPreliminaryCostRemarkDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.PRELIMINARY_COSTREMARK"
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPretralCostRemarkPopColumns}
        />,
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
  .customize-card {
    padding: 16px 0px 6px 0px;
  }
</style>