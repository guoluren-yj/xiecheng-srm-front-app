<template>
  <section>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-form :data-set="headerDs" show-default-detail
                  :columns="getColumns('basicInfo')" :customize-code="getCodeDefine('BASIC_INFO')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="getLanguageDefine('line')" style="position: relative;">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="lineDs"
                  :columns="getColumns('line')" :customize-code="getCodeDefine(paymentSourceTypeCode)"
                  @itemClick="clickAdvancePaymentLine"/>
      </srm-scroll-tab-item>
      <!-- <srm-scroll-tab-item code="attachment" :label="getLanguageDefine('attachment')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="headerDs"
                  :columns="getColumns('attachment')" :customize-code="getCodeDefine('attachment')" />
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>
  </section>
</template>

<script>
import { dateFormat } from "@/utils/index";
import { DataSet, $T } from "srm-mobile-ui";
import { headerDS, lineDS } from "./dataSource/indexDs";
import { unitCodeMap, unitCodeMobile } from "./dataSource/type";

export default {
  modules: [ "sfin.payment", "smbl.common", "sfin.advancePaymentRecord", "entity.supplier", "entity.attachment", "entity.company", "entity.supplier", "hzero.common" ],
  name: "AdvancePayApprovalFiance",
  components: {
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    parameters: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      headerDs: new DataSet(headerDS(this.changeReqId)),
      lineDs: new DataSet(lineDS(this.changeReqId)),
      paymentSourceTypeCode: "",
    };
  },
  computed: {
    getColumns() {
      let cuxBasicInfoDetail = [];
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "paymentNum",
              fieldType: "EMPTY",
              render: (val) => <SrmListHeader>
                {val}
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "companyName",
              formRow: 2,
            },
            {
              fieldCode: "ouName",
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyName",
              formRow: 4,
              render: (val, item) => val || item.supplierName,
            },
            {
              fieldCode: "paymentSourceTypeCodeMeaning",
              formRow: 5,
            },
            {
              fieldCode: "bankName",
              formRow: 6,
            },
            {
              fieldCode: "bankBranchName",
              formRow: 7,
            },
            {
              fieldCode: "bankAccountName",
              formRow: 8,
            },
            {
              fieldCode: "bankAccountNum",
              formRow: 9,
            },
            {
              fieldCode: "typeName",
              formRow: 10,
            },
            {
              fieldCode: "currencyCode",
              formRow: 10,
            },
            {
              fieldCode: "paymentDate",
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 11,
            },
            {
              fieldCode: "paymentAmount",
              formRow: 12,
            },
            {
              fieldCode: "creationDate",
              formRow: 13,
            },
            {
              fieldCode: "createdByName",
              formRow: 14,
            },
            {
              fieldCode: "remark",
              formRow: 15,
            },
            {
              fieldCode: "advanceRatio",
              formRow: 16,
            },
          ].concat(cuxBasicInfoDetail);
        case "line":
          if (this.paymentSourceTypeCode === "SUPPLIER") {
            return [
              {
                fieldCode: "lineNum",
                fieldType: "EMPTY",
                render: (val) => <SrmListHeader>
                  {val}
                </SrmListHeader>,
                formRow: 1,
              },
              {
                fieldCode: "paymentAdvanceAmount",
                formRow: 2,
              },
              {
                fieldCode: "paymentReason",
                formRow: 3,
              },
              {
                fieldCode: "remark",
                formRow: 4,
              },
            ];
          } else if (this.paymentSourceTypeCode === "CONTRACT") {
            return [
              {
                fieldCode: "displayNum",
                fieldType: "EMPTY",
                render: (val) => <SrmListHeader>
                  {val}
                </SrmListHeader>,
                formRow: 1,
              },
              {
                fieldCode: "pcName",
                formRow: 2,
              },
              {
                fieldCode: "taxIncludedAmount",
                formRow: 3,
              },
              {
                fieldCode: "amount",
                formRow: 4,
              },
              {
                fieldCode: "paymentAmount",
                formRow: 5,
              },
              {
                fieldCode: "paymentAdvanceAmount",
                formRow: 6,
              },
              {
                fieldCode: "advanceRatio",
                formRow: 6,
              },
              {
                fieldCode: "pcTypeName",
                formRow: 7,
              },
              {
                fieldCode: "startDateActive",
                formRow: 8,
                render: (val) => <span>{dateFormat(val)}</span>,
              },
              {
                fieldCode: "endDateActive",
                formRow: 8,
                render: (val) => <span>{dateFormat(val)}</span>,
              },
              {
                fieldCode: "realName",
                formRow: 9,
              },
              {
                fieldCode: "creationDate",
                formRow: 11,
              },
              {
                fieldCode: "confirmedDate",
                formRow: 12,
              },
            ];
          }
          return [
            {
              fieldCode: "displayNum",
              fieldType: "EMPTY",
              fieldName: $T("sfin.advancePaymentRecord.model.common.displayNum").$D("采购订单号 "),
              render: (val) => <SrmListHeader>
                {val}
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "displayLineNum",
              formRow: 2,
              visible: this.paymentSourceTypeCode === "PO_LINE",
            },
            {
              fieldCode: "itemCode",
              formRow: 3,
              visible: this.paymentSourceTypeCode === "PO_LINE",
            },
            {
              fieldCode: "itemName",
              formRow: 4,
              visible: this.paymentSourceTypeCode === "PO_LINE",
            },
            {
              fieldCode: "taxIncludedAmount",
              formRow: 5,
              fieldName: $T("sfin.advancePaymentRecord.model.common.taxIncludedAmounts").$D("含税总额 "),
            },
            {
              fieldCode: "amount",
              formRow: 6,
            },
            {
              fieldCode: "paymentAmount",
              formRow: 7,
            },
            {
              fieldCode: "paymentAdvanceAmount",
              formRow: 8,
            },
            {
              fieldCode: "advanceRatio",
              formRow: 9,
            },
            {
              fieldCode: "orderTypeName",
              formRow: 10,
            },
            {
              fieldCode: "ouName",
              formRow: 11,
            },
            {
              fieldCode: "organizationName",
              formRow: 12,
            },
            {
              fieldCode: "purchaseAgentName",
              formRow: 13,
            },
            {
              fieldCode: "creationDate",
              formRow: 14,
            },
            {
              fieldCode: "releasedDate",
              formRow: 15,
            },
          ];
        case "attachment":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "attachmentUuid",
              render: (val, _, field) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other" />
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: field.fieldName,
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={field.fieldName} />
                </SrmFlex>
                <span class="srm-icon icon-chevron-right" />
              </SrmFlex>,
              formRow: 10,
            },
          ];
        default:
          break;
        }
      };
    }
  },
  async mounted() {
    await this.headerDs.refresh();
    const paymentSourceTypeCode = this.headerDs.current?.get("paymentSourceTypeCode");
    this.paymentSourceTypeCode = paymentSourceTypeCode;
    this.lineDs.addQueryParameter("customizeUnitCode", unitCodeMap[paymentSourceTypeCode]);
    this.lineDs.query();
  },
  methods: {
    clickAdvancePaymentLine() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode={this.getCodeDefine(this.paymentSourceTypeCode)}
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.lineDs}
          columns={this.getColumns("line")}
        />
      });
    },
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("sfin.advancePaymentRecord.model.common.advancePaymentHeader").$D("预付款头信息"),
        "line": $T("sfin.advancePaymentRecord.model.common.advancePaymentList").$D("预付款行信息"),
        "attachment": $T("hzero.common.upload.modal.label").$D("附件"),
      };
      return languageList[key] || key;
    },
    getCodeDefine(key) {
      return unitCodeMobile[key];
    },
  }
};
</script>

<style scoped lang="stylus">
  >>> .srm-list-search-line {
    position: absolute;
    top: -45px;
    z-index: 1;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .attachment {
    height 28px;
    font-size 14px;
    color #333333;
    line-height 20px;

    .icon-other {
      font-size 28px;
      color #FEBF43;
      margin-right 8px;
    }

    .icon-chevron-right {
      font-size 16px;
      color val(--color-font-default-b);
    }
    >>> .srm-button-primary {
      color #333 !important;
    }
  }
</style>
