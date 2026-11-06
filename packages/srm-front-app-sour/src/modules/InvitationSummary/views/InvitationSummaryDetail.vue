<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('spfm.disposeInvite.view.message.title').$D('合作邀约')" />
    <div class="srm-main-info">
      <!-- 头信息 -->
      <div
        class="srm-title-div">
        {{ titleDes }}
      </div>
      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <!-- 防止端侧报错，srm-scroll-tab 下必须有子元素，否则报错 -->
        <span/>
        <!-- 邀请供应商 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showInvitationSupFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.INVITATE_SUPPLIER_INFO" :data-source="headInfo" :columns="getInvitationSupInfoColumns" />
        </srm-scroll-tab-item>
        <!-- 邀请客户 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showInvitationCusFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.INVITATE_CUSTOMER_INFO" :data-source="headInfo" :columns="getInvitationCusInfoColumns" />
        </srm-scroll-tab-item>
        <!-- 邀请注册-已认证 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showInvitationResCerFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.INVITATE_REGISTER_CERTIFIED_INFO" :data-source="headInfo" :columns="getInvitationResCerInfoColumns" />
        </srm-scroll-tab-item>
        <!-- 邀请注册-注册/认证 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showInvitationResFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.INVITATE_REGISTER_INFO" :data-source="headInfo" :columns="getInvitationResCerInfoColumns" />
        </srm-scroll-tab-item>
        <!-- 成为供应商 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showBecomeSupFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.BECOME_SUPPLIER_INFO" :data-source="headInfo" :columns="getBecomeSupInfoColumns" />
        </srm-scroll-tab-item>
        <!-- 成为客户 -->
        <srm-scroll-tab-item v-if="showHeadTabInfo.showBecomeCusFlag" :label="$T('spfm.approval.view.message.title.invitateInfo').$D('邀请信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.BECOME_CUSTOMER_INFO" :data-source="headInfo" :columns="getBecomeCusInfoColumns" />
        </srm-scroll-tab-item>

        <srm-scroll-tab-item v-if="showHeadInfo" :label="$T('spfm.approval.view.message.title.regInfo').$D('登记信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.REGISTER_INFO" :data-source="lineInfo.basic" :columns="getRegisterInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="showHeadInfo" :label="$T('spfm.approval.view.message.title.businessInfo').$D('业务信息')" >
          <customize :need-padding="true" code="SMBL.INVITATION_SUMMARY.BUSINESS_INFO" :data-source="lineInfo.business" :columns="getBusinessInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="showQuestionnaire" :label="$T('spfm.disposeInvite.view.message.investigateTemplate').$D('调查表')" >
          <span class="srm-span-noContent">{{ $T("hipspfm.disposeInvite.validation.message.lookInvestigateTemplate").$D("请前往PC端查看调查表信息！") }}</span>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0 && showOpterateBtn"
                        :btn-arr="getBtnArr"/>
    <!-- 拒绝弹窗 -->
    <srm-popup
      :title="$T('hipspfm.common.message.reject').$D('拒绝')"
      :visible.sync="showAuditRej"
      position="bottom"
      rounded
      @onClose="$emit('input', false)">
      <srm-textarea-field
        v-model="rejectReason"
        class="srm-textarea-text"
        :label="$T('spfm.disposeInvite.view.message.title.modal.refuse').$D('拒绝原因')"
        :placeholder="$T('hipspfm.disposeInvite.view.message.inputResultReason').$D('请输入拒绝原因')"
        :show-resizer="false"
        :height="100"/>
      <srm-bottom-handler v-if="getRejectBtnArr.length > 0" :btn-arr="getRejectBtnArr"/>
    </srm-popup>
    <!-- 同意弹窗 -->
    <srm-popup
      :title="$T('spfm.disposeInvite.view.message.agree').$D('同意合作')"
      :visible.sync="showAgree"
      position="bottom"
      height="80%"
      rounded
      @onClose="$emit('input', false)">
      <div
        v-if="headInfo.inviteType === 'CUSTOMER'"
        class="srm-pop-span-first">
        {{ $T("hipspfm.disposeInvite.validation.message.buildPartnerships").$D("如果选择给对方发送调查表，则当对方提交的调查表通过您的审核后，才会建立合作伙伴关系。") }}
      </div>
      <customize ref="inputView" class="srm-pop-customize" :need-padding="true" code="SMBL.INVITATION_SUMMARY.INVITE_REGISTER_SUPPLIER_INFO" :data-source="inviteInfo" :columns="getColumns" />
      <srm-bottom-handler v-if="getApproveBtnArr.length > 0" :btn-arr="getApproveBtnArr"/>
    </srm-popup>
  </div>
</template>

