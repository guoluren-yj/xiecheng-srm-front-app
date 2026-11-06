<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <SrmTab class="content">
      <!-- 基本信息 -->
      <SrmTabPane
        :label="$T('smbl.common.view.message.basicInformation').$D('基本信息')">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicDetailColums,
              purchaseInfo,
              $T('smbl.common.view.message.basicInformation').$D('基本信息')
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{ purchaseInfo.reqNum }}
            </div>
            <Customize
              :columns="getBasicColums"
              :data-source="purchaseInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </SrmTabPane>
      <!-- 申请信息 -->
      <SrmTabPane :label="$T('mallf.common.view.myRequestInfo').$D('申请信息')">
        <div class="content-item">
          <div
            v-for="(approveInfo, key) in purchaseInfo.qschouReqLineDTOList"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getApproveDetailInfoColums,
                approveInfo,
                $T('mallf.common.view.myRequestInfo').$D(
                  '相关信息'
                )
              )
            ">
            <div class="card-head open-tag">
              {{ approveInfo.materialName }}
            </div>
            <Customize :columns="getApproveInfoColums" :data-source="approveInfo" />
          </div>
        </div>
      </SrmTabPane>
    </SrmTab>
    <!-- 非商城采购申请审批详情页pop -->
    <SrmDetailPop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :columns="getPopInfoColumns"/>
  </div>
</template>

