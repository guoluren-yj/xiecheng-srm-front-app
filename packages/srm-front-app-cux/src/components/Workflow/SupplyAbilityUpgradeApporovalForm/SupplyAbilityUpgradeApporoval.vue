<!-- 伽蓝纯二开的供货能力升级功能- -->
<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-tab class="content">
      <!-- 基本信息 -->
      <srm-tab-pane
        :label="
          $T('scux.upgradeOrderCreate.model.archive.baseInfo').$D('基本信息')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicDetailColums,
              basicInfo,
              $T('scux.upgradeOrderCreate.model.archive.baseInfo').$D(
                '基本信息'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T("scux.fr.pr.export.prNum").$D(
                  "申请编号"
                )
              }}
              : {{ basicInfo.reqNumber }}
            </div>
            <customize
              :columns="getBasicColums"
              :data-source="basicInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 相关信息 -->
      <srm-tab-pane
        :label="
          $T('scux.supplyAbilityUpgradeApporoval.model.aboutInfo').$D(
            '相关信息'
          )
        ">
        <div class="content-item">
          <div
            v-for="(aboutInfo, key) in aboutInfoList"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getAboutDetailInfoColums,
                aboutInfo,
                $T('scux.supplyAbilityUpgradeApporoval.model.aboutInfo').$D(
                  '相关信息'
                )
              )
            ">
            <div class="card-head open-tag">
              {{ $T('sslm.upgradeQuery.model.upgradeQuery.categoryCode').$D(
                '相关信息'
              ) }}:
              {{ aboutInfo.itemCategoryCode }}
            </div>
            <customize
              :columns="getAboutInfoColums"
              :data-source="aboutInfo"/>
          </div>
        </div>
      </srm-tab-pane>
    </srm-tab>
    <!-- 供货能力升级申请审批详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :columns="getPopInfoColumns"/>
  </div>
</template>

