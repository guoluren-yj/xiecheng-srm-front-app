<template>
  <div class="detail-form-wrap">
    <srm-scroll-tab customize-code="">
      <srm-blank size="1px" theme="fill"/>
      <srm-scroll-tab-item
        :label="$T('sslm.common.view.title.baseInfo').$D('基础信息')"
        code="baseInfo">
        <customize
          need-padding
          :columns="headerInfoColumns"
          :data-source="headerInfoData"
          code="SMBL.WORKFLOW.SSLM.SUPPLY_ABILITY_DOC_HEADER"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('sslm.supplyAbility.view.message.categoryMaterialTable').$D('推荐物料/品类')"
        code="itemCategory">
        <srm-list
          :scrollable="false"
          :data-set="itemCategoryDs"
          :columns="itemCategoryColumns"
          customize-code="SMBL.WORKFLOW.SSLM.SUPPLY_ABILITY_DOC_DETAIL.CATEGORYS"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.title.attachment').$D('附件')"
        code="attachment">
        <customize
          need-padding
          :columns="attachmentColumns"
          :data-source="headerInfoData"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
// import { SrmUtil, $T } from "srm-mobile-ui";
import { DataSet } from "srm-mobile-ui";
import { getItemCategoryDS } from "./datasource/getItemCategoryDS";
import { getHeaderInfoColumns, getItemCategoryColumns, getAttachmentColumns } from "./utils/getColums";
import { fetchHeaderInfo, fetchLineAttachment } from "./api";
export default {
  modules: [ "sslm.common", "hzero.common", "hipspfm.common", "sslm.supplyAbility", "sslm.supplyAbilityDoc", "smbl.common", "sslm.supplierInform" ],
  name: "SupplyAbilityApprovalDoc",
  components: {
  },
  props: {
    parameters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      headerInfoData: {},
      headerInfoColumns: getHeaderInfoColumns(),
      itemCategoryColumns: getItemCategoryColumns({ onAttachment: this.queryAbilityAttachment }),
      attachmentColumns: getAttachmentColumns(),
      itemCategoryDs: new DataSet(getItemCategoryDS({ abilityReqId:this.parameters.abilityReqId })),
    };
  },
  async mounted() {
    this.$loading.show();
    const headerInfo = await this.queryHeaderInfo();
    if (headerInfo) {
      // usePurchaseItemFlag: 供应商创建的单据才有值； 采购方创建的单据没这个字段
      // 值为1 允许供应商选择采购方物料/品类;
      // 值为0 不允许供应商选择采购方物料/品类; 展示供方物料/品类字段;
      // initiateCamp 0 采购方创建，1 供应商创建
      const { usePurchaseItemFlag = 1, initiateCamp = "0" } = headerInfo;
      const purchaserItemFlag = !Number(initiateCamp) ? true : Boolean(Number(usePurchaseItemFlag));
      // 展示供方物料，品类字段；单据发起方是供应商，并且采购方不允许供应商选择采购方的物料、品类；
      const supplierItemFlag = Number(initiateCamp) && !Number(usePurchaseItemFlag);
      this.headerInfoData = headerInfo;
      this.itemCategoryColumns = getItemCategoryColumns({ purchaserItemFlag, supplierItemFlag, onAttachment: this.queryAbilityAttachment });
    }
    this.$loading.hide();
  },
  methods: {
    // 查询头信息
    async queryHeaderInfo() {
      const param = {
        abilityReqId: this.parameters.abilityReqId,
        customizeUnitCode: "SUPPLY_ABILITY_DOC.PURCHASER_DETAIL.HEADER_INFO"
      };
      const res = await fetchHeaderInfo(param);
      if (res && !res.failed) {
        return res;
      }
    },
    // 查看供货能力行附件
    queryAbilityAttachment(record) {
      const { abilityChangeLineId } = record;
      if (!abilityChangeLineId) {
        return;
      }
      const params = {
        abilityChangeLineId,
        page: 0,
        size: 0,
      };
      fetchLineAttachment(params).then((res) => {
        if (res && !res.failed) {
          const { content = [] } = res;
          this.$showFileList({
            fileList: content.map((e) => ({
              fileUrl: e.attachmentUrl,
              fileName: e.attachmentDesc,
              fileSize: e.attachmentSize,
              creationDate: e.creationDate,
              bucketName: "private-bucket",
            }))
          });
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-form-wrap {
  >>> .attachment-uuid-field{
    height:34px;
    .srm-icon.icon-other{
      color: #febf43;
      font-size: 28px;
    }
    .srm-attachment-button{
      margin-left:8px;
      flex-grow: 1;
      display:flex;
      .srm-button{
        flex-grow: 1;
        text-align: left;
        font-weight: 400;
        .srm-button-text{
          font-size: 14px;
          color: #333;
          font-weight: 400;
          width: 100%;
        }
      }
    }
  }
}
</style>
