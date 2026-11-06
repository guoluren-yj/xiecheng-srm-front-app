<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('hiam.companySearch.view.title.invitingInformation').$D('邀请信息')"/>
    <div class="content" style="height: 100%;width: 100%;overflow: scroll;">
      <!-- 头信息 -->
      <div class="srm-head-info">
        {{ $T("hiam.companySearch.view.message.sendInvitation").$D("您正在向") }}【{{ companyName }}】{{ $T("hiam.companySearch.view.message.sendInvitationOne").$D("发出合作邀约，邀请它成为你的【供应商】") }}
      </div>
      <!-- 内容区域 -->
      <customize ref="inputView" :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.INVITING_INFO" :data-source="invitingInfo" :columns="getHeadColumns" />
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import { postBathInviteApi, checkIntroCategoryApi, getPurchaserApi } from "../api";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "spfm.approval", "spfm.companySearch", "hipspfm.common", "hiam.companySearch", "sinv.purchaseReception", "sfin.inputInvoice", "hipspfm.invoiceInspection", "sslm.supplierManage", "hipspfm.supplier", "spfm.invitationRegister", "ssrc.inquiryHall", "sfin.invoiceVerification", "hzero.common", "sfin.invoiceBill", "spfm.disposeInvite" ],
  name: "InviteCooperationSupplier",
  components: {
  },
  data() {
    return {
      headInfo: {}, // 信息
      companyId: "", //公司id
      tenantId:"", // tenantId
      surveyArr:[], // 调查类型所有的值
      categoryArr:[], // 准入品类数组
      companyName:"", //供应商名
      invitingInfo:{
        // levelName:this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级"), //合作层级名称
        // levelVal:"1", //合作层级id
        levelName:"", //合作层级名称
        levelVal:"", //合作层级id
        companyNames:[], //邀请方名称
        companyIds:[], //邀请id
        companyNamesStr:"", //邀请方名称选择值
        companyNamesCode:"",
        // checkedSurvey:true, //是否发送调查表
        checkedSurvey:"", //是否发送调查表
        investigateTypeName:"", //调查表类型名称
        investigateType:"", //调查表类型
        investigateTemplateName:"", //调查表模板名称
        investigateTemplateId:"", //调查表模板id
        categoryNames:[], //准入品类名称
        categoryNamesStr:"", //准入品类id选择值
        categoryIds:[], //准入品类id
        categoryIdsStr:"", //准入品类id选择值
        purchaseAgentNames:[], //采购员名称
        purchaseAgentNamesStr:"", //采购员名称
        purchaseAgentIds:[], //采购员id
        purchaseAgentIdsStr:"", //采购员id
        supplierCategoryIdsStr:"", //供应商分类id
        supplierCategoryIds:[], //供应商分类id
        supplierCategoryNamesStr:"", //供应商分类名称
        supplierCategoryCodes:[], //供应商分类编码
        inviteRemark:"", //邀约说明
        remark:"", //邀约说明调查
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
          required: true,
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
          // defaultValue:{
          //   value: "1",
          //   meaning: this.$T("hipspfm.supplier.message.supplier.companyLevel").$D("公司级")
          // }
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.companyId").$D("邀请方"),
          fieldCode: "companyNamesStr",
          fieldType: "LOV",
          required: true,
          lovCode: "SPFM.USER_AUTHORITY_COMPANY",
          displayField: "companyNamesCode", // 外层描述显示字段
          options: {
            multiple: true,
            queryField: "companyNum", // 查询
            displayField: "companyName", // 描述显示字段
            subDisplayField: "companyNum", // 编码显示字段
            valueField: "companyId",
            callback:(val) => {
              this.invitingInfo.companyNames = [];
              this.invitingInfo.companyIds = [];
              val.map((item) => {
                this.invitingInfo.companyNames.push(item.companyName);
                this.invitingInfo.companyIds.push(item.companyId);
              });
            }
          },
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.autosendInvestigateFlag").$D("发送调查表"),
          fieldType: "SWITCH",
          fieldCode: "checkedSurvey",
          defaultValue:"1"
        },
        {
          fieldCode: "investigateType",
          fieldType: "SELECT",
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.investigateType").$D("调查类型"),
          lovCode: "SSLM.INVESTIGATE_TYPE",
          disabled: (val, record) => !record.checkedSurvey,
          displayField: "investigateTypeName", // 外层描述显示字段
          options: {
            multiple: false,
            displayField: "meaning", // 描述显示字段
            subDisplayField: "companyNum", // 编码显示字段
            valueField: "value",
          },
          required: (val, record) => record.checkedSurvey
        },
        {
          fieldType: "LOV",
          fieldName: this.$T("spfm.invitationRegister.model.invitationRegister.investigateTemplateId").$D("调查表模板"),
          fieldCode: "investigateTemplateId",
          required: (val, record) => record.checkedSurvey,
          disabled: (val, record) => record.investigateType === "" || record.investigateType === null,
          lovCode: "SSLM.INVESTIGATE_TEMPLATE_ID",
          displayField: "investigateTemplateName", // 外层描述显示字段
          options: {
            multiple: false,
            queryField: "templateCode", // 查询
            displayField: "templateName", // 描述显示字段
            subDisplayField: "templateCode", // 编码显示字段
            valueField: "investigateTemplateId",
            queryParams: { investigateType: this.invitingInfo.investigateType }
          },
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.remark").$D("调查说明"),
          fieldCode: "remark",
          fieldType: "INPUT",
          disabled: (val, record) => !record.checkedSurvey,
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
              this.invitingInfo.categoryIds = [];
              this.invitingInfo.categoryNames = [];
              let params = [];
              val.map((item) => {
                this.invitingInfo.categoryIds.push(item.categoryId);
                this.invitingInfo.categoryNames.push(item.categoryName);
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
              this.invitingInfo.purchaseAgentIds = [];
              this.invitingInfo.purchaseAgentNames = [];
              val.map((item) => {
                this.invitingInfo.purchaseAgentIds.push(item.purchaseAgentId);
                this.invitingInfo.purchaseAgentNames.push(item.purchaseAgentName);
              });
            }
          },
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
              this.invitingInfo.supplierCategoryIds = [];
              this.invitingInfo.supplierCategoryCodes = [];
              let params = "";
              val.map((item) => {
                params = params + "supplierCategoryIdList=" + item.categoryId + "&";
                this.invitingInfo.supplierCategoryIds.push(item.categoryId);
                this.invitingInfo.supplierCategoryCodes.push(item.categoryCode);
              });
              this.checkIntroCategory(params);
            }
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
            this.invitingInfo.purchaseAgentIds.push(item.purchaseAgentId);
            this.invitingInfo.purchaseAgentNames.push(item.purchaseAgentName);
          });
          this.invitingInfo.purchaseAgentIdsStr = this.invitingInfo.purchaseAgentIds.join(",");
          this.invitingInfo.purchaseAgentNamesStr = this.invitingInfo.purchaseAgentNames.join(",");
          this.$loading.hide();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 清空采购员
    clearPurchase() {
      this.invitingInfo.purchaseAgentIds = [];
      this.invitingInfo.purchaseAgentNames = [];
      this.invitingInfo.purchaseAgentIdsStr = "";
      this.invitingInfo.purchaseAgentNamesStr = "";
    },
    checkIntroCategory(params) {
      this.$loading.show();
      checkIntroCategoryApi(params).then((res) => {
        if (res.failed) {
          this.invitingInfo.supplierCategoryIdsStr = "";
          this.invitingInfo.supplierCategoryNamesStr = "";
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
      //判断是否发送调查表
      if (this.invitingInfo.checkedSurvey) {
        params = {
          categoryIds:this.invitingInfo.categoryIds, //准入品类id
          companyIds : this.invitingInfo.companyIds,
          companyNames : this.invitingInfo.companyNames,
          groupLevelSupplierFlag: 0,
          investigateTemplateId : this.invitingInfo.investigateTemplateId, //调查表模板id
          investigateType : this.invitingInfo.investigateType, //调查表类型
          inviteCompanyId : this.companyId,
          inviteRemark : this.invitingInfo.inviteRemark,
          inviteTenantId : Number(this.tenantId),
          levelTypeFlag:Number(this.invitingInfo.levelVal), // 合作层级
          multiSupplierCategoryId:this.invitingInfo.supplierCategoryIdsStr, //供应商分类id
          purchaseAgentId:this.invitingInfo.purchaseAgentIdsStr, //采购员id
          PurchaseAgentName:this.invitingInfo.purchaseAgentNamesStr, //采购员名称
          remark:this.invitingInfo.remark, //调查说明
          supplierCategoryDescription:this.invitingInfo.supplierCategoryNamesStr, //供应商分类
          tenantId : SrmUtil.getTenantId(),
        };
      } else {
        params = {
          categoryIds:this.invitingInfo.categoryIds, //准入品类id
          companyIds : this.invitingInfo.companyIds,
          companyNames : this.invitingInfo.companyNames,
          groupLevelSupplierFlag: 0,
          inviteCompanyId : this.companyId,
          inviteRemark : this.invitingInfo.inviteRemark,
          inviteTenantId : Number(this.tenantId),
          levelTypeFlag:Number(this.invitingInfo.levelVal), // 合作层级
          multiSupplierCategoryId:this.invitingInfo.supplierCategoryIdsStr, //供应商分类id
          purchaseAgentId:this.invitingInfo.purchaseAgentIdsStr, //采购员id
          PurchaseAgentName:this.invitingInfo.purchaseAgentNamesStr, //采购员名称
          supplierCategoryDescription:this.invitingInfo.supplierCategoryNamesStr, //供应商分类
          tenantId : SrmUtil.getTenantId(),
        };
      }
      //调用接口提交数据
      if (params) {
        this.$loading.show();
        postBathInviteApi(params).then((res) => {
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
