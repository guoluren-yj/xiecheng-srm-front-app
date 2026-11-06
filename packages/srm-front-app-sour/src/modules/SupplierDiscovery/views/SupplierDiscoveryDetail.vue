<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('hipspfm.supplier.message.title.supplierDetail').$D('供应商信息')" />
    <div class="srm-main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="basicInfo" :columns="getDetailHeadColumns"/>
      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('spfm.approval.view.message.title.regInfo').$D('登记信息')" >
          <customize :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.REGISTER_INFO" :data-source="basicInfo" :columns="getRegisterInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spfm.approval.view.message.title.businessInfo').$D('业务信息')" >
          <customize :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.BUSINESS_INFO" :data-source="headInfo.business" :columns="getBusinessInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.supplierDetail.view.message.title.supplierContact').$D('联系人')" >
          <div v-for="(item, index) in headInfo.contactList" :key="index" @click="showSupplyConcatDetail(item)">
            <customize :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.SUPPLY_CONTACT_INFO" :data-source="item" :columns="getSupplierContactInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spfm.enterprise.view.message.attachment').$D('附件信息')" >
          <div v-for="(item, index) in headInfo.attachmentList" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.ATTACHMENT_INFO" :data-source="item" :columns="getAttachmentInfoColumns" />
          </div>
        </srm-scroll-tab-item>

        <!-- 预览模态框 -->
        <!-- <a-modal :z-index="5000" :visible="previewVisible" :footer="null" :closable="false" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImg" >
        </a-modal> -->
      </srm-scroll-tab>
    </div>

    <!-- 联系人信息弹窗 -->
    <srm-popup :visible.sync="supplyConcatVisible" height="100%" position="right" :title="$T('hipspfm.supplierLifeCycle.view.title.concatInfo').$D('联系人信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.SUPPLIER_DISCOVERY.SUPPLY_CONTACT_INFO_DETAIL" :data-source="currentSupplyConcatInfo" :columns="getSupplyConcatDetailColumns" />
      </div>
    </srm-popup>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import {
  getSupplierApi,
} from "../api";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "spfm.approval", "spfm.companySearch", "hipspfm.common", "sslm.supplierDetail", "hipspfm.supplier", "spfm.disposeInvite", "hipspfm.supplierLifeCycle", "spfm.enterprise", "ssrc.bidHall", "hzero.common", "smbl.common" ],
  name: "SupplierDiscoveryDetail",
  components: {
  },
  data() {
    return {
      headInfo: {}, // 信息
      companyId: "", //公司id
      tenantId:"", // tenantId
      companyIdTrue:"",
      basicInfo:{},
      businessNature:"", //经营性质
      supplyConcatVisible: false, //联系人信息弹窗
      currentSupplyConcatInfo:{}, //联系人信息
      previewImg:"",
      // previewVisible:false,
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          type: "primary",
          title: this.$T("spfm.companySearch.view.option.invite").$D("邀请合作"),
          handler: () => this.toInvite(this.companyIdTrue, this.basicInfo.companyName, this.tenantId)
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          render:(val, rocord) => rocord.companyName + "(" + rocord.companyTypeMeaning + ")"
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.legalRepName").$D("法定代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spfm.companySearch.model.company.capitalRange").$D("注册资本"),
          fieldCode: "registeredCapital",
          render:(val, record) => {
            const currencyNameStr = record.currencyName ? record.currencyName : this.$T("smbl.common.currency.yuan").$D("人名币");
            return record.registeredCapital ? record.registeredCapital + this.$T("hzero.common.currency.ten.thousand").$D("万") + currencyNameStr : this.$T("hipspfm.common.currency.none").$D("无");
          }
        }
      ];

      return columns;
    },
    // 注册信息
    getRegisterInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{ this.$T("hipspfm.supplier.message.supplier.shortName").$D("公司简称") }：{item.shortName}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.registeredRegionName").$D("注册地址"),
          fieldCode: "addressDetail",
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.registeredCountryName").$D("注册国家"),
          fieldCode: "registeredCountryName",
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.domesticForeignRelation").$D("境内外关系"),
          fieldCode: "domesticForeignRelation",
          render:(val, record) => record.domesticForeignRelation === 1 ? this.$T("hipspfm.supplier.message.supplier.territory").$D("境内") : record.domesticForeignRelation === 0 ? this.$T("hipspfm.supplier.message.supplier.abroad").$D("境外") : ""
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.licenceEndDate").$D("经营期限"),
          fieldCode: "longTermFlag",
          render:(val, record) => record.longTermFlag === 1 ? this.$T("spfm.approval.model.legal.longTermFlag").$D("长期") : record.longTermFlag === 0 ? record.licenceEndDate : ""
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.licenceUrl").$D("营业执照扫描件"),
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
          fieldName: this.$T("spfm.approval.model.legal.taxpayerType").$D("纳税人标识"),
          fieldCode: "taxpayerTypeMeaning",
        },
        {
          fieldName: "D-U-N-S",
          fieldCode: "dunsCode",
          langCode: "sslm.supplierDetail.model.suDe.companyInfo.duns",
        },
        {
          fieldName: this.$T("spfm.approval.model.legal.businessScope").$D("经营范围"),
          fieldCode: "businessScope",
        },
      ];

      return columns;
    },
    // 业务信息
    getBusinessInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spfm.approval.model.business.primaryIdentity").$D("主要身份"),
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
          fieldName: this.$T("spfm.approval.model.business.industryList").$D("行业类型"),
          fieldCode: "industryList",
          render:(val, record) => this.merge(record.industryList, "industryName")
        },
        {
          fieldName: this.$T("spfm.approval.model.business.industryCategoryList").$D("主营品类"),
          fieldCode: "industryCategoryList",
          render:(val, record) => this.merge(record.industryCategoryList, "categoryName")
        },
        {
          fieldName: this.$T("spfm.approval.model.business.website").$D("公司官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("spfm.approval.model.business.description").$D("公司简介"),
          fieldCode: "description",
        },
        {
          fieldName: this.$T("hipspfm.common.message.company").$D("公司"),
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
    // 联系人信息
    getSupplierContactInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <div class="srm-column-div-box">
            {record.gender === 0 && <img class="srm-span-image-headImg image-red-default" src={require("@/assets/icon_list_women_normal@3x.png")} alt="wowenHeadImg"/>}
            {record.gender !== 0 && <img class="srm-span-image-headImg image-blue-default" src={require("@/assets/icon_list_man_normal@3x.png")} alt="manHeadImg"/>}
            <span class="materiel-name">{ record.name }</span>
          </div>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码"),
          fieldCode: "mobilephone",
          render:(val, record) => (record.internationalTelMeaning ? `${record.internationalTelMeaning} | ` : "") + val
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱"),
          fieldCode: "mail",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          render:(val) => val === 1 ? <span class="srm-span-font-blue">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }</span> : <span class="srm-span-font-red">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }</span>
        },
      ];

      return columns;
    },
    // 联系人信息
    getSupplyConcatDetailColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.name").$D("姓名"),
          fieldCode: "name",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.contactsData.gender").$D("性别"),
          fieldCode: "gender",
          render:(val) => val === 0 ? this.$T("hipspfm.common.gender.female").$D("女") : this.$T("hipspfm.common.gender.male").$D("男")
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱"),
          fieldCode: "mail",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码"),
          fieldCode: "mobilephone",
          render:(val, record) => (record.internationalTelCode ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.telephone").$D("固定电话"),
          fieldCode: "telephone",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.contactsData.department").$D("部门"),
          fieldCode: "department",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.contactsData.position").$D("职位"),
          fieldCode: "position",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.contactsData.description").$D("备注"),
          fieldCode: "description",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.defaultFlag").$D("默认联系人"),
          fieldCode: "defaultFlag",
          render:(val) => val === 1 ? <span class="srm-span-font-blue">{ this.$T("hipspfm.common.status.yes").$D("是") }</span> : <span>{ this.$T("hipspfm.common.status.no").$D("否") }</span>
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          render:(val) => val === 1 ? <span class="srm-span-font-blue">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }</span> : <span class="srm-span-font-red">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }</span>
        },
      ];

      return columns;
    },
    // 附件信息
    getAttachmentInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            <span>{ this.$T("sslm.supplierDetail.model.supplierDetail.description").$D("附件描述") }：{ record.description }</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.attachmentType").$D("附件类型"),
          fieldCode: "attachmentType",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.attachmentMessage").$D("附件信息"),
          fieldCode: "attachmentUuid",
          render: (val) => {
            const currentAttachmentUuid = val || this.uuid;
            return <srm-upload attachmentUuid={currentAttachmentUuid} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />;
          },
          // callBack:(val,record) => {
          //   // this.showFilePop(val.pretrialUuid||uuid)
          // }
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.endDate").$D("文件到期日"),
          fieldCode: "endDate",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.addressDetail").$D("最后上传日"),
          fieldCode: "uploadDate",
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    this.companyId = this.$route.query.companyId;
    this.tenantId = this.$route.query.tenantId;
    this.companyIdTrue = this.$route.query.companyIdTrue;
    try {
      this.getSupplier();
    } catch (err) {
      this.$loading.hide();
      // eslint-disable-next-line no-console
      console.log(err);
    }
    this.$loading.hide();
  },
  methods: {
    // handleCancel() {
    //   this.previewVisible = false;
    // },
    handlePreview(url) {
      // const downApi = "/hfle/v1/files/redirect-url";
      // this.previewImg = this.buildImgUrl(val,"private-bucket",downApi);
      // this.previewVisible = true;
      let currentUrlList = [];
      this.previewImg = this.buildImgUrl(url, SrmUtil.getDefaultBucketName());
      currentUrlList.push(this.previewImg);
      this.previewImage(currentUrlList);
    },
    previewImage(urlList) {
      this.$previewImage(urlList,
        { index: 0 });
    },
    //跳转邀请合作页面
    toInvite(companyId, companyName, tenantId) {
      this.$router.push({ name: "InviteCooperationSupplier", query: { "companyId":companyId, "companyName":companyName, "tenantId":tenantId } });
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
    //获取订单信息
    async getSupplier() {
      await getSupplierApi(this.companyId).then((res) => {
        this.headInfo = res;
        this.basicInfo = res.basic;
        //经营性质
        let arr = [];
        if (this.headInfo.business.manufacturerFlag === 1) {
          arr.push(this.$T("spfm.approval.model.business.businessNature.manufuctuerFlag").$D("制造商"));
        }
        if (this.headInfo.business.traderFlag === 1) {
          arr.push(this.$T("spfm.approval.model.business.businessNature.traderFlag").$D("贸易商"));
        }
        if (this.headInfo.business.servicerFlag === 1) {
          arr.push(this.$T("spfm.approval.model.business.businessNature.servicerFlag").$D("服务商"));
        }
        if (this.headInfo.business.agentFlag === 1) {
          arr.push(
            this.$T("spfm.disposeInvite.view.message.agent").$D("代理商")
          );
        }
        if (arr.length > 1) {
          this.businessNature = arr.join("/");
        } else if (arr.length === 1) {
          this.businessNature = arr[0];
        }
      });
    },
    // 查看联系人详情
    showSupplyConcatDetail(item) {
      this.supplyConcatVisible = !this.supplyConcatVisible;
      this.currentSupplyConcatInfo = item;
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-span-font-blue {
  color: var(--color-other-default-b) !important;
}

.srm-span-font-red {
  color: var(--color-other-default) !important;
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

</style>