<script>
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import {
  getEasyPreparePurchasingDetailApi
} from "./api/EasyPreparePurchasingApproval";
export default {
  modules: [ "ssrc.common","sodr.common","hwfp.commom","sslm.sampleHead","hwfm.commom","sprm.common","sslm.supplierInfoChange","spcm.common","scux.commercialTermsPre","scux.upgradeOrderCreate","smpc.product","scux.soSend","ssrc.projectSetup","sinv.common","sqam.common","scux.watsons","scux.listOfReviewItems","smbl.common","mallf.common" ],
  name: "EasyPreparePurchasingApproval",
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
      headTitle: "", //表头标题
      reqHeaderId: "",
      srmDetailPop: false, //明细页pop
      getPopInfoColumns: [],
      detailInfo: {},
      purchaseInfo:{}
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: "标题",
          fieldCode: "title",
          langCode: "ssrc.common.title",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: "标题填写说明",
          fieldCode: "titleDescription",
          langCode: "ssrc.common.title.describe",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: "申请类型",
          fieldCode: "reqTypeMeaning",
          langCode: "sodr.common.model.common.attributeBigint3",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: "申请人",
          fieldCode: "reqByName",
          langCode: "hwfp.commom.model.apply.owner",
          formRow: 3,
          formCol: 2,
        },
        {
          fieldName: "申请人电话",
          fieldCode: "phone",
          langCode: "sslm.sampleHead.model.reqUserPhone",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: "部门",
          fieldCode: "departmentName",
          langCode: "hwfm.commom.modal.unit",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyMeaning",
          langCode: "sprm.common.model.common.currency",
          formRow: 5,
          formCol: 2,
        },
        {
          fieldName: "预算申请总额",
          fieldCode: "reqAmount",
          langCode: "hwfm.commom.model.view.budget.price",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: "实际采购总额",
          fieldCode: "purchaseAmount",
          langCode: "hwfm.commom.model.view.leadershipReport.title",
          formRow: 6,
          formCol: 2,
        },
        {
          fieldName: "申请状态",
          fieldCode: "statusMeaning",
          langCode: "sslm.supplierInfoChange.view.supplier.applicationStatus",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: "附件信息",
          fieldCode: "attachmentInformationHeader",
          langCode: "spcm.common.view.message.title.purchaseAttachmentList",
          formRow: 7,
          formCol: 2,
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.upgradeOrderCreate.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
        },
        {
          fieldName: "申请说明",
          fieldCode: "comments",
          langCode: "sprm.common.model.common.applyExplain",
          formRow: 8,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: "标题",
          fieldCode: "title",
          langCode: "ssrc.common.title",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: "标题填写说明",
          fieldCode: "titleDescription",
          langCode: "ssrc.common.title.describe",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: "申请类型",
          fieldCode: "reqTypeMeaning",
          langCode: "sodr.common.model.common.attributeBigint3",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: "申请人",
          fieldCode: "reqByName",
          langCode: "hwfp.commom.model.apply.owner",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: "申请人电话",
          fieldCode: "phone",
          langCode: "sslm.sampleHead.model.reqUserPhone",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: "部门",
          fieldCode: "departmentName",
          langCode: "hwfm.commom.modal.unit",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyMeaning",
          langCode: "sprm.common.model.common.currency",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: "预算申请总额",
          fieldCode: "reqAmount",
          langCode: "hwfm.commom.model.view.budget.price",
          formRow: 8,
          formCol: 1,
        },
        {
          fieldName: "实际采购总额",
          fieldCode: "purchaseAmount",
          langCode: "hwfm.commom.model.view.leadershipReport.title",
          formRow: 9,
          formCol: 1,
        },
        {
          fieldName: "申请状态",
          fieldCode: "statusMeaning",
          langCode: "sslm.supplierInfoChange.view.supplier.applicationStatus",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: "附件信息",
          fieldCode: "attachmentInformationHeader",
          langCode: "spcm.common.view.message.title.purchaseAttachmentList",
          formRow: 11,
          formCol: 1,
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.upgradeOrderCreate.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
        },
      ];

      return columns;
    },
    // 申请信息
    getApproveInfoColums() {
      const columns = [
        {
          fieldName: "尺寸",
          fieldCode: "size",
          langCode: "sprm.common.model.common.size",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: "物资类型",
          fieldCode: "materialType",
          langCode:
            "smpc.product.model.materialType",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "scux.soSend.model.soSend.lineNumber",
          formRow: 2,
          formCol: 2,
        },
        {
          fieldName: "申请数量",
          fieldCode: "reqQuantity",
          langCode: "sprm.common.model.common.purchaseQuantity",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: "实际采购数量",
          fieldCode: "actualPurchaseQuantity",
          langCode: "sprm.common.model.common.actual.purchaseQuantity",
          formRow: 3,
          formCol: 2,
        },
        {
          fieldName: "预估单价（含税）",
          fieldCode: "estimatedUnitPrice",
          langCode: "sprm.common.model.common.taxIncludedUnitPrice",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: "实际单价（含税）",
          fieldCode: "actualUnitPrice",
          langCode: "sprm.common.model.common.actualIncludedUnitPrice",
          formRow: 4,
          formCol: 2,
        },
        {
          fieldName: "预估行金额",
          fieldCode: "estimatedLinePrice",
          langCode: "ssrc.projectSetup.model.projectSetup.estimatedAmount",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: "实际行金额",
          fieldCode: "actualLinePrice",
          langCode: "ssrc.projectSetup.model.projectSetup.actualAmount",
          formRow: 5,
          formCol: 2,
        },
        {
          fieldName: "物资用途",
          fieldCode: "materialUse",
          langCode: "sprm.common.model.common.materialUse",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: "需求日期",
          fieldCode: "demandDate",
          langCode: "sinv.common.model.common.needByDate",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: "责任人",
          fieldCode: "responsible",
          langCode: "sqam.common.model.8d.chargeName",
          formRow: 7,
          formCol: 2,
        },
        {
          fieldName: "收货人",
          fieldCode: "receiver",
          langCode: "scux.watsons.docAuthExport.model.docAuth.receiverName",
          formRow: 8,
          formCol: 1,
        },
        {
          fieldName: "附件查看",
          fieldCode: "attachmentInformationLine",
          langCode: "scux.listOfReviewItems.view.button.uploadview",
          formRow: 8,
          formCol: 2,
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.upgradeOrderCreate.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
        {
          fieldName: "收货电话",
          fieldCode: "receiverPhone",
          langCode: "sprm.common.model.common.receivePhone",
          formRow: 9,
          formCol: 1,
        },
        {
          fieldName: "收货地址",
          fieldCode: "address",
          langCode: "sprm.common.model.common.receiveAddress",
          formRow: 10,
          formCol: 1,
        },
      ];

      return columns;
    },
    //申请信息详情
    getApproveDetailInfoColums() {
      const columns = [
        {
          fieldName: "尺寸",
          fieldCode: "size",
          langCode: "sprm.common.model.common.size",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: "物资类型",
          fieldCode: "materialTypeMeaning",
          langCode:
            "smpc.product.model.materialType",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "scux.soSend.model.soSend.lineNumber",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: "申请数量",
          fieldCode: "reqQuantity",
          langCode: "sprm.common.model.common.purchaseQuantity",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: "实际采购数量",
          fieldCode: "actualPurchaseQuantity",
          langCode: "sprm.common.model.common.actual.purchaseQuantity",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: "预估单价（含税）",
          fieldCode: "estimatedUnitPrice",
          langCode: "sprm.common.model.common.taxIncludedUnitPrice",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: "实际单价（含税）",
          fieldCode: "actualUnitPrice",
          langCode: "sprm.common.model.common.actualIncludedUnitPrice",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: "预估行金额",
          fieldCode: "estimatedLinePrice",
          langCode: "ssrc.projectSetup.model.projectSetup.estimatedAmount",
          formRow: 8,
          formCol: 1,
        },
        {
          fieldName: "实际行金额",
          fieldCode: "actualLinePrice",
          langCode: "ssrc.projectSetup.model.projectSetup.actualAmount",
          formRow: 9,
          formCol: 1,
        },
        {
          fieldName: "物资用途",
          fieldCode: "materialUse",
          langCode: "sprm.common.model.common.materialUse",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: "需求日期",
          fieldCode: "demandDate",
          langCode: "sinv.common.model.common.needByDate",
          formRow: 11,
          formCol: 1,
        },
        {
          fieldName: "责任人",
          fieldCode: "responsible",
          langCode: "sqam.common.model.8d.chargeName",
          formRow: 12,
          formCol: 1,
        },
        {
          fieldName: "收货人",
          fieldCode: "receiver",
          langCode: "scux.watsons.docAuthExport.model.docAuth.receiverName",
          formRow: 13,
          formCol: 1,
        },
        {
          fieldName: "附件查看",
          fieldCode: "attachmentInformationLine",
          langCode: "scux.listOfReviewItems.view.button.uploadview",
          formRow: 14,
          formCol: 1,
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.upgradeOrderCreate.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
        {
          fieldName: "收货电话",
          fieldCode: "receiverPhone",
          langCode: "sprm.common.model.common.receivePhone",
          formRow: 12,
          formCol: 1,
        },
        {
          fieldName: "收货地址",
          fieldCode: "address",
          langCode: "sprm.common.model.common.receiveAddress",
          formRow: 13,
          formCol: 1,
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.reqHeaderId = this.changeReqId;
    this.getEasyPreparePurchasingDetail();
    this.$emit(
      "GetApprovalTitle",
      this.$T("sprm.common.model.common.nonShopPurchasingApprove").$D(
        "非商城采购申请审批"
      )
    );
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, title) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
    },
    // 获取非商城采购申请基本信息
    async getEasyPreparePurchasingDetail() {
      await getEasyPreparePurchasingDetailApi(this.reqHeaderId).then((res) => {
        this.purchaseInfo = res;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}

>>> .srm-button-group .srm-button-group-area {
  padding-bottom: 12px;
  border-bottom: 1px solid #f6f6f6;
}

>>> .srm-upload-title {
  color: #276EF1;
}

.detail-wrap {
  height: calc(100vh - 240px);
  overflow: auto;

  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 0 16px 15px;
    }
  }
}
</style>
