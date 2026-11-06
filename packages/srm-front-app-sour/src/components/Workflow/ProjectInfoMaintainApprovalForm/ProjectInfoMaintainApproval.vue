<template>
  <div class="project-info-approval">
    <div class="customize-card" @click="showProjectInfoDetial">
      <customize :need-padding="true" :columns="getColumns" :data-source="projectInfo" code="SMBL.WORKFLOW.PROJECT_INFO_MAINTAIN.HEADER"/>
    </div>
    <srm-popup :visible.sync="projectInfoDetailFlag"
               position="right" width="100%"
               height="100%"
               :title="$T('smbl.common.message.tab.detailInfo').$D('明细信息')"
               :show-back="true">
      <customize-detail :need-padding="true" :columns="getInfoDetailColumns" :data-source="projectInfo" code="SMBL.WORKFLOW.PROJECT_INFO_MAINTAIN.HEADER_DETAIL"/>
    </srm-popup>
  </div>
</template>

<script>
import { getBaseInfoApi } from "./api/index";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.tenderPlan", "ssrc.common", "smbl.common" ],
  name: "ProjectInfoMaintainApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      projectInfo: {},
      projectInfoDetailFlag: false,
    };
  },
  computed: {
    // 首页（未展开）个性化字段表
    getColumns() {
      return [ {
        fieldCode: "projectNum",
        fieldType: "EMPTY",
        formRow: 0,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{ val }</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectName").$D("项目名称"),
        fieldCode: "projectName",
        fieldType: "TEXT",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.company").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.ouName").$D("业务实体"),
        fieldCode: "ouName",
        fieldType: "TEXT",
        formRow: 30,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectUserName").$D("项目负责人"),
        fieldCode: "realName",
        fieldType: "TEXT",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.phone").$D("手机号"),
        fieldCode: "phone",
        fieldType: "TEXT",
        formRow: 40,
        formCol: 20,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.email").$D("邮箱"),
        fieldCode: "email",
        fieldType: "TEXT",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectAddress").$D("项目地址"),
        fieldCode: "projectAddress",
        fieldType: "TEXT",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.fundsSource").$D("资金来源"),
        fieldCode: "fundsSourceMeaning",
        fieldType: "TEXT",
        formRow: 70,
        formCol: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.enabledFlag").$D("是否启用"),
        fieldCode: "enabledFlag",
        fieldType: "TEXT",
        formRow: 70,
        formCol: 20,
        render: (val) => Number(val) === 1 ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.createdByName").$D("创建人"),
        fieldCode: "createdByName",
        fieldType: "TEXT",
        formRow: 80,
        formCol: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.creationDate").$D("创建日期"),
        fieldCode: "creationDate",
        fieldType: "TEXT",
        formRow: 80,
        formCol: 20,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldName: this.$T("ssrc.common.model.common.sectionRemark").$D("备注"),
        fieldCode: "remark",
        fieldType: "TEXT",
        formRow: 90,
        formCol: 10,
      } ];
    },
    // 详情页（展开）个性化字段表
    getInfoDetailColumns() {
      return [ {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectNum").$D("项目编号"),
        fieldCode: "projectNum",
        fieldType: "TEXT",
        formRow: 0,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectName").$D("项目名称"),
        fieldCode: "projectName",
        fieldType: "TEXT",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.company").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.ouName").$D("业务实体"),
        fieldCode: "ouName",
        fieldType: "TEXT",
        formRow: 30,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectUserName").$D("项目负责人"),
        fieldCode: "realName",
        fieldType: "TEXT",
        formRow: 40,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.phone").$D("手机号"),
        fieldCode: "phone",
        fieldType: "TEXT",
        formRow: 50,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.email").$D("邮箱"),
        fieldCode: "email",
        fieldType: "TEXT",
        formRow: 60,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.projectAddress").$D("项目地址"),
        fieldCode: "projectAddress",
        fieldType: "TEXT",
        formRow: 70,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.fundsSource").$D("资金来源"),
        fieldCode: "fundsSourceMeaning",
        fieldType: "TEXT",
        formRow: 80,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.enabledFlag").$D("是否启用"),
        fieldCode: "enabledFlag",
        fieldType: "TEXT",
        formRow: 90,
        render: (val) => Number(val) === 1 ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.createdByName").$D("创建人"),
        fieldCode: "createdByName",
        fieldType: "TEXT",
        formRow: 100,
      }, {
        fieldName: this.$T("ssrc.tenderPlan.model.tenderPlan.creationDate").$D("创建日期"),
        fieldCode: "creationDate",
        fieldType: "TEXT",
        formRow: 110,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldName: this.$T("ssrc.common.model.common.sectionRemark").$D("备注"),
        fieldCode: "remark",
        fieldType: "TEXT",
        formRow: 120,
      } ];
    }
  },
  beforeMount() {
    this.requestData();
  },
  methods: {
    requestData() {
      this.$loading.show();
      getBaseInfoApi(this.parameters.projectId)
        .then((res) => {
          this.projectInfo = res;
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    showProjectInfoDetial() {
      this.projectInfoDetailFlag = true;
    }
  },
};
</script>

<style lang="stylus" scoped>
.project-info-approval {
  .customize-card {
    padding: 6px 0px 6px 0px;
  }
}
</style>
