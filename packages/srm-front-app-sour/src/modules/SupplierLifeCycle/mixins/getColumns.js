import { $T } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { yesOrNoRenderer } from "@/utils/renderer";
import { enableRender } from "@/components/utils/render";

export default {
  computed:{
    // 注册信息
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
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.companyType").$D("类型"),
          fieldCode: "companyTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.shortName").$D("简称"),
          fieldCode: "shortName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.registeredCountryName").$D("注册地址"),
          fieldCode: "registeredCountryName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.legalRepName").$D("法定代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.registeredCapital").$D("注册资本(万元)"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.companyInfo.licenceEndDate").$D("经营期限"),
          fieldCode: "longTermFlag",
          render: (val, record) => record.longTermFlag === 1 ? this.$T("sslm.supplierDetail.model.suDe.companyInfo.longTermFlag").$D("长期") : record.longTermFlag === 0 ? record.licenceEndDate : ""
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.domesticForeignRelation").$D("境内外关系"),
          fieldCode: "domesticForeignRelation",
          render: (val, record) => record.domesticForeignRelation === 1 ? this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.domestic").$D("境内") : record.domesticForeignRelation === 0 ? this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.overseas").$D("境外") : ""
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.taxpayerTypeMeaning").$D("纳税人标识"),
          fieldCode: "taxpayerTypeMeaning",
        },
        {
          fieldName: "D-U-N-S",
          fieldCode: "dunsCode",
          langCode: "sslm.supplierDetail.model.suDe.companyInfo.duns",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.businessScope").$D("经营范围"),
          fieldCode: "businessScope",
        },
      ];

      return columns;
    },
    // 业务信息
    getBusinessInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.mainRule").$D("主要身份"),
          fieldCode: "saleFlag",
          render:(val, record) => {
            if (record.purchaseFlag === 1 && record.saleFlag === 1) {
              return this.$T("sslm.supplierDetail.model.companyInfo.saleFlag").$D("销售") + "/" + this.$T("sslm.supplierDetail.model.companyInfo.purchaseFlag").$D("采购");
            }
            return record.saleFlag === 1 ? this.$T("sslm.supplierDetail.model.companyInfo.saleFlag").$D("销售") : record.purchaseFlag === 1 ? this.$T("sslm.supplierDetail.model.companyInfo.purchaseFlag").$D("采购") : "";
          }
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.businessNature").$D("经营性质"),
          fieldCode: "businessNature",
          render:() => this.businessNature
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.industryName").$D("行业类型"),
          fieldCode: "industryList",
          render:(val, record) => this.merge(record.industryList, "industryName")
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.categoryName").$D("主营品类"),
          fieldCode: "industryCategoryList",
          render:(val, record) => this.merge(record.industryCategoryList, "categoryName")
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.website").$D("公司官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.view.message.title.description").$D("公司简介"),
          fieldCode: "description",
        },
      ];
      return columns;
    },
    // 财务状况信息
    getFinanceInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.year").$D("年份"),
          fieldCode: "year",
          fieldType: "EMPTY",
          render: (val, record) => {
            // eslint-disable-next-line new-cap
            const assetLiabilityRatioTemp = this.$options.filters["CalcMoney"](record.assetLiabilityRatio * 100);
            return <SrmListHeader showOpenTag={false}>
              <span>{ this.$T("sslm.supplierDetail.model.companyInfo.year").$D("年份") }：{record.year}</span>
              <span class="srm-span-bigBlock">{ this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.assetLiabilityRatio").$D("资产负债率") }：{ assetLiabilityRatioTemp }%</span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.totalAssets").$D("企业总资产"),
          fieldCode: "totalAssets",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.totalLiabilities").$D("总负债"),
          fieldCode: "totalLiabilities",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.currentAssets").$D("流动资产"),
          fieldCode: "currentAssets",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.currentLiab").$D("流动负债"),
          fieldCode: "currentLiabilities",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.companyInfo.revenue").$D("营业收入"),
          fieldCode: "revenue",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.netProfit").$D("净利润"),
          fieldCode: "netProfit",
        },
      ];
      return columns;
    },
    // 供应商分类信息
    getSupplierClassInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
            <span style={{ fontWeight:600 }}>{item.categoryDescription}</span>
            <span style={{ marginLeft:"auto" }}> {enableRender(item.enabledFlag)}</span>
          </div>
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluationLevel").$D("评级"),
          fieldCode: "evaluationLevel",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluationScore").$D("评分"),
          fieldCode: "evaluationScore",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.categoryCode").$D("供应商分类代码"),
          fieldCode: "categoryCode",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterReason").$D("变更理由"),
          fieldCode: "alterReason",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterDate").$D("变更时间"),
          fieldCode: "alterDate",
          render: (val) => dateFormat(val)
        },
      ];
      return columns;
    },
    // 供货能力清单信息
    getSupplyCapacityInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader >
            <span>{ record.itemCode }</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          render:(val, record) => record.supplyFlag === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
          fieldCode: "supplyStatus",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
      ];
      return columns;
    },
    // 供能力清单详情信息
    getSupplyCapacityListDetailColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          render:(val, record) => record.supplyFlag === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
          fieldCode: "countryIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
          fieldCode: "regionIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
          fieldCode: "cityIdMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
          fieldCode: "supplyStatus",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supAbility.psaEvaluationLevel").$D("PSA评级"),
          fieldCode: "psaEvaluationLevel",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
          fieldCode: "psaEvaluationScore",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
          fieldCode: "psaFinishDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationLevel").$D("SPA评级"),
          fieldCode: "spaEvaluationLevel",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationScore").$D("SPA评分"),
          fieldCode: "spaEvaluationScore",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
          fieldCode: "spaFinishDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluateRemark").$D("评价信息"),
          fieldCode: "evaluateRemark",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件"),
          fieldCode: "attachmentUuid",
          render: (val) => <srm-upload attachmentUuid={val} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />,
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
          render:(val, record) => (record.internationalTelCode ? `${record.internationalTelCode} | ` : "") + val
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
    // 地址信息
    getAddressInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{record.addressDetail}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.addressData.countryName").$D("国家"),
          fieldCode: "countryName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.addressData.regionName").$D("省/市"),
          fieldCode: "regionPathName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.addressData.postCode").$D("邮政编码"),
          fieldCode: "postCode",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          render:(val) => val === 1 ? <span class="srm-span-font-blue">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }</span> : <span class="srm-span-font-red">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }</span>
        },
      ];

      return columns;
    },
    // 银行账户信息
    getBankAccountInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{ record.bankName}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankBranchName").$D("开户行名称"),
          fieldCode: "bankBranchName",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户"),
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态"),
          fieldCode: "enabledFlag",
          render:(val) => val === 1 ? <span class="srm-span-font-blue">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }</span> : <span class="srm-span-font-red">{ this.$T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }</span>
        },
      ];

      return columns;
    },
    // 附件信息（企业认证）
    getAttachmentInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{ this.$T("sslm.supplierDetail.model.supplierDetail.description").$D("附件描述") }：{ record.description }</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.attachmentType").$D("附件类型"),
          fieldCode: "attachmentType",
          render: (val, record) => {
            if (record.attachmentTypeMeaning && record.subAttachmentMeaning) {
              return <span>{`${record.attachmentTypeMeaning} / ${record.subAttachmentMeaning}`}</span>;
            }
            return <span>{record.attachmentTypeMeaning || record.subAttachmentMeaning}</span>;
          },
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.attachmentMessage").$D("附件信息"),
          fieldCode: "attachmentUuid",
          render: (val) => {
            const currentAttachmentUuid = val || this.uuid;
            return <srm-upload attachmentUuid={currentAttachmentUuid} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />;
          },
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
    // 其他信息
    getOtherInfoColumns() {
      const columns = [
        {
          fieldCode: "blacklistExpiryDate",
          fieldName: this.$T("sslm.commonApplication.model.coApp.blacklistExpiryDate").$D("黑名单失效时间"),
        },
        {
          fieldCode: "termName",
          fieldName: this.$T("sslm.common.model.paymentTerms").$D("付款条款"),
        },
        {
          fieldCode: "typeName",
          fieldName: this.$T("sslm.common.model.paymentWay").$D("付款方式"),
        },
        {
          fieldCode: "tempFlag",
          fieldName: this.$T("sslm.common.stage.temporary").$D("临时"),
          render:(val) => yesOrNoRenderer(val),
        },
        {
          fieldCode: "tempEndDate",
          fieldName: this.$T("sslm.common.model.dateTo").$D("有效期至"),
        },
      ];

      return columns;
    },
    // 采购财务头信息Columns
    getPurchaseHeaderColumns() {
      return [
        {
          fieldCode: "programmeGroupsMeaning",
          fieldName: $T("spfm.importErp.model.importErp.planGroups").$D("计划组"),
          formRow: 10,
        },
        {
          fieldCode: "schemeGroup",
          fieldName: $T("sslm.supplierInform.model.supplierInform.schemeGroup").$D("方案组"),
          formRow: 10,
        },
        {
          fieldCode: "accountGroupMeaning",
          fieldName: $T("sslm.supplierInform.model.supplierInform.accountGroup").$D("账户组"),
          formRow: 20,
        },
        {
          fieldCode: "reconciliationAccountMeaning",
          fieldName: $T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
          formRow: 30,
        },
        {
          fieldCode: "ouCode",
          fieldName: $T("sslm.supplierInform.model.supplierInform.erpCompanyCode").$D("erp公司代码"),
          formRow: 40,
        },
        {
          fieldCode: "termName",
          fieldName: $T("sslm.common.model.paymentTerms").$D("付款条款"),
          formRow: 50,
        },
        {
          fieldCode: "frozenFlag",
          fieldName: $T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
          formRow: 60,
          render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
        },
        {
          fieldCode: "paymentFrozenMeaning",
          fieldName: $T("spfm.importErp.model.importErp.paymentFreezeCode").$D("记账冻结代码"),
          formRow: 60,
        },
      ];
    },
    // 采购财务行信息Columns
    getPurchaseColumns () {
      return [
        {
          fieldCode: "organizationName",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) => <SrmListHeader showOpenTag={false} style={{ fontWeight:600 }}>
            <span>{item.organizationName}</span>
          </SrmListHeader>
        },
        {
          fieldCode: "purchaseAgentName",
          formRow: 20,
        },
        {
          fieldCode: "termName",
          formRow: 30,
        },
        {
          fieldCode: "typeName",
          formRow: 30,
        },
        {
          fieldCode: "tradeTermsMeaning",
          formRow: 40,
        },
        {
          fieldCode: "tradeTermsSite",
          formRow: 40,
        },
        {
          fieldCode: "currencyName",
          formRow: 50,
        },
        {
          fieldCode: "reconciliationAccountMeaning",
          formRow: 60,
        },
        {
          fieldCode: "sortNumber",
          formRow: 70,
        },
        {
          fieldCode: "frozenFlag",
          formRow: 70,
          render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
        },
      ];
    },
    // 天齐锂业 == 供应商来源说明
    getSupplierSourceDescColumns() {
      return [
        {
          fieldCode: "attributeVarchar5Meaning",
          fieldName: this.$T("sslm.common.cux.tqly.supplierSource").$D("供应商来源"),
        },
        {
          fieldCode: "attributeVarchar6",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          fieldName: this.$T("sslm.common.cux.tqly.sourceAttachment").$D("来源附件"),
        },
        {
          fieldCode: "attributeLongtext3",
          fieldName: this.$T("sslm.common.cux.tqly.sourceDesc").$D("来源说明"),
        },
      ];
    }
  }
};