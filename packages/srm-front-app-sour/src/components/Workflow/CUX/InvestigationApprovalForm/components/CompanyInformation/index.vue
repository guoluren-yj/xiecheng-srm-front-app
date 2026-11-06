
<template>
  <!-- 内容区域 -->
  <div class="srm-detail-wrap-context">
    <srm-scroll-tab>
      <!-- 登记信息 -->
      <srm-scroll-tab-item :label="$T('spfm.enterprise.view.message.registerInfo').$D('登记信息')">
        <srm-list :scrollable="false" :data-set="registerDs" :columns="getRegisterColumns"/>
      </srm-scroll-tab-item>
      <!-- 业务信息 -->
      <srm-scroll-tab-item :label="$T('spfm.enterprise.view.message.business').$D('业务信息')">
        <srm-list :scrollable="false" :data-set="registerDs" :columns="getBusinessColumns"/>
      </srm-scroll-tab-item>
      <!-- 联系人信息 -->
      <srm-scroll-tab-item :label="$T('spfm.enterprise.view.message.contact').$D('联系人信息')">
        <srm-list :scrollable="false" :data-set="contactDs" :columns="getContactColumns"/>
      </srm-scroll-tab-item>
      <!-- 附件信息 -->
      <srm-scroll-tab-item :label="$T('spfm.enterprise.view.message.attachment').$D('附件信息')">
        <srm-list :scrollable="false" :data-set="attachmentDs" :columns="getAttachmentColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { commonDs } from "./datasource";
import { getCompanyInfoApi } from "../api/index";
import { isUndefined, isEmpty, isNil } from "lodash";
import { handleMobilephone } from "@/utils/sslmUtils.js";
import { yesOrNoRenderer } from "@/utils/renderer.js";

