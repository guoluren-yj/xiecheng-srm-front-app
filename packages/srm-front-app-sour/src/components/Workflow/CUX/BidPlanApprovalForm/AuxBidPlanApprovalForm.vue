<template>
  <div class="bid-plan-approval-form">
    <div class="title-bold">基础信息</div>
    <customize v-if="baseInfoColumns.length" :data-source="bidPlanDetail" :columns="baseInfoColumns"/>
    <div class="title-bold">计划时间</div>
    <customize v-if="planDateColumns.length" :data-source="bidPlanDetail" :columns="planDateColumns"/>
    <div v-if="!manufactureFlag" class="title-bold">责任人</div>
    <customize v-if="!manufactureFlag && personColumns.length" :data-source="bidPlanDetail" :columns="personColumns"/>
  </div>
</template>

<script>
import { getBidPlanDetail, getOrgType } from "./api/AuxApi";

export default {
  modules: [ "scux.tenderPlanReport", "hzero.common" ],
  name: "AuxBidPlanApprovalForm",
  props: {
    changeReqId: {
      type: String | Number,
      default: null,
    }
  },
  data() {
    return {
      planId: this.changeReqId,
      bidPlanDetail: {},
      organizationCode: null,
      organizationType: null,
      manufactureFlag: false,
      baseInfoColumns: [],
      planDateColumns: [],
      personColumns: [],
    };
  },
  mounted() {
    this.$emit("GetApprovalTitle", "招标计划审批");
    this.fetchDetail();
  },
  methods: {
    fetchDetail() {
      this.$loading.show();
      getBidPlanDetail(this.planId).then((res) => {
        if (res && !res.failed) {
          this.bidPlanDetail = res;
          this.organizationCode = res.organizationCode;
        }
      }).finally(() => {
        this.$loading.hide();
        this.fetchOrgType();
      });
    },
    fetchOrgType() {
      this.$loading.show();
      getOrgType(this.organizationCode).then((res) => {
        if (res && !res.failed) {
          this.organizationType = res;
          this.manufactureFlag = this.organizationType === "MANUFACTURE";
          this.baseInfoColumns = this.getBaseInfoColumns();
          this.planDateColumns = this.getPlanDateColumns();
          this.personColumns = this.getPersonColumns();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    getBaseInfoColumns() {
      return [ {
        fieldName: "项目名称",
        fieldCode: "projectName",
        formRow: 1,
      }, {
        fieldName: "公司",
        fieldCode: "companyName",
        formRow: 2,
      }, {
        fieldName: "业务实体",
        fieldCode: "ouName",
        formRow: 3,
      }, {
        fieldName: "采购组织",
        fieldCode: "purOrganizationName",
        formRow: 4,
      }, {
        fieldName: "计划类型",
        fieldCode: "planTypeMeaning",
        formRow: 4,
      }, {
        fieldName: this.$T("scux.tenderPlanReport.model.report.urgentRemark").$D("插单原因"),
        fieldCode: "urgentRemarkMeaning",
        formRow: 50,
        visible: this.bidPlanDetail.planType === "URGENT",
      }, {
        fieldName: this.$T("scux.tenderPlanReport.model.report.dsAttachmentUuid").$D("D/S指示附件"),
        fieldCode: "dsAttachmentUuid",
        fieldType: "UPLOAD",
        showCount: true,
        formRow: 50,
        visible: this.bidPlanDetail.urgentRemark === "DS_INDICATE",
      }, {
        fieldName: "分权引用",
        fieldCode: "decentralizedRef",
        formRow: 60,
      }, {
        fieldName: "状态",
        fieldCode: "planStatusMeaning",
        formRow: 60,
      }, {
        fieldName: "创建人",
        fieldCode: "createdByName",
        formRow: 70,
      }, {
        fieldName: "创建时间",
        fieldCode: "creationDate",
        formRow: 70,
      }, {
        fieldName: "类型",
        fieldCode: "biddingTypeMeaning",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.tenderPlanReport.model.report.scene").$D("场景"),
        fieldCode: "sceneMeaning",
        formRow: 80,
        visible: Number(this.bidPlanDetail.biddingType) === 3,
      }, {
        fieldName: "招采方式",
        fieldCode: "subjectTypeMeaning",
        formRow: 90,
      }, {
        fieldName: "预算（万）",
        fieldCode: "budget",
        formRow: 90,
      }, {
        fieldName: this.$T("scux.tenderPlanReport.model.report.sTaskFlag").$D("是否有计管S待办"),
        fieldCode: "sTaskFlag",
        formRow: 100,
        render: (val) => Number(val) === 1 ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
      }, {
        fieldName: this.$T("scux.tenderPlanReport.model.report.remark").$D("备注"),
        fieldCode: "remark",
        formRow: 110,
      }, ];
    },
    getPlanDateColumns() {
      return [ {
        fieldName: "计划开标地点",
        fieldCode: "planOpenLocation",
        visible: this.manufactureFlag ? 1 : 0,
      }, {
        fieldName: "进场时间",
        fieldCode: "entryDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        },
        visible: this.manufactureFlag ? 0 : 1,
      }, {
        fieldName: "技术文件提交时间",
        fieldCode: "tecFileSubmitDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        }
      }, {
        fieldName: "图纸上传时间",
        fieldCode: "drawingUploadDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        },
        visible: this.manufactureFlag ? 0 : 1,
      }, {
        fieldName: "策划审批时间",
        fieldCode: "planApprovalDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        }
      }, {
        fieldName: "招标答疑时间",
        fieldCode: "bidReplyDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        },
        visible: this.manufactureFlag ? 0 : 1,
      }, {
        fieldName: "计划开标时间",
        fieldCode: "planOpenDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        }
      }, {
        fieldName: "结果提报时间",
        fieldCode: "resultReportDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        }
      }, {
        fieldName: "合同签订时间",
        fieldCode: "signContractDate",
        render: (val) => {
          return (val || "").replace("00:00:00", "");
        },
        visible: this.manufactureFlag ? 0 : 1,
      } ];
    },
    getPersonColumns() {
      return [ {
        fieldName: "设计负责人",
        fieldCode: "designLeader",
      }, {
        fieldName: "城市公司分责人",
        fieldCode: "cityCompanyLeader",
      }, {
        fieldName: "招标负责人",
        fieldCode: "bidLeader",
      }, ];
    },
  }
};
</script>

<style lang="stylus" scoped>
.bid-plan-approval-form {
  padding 16px;
  font-size 14px;
  background white;
}

.title-bold {
  margin-top 15px;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
}

</style>
