<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('ssrc.prequalification.view.tab.basicInfo').$D('基本信息')">
        <srm-form :columns="getBaseInfoColumns" :data-set="baseInfoDs" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.prequalification.view.tab.prequalification').$D('资格预审')
        ">
        <srm-form
          :data-set="baseInfoDs"
          :columns="getPrequalificationColumns"/>
        <srm-list :data-set="supplierDs" :columns="getSupplierColumns" :clickable="false" :scrollable="false" height="auto" style="height: auto" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 预审小组弹框 -->
    <srm-popup :visible.sync="visible" :title="$T('ssrc.prequalification.view.teamMember').$D('预审小组成员')" @onClose="handleClose">
      <srm-list :data-set="teamDs" :columns="getTeamColumns" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { baseInfoDS, supplierDS, teamDS } from "./store";

export default {
  modules: [ "ssrc.prequalification" ],
  name: "YXPrequalificationApprovalForm",
  props: {
    changeReqId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      baseInfoDs: new DataSet(baseInfoDS({ rfxHeaderId: this.changeReqId })),
      supplierDs: new DataSet(supplierDS({ rfxHeaderId: this.changeReqId })),
      teamDs: new DataSet(teamDS()),
      showDetailValue: {},
      visible: false, // 控制预审小组弹框
    };
  },
  computed: {
    // 基本信息列
    getBaseInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxNum",
          render: (val) =>
            <SrmListHeader>
              <div>{val}</div>
            </SrmListHeader>
          ,
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "rfxTitle",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
        },
        // {
        //   formRow: 30,
        //   fieldType: "TEXT",
        //   fieldCode: "quotationStartDate",
        // },
        // {
        //   formRow: 40,
        //   fieldType: "TEXT",
        //   fieldCode: "quotationEndDate",
        // },
        // {
        //   formRow: 50,
        //   fieldType: "TEXT",
        //   fieldCode: "rfxRemark",
        // },
      ];
      return columns;
    },
    // 资格预审列
    getPrequalificationColumns() {
      const columns = [
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "prequalEndDate",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "reviewMethodMeaning",
        },
        {
          formRow: 30,
          fieldType: "TEXT",
          fieldCode: "",
          fieldName: $T("ssrc.prequalification.view.preTrial.panel").$D("预审小组"),
          render: () => <a style={{ color: "var(--font-color-primary)" }} onClick={this.handleModal}>{$T("ssrc.prequalification.view.tab.view").$D("查看")}</a>
        },
        {
          formRow: 40,
          fieldType: "TEXT",
          fieldCode: "prequalAttachmentUuid",
          render: (val) =>
            <SrmUpload
              showIcon={false}
              attachmentUuid={val}
              descTitle={$T(
                "ssrc.prequalification.model.viewAttachmentUuid"
              ).$D("查看附件")}
            />
          ,
        },
        {
          formRow: 50,
          fieldType: "TEXT",
          fieldCode: "prequalRemark",
        },
        {
          formRow: 60,
          fieldType: "EMPTY",
          fieldCode: "attributeLongtext6",
          render: (val) =>
            <span style={{ width: "96vw", height: "10vh" }}>
              {" "}
              <SrmListHeader>
                {$T("ssrc.prequalification.view.prequalificationOpinion").$D(
                  "预审意见"
                )}
                :
              </SrmListHeader>
              <div style={{ marginTop: "10px" }}>
                <SrmTextareaField value={val} editor={false} />
              </div>
            </span>
          ,
        },
        {
          formRow: 70,
          fieldType: "EMPTY",
          fieldCode: "",
          render: () => <SrmListHeader style={{ marginTop: "10px" }}>
            { $T("ssrc.prequalification.view.application.supplierList").$D("供应商列表") }:
          </SrmListHeader>
        },

      ];
      return columns;
    },
    // 供应商列
    getSupplierColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "header",
          render: (val, item) => {
            const lines = this.supplierDs.data.find((e) => e.supplierCompanyId === item.supplierCompanyId);
            return <SrmFlex direction="column">
              <SrmFlex justify="between" nativeOnClick={() => {
                this.$set(this.showDetailValue, item.supplierCompanyId, !this.showDetailValue[item.supplierCompanyId]);
              }}>
                <span class="title-bold">{`${item.companyNum ? item.companyNum + "-" : ""}${item.supplierCompanyName}`}</span>
              </SrmFlex>
              <srm-blank v-show={!this.showDetailValue[item.supplierCompanyId]} style="margin: 10px 0;" size="1px" theme="fill"/>
              <SrmFlex v-show={!this.showDetailValue[item.supplierCompanyId]} direction="column">
                <Customize dataSource={lines} columns={this.getSupplierLineColumns} />
              </SrmFlex>
            </SrmFlex>;
          },
        },
      ];
      return columns;
    },
    getSupplierLineColumns() {
      return [
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "supplierCompanyIp",
          fieldName: $T("ssrc.prequalification.model.supplierCompanyIp").$D(
            "投标IP"
          ),
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "applicationRemark",
          fieldName: $T("ssrc.prequalification.model.applicationRemark").$D(
            "资格预审申请说明"
          ),
        },
        {
          formRow: 30,
          fieldType: "TEXT",
          fieldCode: "lineApprovedStatusMeaning",
          fieldName: $T(
            "ssrc.prequalification.model.lineApprovedStatusMeaning"
          ).$D("预审审批结果"),
        },
        {
          formRow: 40,
          fieldType: "TEXT",
          fieldCode: "approvedRemark",
          fieldName: $T("ssrc.prequalification.model.approvedRemark").$D(
            "备注"
          ),
        },
        {
          formRow: 50,
          fieldType: "TEXT",
          fieldCode: "validAttachmentUuid",
          fieldName: $T("ssrc.prequalification.model.validAttachmentUuid").$D(
            "附件"
          ),
          render: (val) =>
            <SrmUpload
              showIcon={false}
              attachmentUuid={val}
              descTitle={$T(
                "ssrc.prequalification.model.viewAttachmentUuid"
              ).$D("查看附件")}
            />
          ,
        },
      ];
    },
    // 预审小组列
    getTeamColumns() {
      return [
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "loginName",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "realName",
        },
        {
          formRow: 30,
          fieldType: "TEXT",
          fieldCode: "leaderFlagMeaning",
        },
        {
          formRow: 40,
          fieldType: "TEXT",
          fieldCode: "internationalTelCodeMeaning",
          render: (val, item) => <span>{val} | {item.phone}</span>
        },
        {
          formRow: 50,
          fieldType: "TEXT",
          fieldCode: "email",
        },
      ];
    }
  },
  mounted() {
    this.supplierDs.refresh();
  },
  methods: {
    // 打开预审小组弹框
    handleModal() {
      this.visible = true;
      this.teamDs.addPathParameter("rfxHeaderId", this.baseInfoDs?.current?.data?.rfxHeaderId);
      this.teamDs.refresh();
    },
    // 关闭弹框回调
    handleClose() {
      this.visible = false;
    }
  },
};
</script>

<style scoped lang="stylus">

.title-bold {
  width 80%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
