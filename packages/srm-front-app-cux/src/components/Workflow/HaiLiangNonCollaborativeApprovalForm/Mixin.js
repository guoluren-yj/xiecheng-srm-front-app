import { $T, SrmUtil } from "srm-mobile-ui";

import { getHeaderInfo, getLoginInfo, getBusinessInfo } from "./api";
import { getLovTypeMeaning } from "../AUXSupplierStockInApproveForm/api/AuxStockInApprovalApi";

export default {
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    }
  },
  data() {
    return {
      headerInfo: {}, // 准入基本信息
      loginInfo: {}, // 准入登记信息
      businessInfo: {}, // 业务信息
      type: null, // 流程表单类型 1(可编辑)/2(只读)
      lovInfo: [],
      scopeList: [],
      countryCode: null,
      visible: false, // 境内境外企业
      visible1: false, // 个人 身份证弹窗
      url1: "",
      url2: "",
    };
  },
  async mounted() {
    if (this.changeReqId) {
      this.lovInfo = await getLovTypeMeaning("SPFM.BUSINESS.NATURE");
      this.scopeList = await getLovTypeMeaning("SPFM.COMPANY.SERVICE_AREA");
      await this.fetchData();
    }
    this.$emit("GetApprovalTitle",
      this.$T("scux.nonCollaborativeSupplier.view.title.approval").$D("不协同供应商准入审批"),
    );
    if (this.parameters) {
      this.type = this.parameters.type;
    }
  },
  methods: {
    fetchData() {
      getHeaderInfo(this.changeReqId)
        .then((res) => {
          if (res) {
            this.headerInfo = res;
          }
        });
      getLoginInfo(this.changeReqId)
        .then((res) => {
          if (res) {
            this.loginInfo = res;
            this.countryCode = res?.countryCode;
            if (this.headerInfo.documentType === "PERSON") {
              this.url1 = SrmUtil.buildImgUrl(res.idFileAddress1, "private-bucket");
              this.url2 = SrmUtil.buildImgUrl(res.idFileAddress2, "private-bucket");
            } else {
              this.url1 = SrmUtil.buildImgUrl(res.fileAddress, "private-bucket");
            }
          }
        });
      getBusinessInfo(this.changeReqId)
        .then((res) => {
          if (res) {
            this.businessInfo = res;
          }
        });
    },
  },
  computed: {
    getHeaderColumns() {
      return [
        // 准入单基本信息
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.admittanceCode").$D("准入单号"),
          fieldCode: "admittanceCode",
          formRow: 1,
          // formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.statusMeaning").$D("状态"),
          fieldCode: "statusMeaning",
          formRow: 2,
          // formCol: 3,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
          formRow: 3,
          // formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.createName").$D("创建人"),
          fieldCode: "createName",
          formRow: 4,
          // formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.lifeRegisterStage").$D("生命注册阶段"),
          fieldCode: "lifeRegisterStage",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.supplierCategory").$D("供应商分类"),
          fieldCode: "supplierCategory",
          formRow: 5,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.purchaseAgentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.employeeLov").$D("直接上级"),
          fieldCode: "parentEmpName",
          formRow: 6,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.documentTypeMeaning").$D("单据类型"),
          fieldCode: "documentTypeMeaning",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.companyFlag").$D("是否集团级"),
          fieldCode: "companyFlagMeaning",
          formRow: 7,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.supplyCategoryLov").$D("准入品类"),
          fieldCode: "supplyCategoryNames",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.zrReason").$D("准入原因"),
          fieldCode: "zrReason",
        },
      ];
    },
    // 准入单登记信息
    getLoginColumns() {
      const arr = this.headerInfo?.documentType === "PERSON" ? [
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.personCompany").$D("姓名"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.idType").$D("证件类型"),
          fieldCode: "idTypeMeaning",
        },
        {
          fieldName: this.loginInfo?.idType !== "I" ?
            this.$T("scux.nonCollaborativeSupplier.model.passportPass").$D("护照/通行证") :
            this.$T("scux.nonCollaborativeSupplier.model.idCodes").$D("身份证号"),
          fieldCode: "idCode",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.buildDatePerson").$D("证件有效期从"),
          fieldCode: "buildDate",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.licenceEndDateTo").$D("证件有效期至"),
          fieldCode: "licenceEndDate",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.countryCode").$D("注册国家/地区"),
          fieldCode: "countryName",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.regionId").$D("省"),
          fieldCode: "regionName",
          formRow: 6,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.address").$D("联系地址"),
          fieldCode: "address",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.phone").$D("手机号码"),
          fieldCode: "phone",
          render: (val, item) => <span>{item?.internationalTelCodeMeaning} | {val}</span>
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.mail").$D("邮箱"),
          fieldCode: "mail",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.attachmentUuids").$D("附件"),
          fieldCode: "attachmentUuid",
          render: () =>
            // <srm-upload
            //   // attachmentUuid={val}
            //   fileArr={[
            //     { attachmentUuid: val, title: this.$T("scux.nonCollaborativeSupplier.button.portraitface").$D("身份证人像面") },
            //     { attachmentUuid: item?.attributeVarchar2, title: this.$T("scux.nonCollaborativeSupplier.button.nationalEmblem").$D("身份证国徽面") }
            //   ]}
            //   show-icon
            //   color="var(--color-other-default-b)"
            //   desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}
          // />,
            <a onClick={() => {
              this.visible1 = true;
            }} style="color: blue">
              {$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}
            </a>
        },
      ] : this.headerInfo?.documentType === "TERRITORY" ? [
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.certificationArea").$D("认证地区"),
          fieldCode: "certificationAreaMeaning",
          formRow: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.company").$D("企业名称"),
          fieldCode: "companyName",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.dunsCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.companyType").$D("企业类型"),
          fieldCode: "companyTypeMeaning",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.taxpayerType").$D("纳税人标识"),
          fieldCode: "taxpayerTypeMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.countryCode").$D("注册国家/地区"),
          fieldCode: "countryName",
          formRow: 8,
          formCol: 1,
        },
        this.countryCode === "CN" && {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.regionId").$D("省"),
          fieldCode: "regionName",
          formRow: 8,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.address").$D("联系地址"),
          fieldCode: "address",
          formRow: 9,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.legalRepresentative").$D("法定代表人"),
          fieldCode: "legalRepresentative",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.businessLicense").$D("营业执照"),
          fieldCode: "attachmentUuid",
          formRow: 10,
          formCol: 2,
          render: () =>
            <a onClick={() => {
              this.visible = true;
            }} style="color: blue">
              {$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}
            </a>
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.registeredCapital").$D("注册资本(万)"),
          fieldCode: "registeredCapital",
          formRow: 11,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.currencyCode").$D("注册资本币种"),
          fieldCode: "currencyName",
          formRow: 11,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
          formRow: 12,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.licenceEndDatePerson").$D("营业期限"),
          fieldCode: "licenceEndDate",
          formRow: 12,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.longTermFlag").$D("长期"),
          fieldCode: "longTermFlag",
          render: (val) => {
            if (val) {
              return <span>{val === 1 ? this.$T("scux.nonCollaborativeSupplier.model.yes").$D("是") : this.$T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
            }
          }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.getBusinessScope").$D("经营范围"),
          fieldCode: "businessScope",
        },
      ] : [
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.certificationArea").$D("认证地区"),
          fieldCode: "certificationAreaMeaning",
          formRow: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.company").$D("企业名称"),
          fieldCode: "companyName",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.businessRegistrationNumber").$D("商业注册登记号"),
          fieldCode: "businessRegistrationNumber",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.dunsCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.companyType").$D("企业类型"),
          fieldCode: "companyTypeMeaning",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.countryCode").$D("注册国家/地区"),
          fieldCode: "countryName",
          formRow: 7,
          formCol: 1,
        },
        this.countryCode === "CN" && {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.regionId").$D("省"),
          fieldCode: "regionName",
          formRow: 7,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.address").$D("联系地址"),
          fieldCode: "address",
          formRow: 8,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.legalRepresentative").$D("法定代表人"),
          fieldCode: "legalRepresentative",
          formRow: 9,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.enterpriseCertificate").$D("企业注册证书"),
          fieldCode: "attachmentUuid",
          formRow: 9,
          formCol: 2,
          render: () =>
            // <srm-upload
            //   attachmentUuid={val}
            //   show-icon
            //   color="var(--color-other-default-b)"
            //   desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}
            // />,
            <a onClick={() => {
              this.visible = true;
            }} style="color: blue">
              {$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}
            </a>
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.registeredCapital").$D("注册资本(万)"),
          fieldCode: "registeredCapital",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.currencyCode").$D("注册资本币种"),
          fieldCode: "currencyName",
          formRow: 10,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
          formRow: 11,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.licenceEndDatePerson").$D("营业期限"),
          fieldCode: "licenceEndDate",
          formRow: 11,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.longTermFlag").$D("长期"),
          fieldCode: "longTermFlag",
          render: (val) => {
            if (val) {
              return <span>{val === 1 ? this.$T("scux.nonCollaborativeSupplier.model.yes").$D("是") : this.$T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
            }
          }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.getBusinessScope").$D("经营范围"),
          fieldCode: "businessScope",
        },
      ];
      return arr;
    },
    // 业务信息
    getBusinessColumns() {
      return [
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.businessNatureLists").$D("经营性质"),
          fieldCode: "businessNatureList",
          render: (val) => {
            const arr = this.lovInfo.filter((item) => val && val.includes(item.value));
            const list = arr.map((item) => item.meaning);
            return <span>{ list.join() }</span>;
          }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.industryType").$D("行业类型"),
          fieldCode: "industryTypeList",
          // render: (val) => {
          //   if (val && val.length > 0) {
          //     const industryTypeNames = val.map((items) => items.industryName);
          //     return <span>{ industryTypeNames.join() }</span>;
          //   }
          // }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.mainCategory").$D("主营品类"),
          fieldCode: "mainCategoryList",
          // render: (val) => {
          //   if (val && val.length > 0) {
          //     const mainCategoryNames = val.map((items) => items.categoryName);
          //     return <span>{ mainCategoryNames.join() }</span>;
          //   }
          // }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.deliveryScope").$D("送货服务范围"),
          fieldCode: "deliveryScopeList",
          render: (val) => {
            const arr = this.scopeList.filter((item) => val && val.includes(item.value));
            const list = arr.map((item) => item.meaning);
            return <span>{ list.join() }</span>;
          }
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.companyWebsite").$D("公司官网"),
          fieldCode: "companyWebsite",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.mainIdentity").$D("主要身份"),
          fieldCode: "mainIdentity",
        },
        {
          fieldName: this.$T("scux.nonCollaborativeSupplier.model.companyBrief").$D("公司简介"),
          fieldCode: "companyBrief",
        },
      ];
    },
    // 联系人信息
    getConnectColumns() {
      return [
        {
          fieldCode: "name",
          fieldName: $T("scux.nonCollaborativeSupplier.model.name").$D("姓名"),
          formRow: 1,
          formCol: 1,
        },
        {
          fieldCode: "genderMeaning",
          fieldName: $T("scux.nonCollaborativeSupplier.model.gender").$D("性别"),
          formRow: 1,
          formCol: 2,
        },
        {
          fieldCode: "mail",
          fieldName: $T("scux.nonCollaborativeSupplier.model.mail").$D("邮箱"),
          formRow: 2,
          formCol: 1,
        },
        {
          fieldCode: "phone",
          fieldName: $T("scux.nonCollaborativeSupplier.model.phone").$D("手机号码"),
          render: (val, item) => <span>{item?.internationalTelCodeMeaning} | {val}</span>,
          formRow: 3,
          formCol: 1,
        },
        {
          fieldCode: "remark",
          fieldName: $T("scux.nonCollaborativeSupplier.model.remark").$D("备注"),
          formRow: 4,
          formCol: 1,
        },
        {
          fieldCode: "defaultFlag",
          fieldName: $T("scux.nonCollaborativeSupplier.model.defaultFlag").$D("默认"),
          formRow: 5,
          formCol: 1,
        },
        {
          fieldCode: "enabledFlag",
          fieldName: $T("scux.nonCollaborativeSupplier.model.enabledFlag").$D("启用"),
          formRow: 5,
          formCol: 2,
        },
      ];
    },
    // 银行信息
    getBankColumns() {
      return [
        {
          fieldCode: "countryName",
          fieldName: $T("scux.nonCollaborativeSupplier.model.countryCode").$D("国家/地区"),
          formRow: 1,
        },
        {
          fieldCode: "bankCode",
          fieldName: $T("scux.nonCollaborativeSupplier.model.bankCode").$D("银行代码"),
          formRow: 2,
        },
        {
          fieldCode: "bankName",
          fieldName: $T("scux.nonCollaborativeSupplier.model.bankName").$D("银行名称"),
          formRow: 3,
        },
        {
          fieldCode: "bankFirm",
          fieldName: $T("scux.nonCollaborativeSupplier.model.bankFirm").$D("联行行号"),
          formRow: 4,
        },
        {
          fieldCode: "bankBranchName",
          fieldName: $T("scux.nonCollaborativeSupplier.model.bankBranchName").$D("开户行名称"),
          formRow: 5,
        },
        {
          fieldCode: "accountName",
          fieldName: $T("scux.nonCollaborativeSupplier.model.accountName").$D("账户名称"),
          formRow: 6,
        },
        {
          fieldCode: "bankAccountNum",
          fieldName: $T("scux.nonCollaborativeSupplier.model.bankAccountNum").$D("银行账号"),
          formRow: 7,
        },
        {
          fieldCode: "mainBankFlag",
          fieldName: $T("scux.nonCollaborativeSupplier.model.mainBankFlag").$D("是否主账户"),
          formRow: 8,
          formCol: 1,
        },
        {
          fieldCode: "enabledFlag",
          fieldName: $T("scux.nonCollaborativeSupplier.model.enabledFlag").$D("启用"),
          formRow: 8,
          formCol: 2,
        },
      ];
    },
    // 附件信息
    getAttachmentColumns() {
      return [
        {
          fieldCode: "fileName",
          fieldName: $T("scux.nonCollaborativeSupplier.model.fileType").$D("附件类型"),
        },
        {
          fieldCode: "fileBrief",
          fieldName: $T("scux.nonCollaborativeSupplier.model.fileBrief").$D("附件描述"),
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("scux.nonCollaborativeSupplier.model.attachmentUuids").$D("附件"),
        },
        {
          fieldCode: "remark",
          fieldName: $T("scux.nonCollaborativeSupplier.model.remark").$D("备注"),
        },
      ];
    }
  }
};