<script>
import {
  getSupplierApi,
  getInvitesDetailApi,
  getInvitationSendCheckApi,
  // getInvitationApproveApi,
  getInvitationRejectApi,
  checkIntroCategoryApi,
  approveInvitationNoSendCheckApi,
  getPurchaserApi,
} from "../api";
import { isArray } from "lodash";
import { SrmUtil } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "spfm.approval", "spfm.companySearch", "hipspfm.common", "sslm.supplierDetail", "hipspfm.supplier", "spfm.disposeInvite", "hipspfm.supplierLifeCycle", "spfm.enterprise", "ssrc.bidHall", "hzero.common", "smbl.common", "spfm.invitationList", "hipspfm.disposeInvite", "spfm.invitationRegister" ],
  name: "DeliveryBillDetail",
  components: {
  },
  data() {
    return {
      headInfo: {}, // 详情信息
      lineInfo: {}, // tab信息
      inviteId: "", // 详情页头信息查询所需值
      searchType: "", // 发出/收到
      companyName: "", //发起邀请的公司
      inviteCompanyName:"", // 被邀请企业名称
      showTabInfo: false, // 是否展示tabscroll信息
      showHeadInfo:false, // 是否展示tabscroll信息
      showHeadTabInfo:{
        showInvitationSupFlag: false, // 是否展示邀请供应商信息
        showInvitationCusFlag: false, // 是否展示邀请客户信息
        showInvitationResCerFlag: false, // 是否展示邀请注册-已认证信息
        showInvitationResFlag: false, // 是否展示邀请注册-注册/认证信息
        showBecomeSupFlag: false, // 是否展示成为供应商信息
        showBecomeCusFlag: false, // 是否展示成为客户信息
      },
      showQuestionnaire: false, // 是否展示调查表信息
      showOpterateBtn: false, // 是否展示操作按钮信息
      showAgreeViewFlag: true, // 是否展示同意弹框
      companyId: "", //公司id
      businessNature:"", //经营性质
      previewImg:"",
      showAuditRej: false, // 拒绝弹窗
      rejectReason: "", // 拒绝原因
      showAgree: false, // 同意弹窗
      headerStatuClassaStyle: "",
      headerProcessStatus: "",
      isInviteRegFlag:false,
      isSendInvestigateFlag:false, // 是否发送调查表
      inviteInfo:{
        checkedSurvey:false, // 发送调查表开关
        investigateTypeName:"", //调查表类型名称
        investigateType:"", //调查表类型
        investigateTemplateName:"", //调查表模板名称
        investigateTemplateId:"", //调查表模板id
        categoryNames:[], //准入品类名称
        categoryNamesStr:"", //准入品类名称选择值
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
        roleType:"SALES", // 供应商角色（按产品要求，默认销售员角色）
        roleTypeName:"", // 供应商角色名称
        remark:"", //调查说明
      },
    };
  },
  computed: {
    // 顶部邀请描述
    titleDes() {
      let titleText;
      if (this.searchType === "send") {
        if (this.headInfo.inviteType === "SUPPLIER") {
          //1、邀请供应商类型
          titleText = this.$T("spfm.disposeInvite.view.message.turnTo").$D("我向") + "【" + this.inviteCompanyName + "】" + this.$T("spfm.disposeInvite.view.message.sendTopTwo").$D("发出合作邀约，邀请它成为我的【供应商】");
        } else if (this.headInfo.inviteType === "CUSTOMER") {
          //2、邀请客户类型
          titleText = this.$T("spfm.disposeInvite.view.message.turnTo").$D("我向") + "【" + this.inviteCompanyName + "】" + this.$T("spfm.disposeInvite.view.message.sendTopOne").$D("发出合作邀约，邀请它成为我的【客户】");
        } else if (this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "CERTIFICATED") {
          //3、邀请注册类型-已认证
          titleText = this.$T("spfm.disposeInvite.view.message.turnToCertificated").$D("我邀请的供应商企业") + "【" + this.inviteCompanyName + "】" + this.$T("spfm.disposeInvite.view.message.certificatedTopTwo").$D("已完成企业认证");
        } else if (this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "REGISTERED") {
          //4、邀请注册类型-注册
          titleText = this.$T("spfm.disposeInvite.view.message.turnTo").$D("我向") + "【" + this.inviteCompanyName + "】," + this.$T("spfm.disposeInvite.view.message.registerTopTwo").$D("发出注册邀约");
        } else if (this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "CERTIFICATION") {
          //5、邀请注册类型-认证
          titleText = this.$T("spfm.disposeInvite.view.message.turnToCertificated").$D("我邀请的供应商企业") + "【" + this.inviteCompanyName + "】" + this.$T("spfm.disposeInvite.view.message.registerCompleted").$D("已完成在线注册");
        }
      } else if (this.searchType === "receive") {
        if (this.headInfo.inviteType === "SUPPLIER") {
          //1、供应商类型
          titleText = "【" + this.companyName + "】" + this.$T("spfm.disposeInvite.view.message.agreeTopTitle.purchaser").$D("向您发出了合作邀约，邀请您成为它的【供应商】");
        } else if (this.headInfo.inviteType === "CUSTOMER") {
          //2、客户类型
          titleText = "【" + this.companyName + "】" + this.$T("spfm.disposeInvite.view.message.agreeTopTitle.supplie").$D("向您发出了合作邀约，邀请您成为它的【客户】");
        } else if (this.headInfo.inviteType === "REGISTER") {
          //3、注册类型
          titleText = "【" + this.companyName + "】" + this.$T("spfm.disposeInvite.view.message.agreeTopTitle.link").$D("通过供应链管理平台－甄采云（going-link）邀请贵司进行在线注册，实现进一步的在线合作交流。");
        }
        // else if (this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "REGISTERED") {
        // //4、邀请注册类型-注册
        //   titleText = "【" + this.companyName + "】" + this.$T("spfm.disposeInvite.view.message.agreeTopTitle.link").$D("通过供应链管理平台－甄采云（going-link）邀请贵司进行在线注册，实现进一步的在线合作交流。");
        // } else if (this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "CERTIFICATION") {
        // //5、邀请注册类型-认证
        //   titleText = "【" + this.companyName + "】" + this.$T("spfm.disposeInvite.view.message.agreeTopTitle.link").$D("通过供应链管理平台－甄采云（going-link）邀请贵司进行在线注册，实现进一步的在线合作交流。");
        // }
      }
      return titleText;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          handler: () => {
            this.showAuditRej = !this.showAuditRej;
          }
        },
        {
          type: "primary",
          title: this.$T("spfm.disposeInvite.view.message.agree").$D("同意合作"),
          handler: () => {
            // 我收到的邀约，成为客户时要同意弹窗，成为供应商不需要同意弹窗
            if (this.showAgreeViewFlag) {
              this.showAgree = !this.showAgree;
            } else {
              this.clickCubmit("agree");
            }
          }
        },
      ];
    },
    // 拒绝按钮
    getRejectBtnArr() {
      return [
        {
          type: "brown",
          title: this.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            this.showAuditRej = !this.showAuditRej;
          }
        },
        {
          type: "danger",
          title: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          handler: () => {
            this.clickCubmit("reject");
          }
        },
      ];
    },
    // 同意按钮
    getApproveBtnArr() {
      return [
        {
          type: "brown",
          title: this.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            this.showAgree = !this.showAgree;
          }
        },
        {
          type: "primary",
          title: this.$T("spfm.disposeInvite.view.message.agree").$D("同意合作"),
          handler: () => {
            this.clickCubmit("agree");
          }
        },
      ];
    },
    // 表单信息
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.sendInvestigation").$D("发送调查表"),
          fieldType: "SWITCH",
          fieldCode: "checkedSurvey",
          formRow: 10,
        },
        {
          fieldCode: "investigateType",
          fieldType: "SELECT",
          fieldName: this.$T("spfm.disposeInvite.model.purchaserCooperation.investigateType").$D("调查类型"),
          lovCode: "SSLM.INVESTIGATE_TYPE",
          visible: this.inviteInfo.checkedSurvey,
          displayField: "investigateTypeName", // 外层描述显示字段
          options: {
            multiple: false,
            displayField: "meaning", // 描述显示字段
            valueField: "value",
          },
          required: this.inviteInfo.checkedSurvey,
          formRow: 20,
        },
        {
          fieldType: "LOV",
          fieldName: this.$T("spfm.disposeInvite.model.purchaserCooperation.investigateTemplateId").$D("调查表模板"),
          fieldCode: "investigateTemplateId",
          required: this.inviteInfo.checkedSurvey,
          visible: this.inviteInfo.checkedSurvey,
          lovCode: "SSLM.INVESTIGATE_TEMPLATE_ID",
          displayField: "investigateTemplateName", // 外层描述显示字段
          options: {
            multiple: false,
            queryField: "templateCode", // 查询
            displayField: "templateName", // 描述显示字段
            subDisplayField: "templateCode", // 编码显示字段
            valueField: "investigateTemplateId",
            queryParams: { investigateType: this.inviteInfo.investigateType }
          },
          formRow: 30,
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.remark").$D("调查说明"),
          fieldCode: "remark",
          fieldType: "INPUT",
          visible: this.inviteInfo.checkedSurvey,
          formRow: 40,
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
              this.inviteInfo.supplierCategoryIds = [];
              this.inviteInfo.supplierCategoryCodes = [];
              let params = "";
              val.map((item) => {
                params = params + "supplierCategoryIdList=" + item.categoryId + "&";
                this.inviteInfo.supplierCategoryIds.push(item.categoryId);
                this.inviteInfo.supplierCategoryCodes.push(item.categoryCode);
              });
              this.checkIntroCategory(params);
            }
          },
        },
        // {
        //   fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
        //   fieldCode: "roleType",
        //   fieldType: "SELECT",
        //   lovCode: "SPFM.PARTNER_INVITE_ROLE_TYPE",
        //   displayField: "roleTypeName", // 外层描述显示字段
        //   options: {
        //     displayField: "meaning", // 描述显示字段
        //     valueField: "value",
        //   },
        // },
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
              this.inviteInfo.categoryIds = [];
              this.inviteInfo.categoryNames = [];
              let params = [];
              val.map((item) => {
                this.inviteInfo.categoryIds.push(item.categoryId);
                this.inviteInfo.categoryNames.push(item.categoryName);
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
              this.inviteInfo.purchaseAgentIds = [];
              this.inviteInfo.purchaseAgentNames = [];
              val.map((item) => {
                this.inviteInfo.purchaseAgentIds.push(item.purchaseAgentId);
                this.inviteInfo.purchaseAgentNames.push(item.purchaseAgentName);
              });
            }
          },
        },
      ];

      return columns;
    },
    // 邀请供应商信息
    getInvitationSupInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方"),
          fieldType: "EMPTY",
          render: (val, record) => {
            // 获取单据状态
            this.getStatusDes(record.inviteType, record.processStatus);
            return <SrmListHeader showOpenTag={false}>
              <span>{this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方")}：{record.companyName}</span>
              <span slot="right" class={ this.headerStatuClassaStyle }>{ this.headerProcessStatus }</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlag").$D("是否集团级"),
          fieldCode: "levelTypeFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.privateFlag").$D("私有化"),
          fieldCode: "privateFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.autosendInvestigateFlag").$D("是否发送调查表"),
          fieldCode: "sendInvestigateTemplateFlag",
          render:(val, record) => {
            if (this.isInviteRegFlag) {
              return record.inviteReg.autosendInvestigateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
            }
            return record.sendInvestigateTemplateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
          }
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateType").$D("调查类型"),
          fieldCode: "investigateTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateTemplateName").$D("调查模板"),
          fieldCode: "investigateTemplateName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.categoryName").$D("准入品类"),
          fieldCode: "investigateCategoryName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.multiSupplierCategoryDesc").$D("供应商分类"),
          fieldCode: "multiSupplierCategoryDesc",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
          fieldCode: "roleType",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentNameJoint",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.creationDate").$D("邀请时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.inviteRemark").$D("邀请备注"),
          fieldCode: "inviteRegisterRemark",
          render:(val, record) => this.isInviteRegFlag ? val : record.inviteRemark
        },
      ];

      return columns;
    },
    // 邀请客户信息
    getInvitationCusInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方"),
          fieldType: "EMPTY",
          render: (val, record) => {
            // 获取单据状态
            this.getStatusDes(record.inviteType, record.processStatus);
            return <SrmListHeader showOpenTag={false}>
              <span>{this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方")}：{record.companyName}</span>
              <span slot="right" class={ this.headerStatuClassaStyle }>{ this.headerProcessStatus }</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.inviteRemark").$D("邀请备注"),
          fieldCode: "inviteRegisterRemark",
          render:(val, record) => this.isInviteRegFlag ? val : record.inviteRemark
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlagSupplier").$D("是否集团级供应商"),
          fieldCode: "levelTypeFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
          fieldCode: "roleType",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.creationDate").$D("邀请时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
      ];

      return columns;
    },
    // 邀请注册信息
    getInvitationResCerInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方"),
          fieldType: "EMPTY",
          render: (val, record) => {
            // 获取单据状态
            this.getStatusDes(record.inviteType, record.processStatus);
            return <SrmListHeader showOpenTag={false}>
              <span>{this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方")}：{record.companyName}</span>
              <span slot="right" class={ this.headerStatuClassaStyle }>{ this.headerProcessStatus }</span>
            </SrmListHeader>;
          }
        },
        //注册、认证状态单据有以下字段供应商相关字段
        this.showHeadTabInfo.showInvitationResFlag && {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.supplierName").$D("供应商企业"),
          fieldCode: "supplierName",
          render: (val, record) => record.inviteReg && record.inviteReg.supplierName,
        },
        this.showHeadTabInfo.showInvitationResFlag && {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.supplierErpCode").$D("供应商erp编码"),
          fieldCode: "supplierErpCode",
          render: (val, record) => record.inviteReg && record.inviteReg.supplierErpCode,
        },
        this.showHeadTabInfo.showInvitationResFlag && {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.supplierMail").$D("供应商邮箱"),
          fieldCode: "supplierMail",
          render: (val, record) => record.inviteReg && record.inviteReg.supplierMail,
        },

        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.inviteRemark").$D("邀请说明"),
          fieldCode: "inviteRemark",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.autosendPartnerInviteFlag").$D("发送邀约"),
          fieldCode: "autosendPartnerInviteFlag",
          render: (val, record) => record.inviteReg && record.inviteReg.autosendPartnerInviteFlag === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlag").$D("是否集团级"),
          fieldCode: "levelTypeFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.autosendInvestigateFlag").$D("是否发送调查表"),
          fieldCode: "sendInvestigateTemplateFlag",
          render:(val, record) => {
            // if (this.searchType === "send" && record.inviteReg && ([ "CERTIFICATED", "CERTIFICATION" ].includes(record.processStatus) || [ "REGISTERED", "DISABLED" ].includes(record.processStatus) && record.inviteType !== "CUSTOMER")) {
            if (this.isInviteRegFlag) {
              return record.inviteReg.autosendInvestigateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
            }
            return record.sendInvestigateTemplateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.invitation.autoPartnerFlag").$D("自动建立合作伙伴关系"),
          fieldCode: "autobuildPartnerFlag",
          render: (val, record) => record.inviteReg && record.inviteReg.autobuildPartnerFlag === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        this.isSendInvestigateFlag && {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateType").$D("调查类型"),
          fieldCode: "investigateTypeMeaning",
        },
        this.isSendInvestigateFlag && {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateTemplateName").$D("调查模板"),
          fieldCode: "investigateTemplateName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.categoryName").$D("准入品类"),
          fieldCode: "categoryName",
          render:(val, record) => record.inviteReg && record.inviteReg.categoryName
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.multiSupplierCategoryDesc").$D("供应商分类"),
          fieldCode: "multiSupplierCategoryDesc",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
          fieldCode: "roleType",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentNameJoint",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.purchaseAgentPhone").$D("采购员联系方式"),
          fieldCode: "purchaseAgentPhone",
          render:(val, record) => {
            const curInternationalTelMeaning = record.inviteReg && record.inviteReg.internationalTelMeaning ? record.inviteReg.internationalTelMeaning + " | " : " | ";
            return record.inviteReg && record.inviteReg.purchaseAgentPhone ? curInternationalTelMeaning + record.inviteReg.purchaseAgentPhone : "";
          }
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.creationDate").$D("邀请时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
      ];

      return columns;
    },
    // 成为供应商信息
    getBecomeSupInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方"),
          fieldType: "EMPTY",
          render: (val, record) => {
            // 获取单据状态
            this.getStatusDes(record.inviteType, record.processStatus);
            return <SrmListHeader showOpenTag={false}>
              <span>{this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方")}：{record.companyName}</span>
              <span slot="right" class={ this.headerStatuClassaStyle }>{ this.headerProcessStatus }</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.inviteRemark").$D("邀请备注"),
          fieldCode: "inviteRegisterRemark",
          render:(val, record) => this.isInviteRegFlag ? val : record.inviteRemark
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlag").$D("是否集团级"),
          fieldCode: "levelTypeFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.privateFlag").$D("私有化"),
          fieldCode: "privateFlagMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
          fieldCode: "roleType",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.creationDate").$D("邀请时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
      ];

      return columns;
    },
    // 成为客户信息
    getBecomeCusInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方"),
          fieldType: "EMPTY",
          render: (val, record) => {
            // 获取单据状态
            this.getStatusDes(record.inviteType, record.processStatus);
            return <SrmListHeader showOpenTag={false}>
              <span>{this.$T("spfm.disposeInvite.model.topinfo.companyName").$D("邀请方")}：{record.companyName}</span>
              <span slot="right" class={ this.headerStatuClassaStyle }>{ this.headerProcessStatus }</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.inviteCompanyName").$D("采购方"),
          fieldCode: "inviteCompanyName",
        },
        // {
        //   fieldCode: "levelTypeFlag",
        //   fieldType: "SELECT",
        //   displayField:"levelTypeFlagMeaning",
        //   fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlagSupplier").$D("是否集团级供应商"),
        //   options: {
        //     displayField: "meaning",
        //     subDisplayField: "value",
        //     valueField: "value",
        //     listData: [
        //       { value: "0", meaning: this.$T("hipspfm.common.status.yes").$D("是"), orderSeq: 1 },
        //       { value: "1", meaning: this.$T("hipspfm.common.status.no").$D("否"), orderSeq: 2 },
        //     ],
        //     // callback:(val) => {
        //     //   this.headInfo.levelTypeFlag = val[0].value;
        //     // }
        //   }
        // },
        this.headInfo.processStatus !== "PENDING" && {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlagSupplier").$D("是否集团级供应商"),
          fieldCode: "levelTypeFlagMeaning",
        },
        this.headInfo.processStatus === "PENDING" && {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.levelTypeFlagSupplier").$D("是否集团级供应商"),
          fieldCode: "levelTypeFlagMeaning",
          fieldType: "SWITCH",
          disabled: (val, record) => !(record.processStatus === "PENDING"),
          // eslint-disable-next-line no-unused-vars
          inputChange:(val, record) => {
            this.headInfo.levelTypeFlag = val ? 0 : 1;
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.autosendInvestigateFlag").$D("是否发送调查表"),
          fieldCode: "sendInvestigateTemplateFlag",
          render:(val, record) => {
            if (this.isInviteRegFlag) {
              return record.inviteReg.autosendInvestigateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
            }
            return record.sendInvestigateTemplateFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
          }
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateType").$D("调查类型"),
          fieldCode: "investigateTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.investigateTemplateName").$D("调查模板"),
          fieldCode: "investigateTemplateName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.categoryName").$D("准入品类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.multiSupplierCategoryDesc").$D("供应商分类"),
          fieldCode: "multiSupplierCategoryDesc",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.roleType").$D("供应商角色"),
          fieldCode: "roleType",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentNameJoint",
        },
        {
          fieldName: this.$T("spfm.invitationRegister.model.invitation.creationDate").$D("邀请时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          fieldName: this.$T("spfm.disposeInvite.model.topinfo.inviteRemark").$D("邀请备注"),
          fieldCode: "inviteRegisterRemark",
          render:(val, record) => this.isInviteRegFlag ? val : record.inviteRemark
        },
      ];

      return columns;
    },
    // 登记信息
    getRegisterInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            <span>{item.companyName}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.companyTypeMeaning").$D("公司类型"),
          fieldCode: "companyTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.registeredCountryName").$D("注册国家"),
          fieldCode: "registeredCountryName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.registeredCapital").$D("注册资本"),
          fieldCode: "registeredCapital",
          render:(val, record) => {
            const currencyNameStr = record.currencyName ? record.currencyName : this.$T("smbl.common.currency.yuan").$D("人名币");
            return record.registeredCapital ? record.registeredCapital + this.$T("hzero.common.currency.ten.thousand").$D("万") + currencyNameStr : this.$T("hipspfm.common.currency.none").$D("无");
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.legalRepName").$D("法定代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.domesticForeignRelation").$D("境内外关系"),
          fieldCode: "domesticForeignRelation",
          render:(val, record) => record.domesticForeignRelation === 1 ? this.$T("spfm.disposeInvite.view.message.domestic").$D("境内") : record.domesticForeignRelation === 0 ? this.$T("spfm.disposeInvite.view.message.overseas").$D("境外") : ""
        },

        {
          fieldName: this.$T("spfm.disposeInvite.view.message.licenceEndDate").$D("营业期限"),
          fieldCode: "longTermFlag",
          render:(val, record) => record.longTermFlag === 1 ? this.$T("spfm.approval.model.legal.longTermFlag").$D("长期") : record.longTermFlag === 0 ? record.licenceEndDate : ""
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.licenceUrl").$D("营业执照扫描件"),
          fieldCode: "licenceUrl",
          render:(val, record) => {
            if (record.licenceUrl !== null && typeof record.licenceUrl !== "undefined") {
              return <span style="color: blue">{this.$T("hipspfm.common.message.preview").$D("预览")}</span>;
            }
            return <span style="color:var(--color-font-default-b)">{this.$T("hipspfm.common.message.preview").$D("预览")}</span>;
          },
          callBack:(record) => {
            if (record.licenceUrl !== null && typeof record.licenceUrl !== "undefined") {
              this.handlePreview(record.licenceUrl);
            }
          }
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.taxpayerTypeMeaning").$D("纳税人标识"),
          fieldCode: "taxpayerTypeMeaning",
        },
        {
          fieldName: "D-U-N-S",
          fieldCode: "dunsCode",
          langCode: "sslm.supplierDetail.model.suDe.companyInfo.duns",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.registeredRegionName").$D("注册地址"),
          fieldCode: "registeredRegionName",
          render:(val, record) => record.registeredRegionName + record.addressDetail
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.businessScope").$D("经营范围"),
          fieldCode: "businessScope",
        },
      ];

      return columns;
    },
    // 业务信息
    getBusinessInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.mainIdentity").$D("主要身份"),
          fieldCode: "saleFlag",
          render:(val, record) => {
            if (record.purchaseFlag === 1 && record.saleFlag === 1) {
              return this.$T("spfm.approval.model.business.primaryIdentity.purchaseFlag").$D("我要销售") + "/" + this.$T("spfm.approval.model.business.primaryIdentity.saleFlag").$D("我要采购");
            }
            return record.saleFlag === 1 ? this.$T("spfm.approval.model.business.primaryIdentity.purchaseFlag").$D("我要销售") : record.purchaseFlag === 1 ? this.$T("spfm.approval.model.business.primaryIdentity.saleFlag").$D("我要采购") : "";
          }
        },
        {
          fieldName: this.$T("spfm.approval.model.business.businessNature").$D("经营性质"),
          fieldCode: "businessNature",
          render:() => this.businessNature
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.industryType").$D("行业类型"),
          fieldCode: "industryList",
          render:(val, record) => this.merge(record.industryList, "industryName")
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.mainCategory").$D("主营品类"),
          fieldCode: "industryCategoryList",
          render:(val, record) => this.merge(record.industryCategoryList, "categoryName")
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.website").$D("公司官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("spfm.disposeInvite.view.message.description").$D("公司简介"),
          fieldCode: "description",
        },
        {
          fieldName: this.$T("hipspfm.disposeInvite.view.message.companyLoGo").$D("公司logo"),
          fieldCode: "logoUrl",
          render:(val, record) => {
            if (record.logoUrl !== null && typeof record.logoUrl !== "undefined") {
              return <span style="color: blue">{this.$T("hipspfm.common.message.preview").$D("预览")}</span>;
            }
            return <span style="color:var(--color-font-default-b)">{this.$T("hipspfm.common.message.preview").$D("预览")}</span>;
          },
          callBack:(record) => {
            if (record.logoUrl !== null && typeof record.logoUrl !== "undefined") {
              this.handlePreview(record.logoUrl);
            }
          }
        },
      ];
      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    this.searchType = this.$route.query.searchType;
    this.inviteId = this.$route.query.inviteId;
    try {
      await this.getInvitesDetail();
      // await this.getSupplier();
      this.$loading.hide();
    } catch (err) {
      console.log(err, "error");
    }
    this.inviteCompanyName = this.$route.query.inviteCompanyName || this.headInfo.inviteCompanyName;
    this.companyName = this.$route.query.companyName || this.headInfo.companyName;
    this.$loading.hide();
    this.showTabInfo =
      this.searchType === "send" && this.headInfo.inviteType === "SUPPLIER" ||
      this.searchType === "receive" && this.headInfo.inviteType === "CUSTOMER";
    if (this.headInfo.investigateTemplateId && this.headInfo.processStatus !== "INVESTIGATE" || this.headInfo.processStatus === "INVESTIGATE") {
      if (this.headInfo.processStatus !== "REGISTERED" && this.headInfo.processStatus !== "CERTIFICATION" && this.headInfo.processStatus !== "CERTIFICATED") {
        this.showQuestionnaire = true;
      }
    }
    //是否展示tab页签信息
    this.showHeadInfo = this.showTabInfo && this.lineInfo && JSON.stringify(this.lineInfo) !== "{}";
    //是否有邀请信息（我发出的邀约，已认证状态、认证状态、及注册、废弃状态的非客户类型）
    this.isInviteRegFlag = this.searchType === "send" && this.headInfo.inviteReg && ([ "CERTIFICATED", "CERTIFICATION" ].includes(this.headInfo.processStatus) || [ "REGISTERED", "DISABLED" ].includes(this.headInfo.processStatus) && this.headInfo.inviteType !== "CUSTOMER");
    //是否发送调查表
    this.isSendInvestigateFlag = this.isInviteRegFlag ? this.headInfo.inviteReg.autosendInvestigateFlag : this.headInfo.sendInvestigateTemplateFlag;
    //展示邀请信息内容
    if (this.headInfo !== null && this.searchType === "send") {
      //判断邀请类型（CUSTOMER：客户 | SUPPLIER：供应商 | REGISTER：注册）
      this.showHeadTabInfo.showInvitationSupFlag = this.headInfo.inviteType === "SUPPLIER"; //邀请供应商信息
      this.showHeadTabInfo.showInvitationCusFlag = this.headInfo.inviteType === "CUSTOMER"; //邀请客户信息
      this.showHeadTabInfo.showInvitationResCerFlag = Boolean(this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus === "CERTIFICATED"); //邀请注册-已认证信息
      this.showHeadTabInfo.showInvitationResFlag = Boolean(this.headInfo.inviteType === "REGISTER" && this.headInfo.processStatus !== "CERTIFICATED"); //邀请注册-注册/认证信息
    } else if (this.headInfo !== null && this.searchType === "receive") {
      this.showHeadTabInfo.showBecomeSupFlag = this.headInfo.inviteType === "SUPPLIER"; //邀请供应商信息
      this.showHeadTabInfo.showBecomeCusFlag = this.headInfo.inviteType === "CUSTOMER"; //邀请客户信息
    }
    this.showOpterateBtn =
      this.searchType === "receive" &&
      this.headInfo.processStatus === "PENDING" &&
      !this.headInfo.investigateTemplateId;

    this.showAgreeViewFlag = !(this.searchType === "receive" && this.headInfo.inviteType === "SUPPLIER");
    if (this.showQuestionnaire) {
      this.$dialog({
        title: this.$T("hipspfm.common.message.tips").$D("提示"),
        type: "alert",
        content:
          this.$T("hipspfm.disposeInvite.validation.message.goToPC").$D(
            "请前往PC端进行操作"
          ) + "!",
        okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
        onOk() {}
      });
    }
  },
  methods: {
    // /**
    //  * 获取单据状态描述
    //  * 邀请类型：inviteType（注册：REGISTER|供应商：SUPPLIER|客户：CUSTOMER）
    //  * 单据状态：processStatus
    //  * 根据邀请类型和状态，显示对应的文字状态描述，对应描述如下：
    //  *
    //  * 以下状态不区分页面：
    //  * 同意(APPROVED)--该邀约已同意
    //  * 调查表审批中(INVESTIGATE_APPROVING)--正在处理
    //  * 拒绝(REJECT)--该邀约已拒绝
    //  * 已认证(CERTIFICATED)--已完成企业认证
    //  * 待定(PENDING)--无
    //  * 认证(CERTIFICATION)--无
    //  * 注册(REGISTERED)--无
    //  *
    //  * 我发出的邀约页面
    //  * 调查(INVESTIGATE)--正在处理
    //  * 提交(SUBMIT)--无（邀请供应商）/ 提交--正在处理(邀请客户)
    //  *
    //  * 我收到的邀约
    //  * 调查--无(成为供应商) / 调查--正在处理(成为客户)
    //  * 提交--正在处理(成为供应商) / 提交--无(成为客户)
    //  */
    getStatusDes(inviteType, processStatus) {
      let currentProcessStatus;
      let statuClassaStyle;
      if (processStatus === "APPROVED") {
        currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.approved").$D("该邀约已同意");
        statuClassaStyle = "srm-span-status srm-status-c";
      } else if (processStatus === "REJECT") {
        currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.reject").$D("该邀约已拒绝");
        statuClassaStyle = "srm-span-status srm-status-b";
      } else if (processStatus === "INVESTIGATE_APPROVING") {
        currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.processing").$D("正在处理");
        statuClassaStyle = "srm-span-status srm-status-a";
      } else if (processStatus === "CERTIFICATED") {
        currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.certificated").$D("已完成企业认证");
        statuClassaStyle = "srm-span-status srm-status-c";
      } else if (this.searchType === "send") {
        if (processStatus === "INVESTIGATE" || processStatus === "SUBMIT" && inviteType === "CUSTOMER") {
          currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.processing").$D("正在处理");
          statuClassaStyle = "srm-span-status srm-status-a";
        }
      } else if (this.searchType === "receive") {
        if (processStatus === ("INVESTIGATE" && inviteType === "CUSTOMER") || processStatus === "SUBMIT" && inviteType === "SUPPLIER") {
          currentProcessStatus = this.$T("spfm.disposeInvite.view.message.tag.processing").$D("正在处理");
          statuClassaStyle = "srm-span-status srm-status-a";
        }
      }
      this.headerStatuClassaStyle = statuClassaStyle;
      this.headerProcessStatus = currentProcessStatus;
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
            this.inviteInfo.purchaseAgentIds.push(item.purchaseAgentId);
            this.inviteInfo.purchaseAgentNames.push(item.purchaseAgentName);
          });
          this.inviteInfo.purchaseAgentIdsStr = this.inviteInfo.purchaseAgentIds.join(",");
          this.inviteInfo.purchaseAgentNamesStr = this.inviteInfo.purchaseAgentNames.join(",");
          this.$loading.hide();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 清空采购员
    clearPurchase() {
      this.inviteInfo.purchaseAgentIds = [];
      this.inviteInfo.purchaseAgentNames = [];
      this.inviteInfo.purchaseAgentIdsStr = "";
      this.inviteInfo.purchaseAgentNamesStr = "";
    },
    checkIntroCategory(params) {
      this.$loading.show();
      checkIntroCategoryApi(params).then((res) => {
        if (res.failed) {
          // this.invitingInfo.supplierCategoryIdsStr = "";
          // this.invitingInfo.supplierCategoryNamesStr = "";
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
    handlePreview(url) {
      let currentUrlList = [];
      this.previewImg = this.buildImgUrl(url, SrmUtil.getDefaultBucketName());
      currentUrlList.push(this.previewImg);
      this.previewImage(currentUrlList);
    },
    previewImage(urlList) {
      this.$previewImage(urlList,
        { index: 0 });
    },
    merge: function(val, industryName) {
      let arr = [];
      if (val && industryName === "industryName") {
        val.forEach((element) => {
          arr.push(element.industryName);
        });
      } else if (val && industryName === "categoryName") {
        val.forEach((element) => {
          arr.push(element.categoryName);
        });
      }
      const returnVal = arr.join("/");
      return returnVal;
    },
    // 点击查验
    clickCubmit(type) {
      const that = this;
      if (type === "agree") {
        // 校验必输字段
        if (!this.$refs.inputView.validate()) {
          return;
        }
        this.$dialog({
          content: this.$T("hipspfm.common.button.confirm").$D("确认") + this.$T("spfm.disposeInvite.view.message.agree").$D("同意合作") + "？",
          onOk() {
            that.agree();
          },
        });
      } else if (type === "reject") {
        this.$dialog({
          content: this.$T("hipspfm.common.button.confirm").$D("确认") + this.$T("hipspfm.common.message.reject").$D("拒绝") + "？",
          onOk() {
            that.reject();
          },
        });
      }
    },
    // 拒绝
    reject() {
      let params = {
        objectVersionNumber: this.headInfo.objectVersionNumber,
        processMsg: this.rejectReason
      };
      this.$loading.show();
      getInvitationRejectApi(params, this.inviteId).then((res) => {
        if (res && res.inviteId) {
          this.$notification.open({
            message: this.$T(
              "hipspfm.disposeInvite.view.message.rejectSuccess"
            ).$D("拒绝成功"),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 2
          });
          this.$router.push("InvitationSummaryList");
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.disposeInvite.view.message.rejectFailed"
            ).$D("拒绝失败"),
            description: res.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 2
          });
          this.$loading.hide();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 同意
    agree() {
      let params;

      const supplierCategoryIdList = this.inviteInfo.supplierCategoryIds;

      const newMultiSupplierCategoryId = !(Number(this.headInfo.supplierCategorySingleFlag) === 1) ? isArray(supplierCategoryIdList) ? supplierCategoryIdList.join() : null : this.inviteInfo.supplierCategoryIdsStr;

      if (this.inviteInfo.checkedSurvey) {
        params = {
          categoryIds:this.inviteInfo.categoryIds, //准入品类id
          categoryName:this.inviteInfo.categoryNamesStr, //准入品类名称选择值
          flag: 1,
          investigateTemplateId: this.inviteInfo.investigateTemplateId, //调查表模板id
          investigateType: this.inviteInfo.investigateType, //调查表类型
          inviteId: this.inviteId,
          levelTypeFlag:this.headInfo.levelTypeFlag, // 合作层级
          multiSupplierCategoryId:newMultiSupplierCategoryId,
          objectVersionNumber: this.headInfo.objectVersionNumber,
          organizationId: Number(SrmUtil.getOrganizationId()),
          purchaseAgentId:this.inviteInfo.purchaseAgentIdsStr, //采购员id
          PurchaseAgentName:this.inviteInfo.purchaseAgentNamesStr, //采购员名称
          remark:this.inviteInfo.remark, //调查说明
          roleType:this.inviteInfo.roleType, // 供应商角色
          supplierCategoryCode:this.inviteInfo.supplierCategoryCodes, //供应商分类编码
          supplierCategoryIdList, //供应商分类id
        };
        this.$loading.show();
        getInvitationSendCheckApi(params).then((res) => {
          if (res && res.inviteId) {
            this.$notification.open({
              message: this.$T(
                "hipspfm.disposeInvite.view.message.agreeSuccess"
              ).$D("同意成功"),
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2
            });
            this.$router.push("InvitationSummaryList");
            this.$loading.hide();
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.disposeInvite.view.message.agreeFailed"
              ).$D("同意操作失败"),
              description: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2
            });
            this.$loading.hide();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        params = {
          categoryIds:this.inviteInfo.categoryIds, //准入品类id
          inviteId: this.inviteId,
          levelTypeFlag:this.headInfo.levelTypeFlag, // 合作层级
          multiSupplierCategoryId:newMultiSupplierCategoryId,
          objectVersionNumber: this.headInfo.objectVersionNumber,
          organizationId: Number(SrmUtil.getOrganizationId()),
          purchaseAgentId:this.inviteInfo.purchaseAgentIdsStr, //采购员id
          PurchaseAgentName:this.inviteInfo.purchaseAgentNamesStr, //采购员名称
          roleType:this.inviteInfo.roleType, // 供应商角色
          supplierCategoryIdList, //供应商分类id
        };
        this.$loading.show();
        approveInvitationNoSendCheckApi(params, this.inviteId).then((res) => {
          if (res && res.inviteId) {
            this.$notification.open({
              message: this.$T(
                "hipspfm.disposeInvite.view.message.agreeSuccess"
              ).$D("同意成功"),
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2
            });
            this.$router.push("InvitationSummaryList");
            this.$loading.hide();
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.disposeInvite.view.message.agreeFailed"
              ).$D("同意操作失败"),
              description: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2
            });
            this.$loading.hide();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    //获取订单信息
    async getInvitesDetail() {
      const headInfo = await getInvitesDetailApi(this.inviteId);

      this.headInfo = headInfo;
      this.companyId = headInfo.inviteSourceKey;
      this.inviteInfo.supplierCategoryIds = headInfo && headInfo.multiSupplierCategoryId && headInfo.multiSupplierCategoryId.split(",") || [];
      if (this.searchType === "receive") {
        this.companyId = headInfo.sourceKey;
      }
      //获取行信息，companyId存在时获取
      if (typeof this.companyId !== "undefined" && this.companyId !== null) {
        await this.getSupplier();
      }
    },
    async getSupplier() {
      const lineInfo = await getSupplierApi(this.companyId);
      this.lineInfo = lineInfo;
      //经营性质
      let arr = [];
      if (this.lineInfo.business.manufacturerFlag === 1) {
        arr.push(this.$T("spfm.approval.model.business.businessNature.manufuctuerFlag").$D("制造商"));
      }
      if (this.lineInfo.business.traderFlag === 1) {
        arr.push(this.$T("spfm.approval.model.business.businessNature.traderFlag").$D("贸易商"));
      }
      if (this.lineInfo.business.servicerFlag === 1) {
        arr.push(this.$T("spfm.approval.model.business.businessNature.servicerFlag").$D("服务商"));
      }
      if (this.lineInfo.business.agentFlag === 1) {
        arr.push(
          this.$T("spfm.disposeInvite.view.message.agent").$D("代理商")
        );
      }
      if (arr.length > 1) {
        this.businessNature = arr.join("/");
      } else if (arr.length === 1) {
        this.businessNature = arr[0];
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-textarea-text{
  padding-left: 5px;
  padding-right: 5px;
}

.srm-span-noContent {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
}

.srm-title-div {
  line-height: 16px;
  background: #EFF3FE;
  padding: 6px 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: bold
  color: var(--color-other-default-b);
}

.srm-pop-span-first {
  background:var(--color-bg-default-c);
  padding: 5px 15px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: var(--color-other-default-b);
  line-height: 20px;
}

.srm-pop-customize {
  margin-top:10px;
}

.srm-main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}

.srm-column-div-box {
  display: flex;
  flex-direction: row;
  padding-bottom: 11px;
  margin: 14px 0 0px 0px;
  border-bottom:1px solid var(--color-border-default);
  padding-right: 20px;
  align-items: center;

  .srm-span-image-headImg {
    height: 20px;

    img {
      width: 20px;
      height: 20px;
    }

    margin-right: 8px;
  }
}

.srm-span-block {
  border-radius: 2px;
  margin-right: 8px;
  padding: 1px 4px;
  font-weight: normal;
  font-size: 10px !important;
  line-height: 18px;
  position: relative;
  display: inline-block;
  bottom: 1px;
}

.srm-span-block-content {
  font-size: 14px;
}

.srm-code-status-a {
  background:var(--color-bg-default-c);
  color: var(--color-other-default-b);
}

.srm-code-status-b {
  background:var(--color-bg-default-g);
  color: var(--color-other-default-c);
}

.srm-code-status-c {
  background:var(--color-bg-default-e);
  color: var(--color-other-default);
}

.srm-code-status-d {
  background:var(--color-bg-default-h);
  color: var(--color-other-default-d);
}

.srm-span-flex {
  display: flex;
  justify-content: space-between;
}

.srm-span-text {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 22px;
}

.srm-span-status {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-other-default-b);
  text-align: right;
  line-height: 22px;
}

.srm-status-a {
  color: var(--color-other-default-c) !important;
}

.srm-status-b {
  color: var(--color-other-default) !important;
}

.srm-status-c {
  color: #05944F;
}

</style>
