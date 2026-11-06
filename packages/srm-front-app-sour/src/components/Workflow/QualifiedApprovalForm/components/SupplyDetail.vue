<template>
  <hips-popup v-model="value" class="FullPop" style="height: 100%;width:100%" position="bottom">
    <div class="lineInfoDetail">
      <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid"/>
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/icon_navigationbars_off_normal@3x.png">
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('sslm.supplierDetail.view.message.title.supplyCapacityList').$D('供货能力详情') }}
        </div>
      </hips-nav-bar>
      <div class="lineBody">
        <customize-detail :columns="columns" :data-source="supplyDetail"
                          code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_INFO_DETAIL"/>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, Input, Popup, NavBar } from "hips";
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";

export default {
  modules: [ "hipspfm.common", "sslm.supplierDetail", "sslm.supplyAbility", "sslm.commonApplication", "smbl.common" ],
  name: "SupplyDetail",
  components: {
    AttachedFile,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    supplyDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      uuid: "",
      attachmentUuid: "",
      filePopup: false,
      columns: [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          fieldType: "TEXT",
          defaultValue: "",
          render: (val) => {
            if (val) {
              return this.$T("smbl.common.message.yes").$D("是");
            }
            return this.$T("smbl.common.message.no").$D("否");
          },
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.countryIdMeaning").$D("服务国家"),
          fieldCode: "countryIdMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.regionIdMeaning").$D("服务地区"),
          fieldCode: "regionIdMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.cityName").$D("服务城市"),
          fieldCode: "cityIdMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
          fieldCode: "supplyStatus",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supAbility.psaEvaluationLevel").$D("PSA评级"),
          fieldCode: "psaEvaluationLevel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
          fieldCode: "psaEvaluationScore",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
          fieldCode: "psaFinishDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationLevel").$D("SPA评级"),
          fieldCode: "spaEvaluationLevel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationScore").$D("SPA评分"),
          fieldCode: "spaEvaluationScore",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
          fieldCode: "spaFinishDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluateRemark").$D("评价信息"),
          fieldCode: "evaluateRemark",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldCode: "supplierAttachmentUuid",
          fieldType: "TEXT",
          render: () => this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
          callBack: (val) => {
            this.showFilePop(val.supplierAttachmentUuid || this.uuid);
          }
        },
      ]
    };
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    showFilePop(attachmentUuid) {
      this.attachmentUuid = attachmentUuid;
      this.filePopup = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.lineInfoDetail {
  background: var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineBody {
    padding 15px;
  }
}
</style>
