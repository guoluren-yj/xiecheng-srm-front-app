<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('spfm.invitationRegister.view.invitationRegister.invitationRegister').$D('邀请供应商注册')"/>
    <div class="content" style="height: 85%;width: 100%;overflow: scroll;">
      <!-- 内容区域 -->
      <customize ref="inputView" :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.INVITE_REGISTER_SUPPLIER_INFO" :data-source="inviteRegisterSupInfo" :columns="getColumns" />
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import { postInviteRegisterApi, getPurchaserApi, checkIntroCategoryApi } from "../api";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "spfm.approval", "spfm.companySearch", "hipspfm.common", "hiam.companySearch", "sinv.purchaseReception", "sfin.inputInvoice", "hipspfm.invoiceInspection", "sslm.supplierManage", "hipspfm.supplier", "spfm.invitationRegister", "ssrc.inquiryHall", "sfin.invoiceVerification", "hzero.common", "sfin.invoiceBill", "smbl.small", "spfm.disposeInvite", "smbl.common" ],
  name: "InviteRegisterSupplier",
  components: {
  },
  data() {
    return {
      inviteRegisterSupInfo:{
        companyName:"", //邀请方名称
        companyId:"", //邀请方id
        supplierName:"", //供应商企业名称
        supplierMail:"", //供应商企业邮箱
        supplierErpCode:"", //供应商企业ERP编码
        inviteRemark:"", //邀约说明
        // sendInvite:true, // 发送邀约开关
        sendInvite:"", // 发送邀约开关
        // levelName:this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级"), //合作层级名称
        // levelVal:"1", //合作层级id
        levelName:"", //合作层级名称
        levelVal:"", //合作层级id
        // checkedSurvey:false, // 发送调查表开关
        checkedSurvey:"", // 发送调查表开关
        investigateTypeName:"", //调查表类型名称
        investigateType:"", //调查表类型
        investigateTemplateName:"", //调查表模板名称
        investigateTemplateId:"", //调查表模板id
        // autobuildPartnerFlag: false, //自动建立合作伙伴关系
        autobuildPartnerFlag: "", //自动建立合作伙伴关系
        categoryNames:[], //准入品类名称
        categoryNamesStr:"", //准入品类id选择值
        categoryIds:[], //准入品类id
        categoryIdsStr:"", //准入品类id选择值
        supplierCategoryIdsStr:"", //供应商分类id
        supplierCategoryIds:[], //供应商分类id
        supplierCategoryNamesStr:"", //供应商分类名称
        supplierCategoryCodes:[], //供应商分类编码
        purchaseAgentNames:[], //采购员名称
        purchaseAgentNamesStr:"", //采购员名称字符
        purchaseAgentIds:[], //采购员id
        purchaseAgentIdsStr:"", //采购员id
        purchaseAgentPhone:"", //采购员手机
        internationalTelCode:"", //手机区号
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
          title: this.$T("spfm.invitationRegister.view.invitationRegister.sendInvitation").$D("发送邀请"),
          handler: () => this.clickCubmit()
        },
      ];
    },
    // 表单信息
    getColumns() {
      const columns = [
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
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.supplierName").$D("供应商企业"),
          fieldCode: "supplierName",
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.supplierMail").$D("供应商邮箱"),
          fieldCode: "supplierMail",
          fieldType: "INPUT",
          required: true,
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!this.validateMail(val)) {
                return this.$T("smbl.common.message.emailFormatError").$D("邮箱格式不正确！");
              }
            }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.supplierErpCode").$D("供应商ERP编码"),
          fieldCode: "supplierErpCode",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.inviteRegisterRemark").$D("邀请说明"),
          fieldCode: "inviteRemark",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.autosendPartnerInviteFlag").$D("发送邀约"),
          fieldType: "SWITCH",
          fieldCode: "sendInvite",
          defaultValue:"1", //默认开启
        },
        {
          fieldCode: "levelVal",
          fieldType: "SELECT",
          lovCode: "SMBL.COOPERATION_LEVEL",
          displayField: "levelName",
          fieldName: this.$T("hipspfm.supplier.message.supplier.cooperationLevel").$D("合作层级"),
          visible: (val, record) => record.sendInvite,
          required: (val, record) => record.sendInvite,
          options: {
            displayField: "meaning",
            valueField: "value",
            // listData: [
            //   { value: "1", meaning: this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级"), orderSeq: 1 },
            //   { value: "0", meaning: this.$T("hipspfm.supplier.message.supplier.groupLevel").$D("集团级"), orderSeq: 2 },
            // ],
            // callback:(val) => {
            //   this.inviteRegisterSupInfo.levelVal = val[0].value;
            // }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.autosendInvestigateFlag").$D("发送调查表"),
          fieldType: "SWITCH",
          fieldCode: "checkedSurvey",
          disabled: (val, record) => !record.sendInvite,
          defaultValue:"0", //默认关闭
        },
        {
          fieldCode: "investigateType",
          fieldType: "SELECT",
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.investigateType").$D("调查类型"),
          lovCode: "SSLM.INVESTIGATE_TYPE",
          // disabled: !this.inviteRegisterSupInfo.checkedSurvey,
          visible: (val, record) => record.checkedSurvey,
          displayField: "investigateTypeName", // 外层描述显示字段
          options: {
            multiple: false,
            displayField: "meaning", // 描述显示字段
            subDisplayField: "companyNum", // 编码显示字段
            valueField: "value",
          },
          required: (val, record) => record.checkedSurvey,
        },
        {
          fieldType: "LOV",
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.investigateTemplateId").$D("调查表模板"),
          fieldCode: "investigateTemplateId",
          required: (val, record) => record.checkedSurvey,
          // disabled: this.inviteRegisterSupInfo.investigateType === "" || this.inviteRegisterSupInfo.investigateType === null,
          visible: (val, record) => record.checkedSurvey,
          lovCode: "SSLM.INVESTIGATE_TEMPLATE_ID",
          displayField: "investigateTemplateName", // 外层描述显示字段
          options: {
            multiple: false,
            queryField: "templateCode", // 查询
            displayField: "templateName", // 描述显示字段
            subDisplayField: "templateCode", // 编码显示字段
            valueField: "investigateTemplateId",
            queryParams: { investigateType: this.inviteRegisterSupInfo.investigateType }
          },
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.invitation.autoPartnerFlag").$D("自动建立合作伙伴关系"),
          fieldType: "SWITCH",
          fieldCode: "autobuildPartnerFlag",
          defaultValue:"0", //默认关闭
          // disabled: !this.inviteRegisterSupInfo.sendInvite || this.inviteRegisterSupInfo.checkedSurvey,
          visible: (val, record) => record.sendInvite && !record.checkedSurvey
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.multiSupplierCategoryDesc").$D("供应商分类"),
          fieldCode: "supplierCategoryIdsStr",
          fieldType: "LOV",
          lovCode: "SSLM.SUPPLIER_CATEGORY_TREE",
          displayField: "supplierCategoryNamesStr", // 外层描述显示字段
          options: {
            multiple: true,
            queryField: "categoryCode", // 查询
            displayField: "categoryDescription", // 描述显示字段
            subDisplayField: "categoryCode", // 编码显示字段
            valueField: "categoryId",
            callback:(val) => {
              this.inviteRegisterSupInfo.supplierCategoryIds = [];
              this.inviteRegisterSupInfo.supplierCategoryCodes = [];
              let params = "";
              val.map((item) => {
                params = params + "supplierCategoryIdList=" + item.categoryId + "&";
                this.inviteRegisterSupInfo.supplierCategoryIds.push(item.categoryId);
                this.inviteRegisterSupInfo.supplierCategoryCodes.push(item.categoryCode);
              });
              this.checkIntroCategory(params);
            }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.categoryCode").$D("准入品类"),
          fieldCode: "categoryIdsStr",
          fieldType: "TREE",
          lovCode: "SMDM.TREE_ITEM_CATEGORY",
          displayField: "categoryNamesStr", // 外层描述显示字段
          inputChange:(val) => {
            if (val.length < 1) {
              this.clearPurchase();
            }
          },
          options: {
            multiple: true,
            queryField: "categoryCode", // 查询
            displayField: "categoryName", // 描述显示字段
            subDisplayField: "categoryCode", // 编码显示字段
            valueField: "categoryId",
            callback:(val) => {
              this.inviteRegisterSupInfo.categoryIds = [];
              this.inviteRegisterSupInfo.categoryNames = [];
              let params = [];
              val.map((item) => {
                this.inviteRegisterSupInfo.categoryIds.push(item.categoryId);
                this.inviteRegisterSupInfo.categoryNames.push(item.categoryName);
                params.push({ categoryId:item.categoryId });
              });
              //准入品类带出对应采购员
              this.getPurchaserInfo(params);
            }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentIdsStr",
          fieldType: "LOV",
          lovCode: "SPFM.PURCHASE_AGENT_NOUSER",
          displayField: "purchaseAgentNamesStr", // 外层描述显示字段
          options: {
            multiple: true,
            queryField: "purchaseAgentCode", // 查询
            displayField: "purchaseAgentName", // 描述显示字段
            subDisplayField: "purchaseAgentCode", // 编码显示字段
            valueField: "purchaseAgentId",
            callback:(val) => {
              this.inviteRegisterSupInfo.purchaseAgentIds = [];
              this.inviteRegisterSupInfo.purchaseAgentNames = [];
              val.map((item) => {
                this.inviteRegisterSupInfo.purchaseAgentIds.push(item.purchaseAgentId);
                this.inviteRegisterSupInfo.purchaseAgentNames.push(item.purchaseAgentName);
              });
            }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.purchaseAgentPhone").$D("采购员联系方式"),
          fieldCode: "purchaseAgentPhone",
          fieldType: "INPUT",
          prefixField:{
            lovCode:"HPFM.IDD",
            defaultValue:{ value: "+86", meaning:this.$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
            // displayField:"internationalTelCodeMeaning",
            fieldCode:"internationalTelCode",
            fieldType: "SELECT"
          },
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!SrmUtil.isMobileNumber(val)) {
                return this.$T("smbl.common.message.phoneFormatError").$D("手机号码格式不正确！");
              }
            }
          },
        },
      ];

      return columns;
    },
  },
  async mounted() {
  },
  methods: {
    validateMail(mail) {
      if (mail !== "") {
        //邮箱校验正则表达式
        const mailRegex = /^[a-z0-9]+([._-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if (!mailRegex.test(mail)) {
          return false;
        }
      }
      return true;
    },
    checkIntroCategory(params) {
      this.$loading.show();
      checkIntroCategoryApi(params).then((res) => {
        if (res.failed) {
          this.inviteRegisterSupInfo.supplierCategoryIdsStr = "";
          this.inviteRegisterSupInfo.supplierCategoryNamesStr = "";
          this.$notification.open({
            message: res.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
          this.$loading.hide();
        } else {
          this.$loading.hide();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 获取准入品类对应采购员
    getPurchaserInfo(params) {
      this.clearPurchase();
      this.$loading.show();
      getPurchaserApi(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
          this.$loading.hide();
        } else {
          res.map((item) => {
            this.inviteRegisterSupInfo.purchaseAgentIds.push(item.purchaseAgentId);
            this.inviteRegisterSupInfo.purchaseAgentNames.push(item.purchaseAgentName);
          });
          this.inviteRegisterSupInfo.purchaseAgentIdsStr = this.inviteRegisterSupInfo.purchaseAgentIds.join(",");
          this.inviteRegisterSupInfo.purchaseAgentNamesStr = this.inviteRegisterSupInfo.purchaseAgentNames.join(",");
          this.$loading.hide();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 清空采购员
    clearPurchase() {
      this.inviteRegisterSupInfo.purchaseAgentIds = [];
      this.inviteRegisterSupInfo.purchaseAgentNames = [];
      this.inviteRegisterSupInfo.purchaseAgentIdsStr = "";
      this.inviteRegisterSupInfo.purchaseAgentNamesStr = "";
    },
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
      let params;
      params = {
        autosendInvestigateFlag: this.inviteRegisterSupInfo.checkedSurvey ? 1 : 0,
        autosendPartnerInviteFlag : this.inviteRegisterSupInfo.sendInvite ? 1 : 0,
        categoryIds:this.inviteRegisterSupInfo.categoryIds,
        companyId : this.inviteRegisterSupInfo.companyId,
        internationalTelCode: this.inviteRegisterSupInfo.internationalTelCode,
        inviteRegisterRemark:this.inviteRegisterSupInfo.inviteRemark,
        purchaseAgentId:this.inviteRegisterSupInfo.purchaseAgentIdsStr,
        purchaseAgentPhone:this.inviteRegisterSupInfo.purchaseAgentPhone,
        rePurchaseAgentName:this.inviteRegisterSupInfo.purchaseAgentNamesStr,
        supplierErpCode: this.inviteRegisterSupInfo.supplierErpCode,
        supplierMail:this.inviteRegisterSupInfo.supplierMail,
        supplierName:this.inviteRegisterSupInfo.supplierName,
        multiSupplierCategoryId:this.inviteRegisterSupInfo.supplierCategoryIdsStr, //供应商分类id
        supplierCategoryDescription:this.inviteRegisterSupInfo.supplierCategoryNamesStr,
        tenantId:SrmUtil.getTenantId(),
        // groupLevelSupplierFlag: 0,
      };
      //判断是否发送邀约
      if (this.inviteRegisterSupInfo.sendInvite) {
        const sendInviteParams = {
          levelTypeFlag:Number(this.inviteRegisterSupInfo.levelVal),
        };
        params = { ...params, ...sendInviteParams };
      }
      //判断是否发送调查表
      if (this.inviteRegisterSupInfo.checkedSurvey) {
        const checkedSurveyParams = {
          investigateTemplateId : this.inviteRegisterSupInfo.investigateTemplateId,
          investigateType : this.inviteRegisterSupInfo.investigateType,
        };
        params = { ...params, ...checkedSurveyParams };
      }
      //判断是否添加自动建立合作伙伴关系（发送邀约且不发送调查表）
      if (this.inviteRegisterSupInfo.sendInvite && !this.inviteRegisterSupInfo.checkedSurvey) {
        const autobuildPartnerParams = {
          autobuildPartnerFlag:Number(this.inviteRegisterSupInfo.autobuildPartnerFlag),
        };
        params = { ...params, ...autobuildPartnerParams };
      }
      //调用接口提交数据
      if (params) {
        // if (!this.sendInvite) {
        //   delete params.levelTypeFlag;
        // }
        this.$loading.show();
        postInviteRegisterApi(params).then((res) => {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              description: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
            });
            // if (res.message.includes("supplierMail 不是一个合法的电子邮件地址; ")) {
            //   this.$notification.open({
            //     message: this.$T("spfm.invitationRegister.view.invitationRegister.supplierMail").$D("供应商邮箱格式不正确"),
            //     description: res.message,
            //     // eslint-disable-next-line no-undef
            //     key,
            //     class: "notification",
            //   });
            // } else {
            //   this.$notification.open({
            //     message: res.message,
            //     description: res.message,
            //     // eslint-disable-next-line no-undef
            //     key,
            //     class: "notification",
            //   });
            // }
            // this.$loading.hide();
          } else {
            this.$notification.open({
              message: this.$T("spfm.invitationRegister.view.invitationRegister.invitationSuccess").$D("发送邀请成功"),
              description: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
            });
            const that = this;
            setTimeout(function() {
              that.$router.replace({ name: "SupplierDiscoveryList" });
            }, 1000);
            // this.$loading.hide();
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
