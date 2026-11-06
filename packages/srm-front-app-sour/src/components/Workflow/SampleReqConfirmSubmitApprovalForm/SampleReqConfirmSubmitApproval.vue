<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-scroll-tab class="content">
      <!-- 基本信息 -->
      <srm-scroll-tab-item
        :label="$T('hipspfm.workFlow.view.message.basicInfo').$D('基本信息')">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicInfoDetailColums,
              basicInfo,
              $T('mallf.common.view.basicInfo').$D(
                '基本信息'
              ),
              'SMBL.WORKFLOW.SAMPLE_REQ_CONFIRM_SUBMIT_APPROVAL_BASIC_IF_DETAIL'
            )
          ">
          <div class="card">
            <customize
              :columns="getBasicInfoColums"
              :data-source="basicInfo"
              code="SMBL.WORKFLOW.SAMPLE_REQ_CONFIRM_SUBMIT_APPROVAL_BASIC_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 样品信息 -->
      <srm-scroll-tab-item :label="$T('hipspfm.workFlow.view.message.sampleInfo').$D('样品信息')">
        <div
          class="content-item">
          <div class="card">
            <customize
              :columns="getSampleHeadInfoColums"
              :data-source="basicInfo"
              code="SMBL.WORKFLOW.SAMPLE_REQ_CONFIRM_SUBMIT_APPROVAL_SAMPLE_INFO"
              unit-type="FORM"/>
          </div>
        </div>
        <div class="content-item">
          <div
            v-for="(item, key) in sampleLineInfoList"
            :key="key"
            class="card">
            <customize :columns="getSampleLineInfoColums" :data-source="item" code="SMBL.WORKFLOW.SAMPLE_REQ_CONFIRM_SUBMIT_APPROVAL_SAMPLE_LINEINFO" />
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 送样申请确认提交审批详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :pop-customize-code="customizeCode"
      :columns="getPopInfoColumns"/>
  </div>
</template>

