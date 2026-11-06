// import uuid from "uuid";
import { $T, SrmUtil } from "srm-mobile-ui";
import {
  getStatusCodeColor,
} from "../utils";
export default {
  data() {
    return {};
  },
  methods: {
    // 表单信息
    getDetailHeaderColumns(commonInfo) {
      const { node, headerType = "basicInfo", tab, } = commonInfo;
      switch (node) {
      case "ASN":
        if (headerType === "basicInfo") {
          if (tab === "all") {
            return [
              {
                fieldCode: "displayAsnNum",
                fieldType: "EMPTY",
                render: (val, item) => <srm-list-header show-open-tag={true}>
                  <span>{ item.displayAsnNum }</span>
                  <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
                </srm-list-header>,
                formRow: 1,
              },
              {
                fieldCode: "asnTypeCodeMeaning",
                formRow: 2,
              },
              {
                fieldCode: "createdName",
                formRow: 3,
              },
              {
                fieldCode: "creationDate",
                formRow: 3,
              }
            ];
          }
          return [
            {
              fieldCode: "displayAsnNum",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.displayAsnNum }</span>
                <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
              </srm-list-header>,
              formRow: 1,
            },
            {
              fieldCode: "createdName",
              formRow: 2,
            },
            {
              fieldCode: "creationDate",
              formRow: 2,
            }
          ];
        }
        if (headerType === "shipInfo") {
          return [
            {
              fieldCode: "supplierCompanyName",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.supplierCompanyName }</span>
              </srm-list-header>,
            },
            {
              fieldCode: "shipDate",
              editor: tab === "submit",
              required: tab === "submit" && node === "ASN",
            },
            {
              fieldCode: "expectedArriveDate",
              editor: tab === "submit",
              required: tab === "submit" && node === "ASN",
            },
            {
              fieldCode: "deliveryAddress",
              editor: tab === "submit",
            },
          ];
        }
        if (headerType === "receiveInfo") {
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.companyName }</span>
              </srm-list-header>,
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
              editor: tab === "submit",
            },
          ];
        }
        if (headerType === "attachInfo") {
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "purchaseAttachmentUuid",
              render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    directory: "slod-document",
                    attachmentUuid: item.purchaseAttachmentUuid,
                    // bucketName: "public-bucket",
                    title: $T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件"),
                    tenantId: SrmUtil.getTenantId(),
                    displayType: "list",
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="primary" plain>{$T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
            {
              fieldType: "EMPTY",
              render: () => <srm-blank size="1px" theme="fill"/>,
              formRow: 20,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttachmentUuid",
              render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [ {
                    directory: "slod-document",
                    attachmentUuid: item.supplierAttachmentUuid,
                    title: $T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件"),
                    displayType: tab === "all" || tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]) ? "list" : "grid",
                    readonly: tab === "all" || tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]),
                    showInfo: true,
                    uploadButton: tab === "all" || tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]) ? "none" : "fixed",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="primary" plain>{$T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 30,
            },
          ];
        }
        break;
      case "PLAN":
        return [
          {
            fieldCode: "displayPlanNum",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.displayPlanNum }</span>
              <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
            </srm-list-header>,
            formRow: 1,
          },
          {
            fieldCode: "companyName",
            formRow: 2,
          },
        ];
      default:
        return [];
      }
    },
    // 表单信息-明细详情
    getDetailMoreHeaderColumns(commonInfo) {
      const { tab, node, headerType = "basicInfoDetail" } = commonInfo;
      switch (node) {
      case "ASN":
        if (headerType === "basicInfoDetail") {
          return [
            {
              fieldCode: "displayAsnNum",
            },
            {
              fieldCode: "nodeConfigName",
            },
            {
              fieldCode: "asnTypeCodeMeaning",
            },
            {
              fieldCode: "statusCodeMeaning",
            },
            {
              fieldCode: "createdName",
            },
            {
              fieldCode: "creationDate",
            },
          ];
        }
        if (headerType === "shipInfoDetail") {
          return [
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "shipDate",
              editor: tab === "submit",
              required: tab === "submit" && node === "ASN",
            },
            {
              fieldCode: "expectedArriveDate",
              editor: tab === "submit",
              required: tab === "submit" && node === "ASN",
            },
            {
              fieldCode: "deliveryAddress",
              editor: tab === "submit",
            },
            {
              fieldCode: "shipTotalQuantity",
            },
            {
              fieldCode: "shipTaxIncludedAmount",
            },
            tab !== "affirm" && {
              fieldCode: "transportType",
              editor: tab !== "affirm",
            },
            tab === "affirm" && {
              fieldCode: "transportTypeMeaning",
            },
            tab !== "affirm" && {
              fieldCode: "logisticsCompanyCode",
              editor: tab !== "affirm",
            },
            tab === "affirm" && {
              fieldCode: "logisticsCompanyName",
            },
            {
              fieldCode: "carNumber",
              editor: tab !== "affirm",
            },
            {
              fieldCode: "expressNum",
              editor: tab !== "affirm",
            },
            {
              fieldCode: "logisticsStaff",
              editor: tab !== "affirm",
            },
            tab !== "affirm" && {
              fieldCode: "logisticsPhoneNum",
              prefixField:{
                fieldCode: "internationalTelCode",
                lovCode: "HPFM.IDD",
                fieldType: "SELECT",
                defaultValue: { value: "+86", meaning: `${$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
              },
            },
            tab === "affirm" && {
              fieldCode: "logisticsPhoneNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.logisticsPhoneNum}</span>
            },
            {
              fieldCode: "purchaseRemark",
            },
            {
              fieldCode: "supplierRemark",
              editor: (val, item) => tab === "submit" || tab === "affirm" && [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]),
            }
          ];
        }
        if (headerType === "receiveInfoDetail") {
          return [
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
              editor: tab === "submit",
            },
            {
              fieldCode: "contactName",
              editor: tab === "submit",
            },
            tab !== "affirm" && {
              fieldCode: "contactTelNum",
              prefixField:{
                fieldCode: "internationalTelCode",
                lovCode: "HPFM.IDD",
                fieldType: "SELECT",
                defaultValue: { value: "+86", meaning: `${$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
              },
            },
            tab === "affirm" && {
              fieldCode: "contactTelNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.contactTelNum}</span>
            },
          ];
        }
        break;
      case "PLAN":
        return [
          {
            fieldCode: "statusCodeMeaning",
          },
          {
            fieldCode: "supplierCompanyName",
          },
          {
            fieldCode: "createdName",
          },
          {
            fieldCode: "creationDate",
          },
        ];
      default:
        return [];
      }
    },
  }
};
