<script>
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { camelCase, snakeCase } from "lodash";
import headerDS from "./datasource/headerDS";
import ButtonSwitch from "@/components/V5/ButtonSwitch";
import {
  getInvestigateConfig,
  compareSupplierInfo,
  compareInvestigateInfo
} from "./api";

export default {
  modules: [ "sslm.enterpriseInform", "smbl.common", "spfm.enterprise", "sslm.supplierDetail", "sslm.common", ],
  name: "EnterpriseInformationConfirm",
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      changeFlag: 1,
      headerDataSet: new DataSet(headerDS()),
      investigateConfig: {},
      supplierCompares: [],
      investigateCompares: [],
      investigateRequestMap: {
        sslmInvestgBasic: "basics",
        sslmInvestgBusiness: "business",
        sslmInvestgProservice: "proservices",
        sslmInvestgFin: "finances",
        sslmInvestgFinBranch: "finances-branchs",
        sslmInvestgAddress: "addresses",
        sslmInvestgAuth: "authes",
        sslmInvestgContact: "contacts",
        sslmInvestgBankAccount: "bank-accounts",
        sslmInvestgSubSupplier: "sub-suppliers",
        sslmInvestgCustomer: "customers",
        sslmInvestgEquipment: "equipments",
        sslmInvestgRd: "rds",
        sslmInvestgQa: "qas",
        sslmInvestgProduce: "produces",
        sslmInvestgCustservice: "custservices",
        sslmInvestgAttachment: "attachments",
      },
      supplierRequestMap: {
        supplierBasic: {
          code:"registInfo",
          title: $T("sslm.enterpriseInform.view.model.companyInfo.title").$D("登记信息"),
          url: "/sup-basic-req/compare-supplier-basic",
          type: "form",
          fieldName: "Basic",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.REGISTRATION",
          customizeUnitCode:"SSLM.ENTERPRISE_INFORM_CHANGE_DETAIL.REGISTRATION_OVERSEAS",
          columns: [
            {
              formRow: 1,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区"),
              fieldCode: "domesticForeignRelation",
              render: (val) => val ? $T("sslm.enterpriseInform.view.model.companyInfo.innerOrg").$D("境内") :
                $T("sslm.enterpriseInform.view.model.companyInfo.outerOrg").$D("境外")
            }, {
              formRow: 2,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.socialCode").$D("统一社会信用代码"),
              fieldCode: "unifiedSocialCode",
            }, {
              formRow: 3,
              fieldName: $T("sslm.enterpriseInform.model.application.enterpriseName").$D("企业名称"),
              fieldCode: "companyName",
            }, {
              formRow: 4,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.englishName").$D("英文名称"),
              fieldCode: "companyEnglishName",
            }, {
              formRow: 5,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.shortName").$D("企业简称"),
              fieldCode: "shortName",
            }, {
              formRow: 6,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.organizingCode").$D("企业简称"),
              fieldCode: "organizingInstitutionCode",
            }, {
              formRow: 7,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.dunsCode").$D("邓白氏编码"),
              fieldCode: "dunsCode",
            }, {
              formRow: 8,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.companyType").$D("企业类型"),
              fieldCode: "companyTypeMeaning",
            }, {
              formRow: 9,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.addressDetail").$D("详细地址"),
              fieldCode: "addressDetail",
            }, {
              formRow: 10,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.registeredRegionName").$D("注册地址"),
              fieldCode: "registeredRegionName",
              render: (val) => val && `${this.$T("smbl.common.country.china").$D("中国")}|${val}`
            }, {
              formRow: 11,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.taxpayerType").$D("纳税人标识"),
              fieldCode: "taxpayerTypeMeaning",
            }, {
              formRow: 12,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.legalRepName").$D("法定代表人"),
              fieldCode: "legalRepName",
            }, {
              formRow: 13,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.registeredCapital").$D("注册资本(万)"),
              fieldCode: "registeredCapital",
            }, {
              formRow: 14,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.currencyCode").$D("注册资本币种"),
              fieldCode: "currencyName",
            },
            {
              formRow: 15,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.buildDate").$D("成立日期"),
              fieldCode: "buildDate",
            },
            {
              formRow: 16,
              fieldName: $T("sslm.enterpriseInform.view.registInform.businessTerm").$D("营业期限"),
              fieldCode: "licenceEndDate",
            }, {
              formRow: 17,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.longTermFlag").$D("长期"),
              fieldCode: "longTermFlag",
              render: this.renderYesOrNo
            },
            // {
            //   formRow: 18,
            //   fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.businessScope").$D("经营范围"),
            //   fieldCode: "businessScope",
            // },
            {
              formRow: 18,
              fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.licenceUrl").$D("营业执照"),
              fieldCode: "licenceUrl",
              render: (val) => val &&
                <SrmButton
                  plain rect
                  onClick={() => this.$previewImage([ SrmUtil.buildImgUrl(val, SrmUtil.getDefaultBucketName()) ])}>
                  {this.$T("sslm.enterpriseInform.button.see").$D("查看")}
                </SrmButton>
            },
          ],
        }, //登记信息
        supplierBusiness: {
          code:"registeBusinessInfo",
          title: $T("sslm.enterpriseInform.view.model.business.title").$D("注册业务信息"),
          url: "/sup-business-req/compare-supplier-business",
          type: "form",
          fieldName: "Business",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.BUSINESS",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CHANGE_DETAIL.BUSINESS_INFO",
          columns: [
            {
              formRow: 1,
              fieldName: $T("sslm.enterpriseInform.view.model.business.businessType").$D("主要身份"),
              fieldCode: "saleFlag",
              render: (val, item) => {
                const list = [];
                val && list.push($T("sslm.enterpriseInform.view.model.business.sale").$D("我要销售"));
                item.purchaseFlag && list.push($T("sslm.enterpriseInform.view.model.business.purchase").$D("我要采购"));
                return list.join(" ");
              },
            }, {
              formRow: 2,
              fieldName: $T("sslm.enterpriseInform.view.model.business.serviceType").$D("经营性质"),
              fieldCode: "manufacturerFlag",
              render: (val, item) => {
                const list = [];
                val && list.push($T("sslm.enterpriseInform.view.model.business.manufacturer").$D("制造商"));
                item.traderFlag && list.push($T("sslm.enterpriseInform.view.model.business.trader").$D("贸易商"));
                item.servicerFlag && list.push($T("sslm.enterpriseInform.view.model.business.servicer").$D("服务商"));
                return list.join(" ");
              },
            },
            {
              formRow: 3,
              fieldName: $T("spfm.enterprise.model.message.interBusinessShield").$D("不允许其他企业找到我"),
              fieldCode: "interBusinessShield",
              render: this.renderYesOrNo
            },
            {
              formRow: 4,
              fieldName: $T("sslm.enterpriseInform.view.model.business.industryReqList").$D("行业类型"),
              fieldCode: "industryReqList",
              render: (val) => val && val.map((e) => e.industryName).join(",")
            }, {
              formRow: 5,
              fieldName: $T("sslm.enterpriseInform.view.model.business.industryList").$D("主营品类"),
              fieldCode: "industryCategoryReqList",
              render: (val) => val && val.map((e) => e.categoryName).join(",")
            }, {
              formRow: 6,
              fieldName: $T("sslm.enterpriseInform.view.model.business.serviceAreaReqList").$D("送货服务范围"),
              fieldCode: "serviceAreaReqList",
              render: (val) => val && val.map((e) => e.serviceAreaMeaning).join(",")
            }, {
              formRow: 7,
              fieldName: $T("sslm.enterpriseInform.view.model.business.website").$D("公司官网"),
              fieldCode: "website",
            }, {
              formRow: 8,
              fieldName: $T("sslm.enterpriseInform.view.model.business.logoUrl").$D("公司 Logo"),
              fieldCode: "logoUrl",
              render: (val) => val &&
                <SrmButton plain rect onClick={() => this.$previewImage([ SrmUtil.buildImgUrl(val) ])}>
                  {this.$T("sslm.enterpriseInform.button.see").$D("查看")}
                </SrmButton>
            }, {
              formRow: 9,
              fieldName: $T("sslm.enterpriseInform.view.model.business.description").$D("公司简介"),
              fieldCode: "description",
            },
          ]
        }, //注册业务信息
        supplierContacts: {
          code:"contactInfo",
          title: $T("sslm.enterpriseInform.view.model.contactPerson.title").$D("联系人"),
          url: "/sup-contacts-reqs/compare",
          type: "list",
          fieldName: "Contacts",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.CONTACT",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.CONT_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.name").$D("姓名"),
              fieldCode: "name",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.gender").$D("性别"),
              fieldCode: "genderMeaning",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.mail").$D("邮箱"),
              fieldCode: "mail",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.mobilephone").$D("手机号码"),
              fieldCode: "mobilephone",
            },
            // {
            //   fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.idType").$D("证件类型"),
            //   fieldCode: "idTypeMeaning",
            // }, {
            //   fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.idNum").$D("证件号码"),
            //   fieldCode: "idNum",
            // },
            {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.contactType").$D("联系人类型"),
              fieldCode: "contactType",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.department").$D("部门"),
              fieldCode: "department",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.position").$D("职位"),
              fieldCode: "position",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.telephone").$D("固定电话"),
              fieldCode: "telephone",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.description").$D("备注"),
              fieldCode: "description",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.defaultFlag").$D("默认"),
              fieldCode: "defaultFlag",
              render: this.renderEnabled
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.enabledFlag").$D("启用"),
              fieldCode: "enabledFlag",
              render: this.renderEnabled
            },
          ]
        }, //联系人
        supplierAddress: {
          code:"addressInfo",
          title: $T("sslm.enterpriseInform.view.model.address.title").$D("地址"),
          url: "/sup-address-reqs/compare",
          type: "list",
          fieldName: "Addresses",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.ADDRESS",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ADDRESS_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.address.countryName").$D("国家/地区"),
              fieldCode: "countryName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.address.regionPathName").$D("省/市/区"),
              fieldCode: "regionPathName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.address.addressDetail").$D("详细地址"),
              fieldCode: "addressDetail",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.address.postCode").$D("邮政编码"),
              fieldCode: "postCode",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.address.description").$D("地址备注"),
              fieldCode: "description",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.address.enabledFlag").$D("状态"),
              fieldCode: "enabledFlag",
              render: this.renderEnabled
            },
          ]
        }, //地址
        supplierBankAcc: {
          code:"bankInfo",
          title: $T("sslm.enterpriseInform.view.model.bank.title").$D("银行信息"),
          url: "/sup-bank-acc-reqs/compare",
          type: "list",
          fieldName: "BankAccounts",
          customizeCode: "SMBL.WORKFLOW.ENTERPRISE_INFORMATION.BANK_ACC",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.BANK_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankCountry").$D("国家/地区"),
              fieldCode: "bankCountryName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankCode").$D("银行代码"),
              fieldCode: "bankCode",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankName").$D("银行名称"),
              fieldCode: "bankName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankFirm").$D("联行行号"),
              fieldCode: "bankFirm",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankBranchName").$D("开户行名称"),
              fieldCode: "bankBranchName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankAccountName").$D("账户名称"),
              fieldCode: "bankAccountName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.bankAccountNum").$D("银行账号"),
              fieldCode: "bankAccountNum",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.master").$D("主账户"),
              fieldCode: "masterFlag",
              render: this.renderEnabled
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.enabledFlag").$D("状态"),
              fieldCode: "enabledFlag",
              render: this.renderEnabled
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.bank.remark").$D("备注"),
              fieldCode: "remark",
            },
          ]
        }, //银行信息
        supplierInvoice: {
          code:"invoiceInfo",
          title: $T("sslm.enterpriseInform.view.model.invoice.title").$D("开票信息"),
          url: "/sup-invoice-reqs/compare",
          type: "form",
          fieldName: "Invoice",
          customizeCode: "SMBL.WORKFLOW.ENTERPRISE_INFORMATION.INVOICE",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.INVOICE_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.invoiceHeader").$D("发票头"),
              fieldCode: "invoiceHeader",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxRegistrationNumber").$D("税务登记号"),
              fieldCode: "taxRegistrationNumber",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.depositBank").$D("开户行"),
              fieldCode: "depositBank",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.bankAccountNum").$D("开户行账号"),
              fieldCode: "bankAccountNum",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxRegistrationAddress").$D("税务登记地址"),
              fieldCode: "taxRegistrationAddress",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxRegistrationPhone").$D("税务登记电话"),
              fieldCode: "taxRegistrationPhone",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.receiveMail").$D("收票人邮箱"),
              fieldCode: "receiveMail",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.invoice.receivePhone").$D("收票人手机号"),
              fieldCode: "receivePhone",
              render: (val, item) => val && `${item.internationalTelMeaning}|${val}`,
            }, {
              fieldName: $T("sslm.common.model.invoice.taker").$D("收票人"),
              fieldCode: "receiver",
            }, {
              fieldName: $T("sslm.common.model.invoice.ticketAddress").$D("收票地址"),
              fieldCode: "receiveAddress",
            },
          ]
        }, //开票信息
        supplierFinanceReq: {
          code:"financialInfo",
          title: $T("sslm.enterpriseInform.view.model.financialStatus.title").$D("财务状况"),
          url: "/sup-finance-reqs/compare",
          type: "list",
          fieldName: "Finance",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.FINANCIAL",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.FINANCIAL_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.year").$D("年份"),
              fieldCode: "year",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.currencyName").$D("币种"),
              fieldCode: "currencyName",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.totalAssets").$D("企业总资产(万)"),
              fieldCode: "totalAssets",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.totalLiabilities").$D("总负债(万)"),
              fieldCode: "totalLiabilities",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.currentAssets").$D("流动资产(万)"),
              fieldCode: "currentAssets",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.currentLiabilities").$D("流动负债(万)"),
              fieldCode: "currentLiabilities",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.revenue").$D("营业收入(万)"),
              fieldCode: "revenue",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.netProfit").$D("净利润(万)"),
              fieldCode: "netProfit",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.assetLiabilityRatio").$D("资产负债率"),
              fieldCode: "assetLiabilityRatio",
              render: this.renderPercent
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.currentRatio").$D("流动比率"),
              fieldCode: "currentRatio",
              render: this.renderPercent
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.totalAssetsEarningsRatio").$D("总资产收益率"),
              fieldCode: "totalAssetsEarningsRatio",
              render: this.renderPercent
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.financial.remark").$D("备注"),
              fieldCode: "remark",
            },
          ]
        }, //财务状况
        supplierAttachment: {
          code:"attachmentInfo",
          title: $T("sslm.enterpriseInform.view.model.attachment.title").$D("附件信息"),
          url: "/sup-attachment-reqs/compare",
          type: "list",
          fieldName: "Attachments",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.ATTACH",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ATT_INFO",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.type").$D("附件类型"),
              fieldCode: "attachmentMeaning",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.description").$D("附件描述"),
              fieldCode: "description",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.endDate").$D("文件到期日"),
              fieldCode: "endDate",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.lastUpdatedTime").$D("最后更新时间"),
              fieldCode: "uploadDate",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.upload").$D("附件上传"),
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
            }, {
              fieldName: $T("sslm.enterpriseInform.view.model.attachment.remark").$D("备注"),
              fieldCode: "remark",
            },
          ]
        }, //附件信息
        supplierCate: {
          code:"supplierClassify",
          title: $T("sslm.enterpriseInform.view.fixCatalog.supplierClassify").$D("供应商分类"),
          url: "/enterprise-change/detail/investigate-cate",
          type: "list",
          fieldName: "FirmChangeCates",
          customizeCode:"SMBL.WORKFLOW.ENTERPRISE_INFORMATION.CLASSIFY",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.SUPPLIER_CLASSIFY",
          columns: [
            {
              fieldName: $T("sslm.enterpriseInform.model.supplierClassify.code").$D("供应商类型分类"),
              fieldCode: "categoryCode",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader showOpenTag={false}>
                <span>
                  <SrmTag
                    style="margin-right: 8px"
                    fill
                    type={item.enabledFlag ? "success" : "danger"}>
                    {this.renderEnabled(item.enabledFlag)}</SrmTag>{`${val}-${item.categoryDescription}`}
                </span>
              </SrmListHeader>
            },
            // {
            //   fieldName: $T("sslm.enterpriseInform.model.supplierClassify.describe").$D("供应商分类描述"),
            //   fieldCode: "categoryDescription",
            // }, {
            //   fieldName: $T("sslm.enterpriseInform.model.supplierClassify.enabledFlag").$D("是否启用"),
            //   fieldCode: "enabledFlag",
            //   render: this.renderYesOrNo
            // },
          ]
        }, //供应商分类
        supplierOtherInfo: {
          code:"otherInfo",
          title: $T("sslm.enterpriseInform.view.title.otherInformation").$D("其他信息"),
          url: "/sup-change-others/firm-change/compare",
          type: "list",
          fieldName: "SupOther",
          customizeCode: "SMBL.WORKFLOW.ENTERPRISE_INFORMATION.OTHER",
          customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.OTHER_INFO",
          columns: []
        }, //其他信息
      },
      componentMap: {
        Input: "INPUT",
        InputNumber: "INPUT_NUMBER",
        ValueList: "SELECT",
        Lov: "LOV",
        Checkbox: "TEXT",
        Switch: "TEXT",
      },
      loadingFlag: false,
    };
  },
  beforeMount() {
    this.headerDataSet.addQueryParameter("changeReqId", this.parameters.changeReqId);
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const { parameters } = this;
      const res = await getInvestigateConfig(parameters) || {};
      const investigateConfigHeaders = res.investigateConfigHeaders || [];
      const newInvestigateConfigHeaders = [];
      for (let i = 0; i < investigateConfigHeaders.length; i++) {
        let header = investigateConfigHeaders[i];
        const next = i < investigateConfigHeaders.length - 1 && investigateConfigHeaders[i + 1];
        if (header.configName === "sslmInvestgProservice" && next.configName === "sslmInvestgSupplierCate") {
          header = {
            configDescription: header.configDescription,
            children: [ header, next ]
          };
          i++;
        }
        if (header.configName === "sslmInvestgFin" && next.configName === "sslmInvestgFinBranch") {
          header = {
            configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgFinInfo").$D("财务信息"),
            children: [ header, next ]
          };
          i++;
        }
        // if (header.configName === "sslmInvestgContact" && next.configName === "sslmInvestgAddress") {
        //   header = {
        //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgContact").$D("联系人及地址"),
        //     children: [ header, next ]
        //   };
        //   i++;
        // }
        if (header.configName === "sslmInvestgCustomer" && next.configName === "sslmInvestgSubSupplier") {
          header = {
            configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgCustomer").$D("合作伙伴"),
            children: [ header, next ]
          };
          i++;
        }
        if (header.configName === "sslmInvestgRd" && next.configName === "sslmInvestgProduce") {
          header = {
            configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgRd").$D("研发和生产"),
            children: [ header, next ]
          };
          i++;
        }
        if (header.configName === "sslmInvestgQa" && next.configName === "sslmInvestgCustservice") {
          header = {
            configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgQa").$D("质保与售后"),
            children: [ header, next ]
          };
          i++;
        }
        newInvestigateConfigHeaders.push(header);
        res.investigateConfigHeaders = newInvestigateConfigHeaders;
      }
      this.investigateConfig = res;
      this.investigateCompares = this.investigateConfig.investigateConfigHeaders || [];
      const configNames = investigateConfigHeaders.map((e) => e.configName);
      this.supplierCompares = [
        this.supplierRequestMap.supplierBasic,
        this.supplierRequestMap.supplierBusiness,
        !configNames.includes("sslmInvestgContact") && this.supplierRequestMap.supplierContacts,
        !configNames.includes("sslmInvestgAddress") && this.supplierRequestMap.supplierAddress,
        !configNames.includes("sslmInvestgBankAccount") && this.supplierRequestMap.supplierBankAcc,
        this.supplierRequestMap.supplierInvoice,
        !configNames.includes("sslmInvestgFin") && this.supplierRequestMap.supplierFinanceReq,
        !configNames.includes("sslmInvestgAttachment") && this.supplierRequestMap.supplierAttachment,
        this.supplierRequestMap.supplierCate,
        this.supplierRequestMap.supplierOtherInfo,
      ];
      const promiseList = [];
      this.supplierCompares.forEach((e) => {
        if (!e) {
          return;
        }
        e.columns.forEach((col) => {
          const render = col.render;
          if (render) {
            if (col.fieldType === "EMPTY") {
              return;
            }
            col.render = (val, item, field) => this.renderCompare(val, item, field, render);
          } else {
            col.render = (val, item, field) => this.renderCompare(val, item, field);
          }
        });
        e.dataSet = this.getDefaultDataSet(e.columns);
        e.data = {};
        const promise = compareSupplierInfo(e.url, { ...this.parameters, customizeUnitCode:e.customizeUnitCode }).then((data) => {
          const newData = data[`new${e.fieldName}`];
          const oldData = data[`old${e.fieldName}`];
          if (Array.isArray(newData)) {
            for (let index = 0; index < Math.max(newData.length, oldData.length); index++) {
              const newDataCurrent = newData[index];
              const oldDataCurrent = oldData[index];
              newDataCurrent && (newDataCurrent.mobilephone = newDataCurrent.mobilephone &&
              newDataCurrent.mobilephone.startWith && newDataCurrent.mobilephone.startWith(newDataCurrent.internationalTelMeaning) ?
                newDataCurrent.mobilephone : `${newDataCurrent.internationalTelMeaning}|${newDataCurrent.mobilephone}`);
              oldDataCurrent && (oldDataCurrent.mobilephone = oldDataCurrent.mobilephone &&
              oldDataCurrent.mobilephone.startWith && oldDataCurrent.mobilephone.startWith(oldDataCurrent.internationalTelMeaning) ?
                oldDataCurrent.mobilephone : `${oldDataCurrent.internationalTelMeaning}|${oldDataCurrent.mobilephone}`);
              this.compareAndSetState(newDataCurrent, oldDataCurrent);
            }
          } else {
            this.compareAndSetState(newData, oldData);
          }
          e.data = data;
        });
        promiseList.push(promise);
      });
      this.investigateCompares
        .filter((e) => this.investigateRequestMap[e.configName] || e.children)
        .forEach((e) => {
          if (e.children) {
            e.children.forEach((child) => {
              this.fetchInvestigate(child, promiseList);
            });
          } else {
            this.fetchInvestigate(e, promiseList);
          }
        });
      this.loadingFlag = true;
      this.$loading.show();
      Promise.all(promiseList).finally(() => {
        this.loadingFlag = false;
        this.$loading.hide();
        this.$forceUpdate();
      });
    },
    renderCompare(val, item, field, render) {
      const changeFlagFieldCode = `${field.fieldCode}StateFlag`;
      const changeFlag = item[changeFlagFieldCode];
      const meaningField = `${field.fieldCode}Meaning`;
      const meaning = item[meaningField];
      return <span
        style={{ color: changeFlag ? "red" : "" }}>{render ? render(val, item, field) : meaning || val}</span>;
    },
    compareAndSetState(newData, oldData) {
      // 传入值判空
      if (newData || oldData) {
        Object.keys(newData || oldData).forEach((key) => {
          if (oldData && newData) {
            if ((typeof newData[key] === "string" || typeof newData[key] === "number" ||
            typeof oldData[key] === "string" || typeof oldData[key] === "number") && newData[key] !== oldData[key]) {
              newData[`${key}StateFlag`] = true;
              oldData[`${key}StateFlag`] = true;
            }
            return;
          }
          if (newData) {
            newData[`${key}StateFlag`] = true;
            return;
          }
          if (oldData) {
            oldData[`${key}StateFlag`] = true;
          }
        });
      }
    },
    fetchInvestigate(e, promiseList) {
      e.columns = this.getCustomColumns(e.investgCfHeaderId);
      e.dataSet = this.getDefaultDataSet(e.columns);
      e.dataSet.events.afterQuery = (ds, data) => {
        if (data && data.length) {
          data.forEach((d) => {
            d.mobilephone = d.mobilephone && d.mobilephone.startWith && d.mobilephone.startWith(d.internationalTelMeaning) ?
              d.mobilephone : `${d.internationalTelMeaning}|${d.mobilephone}`;
            d.regionId = d.regionPathName;
            d.attachmentType = d.attachmentTypeMeaning;
          });
        }
      };
      e.data = [];
      const promise = compareInvestigateInfo(this.investigateRequestMap[e.configName], this.parameters).then((res) => {
        e.data = res;
      });
      promiseList.push(promise);
    },
    renderYesOrNo(val) {
      if (val) {
        return this.$T("smbl.common.view.yes").$D("是");
      }
      return this.$T("smbl.common.view.no").$D("否");
    },
    renderEnabled(val) {
      if (val) {
        return this.$T("smbl.common.view.enabled").$D("启用");
      }
      return this.$T("smbl.common.view.disabled").$D("禁用");
    },
    renderPercent(val) {
      return Number((val || 0) * 100).toFixed(2) + "%";
    },
    renderInvestigate(val, item, field, fieldType, render) {
      const changeFlagFieldCode = `${field.fieldCode}StateFlag`;
      const meaningField = `${field.fieldCode}Meaning`;
      const changeFlag = item[changeFlagFieldCode] !== "original";
      const meaning = item[meaningField];
      if (fieldType === "UPLOAD") {
        return <SrmUpload
          color={changeFlag ? "red" : "blue"}
          attachment-uuid={val}
          show-icon={false}
          desc-title={this.$T("smbl.common.button.viewAttachment").$D("查看附件")}/>;
      }
      return <span style={{ color: changeFlag ? "red" : null }}>{render ? render(val) : meaning || val}</span>;
    },
    renderSupplierCompare(compare = {}) {
      if (this.loadingFlag) {
        return;
      }
      const { columns, fieldName, customizeCode } = compare;
      let data;
      if (this.changeFlag === 1) {
        data = compare.data[`new${fieldName}`];
      } else {
        data = compare.data[`old${fieldName}`];
      }
      data = Array.isArray(data) ? data : data ? [ data ] : [];
      if (compare.changeFlag !== this.changeFlag) {
        // dataSet.reset();
        // dataSet.setData(data);
        // dataSet.locate(0);
        compare.dataSet = this.getDefaultDataSet(columns);
        compare.dataSet.setData(data);
      }
      compare.changeFlag = this.changeFlag;
      // if (type === "list") {
      //   return <SrmList
      //     scrollable={false}
      //     columns={columns}
      //     dataSet={compare.dataSet}
      //   />;
      // }
      return <SrmList
        scrollable={false}
        columns={columns}
        customize-code = {customizeCode}
        dataSet={compare.dataSet}/>;
    },
    renderInvestigateCompare(config) {
      if (this.loadingFlag) {
        return;
      }
      const { dataSet, columns, data } = config;
      if (SrmUtil.isEmpty(data)) {
        return;
      }
      let displayData;
      if (this.changeFlag === 1) {
        displayData = data[1];
      } else {
        displayData = data[0];
      }
      let isArray = Array.isArray(displayData);
      displayData = isArray ? displayData : displayData ? [ displayData ] : [];
      if (config.changeFlag !== this.changeFlag) {
        // dataSet.reset();
        // dataSet.setData(displayData);
        // dataSet.locate(0);
        config.dataSet = this.getDefaultDataSet(columns);
        config.dataSet.setData(displayData);
      }
      config.changeFlag = this.changeFlag;
      // if (isArray) {
      //   return <SrmList
      //     scrollable={false}
      //     onItemClick={() => columns.length > 10 ? this.openDetailPopup(dataSet, columns) : null}
      //     columns={columns.slice(0, 10)}
      //     dataSet={dataSet}
      //   />;
      // }
      // return <SrmForm
      //   nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(dataSet, columns) : null}
      //   columns={columns.slice(0, 10)}
      //   dataSet={dataSet}/>;
      return <SrmList
        scrollable={false}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(dataSet, columns) : null}
        columns={columns.slice(0, 10)}
        dataSet={config.dataSet}
      />;
    },
    openDetailPopup(dataSet, columns) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={columns}
          dataSet={dataSet}/>,
      });
    },
    getCustomColumns(investgCfHeaderId) {
      return this.investigateConfig.investigateConfigLines
        .filter((e) => e.investgCfHeaderId === investgCfHeaderId)
        .map((e) => ({
          fieldCode: camelCase(e.fieldCode),
          fieldType: "TEXT",
          fieldName: e.fieldDescription,
          editor: false,
          render: [ "Checkbox", "Switch" ].includes(e.componentType) ?
            (val, item, field) => this.renderInvestigate(val, item, field, null, this.renderYesOrNo) : (val, item, field) => this.renderInvestigate(val, item, field, this.componentMap[e.componentType] || snakeCase(e.componentType).toUpperCase()),
        }));
    },
    getDefaultDataSet(columns) {
      const config = {
        autoQuery: false,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: false,
        fields: columns,
      };
      return new DataSet(config);
    },
    getHeaderColumns() {
      return [ {
        formRow: 10,
        fieldCode: "changeReqNumber",
      }, {
        formRow: 20,
        fieldCode: "reqStatusMeaning",
      }, {
        formRow: 20,
        fieldCode: "changeLevelMeaning",
      }, {
        formRow: 30,
        fieldCode: "companyName",
      }, {
        formRow: 40,
        fieldCode: "companyNum",
      }, {
        formRow: 44,
        fieldCode: "partnerCompanyNum",
        visible:(val, record) => record.changeLevel === "COMPANY",
      }, {
        formRow: 46,
        fieldCode: "partnerCompanyName",
        visible:(val, record) => record.changeLevel !== "PLATFORM",
      }, {
        formRow: 50,
        fieldCode: "createUserRealName",
      }, {
        formRow: 60,
        fieldCode: "creationDate",
        render: (val) => val && String(val).substring(0, 10),
      }, {
        formRow: 70,
        fieldCode: "submitDate",
        render: (val) => val && String(val).substring(0, 10),
      }, {
        formRow: 70,
        fieldCode: "attachmentUuid",
      }, {
        formRow: 80,
        fieldCode: "remark",
      }, ];
    },
  },
  render() {
    return <srm-scroll-tab customize-code="SMBL.WORKFLOW.ENTERPRISE_INFORMATION.TABS">
      <SrmFlex style="height: 52px;padding-left: 15px" align="center">
        <ButtonSwitch
          v-model={this.changeFlag}
          btnArr={[
            this.$T("sslm.enterpriseInform.view.title.afterChange").$D("变更后"),
            this.$T("sslm.enterpriseInform.view.title.beforeChange").$D("变更前")
          ]}
        />
      </SrmFlex>
      <srm-scroll-tab-item
        code="basicInfo"
        label={this.$T("sslm.enterpriseInform.title.changeInfoForm").$D("变更单信息")}>
        <srm-form
          columns={this.getHeaderColumns()}
          data-set={this.headerDataSet}
          customize-code="SMBL.WORKFLOW.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER"/>
      </srm-scroll-tab-item>
      {
        this.supplierCompares.map((compare) => compare && <srm-scroll-tab-item label={compare.title} code={compare.code}>
          {
            this.renderSupplierCompare(compare)
          }
        </srm-scroll-tab-item>)
      }
      {
        this.investigateCompares
          .filter((e) => this.investigateRequestMap[e.configName] || e.children)
          .map((config) => <srm-scroll-tab-item label={config.configDescription || "-"} code={config.configName}>
            {
              config.children ? config.children.map((child) => [ <SrmFlex class="sub-title" align="center">{child.configDescription || "-"}</SrmFlex>,
                this.renderInvestigateCompare(child) ]) : this.renderInvestigateCompare(config)
            }
          </srm-scroll-tab-item>)
      }
    </srm-scroll-tab>;
  }
}
;
</script>

<style scoped lang="stylus">
>>> .srm-form {
  padding: 4px 15px 16px 15px;
  margin 0;
  min-height 20vh;
}

>>> .button-switch {
  .toggle {
    height 28px;
    border-radius 14px;

    .btn {
      font-size 12px;
      line-height 16px;
      border-radius: 14px;
      font-weight bold;
    }
  }
}

.sub-title {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
}
</style>
