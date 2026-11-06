import { $T } from "srm-mobile-ui";
import sslmUtilsMixins from "@/utils/sslmUtilsMixins";
import { enableRender } from "@/components/utils/render";

export default {
  mixins: [ sslmUtilsMixins ],
  methods: {
    handleVisible(fields = {}, config) {
      const { fieldCode = "" } = fields;
      return config.includes(fieldCode);
    },
    getAppealReasonColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "appealReason",
        },
      ];
    },
    getCertificationResultColumns() {
      return [
        {
          fieldCode: "certificationStatusMeaning",
          // render:(val, record) => {
          //   const { certificationStatus } = record;
          //   const type = [ "FAIL" ].includes(certificationStatus) ? "danger" : "primary";
          //   return <srm-button plain type={type}>{val}</srm-button>;
          // }
        },
        {
          fieldCode: "errorMessage",
          render:(val, record) => <srm-flex>
            <span>{record.errorMessage}</span>
          </srm-flex>
        },
      ];
    },
    getManualReviewColumns() {
      return [
        {
          fieldCode: "proposerName",
        },
        {
          fieldCode: "reason",
        },
        {
          fieldCode: "attachmentUuid",
        },
      ];
    },
    getRegisterColumns(params = {}) {
      const { domesticForeignRelation, showArrow = false } = params;
      // domesticForeignFlag 境内-1，境外-0，个人-2
      if (domesticForeignRelation === 1) {
        return [
          {
            formRow: 10,
            fieldCode: "companyName",
            render: (val) => <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight:400 }}>{val}</span>
              { showArrow &&
                <span slot="right" >
                  <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "#333" }}/>
                </span>
              }
            </SrmListHeader>,
          },
          {
            fieldCode: "companyNum",
          },
          {
            fieldCode: "unifiedSocialCode",
          },
          {
            fieldCode: "dunsCode",
          },
          {
            fieldCode: "organizingInstitutionCode",
          },
          {
            fieldCode: "institutionalTypeMeaning",
          },
          {
            fieldCode: "companyTypeMeaning",
          },
          {
            fieldCode: "registeredCountryName",
          },
          {
            fieldCode: "registeredRegionName",
          },
          {
            fieldCode: "legalRepName",
          },
          {
            fieldCode: "taxpayerTypeMeaning",
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
            render:(val, record) => <srm-button style="font-size: 14px;font-weight:400" plain onClick={() => this.handlePreview(val)}> {record.licenceFilename}</srm-button>
          },
        ];
      } else if (domesticForeignRelation === 2) {
        return [
          {
            fieldCode: "domesticForeignRelation",
            render: (val) => this.handleCertificationArea(val)
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
          fieldCode: "companyName",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span style={{ fontWeight:400 }}>{val}</span>
            { showArrow &&
              <span slot="right" >
                <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "#333" }}/>
              </span>
            }
          </SrmListHeader>,
        },
        {
          fieldCode: "companyNum",
        },
        {
          fieldCode: "businessRegistrationNumber",
        },
        {
          fieldCode: "dunsCode",
        },
        {
          fieldCode: "registeredCountryName",
        },
        {
          fieldCode: "registeredRegionName",
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
          render:(val, record) => <srm-button style="font-size: 14px;font-weight:400" plain onClick={() => this.handlePreview(val)}> {record.licenceFilename}</srm-button>
        },
      ];

    },
    getBusinessColumns() {
      return [
        {
          formRow: 10,
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
          render:(val, record) => val ? <srm-button style="font-size: 12px" plain onClick={() => this.handlePreview(val)}> {record.logoUrlname}</srm-button> : "-"
        },
      ];
    },
    getContactColumns(config = []) {
      return [
        {
          fieldCode: "name",
          visible:(val, record, fields) => this.handleVisible(fields, config),
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
                    {$T("smbl.common.view.title.default").$D("默认")}
                  </SrmTag> :
                  ""
                }
                <SrmTag
                  type={item.enabledFlag ? "success" : "danger"}
                >
                  {item.enabledFlag ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用") : $T("hipspfm.common.status.enabledFlag.disable").$D("禁用")}
                </SrmTag>
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "mobilephone",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "mail",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "telephone",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "department",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "position",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "description",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        // {
        //   fieldCode: "defaultFlag",
        //   visible:(val, record, fields) => this.handleVisible(fields, config),
        // },
        // {
        //   fieldCode: "enabledFlag",
        //   visible:(val, record, fields) => this.handleVisible(fields, config),
        // },
      ];
    },
    getAddressColumns(config = []) {
      return [
        {
          formRow: 10,
          fieldCode: "countryName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            <span style={{ fontWeight:400 }}>{val}</span>
            <span slot="right" >
              <SrmTag
                type={item.enabledFlag ? "success" : "danger"}
              >
                {item.enabledFlag ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用") : $T("hipspfm.common.status.enabledFlag.disable").$D("禁用")}
              </SrmTag>
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "regionPathName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "addressDetail",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "postCode",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "description",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        // {
        //   fieldCode: "enabledFlag",
        //   visible:(val, record, fields) => this.handleVisible(fields, config),
        // },
      ];
    },
    getBankColumns(config = []) {
      return [
        {
          fieldCode: "bankCountryName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            <span style={{ fontWeight:400 }}>{val}</span>
            <span slot="right">
              {enableRender(item.enabledFlag)}
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "bankCode",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankFirm",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankBranchName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankAccountName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankAccountNum",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "accountNatureMeaning",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "accountPurposeMeaning",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "currencyIdMeaning",
          render:(val, record) => record.currencyIdMeaning,
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "paymentTypeIdMeaning",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        // {
        //   fieldCode: "enabledFlag",
        //   visible:(val, record, fields) => this.handleVisible(fields, config),
        // },
        {
          fieldCode: "masterFlag",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "remark",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
      ];
    },
    getInvoiceColumns(config = []) {
      return [
        {
          fieldCode: "invoiceHeader",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "taxRegistrationNumber",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "depositBank",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "bankAccountNum",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "taxRegistrationAddress",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "taxRegistrationPhone",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "receiver",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "receiveMail",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "receivePhone",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "receiveAddress",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
      ];
    },
    getFinanceColumns(config = []) {
      return [
        {
          fieldCode: "year",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "currencyName",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "totalAssets",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "totalLiabilities",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "currentAssets",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "currentLiabilities",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "revenue",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "netProfit",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "assetLiabilityRatio",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "currentRatio",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "totalAssetsEarningsRatio",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "remark",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
      ];
    },
    getAttachmentColumns(config = []) {
      return [
        {
          fieldCode: "attachmentTypeMerge",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "description",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "endDate",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "longEffectiveFlag",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "uploadDate",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "attachmentUuid",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
        {
          fieldCode: "remark",
          visible:(val, record, fields) => this.handleVisible(fields, config),
        },
      ];
    },
    getOtherColumns() {
      return [
      ];
    },
    getInviteColumns() {
      return [
        {
          fieldCode: "autoPartnerFlag",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
  }
};

