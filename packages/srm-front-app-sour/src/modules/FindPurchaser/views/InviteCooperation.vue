<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('hiam.companySearch.view.title.invitingInformation').$D('邀请信息')"/>
    <div class="content" style="height: 100%;width: 100%;overflow: scroll;">
      <!-- 头信息 -->
      <div class="srm-head-info">
        {{ $T("hiam.companySearch.view.message.sendInvitation").$D("您正在向") }}【{{ companyName }}】{{ $T("hiam.companySearch.view.message.sendInvitationTwo").$D("发出合作邀约，邀请它成为您的【客户】") }}
      </div>
      <!-- 内容区域 -->
      <customize ref="inputView" :need-padding="true" code="SMBL.FIND_PURCHASER.INVITING_INFO" :data-source="invitingInfo" :columns="getHeadColumns" />
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import { postInviteApi } from "../api";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "spfm.approval", "spfm.companySearch", "hipspfm.common", "hiam.companySearch", "sinv.purchaseReception", "sfin.inputInvoice", "hipspfm.invoiceInspection", "sslm.supplierManage", "hipspfm.supplier", "spfm.invitationRegister", "ssrc.inquiryHall", "sfin.invoiceVerification", "hzero.common", "sfin.invoiceBill", "spfm.disposeInvite" ],
  name: "DeliveryBillDetail",
  components: {
  },
  data() {
    return {
      headInfo: {}, // 信息
      companyId: "", //公司id
      tenantId:"", // tenantId
      companyName:"", //客户名称
      invitingInfo:{
        // levelName:this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级"), //合作层级名称
        // levelVal:"1", //合作层级id
        levelName:"", //合作层级名称
        levelVal:"", //合作层级id
        companyName:"", //邀请方名称
        companyId:"", //邀请id
        inviteRemark:"", //邀约说明
      },
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          type: "info",
          title: this.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => this.goBack()
        },
        {
          type: "primary",
          title: this.$T("spfm.companySearch.view.option.confirmInvitation").$D("确认邀请"),
          handler: () => this.clickCubmit()
        },
      ];
    },
    // 详情头
    getHeadColumns() {
      const columns = [
        {
          fieldCode: "levelVal",
          fieldType: "SELECT",
          lovCode: "SMBL.COOPERATION_LEVEL",
          displayField: "levelName",
          fieldName: this.$T("hipspfm.supplier.message.supplier.cooperationLevel").$D("合作层级"),
          options: {
            displayField: "meaning",
            valueField: "value",
            // listData: [
            //   { value: "1", meaning: this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级"), orderSeq: 1 },
            //   { value: "0", meaning: this.$T("hipspfm.supplier.message.supplier.groupLevel").$D("集团级"), orderSeq: 2 },
            // ],
            // callback:(val) => {
            //   this.invitingInfo.levelVal = val[0].value;
            // }
          },
          required: true,
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.companyId").$D("邀请方"),
          fieldCode: "companyId",
          fieldType: "LOV",
          required: true,
          lovCode: "SPFM.USER_AUTHORITY_COMPANY",
          displayField: "companyName", // 外层描述显示字段
          options: {
            multiple: false,
            queryField: "companyNum", // 查询
            displayField: "companyName", // 描述显示字段
            subDisplayField: "companyNum", // 编码显示字段
            valueField: "companyId",
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.inviteRegisterRemark").$D("邀请说明"),
          fieldCode: "inviteRemark",
          fieldType: "INPUT",
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    this.companyId = this.$route.query.companyId;
    this.companyName = this.$route.query.companyName;
    this.tenantId = this.$route.query.tenantId;
    this.purchaseAgentLovTenantId = SrmUtil.getTenantId();
    this.$loading.hide();
  },
  methods: {
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    // 点击查验
    clickCubmit() {
      if (!this.$refs.inputView.validate()) {
        return;
      }
      const that = this;
      this.$dialog({
        content: this.$T("hipspfm.common.button.confirm").$D("确认") + this.$T("spfm.invitationRegister.view.invitationRegister.sendInvitation").$D("发送邀请") + "？",
        onOk() {
          that.submit();
        },
      });
    },
    //提交
    submit() {
      const params = {
        companyId: this.invitingInfo.companyId,
        groupLevelSupplierFlag: 0,
        inviteCompanyId: this.companyId,
        inviteRemark: this.invitingInfo.inviteRemark,
        inviteTenantId: Number(this.tenantId),
        levelTypeFlag: Number(this.invitingInfo.levelVal),
        tenantId: SrmUtil.getTenantId(),
      };
      //调用接口提交数据
      if (params) {
        this.$loading.show();
        postInviteApi(params).then((res) => {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
            });
            this.$loading.hide();
          } else {
            this.$notification.open({
              message: this.$T("spfm.invitationRegister.view.invitationRegister.invitationSuccess").$D("发送邀请成功"),
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
            });
            const that = this;
            setTimeout(function() {
              that.$router.replace({ name: "SupplierDiscoveryList" });
            }, 1000);
            this.$loading.hide();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    }
  },
};
</script>

<style lang="stylus" scoped>

.srm-head-info{
  background:var(--color-bg-default-d,rgba(65,70,96,0.1));
  padding:5px 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: var(--color-other-default-b);
  line-height: 20px;
  margin-bottom: 15px;
}

</style>
