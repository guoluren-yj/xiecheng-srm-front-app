<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-tab class="content">
      <!-- 基本信息 -->
      <srm-tab-pane
        :label="
          $T('scux.commercialTermsPre.model.archive.baseInfo').$D('基本信息')
        ">
        <div class="content-item">
          <div
            class="commerical-info">
            <div class="content">
              <!-- 个性化组件替换后的代码 -->
              <customize-detail
                :columns="getBasicInfoColumns"
                :data-source="commericalTermsInfo"/>
            </div>
          </div>
        </div>
      </srm-tab-pane>

      <!-- 主要商务条款信息 -->
      <srm-tab-pane
        :label="
          $T('scux.commercialTermsPre.model.archive.mainContent').$D(
            '主要商务条款信息'
          )
        ">
        <srm-button-group>
          <srm-button fill>
            <srm-upload
              :attachment-uuid="attachmentUuid"
              :show-count="false"
              :show-icon="false"
              :desc-title="
                $T('scux.commercialTermsPre.model.annexUuid').$D('相关附件')
              "/>
          </srm-button>
        </srm-button-group>
        <div class="content-item">
          <div
            class="commerical-info">
            <div class="content">
              <!-- 个性化组件替换后的代码 -->
              <customize-detail
                :columns="getCommericalTermsInfoColumns"
                :data-source="commericalTermsInfo"/>
            </div>
          </div>
        </div>
      </srm-tab-pane>
    </srm-tab>
  </div>
</template>