<script>
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import {
  getBasicInfoApi,
  getAboutInfoListApi,
  getAboutAttachmentListApi
} from "./api/SupplyAbiltyUpgrade";
export default {
  modules: [ "scux.commercialTermsPre", "scux.upgradeOrderCreate", "sslm.upgradeQuery", "scux.fr", "scux.supplyAbilityUpgradeApporoval", "scux.capacityAllocation", "scux.packageReport", "scux.packingList", "scux.projectCreate", "scux.platformLock", "scux.projectProgress", "scux.listOfReviewItems" ],
  name: "SupplyAbilityUpgradeApporoval",
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
      fileArr:[],
      headTitle: "", //表头标题
      approvalId: "",
      basicInfo: {}, //供货能力升级申请基本信息
      aboutInfoList: [], //供货能力升级申请相关信息列表
      srmDetailPop: false, //明细页pop
      getPopInfoColumns: [],
      detailInfo: {},
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("scux.capacityAllocation.model.title.yunfuCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.capacityAllocation.model.title.yunfuCompanyCode").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.packageReport.model.prTypeName").$D("申请类型"),
          fieldCode: "reqTypeMeaning",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.upgradeOrderCreate.model.createdByName").$D("创建人"),
          fieldCode: "createUser",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.packingList.model.title.statusCode").$D("状态"),
          fieldCode: "reqStatusMeaning",
          formRow: 4,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.projectCreate.model.unitName").$D("创建部门"),
          fieldCode: "unitName",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.platformLock.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.projectProgress.model.remarks").$D("备注"),
          fieldCode: "remark",
          formRow: 7,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.fr.pr.export.prNum").$D("申请编号"),
          fieldCode: "reqNumber",
          formRow: 10,
        },
        {
          fieldName: this.$T("scux.packingList.model.title.statusCode").$D("状态"),
          fieldCode: "reqStatusMeaning",
          formRow: 20,
        },
        {
          fieldName: this.$T("scux.packageReport.model.prTypeName").$D("申请类型"),
          fieldCode: "reqTypeMeaning",
          formRow: 30,
        },
        {
          fieldName: this.$T("scux.capacityAllocation.model.title.yunfuCompanyCode").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          formRow: 40,
        },
        {
          fieldName: this.$T("scux.capacityAllocation.model.title.yunfuCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          formRow: 50,
        },
        {
          fieldName: this.$T("scux.upgradeOrderCreate.model.createdByName").$D("创建人"),
          fieldCode: "createUser",
          formRow: 60,
        },
        {
          fieldName: this.$T("scux.projectCreate.model.unitName").$D("创建部门"),
          fieldCode: "unitName",
          formRow: 70,
        },
        {
          fieldName: this.$T("scux.platformLock.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          formRow: 80,
        },
        {
          fieldName: this.$T("scux.projectProgress.model.remarks").$D("备注"),
          fieldCode: "remark",
          formRow: 90,
        },
      ];

      return columns;
    },
    // 相关信息
    getAboutInfoColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.currentCategoryStatus").$D("当前品类状态"),
          fieldCode: "reqLineTypeMeaning",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.cooperationIntention").$D("合作意愿"),
          fieldCode: "cooperateWillMeaning",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.collecteChannel").$D("收集渠道"),
          fieldCode: "collectChannel",
          formRow: 3,
          formCol: 2,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.potentialScore").$D("潜在评分"),
          fieldCode: "potentialScore",
          formRow:4,
          formCol:1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.echelon").$D("梯队"),
          fieldCode: "echelonMeaning",
          formRow: 4,
          formCol: 2,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.requestDetail").$D("信息征询函详情（调查表）"),
          fieldCode: "investgNumber",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.reviewDetail").$D("评审表（现场考察）详情"),
          fieldCode: "evalNum",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.listOfReviewItems.view.button.uploadview").$D("附件查看"),
          fieldCode: "fileArr",
          formRow: 8,
          formCol: 1,
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={this.fileArr}
                show-count={false}
                show-icon={false}
                title={
                  this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )
                }
                desc-title={
                  this.$T("scux.upgradeOrderCreate.view.button.viewUpload").$D("查看附件")
                }
                onShowFilePopup={() => this.showAttachment(val)}/>
            </div>,
          callBack: () => {
          },
        },
      ];

      return columns;
    },
    //相关信息详情
    getAboutDetailInfoColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.categoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          formRow: 10,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 20,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.currentCategoryStatus").$D("当前品类状态"),
          fieldCode: "reqLineTypeMeaning",
          formRow: 30,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.cooperationIntention").$D("合作意愿"),
          fieldCode: "cooperateWillMeaning",
          formRow: 40,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.collecteChannel").$D("收集渠道"),
          fieldCode: "collectChannel",
          formRow: 50,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.requestDetail").$D("信息征询函详情（调查表）"),
          fieldCode: "investgNumber",
          formRow: 60,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.potentialScore").$D("潜在评分"),
          fieldCode: "potentialScore",
          formRow:70,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.echelon").$D("梯队"),
          fieldCode: "echelonMeaning",
          formRow: 80,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.reviewDetail").$D("评审表（现场考察）详情"),
          fieldCode: "evalNum",
          formRow: 90,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.reviewResult").$D("评审结果"),
          fieldCode: "reviewResult",
          formRow: 100,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.noSiteReviewDetail").$D("免现场评审详情"),
          fieldCode: "outSiteReviewNum",
          formRow: 110,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.noSiteReviewAttribute").$D("免现场评审属性"),
          fieldCode: "outSiteReviewRemark",
          formRow: 120,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.processNum").$D("尝试性合作报告详情"),
          fieldCode: "processNum",
          formRow: 130,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.cooperateFlag").$D("是否继续合作"),
          fieldCode: "cooperateMeaning",
          formRow: 140,
        },
        {
          fieldName: this.$T("sslm.upgradeQuery.model.upgradeQuery.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 150,
        },
        {
          fieldName: this.$T("scux.listOfReviewItems.view.button.uploadview").$D("附件查看"),
          fieldCode: "fileArr",
          formRow: 160,
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={this.fileArr}
                show-count={false}
                show-icon={false}
                title={
                  this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )
                }
                desc-title={
                  this.$T("scux.upgradeOrderCreate.view.button.viewUpload").$D("查看附件")
                }
                onShowFilePopup={() => this.showAttachment(val)}/>
            </div>,
          callBack: () => {
          },
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.approvalId = this.changeReqId;
    this.getBasicInfo();
    this.getAboutInfoList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("sslm.upgradeQuery.view.title.supplyCapacityUpgradeApply").$D(
        "供货能力升级申请"
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
    // 获取供货能力升级申请基本信息
    async getBasicInfo() {
      await getBasicInfoApi(this.approvalId).then((res) => {
        this.basicInfo = res;
      });
    },
    //获取供货能力升级申请相关信息列表
    async getAboutInfoList() {
      await getAboutInfoListApi(this.approvalId).then(async (res) => {
        // eslint-disable-next-line no-unused-vars
        for (let item of res.content) {
          await getAboutAttachmentListApi(item.reqLineId).then((result) => {
            item.fileArr = result.content;
          });
        }
        this.aboutInfoList = res.content;
      });
    },
    //展示附件列表
    showAttachment(val) {
      this.fileArr = val.map((item) => ({ ...item, fileUrl: item.attachmentUrl, bucketName: "private-bucket" }));
    }
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
>>> .srm-upload-title{
  color:#276EF1;
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