export default {
  modules: [ "spfm.enterprise", "entity.company", "entity.attachment", "spfm.certificateAuthority" ],
  name: "CompanyInformation",
  props: {
    basicInfo: {
      type:Object,
      default: () => ({})
    },
  },
  data() {
    return {
      registerDs: new DataSet(commonDs()),
      contactDs: new DataSet(commonDs()),
      attachmentDs: new DataSet(commonDs()),
    };
  },
  computed: {
    getRegisterColumns() {
      const columns = [
        {
          fieldName: $T("entity.company.companyName").$D("公司名称"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.disposeInvite.view.message.companyNum").$D("公司编码"),
          fieldCode: "companyNum",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.companyTypeMeaning").$D("公司类型"),
          fieldCode: "companyTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.registeredCountryName").$D("注册国家"),
          fieldCode: "registeredCountryName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.registeredRegionName").$D("注册地址"),
          fieldCode: "registeredRegionName",
          fieldType: "TEXT",
          render: (val, record) => `${record.registeredRegionName}${record.addressDetail}`
        },
        {
          fieldName: $T("spfm.enterprise.view.message.legalRepName").$D("法定代表人"),
          fieldCode: "legalRepName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.companySearch.model.company.capitalRange").$D("注册资本"),
          fieldCode: "registeredCapital",
          fieldType: "TEXT",
          render: (val, record) => {
            const { registeredCapital, currencyName } = record;
            const result = isNil(registeredCapital) ? $T("hzero.common.currency.none").$D("无") : `${registeredCapital}${currencyName || $T("hzero.common.currency.cny").$D("人民币")}(${$T("hzero.common.currency.ten.thousand").$D("万")})`;
            return result;
          }
        },
        {
          fieldName: $T("spfm.enterprise.view.message.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.licenceEndDate").$D("营业期限"),
          fieldCode: "longTermFlag",
          fieldType: "TEXT",
          render: (val, record) => val === 1 ? $T("spfm.enterprise.view.message.longTerm").$D("长期") : record.licenceEndDate,
        },
        {
          fieldName: $T("spfm.enterprise.view.message.businessScope").$D("经营范围"),
          fieldCode: "businessScope",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.shortName").$D("简称"),
          fieldCode: "shortName",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.domesticForeignRelation").$D("境内外关系"),
          fieldCode: "domesticForeignRelation",
          fieldType: "TEXT",
          render: (val) => isUndefined(val) ? "" : val === 1 ? $T("spfm.enterprise.view.message.domestic").$D("境内") : $T("spfm.enterprise.view.message.overseas").$D("境外"),
        },
        {
          fieldName: $T("spfm.enterprise.model.legal.dunsCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.enterprise.view.message.taxpayerTypeMeaning").$D("纳税人标识"),
          fieldCode: "shortName",
          fieldType: "TEXT",
          render: (val, record) => {
            const { taxpayerTypeMeaning, licenceUrl } = record;
            return <div>
              <span>{taxpayerTypeMeaning}</span>
              {
                !isEmpty(licenceUrl) && <srm-button type="primary" plain rect onClick={() => {
                  SrmUtil.previewFile({
                    fileName: $T("spfm.certificationApproval.model.detailForm.licenceUrl").$D("营业执照扫描件"),
                    fileUrl: licenceUrl,
                    bucketName: SrmUtil.getDefaultBucketName()
                  });
                }}>{ $T("spfm.certificationApproval.model.detailForm.licenceUrl").$D("营业执照扫描件") }</srm-button>
              }
            </div>;
          },
        },
      ];
      return columns;
    },
    getBusinessColumns() {
      const columns = [
        {
          fieldName: $T("spfm.enterprise.view.message.mainIdentity").$D("主要身份"),
          fieldCode: "mainIdentityList",
          fieldType: "TEXT",
          render: (val, record) => {
            const { saleFlag, purchaseFlag } = record;
            const mainIdentityList = [
              saleFlag === 1 ? $T("spfm.enterprise.view.message.sale").$D("我要销售") : false,
              purchaseFlag === 1 ? $T("spfm.enterprise.view.message.purchase").$D("我要采购") : false,
            ];
            return mainIdentityList.filter((n) => n).join("/");
          },
        },
        {
          fieldName: $T("spfm.enterprise.view.message.businessNature").$D("经营性质"),
          fieldCode: "mainIdentityList",
          fieldType: "TEXT",
          render: (val, record) => {
            const { manufacturerFlag, traderFlag, servicerFlag, agentFlag } = record;
            const businessNatureList = [
              manufacturerFlag === 1 ? $T("spfm.enterprise.view.message.manufacturer").$D("制造商") : false,
              traderFlag === 1 ? $T("spfm.enterprise.view.message.trader").$D("贸易商") : false,
              servicerFlag === 1 ? $T("spfm.enterprise.view.message.servicer").$D("服务商") : false,
              agentFlag === 1 ? $T("spfm.enterprise.view.message.agent").$D("代理商") : false,
            ];
            return businessNatureList.filter((n) => n).join("/");
          },
        },
        {
          fieldName: $T("spfm.enterprise.view.message.industryType").$D("行业类型"),
          fieldCode: "industryList",
          fieldType: "TEXT",
          render: (val, record) => {
            const { industryList } = record || {};
            const resultMeaning = industryList.map((n, index) => {
              if (index === 0) {
                return <span key={n.industryId}>{n.industryName}</span>;
              }
              return <span key={n.industryId}>/{n.industryName}</span>;
            });
            return resultMeaning;
          }
        },
        {
          fieldName: $T("spfm.enterprise.view.message.mainCategory").$D("主营品类"),
          fieldCode: "industryCategoryList",
          fieldType: "TEXT",
          render: (val, record) => {
            const { industryCategoryList } = record || {};
            const resultMeaning = industryCategoryList.map((n, index) => {
              if (index === 0) {
                return <span key={n.categoryId}>{n.categoryName}</span>;
              }
              return <span key={n.categoryId}>/{n.categoryName}</span>;
            });
            return resultMeaning;
          }
        },
        {
          fieldName: $T("spfm.enterprise.view.message.website").$D("公司官网"),
          fieldCode: "website",
          fieldType: "TEXT",
          render: (val, record) => {
            const { logoUrl, website } = record;
            return <srm-button type="primary" plain rect onClick={() => {
              SrmUtil.previewFile({
                fileName: $T("spfm.enterprise.view.message.logo").$D("公司logo"),
                fileUrl: logoUrl,
                bucketName: SrmUtil.getDefaultBucketName()
              });
            }}>{ website }</srm-button>;
          },
        },
        {
          fieldName: $T("spfm.enterprise.view.message.description").$D("公司简介"),
          fieldCode: "description",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    getContactColumns() {
      const columns = [
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.name").$D("姓名"),
          fieldCode: "name",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.gender").$D("性别"),
          fieldCode: "gender",
          fieldType: "TEXT",
          render: (val) => val === 1 ? $T("hzero.common.gender.male").$D("男") : $T("hzero.common.gender.female").$D("女"),
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.mail").$D("邮箱"),
          fieldCode: "mail",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.mobilephone").$D("手机号码"),
          fieldCode: "mobilephone",
          fieldType: "TEXT",
          render:(val, record) => handleMobilephone(val, record)
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.telephone").$D("固定电话"),
          fieldCode: "telephone",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.idTypeMeaning").$D("证件类型"),
          fieldCode: "idTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.idNum").$D("证件号码"),
          fieldCode: "idNum",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.department").$D("部门"),
          fieldCode: "department",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.position").$D("职位"),
          fieldCode: "position",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("hzero.common.remark").$D("备注"),
          fieldCode: "description",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.contactTable.defaultFlag").$D("默认联系人"),
          fieldCode: "defaultFlag",
          fieldType: "TEXT",
          render: (val) => yesOrNoRenderer(val),
        },
        {
          fieldName: $T("hzero.common.status.enable").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render: (val) => yesOrNoRenderer(val),
        },
      ];
      return columns;
    },
    getAttachmentColumns() {
      const columns = [
        {
          fieldName: $T("entity.attachment.type").$D("附件类型"),
          fieldCode: "attachmentTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("entity.attachment.description").$D("附件描述"),
          fieldCode: "subAttachmentMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificateAuthority.model.operationRecord.processMsg").$D("说明"),
          fieldCode: "description",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.attachmentTable.endDate").$D("文件到期日"),
          fieldCode: "endDate",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.attachmentTable.uploadDate").$D("最后上传时间"),
          fieldCode: "uploadDate",
          fieldType: "TEXT",
        },
        {
          fieldName: $T("spfm.certificationApproval.model.attachmentTable.attachment").$D("附件上传"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
        },
        {
          fieldName: $T("hzero.common.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    try {
      await this.init();
    } catch (err) {
      this.$loading.hide();
    }
    this.$loading.hide();
  },
  methods: {
    init() {
      const { hostname } = window.location || {};
      const webUrl = hostname ?
        hostname.includes("mobile.") ?
          hostname.replace("mobile.", "") :
          hostname :
        null;
      const { companyId, investgHeaderId, partnerCompanyId } = this.basicInfo;
      const params = { companyId, supplierCompanyId: partnerCompanyId, investigateHeaderId: investgHeaderId, webUrl };
      getCompanyInfoApi(params).then((res) => {
        if (res && !res.failed) {
          const { basic, business, contactList, attachmentList } = res;
          const registerInfo = { ...basic, ...business };
          this.registerDs.setData([ registerInfo ] || []);
          this.contactDs.setData(contactList || []);
          this.attachmentDs.setData(attachmentList || []);
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