<script>
import { getCommericalTermsInfoApi, saveCommericalTermsInfoApi } from "./api/JialanCommercialTermsPre";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";
export default {
  modules: [ "scux.commercialTermsPre" ],
  name: "JialanCommercialTermsPreApproval",
  components: {
    SrmButtonGroup,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    }
  },
  data() {
    return {
      preTrialId: "",
      editFlags:"",
      commericalTermsInfo: {},
      attachmentUuid: "", //当前传入的文件uuid
      paymentMethodCode: null,
      whetherBudget: null
    };
  },
  computed: {
    //基本信息
    getBasicInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("scux.commercialTermsPre.model.preTrialNum").$D("预审单编号"),
          fieldCode: "preTrialNum",
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.unitName").$D("主办人部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.realName").$D("主办人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.phone").$D("主办人电话"),
          fieldCode: "phone",
          required: 1,
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.displayPrNum").$D("关联申请号"),
          fieldCode: "displayPrNum",
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.pcCode").$D("关联合同号"),
          fieldCode: "pcCode",
          render: (val) => {
            const pcCodeList = val.split(",");
            return (
              <div>
                {pcCodeList
                  .filter((i) => Boolean(i))
                  .map((v) =>
                    <SrmTag size="mid" fill type="info">
                      {v}
                    </SrmTag>
                  )}
              </div>
            );
          },
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.applyInfo").$D("关联OA申请号"),
          fieldCode: "applyInfo",
          render: (val) => {
            const applyInfoList = val.split(",");
            let isApplyInfo;
            applyInfoList.forEach((item) => {
              if (item) {
                isApplyInfo = true;
              }
            });
            if (isApplyInfo) {
              return applyInfoList.map((item) =>
                <SrmTag size="mid" fill type="info" closable>
                  {item}
                </SrmTag>
              );
            }
          },
        },
      ];

      return columns;
    },
    //主要商务条款信息
    getCommericalTermsInfoColumns() {
      const that=this;
      const columns = [
        {
          fieldName: this.$T("scux.commercialTermsPre.model.companyName").$D("甲方全称"),
          fieldCode: "companyName",
          required: 1,
          formRow:10
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.partyBName").$D("乙方全称"),
          fieldCode: "partyBName",
          required: 1,
          formRow:20
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.cooperativeContents").$D("合作内容"),
          fieldCode: "cooperativeContents",
          required: 1,
          formRow:30,
          render:(val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.quantity").$D("数量"),
          fieldCode: "quantity",
          required: 1,
          formRow:40
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.qualityStandard").$D("质量标准"),
          fieldCode: "qualityStandard",
          required: 1,
          formRow: 50,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.paymentMethodCode").$D("支出费用类型"),
          fieldCode: "paymentMethodCode",
          formRow: 60,
          fieldType: "SELECT",
          lovCode: "SCUX.JALA.EXPENDITURE_TYPE",
          required: this.editFlags === 1 || this.editFlags === "1",
          // eslint-disable-next-line no-return-assign
          editor: () => this.editFlags === 1 || this.editFlags === "1",
          displayField: "paymentMethodCodeMeaning",
          options: {
            valueField: "paymentMethodCodeMeaning",
            callback: function ([ { value } ]) {
              console.log(that, value);
              // this.commericalTermsInfo["paymentMethodCode"] = value;
              that.paymentMethodCode = value;
            },
          },
          render: (val, record) =>
            <div>
              <span>{record.paymentMethodCodeMeaning}</span>
              <p class="message">支出费用类型：前台事业部请根据实际情况选择（可参考《伽蓝集团会计科目表》）；中后台部门请选择“其他”。</p>
            </div>
          ,
        },
        {
          fieldCode: "whetherBudget",
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          fieldName: this.$T("scux.commercialTermsPre.model.whetherBudget").$D("是否年度预算内"),
          required: this.editFlags === 1 || this.editFlags === "1",
          // eslint-disable-next-line no-return-assign
          editor: () => this.editFlags === 1 || this.editFlags === "1",
          displayField: "whetherBudgetMeaning",
          options: {
            valueField: "whetherBudgetMeaning",
            callback: function ([ { value } ]) {
              that.whetherBudget = value;
            },
          },
          render: (val, record) => record.whetherBudgetMeaning
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.unitPrice").$D("单价"),
          fieldCode: "unitPrice",
          formRow: 70
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.bigUnitPrice").$D("单价(大写)"),
          fieldCode: "bigUnitPrice",
          formRow: 80
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.amount").$D("金额"),
          fieldCode: "amount",
          required: 1,
          formRow: 90
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.bigAmount").$D("金额(大写)"),
          fieldCode: "bigAmount",
          formRow: 100
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.amountDescription").$D("单价及金额说明"),
          fieldCode: "amountDescription",
          formRow: 110,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.paymentMethod").$D("交付方式"),
          fieldCode: "paymentMethod",
          required: 1,
          formRow: 120,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.assessmentMethod").$D("验收考核方式"),
          fieldCode: "assessmentMethod",
          formRow: 130,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.outSiteReviewComments").$D("付款方式及时间"),
          fieldCode: "outSiteReviewComments",
          formRow: 140,
          required: 1,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.violationResponsibility").$D("违约责任"),
          fieldCode: "violationResponsibility",
          formRow: 150,
          render: (val) => <div class="text-field">{val}</div>
        },
        {
          fieldName: this.$T("scux.commercialTermsPre.model.other").$D("其他"),
          fieldCode: "other",
          formRow: 160,
          render: (val) => <div class="text-field">{val}</div>
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.preTrialId = this.changeReqId;
    this.editFlags = this.$attrs.parameters.editFlag;
    // console.log(this,'23322');
    this.getCommericalTermsInfoList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.commercialTermsPre.model.archive.mainContent").$D(
        "主要商务条款信息"
      )
    );
  },
  methods: {
    //获取商务条款信息数据
    getCommericalTermsInfoList() {
      getCommericalTermsInfoApi(this.preTrialId).then((res) => {
        this.commericalTermsInfo = res;
        this.attachmentUuid = res.annexUuid;
      });
    },
    beforeApprove() {
      console.log(this, "ceshi");
      return new Promise((resolve, reject) => {
        // const validateFlag = this.trialResultsDs.validate();
        console.log(this.editFlags, this.whetherBudget, this.paymentMethodCode, 323223);
        if (this.editFlags !== "1") {
          resolve(true);
        } else if (!this.whetherBudget && this.editFlags === "1" && !this.paymentMethodCode) {
          reject(false);
        } else {
          saveCommericalTermsInfoApi({
            ...this.commericalTermsInfo,
            paymentMethodCode: this.paymentMethodCode,
            whetherBudget: this.whetherBudget
          }).then((response) => {
            if (response.preTrialId) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        }
      });
    }
  },
};
</script>

<style scoped lang="stylus">
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .srm-tag-mid {
  margin-right: 12px;
}

>>> .srm-tag-fill-info {
  background: #f6f6f6;
  color: #333;
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
>>> .srm-upload-title{
  color:#fff;
}
>>> .text-field{
  line-height :20px;
  background: #f6f6f6;
  border-radius: 4px;
  box-sizing :border-box;
  padding:8px;
}
.detail-wrap {
  height: calc(100vh - 250px);
  overflow: auto;

  .commerical-info {
    width: 100%;
    overflow-y: auto;
    background: #F0F2F5;

    .content {
      padding-left: 15px;
    }
  }

  .message {
    width: 345px;
    height: 24px;
    font-size: 10px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    text-align: left;
    color: #e11900;
    line-height: 12px;
    background: #ffefed;
  }
}
</style>
