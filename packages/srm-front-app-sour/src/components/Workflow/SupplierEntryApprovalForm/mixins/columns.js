import { $T } from "srm-mobile-ui";
import sslmUtilsMixins from "@/utils/sslmUtilsMixins";
import { enableRender } from "@/components/utils/render";

export default {
  mixins: [ sslmUtilsMixins ],
  methods: {
    getRegisterColumns(params = {}) {
      const { domesticForeignRelation } = params;
      // domesticForeignFlag 境内-1，境外-0，个人-2
      if (domesticForeignRelation === 1) {
        return [
          {
            fieldCode: "domesticForeignRelation",
            render: (val) => <SrmListHeader showOpenTag={false}>
              <span>{this.handleCertificationArea(val)}</span>
              <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color:"var(--color-font-default)" }}/>
            </SrmListHeader>,
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "unifiedSocialCode",
          },
          {
            fieldCode: "organizingInstitutionCode",
          },
          {
            fieldCode: "dunsCode",
          },
          {
            fieldCode: "institutionalTypeMeaning",
          },
          {
            fieldCode: "companyTypeMeaning",
          },
          {
            fieldCode: "taxpayerTypeMeaning",
          },
          {
            fieldCode: "registeredCountryName",
          },
          {
            fieldCode: "registeredRegionName",
          },
          {
            fieldCode: "addressDetail",
          },
          {
            fieldCode: "legalRepName",
          },
          {
            fieldCode: "registeredCapital",
          },
          {
            fieldCode: "currencyName",
          },
          {
            fieldCode: "buildDate",
          },
          {
            fieldCode: "licenceEndDate",
          },
          {
            fieldCode: "businessScope",
          },
          {
            fieldCode: "licenceUrl",
            render:(val, record) => val ? <srm-button plain onClick={() => this.handlePreview(val)}> {record.licenceFilename}</srm-button> : "-"
          },
        ];
      } else if (domesticForeignRelation === 2) {
        return [
          {
            fieldCode: "domesticForeignRelation",
            render: (val) => <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:400 }}>{this.handleCertificationArea(val)}</span>
              <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color:"var(--color-font-default)" }}/>
            </SrmListHeader>,
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "registeredCountryName",
          },
          {
            fieldCode: "phone",
          },
          {
            fieldCode: "email",
          },
          {
            fieldCode: "addressDetail",
          },
        ];
      }
      return [
        {
          fieldCode: "domesticForeignRelation",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span>{this.handleCertificationArea(val)}</span>
            <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color:"var(--color-font-default)" }}/>
          </SrmListHeader>,
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "dunsCode",
        },
        {
          fieldCode: "businessRegistrationNumber",
        },
        {
          fieldCode: "registeredCountryName",
        },
        {
          fieldCode: "addressDetail",
        },
        {
          fieldCode: "legalRepName",
        },
        {
          fieldCode: "registeredCapital",
        },
        {
          fieldCode: "currencyName",
        },
        {
          fieldCode: "buildDate",
        },
        {
          fieldCode: "businessScope",
        },
        {
          fieldCode: "licenceUrl",
          render:(val, record) => val ? <srm-button plain onClick={() => this.handlePreview(val)}> {record.licenceFilename}</srm-button> : "-"
        },
      ];
    },
    getBusinessColumns() {
      return [
        {
          fieldCode: "businessType",
          render: (val, record) => this.primaryIdentityMerge(record),
        },
        {
          fieldCode: "interBusinessShield",
        },
        {
          fieldCode: "serviceType",
          render:(val, record) => this.serviceTypeMerge(record)
        },
        {
          fieldCode: "industryReqList",
        },
        {
          fieldCode: "industryCategoryReqList",
        },
        {
          fieldCode: "serviceAreaReqList",
        },
        {
          fieldCode: "website",
        },
        {
          fieldCode: "description",
        },
        {
          fieldCode: "logoUrl",
          render:(val, record) => val ? <srm-button plain onClick={() => this.handlePreview(val)}> {record.logoUrlname}</srm-button> : "-"
        },
      ];
    },
    getContactColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "name",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:600 }}>{val}</span>
              <span slot="right">
                {item.defaultFlag ?
                  <SrmTag
                    type="success"
                    style="margin-right: 8px"
                  >
                    {$T("sslm.common.model.common.default").$D("默认")}
                  </SrmTag> :
                  ""
                }
                {enableRender(item.enabledFlag)}
              </span>
            </SrmListHeader>,
        },
        {
          fieldCode: "mobilephone",
        },
        {
          fieldCode: "mail",
        },
        {
          fieldCode: "telephone",
        },
        {
          fieldCode: "department",
        },
        {
          fieldCode: "position",
        },
        {
          fieldCode: "description",
        },
        // {
        //   fieldCode: "defaultFlag",
        // },
        // {
        //   fieldCode: "enabledFlag",
        // },
      ];
    },
    getAddressColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "countryName",
          render: (val, item) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:400 }}>{val}</span>
              <span slot="right">
                {enableRender(item.enabledFlag)}
              </span>
            </SrmListHeader>,
        },
        {
          fieldCode: "regionPathName",
        },
        {
          fieldCode: "addressDetail",
        },
        {
          fieldCode: "postCode",
        },
        {
          fieldCode: "description",
        },
        // {
        //   fieldCode: "enabledFlag",
        // },
      ];
    },
    getBankColumns() {
      return [
        {
          fieldCode: "bankCountryName",
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            <span style={{ fontWeight:400 }}>{val}</span>
            <span slot="right">
              {enableRender(item.enabledFlag)}
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "bankCode",
        },
        {
          fieldCode: "bankName",
        },
        {
          fieldCode: "bankFirm",
        },
        {
          fieldCode: "bankBranchName",
        },
        {
          fieldCode: "bankAccountName",
        },
        {
          fieldCode: "bankAccountNum",
        },
        {
          fieldCode: "accountNatureMeaning",
        },
        {
          fieldCode: "accountPurposeMeaning",
        },
        {
          fieldCode: "currencyIdMeaning",
        },
        {
          fieldCode: "paymentTypeIdMeaning",
        },
        // {
        //   fieldCode: "enabledFlag",
        // },
        {
          fieldCode: "masterFlag",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getInvoiceColumns() {
      return [
        {
          fieldCode: "invoiceHeader",
        },
        {
          fieldCode: "taxRegistrationNumber",
        },
        {
          fieldCode: "depositBank",
        },
        {
          fieldCode: "bankAccountNum",
        },
        {
          fieldCode: "taxRegistrationAddress",
        },
        {
          fieldCode: "taxRegistrationPhone",
        },
        {
          fieldCode: "receiver",
        },
        {
          fieldCode: "receiveMail",
        },
        {
          fieldCode: "receivePhone",
        },
        {
          fieldCode: "receiveAddress",
        },
      ];
    },
    getFinanceColumns() {
      return [
        {
          fieldCode: "year",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:600 }}>{val}</span>
            </SrmListHeader>,
        },
        {
          fieldCode: "currencyName",
        },
        {
          fieldCode: "totalAssets",
        },
        {
          fieldCode: "totalLiabilities",
        },
        {
          fieldCode: "currentAssets",
        },
        {
          fieldCode: "currentLiabilities",
        },
        {
          fieldCode: "revenue",
        },
        {
          fieldCode: "netProfit",
        },
        {
          fieldCode: "assetLiabilityRatio",
        },
        {
          fieldCode: "currentRatio",
        },
        {
          fieldCode: "totalAssetsEarningsRatio",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getAttachmentColumns() {
      return [
        {
          fieldCode: "attachmentTypeMerge",
        },
        {
          fieldCode: "description",
        },
        {
          fieldCode: "endDate",
        },
        // {
        //   fieldCode: "longEffectiveFlag",
        // },
        {
          fieldCode: "uploadDate",
        },
        {
          fieldCode: "attachmentUuid",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getOtherColumns() {
      return [];
    },
    getInviteColumns() {
      return [
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "levelTypeFlag",
        },
        {
          fieldCode: "stageId",
        },
        {
          fieldCode: "investigateFlag",
        },
        {
          fieldCode: "templateName",
        },
        {
          fieldCode: "categoryIds",
        },
        {
          fieldCode: "itemCategoryIds",
        },
        {
          fieldCode: "purchaseAgentIds",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getEntryBaseColumns() {
      return [
        {
          fieldCode: "changeReqNumber",
        },
        {
          fieldCode: "createUserName",
        },
        {
          fieldCode: "departmentName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "realName",
        },
        {
          fieldCode: "password",
        },
        {
          fieldCode: "phone",
        },
        {
          fieldCode: "email",
        },
        {
          fieldCode: "attachmentUuid",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
  }
};

