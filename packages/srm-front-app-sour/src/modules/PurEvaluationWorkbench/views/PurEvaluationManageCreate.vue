<!-- 供应商评估工作台-手工创建详情页 -->
<template>
  <div class="srm-detail-maintain">
    <!-- 内容区域 -->
    <div class="srm-detail-wrap-context">
      <srm-scroll-tab customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.TABS">
        <srm-scroll-tab-item code="basic" :label="$T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息')" >
          <srm-form
            :customize-code="getCustomizeCode('basic')"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getBasicColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="company" :label="$T('sslm.purchaserEvaluationDetail.view.content.companyInfo').$D('公司信息')" >
          <srm-form
            :customize-code="getCustomizeCode('company')"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getCompanyColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="supplier" :label="$T('sslm.purchaserEvaluationDetail.view.content.supplierInfo').$D('供应商信息')" >
          <srm-form
            :customize-code="getCustomizeCode('supplier')"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getSupplierColumns"/>
          <!-- 解决包含头的列表 -->
          <div class="srm-have-top-header" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="bottomBtn.length > 0" :btn-arr="bottomBtn"/>
    <!-- 基础信息详情弹框 -->
    <srm-popup :visible.sync="basePopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getBasicDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.BASIC_DETAIL"/>
    </srm-popup>
    <!-- 公司信息详情弹框 -->
    <srm-popup :visible.sync="companyPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getCompanyDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.COMPANY_DETAIL"/>
    </srm-popup>
    <!-- 供应商信息详情弹框 -->
    <srm-popup :visible.sync="supplierPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getSupplierDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.SUPPLIER_DETAIL"/>
    </srm-popup>
  </div>
</template>

<script>
import manageDetailMix from "../mixins/manageDetailMix";
import { DataSet } from "srm-mobile-ui";
import { creatBasicDS } from "../datasource/detailDs";
import {
  saveAllApi,
} from "../api";
import moment from "moment";
import { head, forEach } from "lodash";

export default {
  modules: [ "hzero.common", "smbl.common", "hipspfm.supplier", "sslm.purchaserEvaluationDetail", "sslm.common", "sslm.purchaserEvaluation", "smbl.small", "hipspfm.common", "sslm.evaluationStrategyDetail", "sslm.supplierDocManage", "sslm.commonApplication", "sslm.siteInvestigateReport" ],
  name: "PurEvaluationManageCreate",
  mixins: [ manageDetailMix ],
  data() {
    return {
      isCreate: true,
      readOnly: false,
      isEditList: {
        basic: true,
        itemCategory: true,
        assessmentPanel: true,
        assessment: true,
        attachment: true,
      },
      basicDs: new DataSet(creatBasicDS()),
      basicDetail: {},
      basePopupFlag: false,
      companyDetail: {},
      companyPopupFlag: false,
      supplierDetail: {},
      supplierPopupFlag: false,
    };
  },
  computed: {
    // 底部按钮
    bottomBtn() {
      return [
        {
          type: "primary",
          fill: true,
          title: this.$T("hzero.common.button.save").$D("保存"),
          handler: () => this.handleSave()
        },
      ];
    },
  },
  async mounted() {
    this.handleCreate();
  },
  methods: {
    getCustomizeCode(tabCode) {
      const customizeCodeList = {
        basic: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.BASIC",
        company: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.COMPANY",
        supplier: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.SUPPLIER",
      };
      return customizeCodeList[tabCode];
    },
    handleCreate() {
      this.basicDs.create({
        groupFlag: 1,
        groupFlagMeaning: this.$T("smbl.common.view.yes").$D("是"),
        evalDateFrom: String(this.getNowDate()),
        evalDateTo: String(this.getAfterDate(7)),
      }, 0);
    },
    // 获取当前日期
    getNowDate() {
      const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      return date;
    },
    getAfterDate(N) {
      const date = new Date();
      const DateN = moment(new Date(date.getTime() + N * 24 * 60 * 60 * 1000)).format("YYYY-MM-DD HH:mm:ss");
      return DateN;
    },
    // 保存回调
    async handleSave() {
      const payload = await this.getSaveParams();

      if (payload) {
        saveAllApi(payload).then((res) => {
          if (res && !res.failed && res.evalHeaderId) {
            this.$router.push({
              name: "PurEvaluationManageDetail",
              query: {
                evalHeaderId: res.evalHeaderId,
              },
            });
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
          }
        });
      }
    },
    // 获取需保存的参数
    getSaveParams() {
      if (!this.basicDs.validate()) {
        const errorList = head(this.basicDs.getValidateErrors())[1];
        const message = [];
        forEach(errorList, (err) => {
          message.push(err.fieldName);
        });
        this.$notification.open({
          message: this.$T("sslm.common.view.message.pleaseEnter").$D("请输入") + message.join("、"),
        });
        return false;
      }
      const saveHeaderData = this.basicDs?.current?.toData() || {};
      const customizeUnitCode = [
        "SSLM.PURCHASER_ASSESS_DETAIL.EX_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.IN_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION",
        "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION",
        "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_TEAM",
        "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_RESULT",
        "SSLM.PURCHASER_ASSESS_DETAIL.BASICINFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.COMPANY_INFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.SUPPLIER_INFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATE_MATERIALS_TABLE",
        "SSLM.PURCHASER_ASSESS_DETAIL.BTN_GROUP",
      ].join(",");
      // eslint-disable-next-line no-unused-vars
      const { _defaultValueInitialize, _status, ...otherHeaderData } = saveHeaderData;
      return {
        ...otherHeaderData,
        customizeUnitCode,
      };

    },
  }
};
</script>

<style lang="stylus" scoped>
.srm-detail-maintain {
  width: 100vw;
  height: 100vh;
  .srm-detail-wrap-header {}
  .srm-detail-wrap-context {
    .srm-detail-tab-item-buttons {
      position: absolute;
      height: 54px;
      top: 0px;
      right: 15px;
      z-index: 1;
      .button {
        font-size: 20px;
        color: var(--font-color-disable);
        margin-left: 12px;
        >>> .srm-button-primary {
          color: var(--font-color-disable);
        }
      }
    }
  }
}

.srm-attachment-flex {
  height: 60px;
  padding: 0 15px;
  .srm-attachment-title {
    margin-left: 16px;
  }
}
.srm-attachment-division {
  height: 1px;
  width: 100%;
  border: 1px solid #F6F6F6;
}
.srm-assessment-panel {
  .srm-assessment-panel-header {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 52px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    .srm-assessment-header-left {
      flex:1
    }
    .srm-assessment-header-right {
      flex:1
    }
  }
  .srm-assessment-panel-division {
    background: #F6F6F6;
    height: 8px;
  }
}

.srm-have-top-header {
  height: 150px;
}

>>> .srm-form {
  min-height: 100px;
}

</style>