<script>
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import { getBasicInfoApi, getSampleInfoListApi, getSampleAttachmentInfoListApi } from "./api/index.js";
import uuid from "uuid";
export default {
  modules: [ "ssrc.common", "sodr.common", "hwfp.commom", "sslm.sampleHead", "hwfm.commom", "sprm.common", "sslm.supplierInfoChange", "spcm.common", "scux.commercialTermsPre", "scux.upgradeOrderCreate", "smpc.product", "scux.soSend", "ssrc.projectSetup", "sinv.common", "sqam.common", "scux.watsons", "scux.listOfReviewItems", "smbl.common", "mallf.common", "hipspfm.workFlow", "sslm.commonApplication", "hipspfm.common", "scux.bidEvaluationReport", "sslm.supplyAbility", "hipspfm.supplierLifeCycle", "ssrc.supplyInfoChange", "sqam.inquiryHall", "sslm.sample" ],
  name: "SampleReqConfirmSubmitApproval",
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
      basicInfo:{},
      detailInfo:{},
      sampleLineInfoList:[],
      getPopInfoColumns:[],
      srmDetailPop:false,
      headTitle:"",
      customizeCode:""
    };
  },
  computed: {
    // 基本信息
    getBasicInfoColums() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqNum").$D("申请单号"),
          fieldCode: "reqNum",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqUserName").$D("申请人"),
          fieldCode: "reqUserName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.supplierName").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.typeCodeMeaning").$D("送样类型"),
          fieldCode: "typeCodeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.urgencyDegreeMeaning").$D("紧急程度"),
          fieldCode: "urgencyDegreeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.recUserName").$D("接样人"),
          fieldCode: "recUserName",
        },
        {
          fieldName: this.$T("sslm.sample.model.recUserPhone").$D("接样人联系电话"),
          fieldCode: "reqUserPhone",
          render:(val, record) => <span>{record.reqInternationalTelMeaning} | {val}</span>
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sslm.commonApplication.view.message.confirmRemark").$D("确认说明"),
          fieldCode: "confirmRemark",
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqNum").$D("申请单号"),
          fieldCode: "reqNum",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqStatusMeaning").$D("单据状态"),
          fieldCode: "reqStatusMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqUserName").$D("申请人"),
          fieldCode: "reqUserName",
        },
        {
          fieldName: this.$T("sslm.sampleHead.model.reqUserPhone").$D("申请人电话"),
          fieldCode: "reqUserPhone",
          render:(val, record) => <span>{record.reqInternationalTelMeaning} | {val}</span>
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.organizationName").$D("库存组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.supplierName").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.supplierTypeCodeMeaning").$D("供应商类型"),
          fieldCode: "supplierTypeCodeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.originFactoryName").$D("原厂名称"),
          fieldCode: "originFactoryName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.typeCodeMeaning").$D("送样类型"),
          fieldCode: "typeCodeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.urgencyDegreeMeaning").$D("紧急程度"),
          fieldCode: "urgencyDegreeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.recUserName").$D("接样人"),
          fieldCode: "recUserName",
        },
        {
          fieldName: this.$T("sslm.sample.model.recUserPhone").$D("接样人联系电话"),
          fieldCode: "recUserPhone",
          render:(val, record) => <span>{record.reqInternationalTelMeaning} | {val}</span>
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.receiveUnitName").$D("接收部门"),
          fieldCode: "receiveUnitName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.needFeedbackFlagMeaning").$D("需要供应商反馈"),
          fieldCode: "needFeedbackFlagMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.confirmationFlagMeaning").$D("直接确认"),
          fieldCode: "confirmationFlagMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sampleSendAddress").$D("送样类型"),
          fieldCode: "sampleSendAddress",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.confirmRemark").$D("确认说明"),
          fieldCode: "confirmRemark",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.annexUuid").$D("相关附件"),
          fieldCode: "sampleAttachmentUuid",
          render: (val) => <div>
            <SrmUpload
              attachment-uuid={val}
              show-icon={false}
              color="#276EF1"
              title={this.$T("hipspfm.workFlow.model.annexUuid").$D(
                "相关附件"
              )}
              desc-title={this.$T(
                "hipspfm.workFlow.view.button.uploadview"
              ).$D("附件查看")}
            />
          </div>
        },
      ];

      return columns;
    },
    // 样品信息
    getSampleHeadInfoColums() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.workFlow.model.sendUserName").$D("送样人"),
          fieldCode: "sendUserName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sendUserPhone").$D("送样人联系电话"),
          fieldCode: "sendUserPhone",
          render:(val, record) => <span>{record.sendInternationalTelMeaning} | {val}</span>
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.expectedDeliveryDate").$D("预计送达时间"),
          fieldCode: "expectedDeliveryDate",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sendTypeCodeMeaning").$D("送样方式"),
          fieldCode: "sendTypeCodeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.trackingNumber").$D("快递单号"),
          fieldCode: "trackingNumber",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.supplierRemark").$D("供应商备注"),
          fieldCode: "supplierRemark",
        },
      ];

      return columns;
    },
    getSampleLineInfoColums() {
      const columns = [
        {
          fieldCode: "itemName",
          // langCode: "hipspfm.workFlow.model.itemName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            <span>{item.lineNum}-{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.itemDesc").$D("物料说明"),
          fieldCode: "itemDesc",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.categoryCodes").$D("品类代码"),
          fieldCode: "categoryCodes",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.categoryNames").$D("品类名称"),
          fieldCode: "categoryNames",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.uomCodeAndName").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.reqQuantity").$D("送样需求数量"),
          fieldCode: "reqQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sendReqTime").$D("送样需求时间"),
          fieldCode: "reqTime",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.expectedDeliveryDate").$D("预计送达时间"),
          fieldCode: "expectedDeliveryDate",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sendTypeCodeMeaning").$D("送样方式"),
          fieldCode: "sendTypeCodeMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.trackingNumber").$D("快递单号"),
          fieldCode: "trackingNumber",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.tryUseDepartment").$D("试用部门"),
          fieldCode: "tryUseDepartment",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.tryUseWorkshop").$D("试用车间"),
          fieldCode: "tryUseWorkshop",
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.sampleResultMeaning").$D("试用结果"),
          fieldCode: "sampleResultMeaning",
          render:(val, record) => {
            if (record.sampleResult === "QUALIFIED") {
              return <span style="color:#05944F;">{val}</span>;
            } else if (record.sampleResult === "UNQUALIFIED") {
              return <span style="color:#E11900;">{val}</span>;
            }
            return <span style="color:#FFC043;">{val}</span>;
          }
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.tryUseAttachment").$D("附件"),
          fieldCode: "attachment",
          render: (val) =>
            <div>
              <SrmUpload
                fileArr={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("hipspfm.workFlow.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "hipspfm.workFlow.view.button.uploadview"
                ).$D("附件查看")}
              />
            </div>,
          callBack: () => {},
        },
        {
          fieldName: this.$T("hipspfm.workFlow.model.tryUseRemark").$D("试用说明"),
          fieldCode: "remark",
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.getBasicInfo();
    this.getSampleInfoList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.model.confirm.approval").$D(
        "送样申请确认审批"
      )
    );
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, title, code) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
      this.customizeCode = code;
    },
    // 获取基本信息
    async getBasicInfo() {
      await getBasicInfoApi(this.changeReqId).then((res) => {
        this.basicInfo = res;
        console.log("basicInfo:", this.basicInfo);
      });
    },
    // 获取样品信息
    async getSampleInfoList() {
      await getSampleInfoListApi(this.changeReqId).then(async (res) => {
        // eslint-disable-next-line no-unused-vars
        for (let item of res.content) {
          // eslint-disable-next-line no-shadow
          await getSampleAttachmentInfoListApi(item.sampleId).then((res) => {
            item.productAuthUuid = res.content[0] && res.content[0].attachmentUuid;
            item.prodectSpecificationUUid = res.content[1] && res.content[1].attachmentUuid;
          });
          item.attachment = [
            {
              title: this.$T("hipspfm.workFlow.view.btn.trialResultsUuid").$D("试用结果附件"),
              attachmentUuid: item.trialResultsUuid || uuid(),
              readOnly: true
            },
            {
              title: this.$T("hipspfm.workFlow.view.message.purchaseUuid").$D("采购方附件"),
              attachmentUuid: item.buyerAttachmentUuid || uuid(),
              readOnly: true
            },
            {
              title: this.$T("hipspfm.workFlow.view.message.productAuth").$D("产品认证书"),
              attachmentUuid: item.productAuthUuid || uuid(),
              readOnly: true
            },
            {
              title: this.$T("hipspfm.workFlow.view.message.prodectSpecification").$D("产品规格书"),
              attachmentUuid: item.prodectSpecificationUUid || uuid(),
              readOnly: true
            },
          ];
        }
        this.sampleLineInfoList = res.content;
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
>>> .noWrap{
  position:static !important;
}
.detail-wrap {
  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 15px 16px 15px;
    }
  }
}
</style>
