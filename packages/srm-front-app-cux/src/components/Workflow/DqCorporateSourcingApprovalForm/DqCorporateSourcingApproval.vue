<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.sourcingApproval.view.message.baseInfo').$D('基本信息')">
        <srm-form :data-set="headerDataSet" :columns="getBaseInfoColumns" style="min-height: 100%" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.sourcingApproval.detail.costInfo').$D('成本备注')">
        <srm-form :data-set="headerDataSet" :columns="getCostInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.sourcingApproval.view.title.fullQuotationDetails').$D('全部报价明细')">
        <srm-list :scrollable="false" :data-set="quotationDataSet" :columns="quotationColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.sourcingApproval.view.title.supplierList').$D('供应商列表')">
        <srm-collapse :max-open="1" @change="onChange">
          <div v-if="JSON.stringify(supplierInfo) === '[]'" class="noContent">
            <span>{{ $T('smbl.common.view.noDocumentInformation').$D('暂无单据信息') }}</span>
          </div>
          <div v-for="(item, headerIndex) in supplierInfo" v-else :key="headerIndex">
            <srm-collapse-item :name="item.supplierCompanyId">
              <p>{{ item.supplierCompanyIdMeaning }}</p>
              <div slot="content">
                <srm-flex justify="between" style="padding: 1vw 2vw;">
                  <srm-button size="small" icon="icon-paperclip">
                    <srm-attachment-button :attachments="[
                                             {
                                               attachmentUuid: item.cuxBusinessAttachmentUuid,
                                               readonly: true,
                                               uploadButton: 'none',
                                               bucketName: 'private-bucket'
                                             }
                                           ]" show-total
                                           :title="$T('scux.sourcingApproval.model.businessAttachmentUuid').$D('商务附件')" />
                  </srm-button>
                  <srm-button size="small" icon="icon-paperclip">
                    <srm-attachment-button :attachments="[
                                             {
                                               attachmentUuid: item.cuxTechAttachmentUuid,
                                               readonly: true,
                                               uploadButton: 'none',
                                               bucketName: 'private-bucket'
                                             }
                                           ]" show-total
                                           :title="$T('scux.sourcingApproval.model.techAttachmentUuid').$D('技术附件')" />
                  </srm-button>
                  <srm-button size="small" icon="icon-paperclip">
                    <srm-attachment-button :attachments="[
                                             {
                                               attachmentUuid: item.cuxProcessAttachmentUuid,
                                               readonly: true,
                                               uploadButton: 'none',
                                               bucketName: 'private-bucket'
                                             }
                                           ]" show-total
                                           :title="$T('scux.sourcingApproval.model.cuxProcessAttachmentUuid').$D('过程附件')" />
                  </srm-button>
                </srm-flex>
                <srm-flex justify="between" style="padding: 1vw 4vw; font-size: 14px;">
                  <div style="width: 30%;">
                    {{ $T("scux.sourcingApproval.model.inquiryHall.score").$D("总分") }}：{{
                      item.sumPassStatus || item.score }}
                  </div>
                  <div style="width: 30%;">
                    {{ $T("scux.sourcingApproval.model.inquiryHall.technologyScore").$D("技术评分") }}：{{
                      item.technologyPassStatus || item.technologyScore }}
                  </div>
                  <div style="width: 30%;">
                    {{ $T("scux.sourcingApproval.model.inquiryHall.businessScore").$D("商务评分") }}：{{
                      item.businessPassStatus || item.businessScore }}
                  </div>
                </srm-flex>
                <srm-list :scrollable="false" :data-set="supplierLineDataSet"
                          :columns="supplierLineColumns" />
              </div>
            </srm-collapse-item>
          </div>
        </srm-collapse>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { quotationDs, supplierLineDs, headerDs } from "./dataSource";
import { getSupplierInfoApi } from "./api";

export default {
  modules: [ "scux.sourcingApproval", "hipspfm.common", "smbl.common" ],
  fieldCode: "DqCorporateSourcingApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      supplierInfo: [],
      lineDs: {},
      headerDataSet: new DataSet(headerDs(this.changeReqId)),
      quotationDataSet: new DataSet(quotationDs(this.changeReqId)),
      supplierLineDataSet: new DataSet(supplierLineDs(this.changeReqId)),
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "rfxNum",
          fieldName: $T("scux.sourcingApproval.model.rfxNum").$D("单号"),
          formCol: 1,
          formRow: 1,
        },
        {
          fieldCode: "rfxTitle",
          fieldName: $T("scux.sourcingApproval.model.rfxTitle").$D("标题"),
          formCol: 1,
          formRow: 2,
        },
        {
          fieldCode: "invOrganizationIdMeaning",
          fieldName: $T("scux.sourcingApproval.model.invOrganizationName").$D(
            "工厂"
          ),
          formCol: 1,
          formRow: 3,
        },
        {
          fieldCode: "sourceCategoryMeaning",
          fieldName: $T("scux.sourcingApproval.model.sourceCategoryMeaning").$D(
            "寻源类别"
          ),
          formCol: 1,
          formRow: 4,
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldName: $T("scux.sourcingApproval.model.sourceMethodMeaning").$D(
            "寻源方式"
          ),
          formCol: 2,
          formRow: 4,
        },
        {
          fieldCode: "attributeVarchar28",
          fieldName: $T("scux.sourcingApproval.model.checkAttachmentUuid").$D(
            "集采定价附件"
          ),
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          formCol: 1,
          formRow: 5,
        },
        {
          fieldCode: "attributeVarchar28Version",
          fieldName: $T(
            "scux.sourcingApproval.model.attributeVarchar28Version"
          ).$D("集采定价附件版本"),
          formCol: 2,
          formRow: 5,
        },
        {
          fieldCode: "attributeVarchar10",
          fieldName: $T("scux.sourcingApproval.model.TradingFlag").$D(
            "是否关联交易"
          ),
          formCol: 1,
          formRow: 6,
          render: (val) => <span>{[ "0", $T("hipspfm.common.status.no").$D(
            "否"
          ) ].includes(val) ? $T("hipspfm.common.status.no").$D(
              "否"
            ) : [ "1", $T("hipspfm.common.status.yes").$D(
              "是"
            ) ].includes(val) ? $T("hipspfm.common.status.yes").$D(
                "是"
              ) : "-"}</span>,
        },
        {
          fieldCode: "attributeVarchar11",
          fieldName: $T("scux.sourcingApproval.model.engineeringFlag").$D(
            "是否工程类"
          ),
          formCol: 2,
          formRow: 6,
        },
        {
          fieldCode: "attributeVarchar20",
          fieldName: $T(
            "scux.sourcingApproval.model.semiconductorSecurityFlag"
          ).$D("是否半导体保密"),
          formCol: 1,
          formRow: 7,
          render: (val) => <span>{[ "0", $T("hipspfm.common.status.no").$D(
            "否"
          ) ].includes(val) ? $T("hipspfm.common.status.no").$D(
              "否"
            ) : [ "1", $T("hipspfm.common.status.yes").$D(
              "是"
            ) ].includes(val) ? $T("hipspfm.common.status.yes").$D(
                "是"
              ) : "-"}</span>,
        },
        {
          fieldCode: "attributeVarchar12Meaning",
          fieldName: $T("scux.sourcingApproval.model.purchasingDepartment").$D(
            "申购部门"
          ),
          formCol: 2,
          formRow: 7,
        },
        {
          fieldCode: "attributeVarchar13Meaning",
          fieldName: $T("scux.sourcingApproval.model.relevantDepartment").$D(
            "相关部门"
          ),
          formCol: 1,
          formRow: 8,
        },
        {
          fieldCode: "sourceTypeMeaning",
          fieldName: $T("scux.sourcingApproval.model.sourceType").$D("寻源类型"),
          formCol: 2,
          formRow: 8,
        },
        {
          fieldCode: "attributeVarchar17",
          fieldName: $T("scux.sourcingApproval.model.headquartersInquiryFlag").$D(
            "是否总部询价"
          ),
          formCol: 1,
          formRow: 9,
        },
        {
          fieldCode: "attributeVarchar16",
          fieldName: $T("scux.sourcingApproval.model.attributeVarchar16").$D(
            "是否半导体、二期项目"
          ),
          formCol: 1,
          formRow: 10,
        },
        {
          fieldCode: "checkRemark",
          fieldName: $T("scux.sourcingApproval.model.checkRemark").$D("核价备注"),
          formCol: 1,
          formRow: 11,
          render: (val) => <srm-textarea-field value={val} editor={false} autoSize={{ minRows: 1, maxRows: 4 }} />,
        },
        {
          fieldCode: "rfxRemark",
          fieldName: $T("scux.sourcingApproval.model.rfxRemark").$D("备注"),
          formCol: 1,
          formRow: 12,
          render: (val) => <srm-textarea-field value={val} editor={false} autoSize={{ minRows: 1, maxRows: 4 }} />,
        },
      ];
    },
    getCostInfoColumns() {
      return [
        {
          fieldCode: "totalPrice2",
          fieldType: "TEXT",
          fieldName: $T("scux.sourcingApproval.model.totalCost").$D("核价总金额"),
        },
        {
          fieldCode: "attributeVarchar3",
          fieldName: $T("scux.sourcingApproval.model.totalCostUp").$D(
            "核价总金额大写"
          ),
        },
      ];
    },
    quotationColumns() {
      return [
        {
          fieldCode: "rfxLineItemNum",
          formCol: 1,
          formRow: 1,
        },
        {
          fieldCode: "suggestedFlagMeaning",
          formCol: 2,
          formRow: 1,
        },
        {
          fieldCode: "supplierCompanyIdMeaning",
          formCol: 1,
          formRow: 2,
        },
        {
          fieldCode: "itemName",
          formCol: 1,
          formRow: 3,
        },
        {
          fieldCode: "itemCode",
          formCol: 1,
          formRow: 4,
        },
        {
          fieldCode: "specs",
          formCol: 2,
          formRow: 4,
        },
        {
          fieldCode: "rfxQuantity",
          formCol: 1,
          formRow: 5,
        },
        {
          fieldCode: "secondaryUomIdMeaning",
          formCol: 2,
          formRow: 5,
        },
        {
          fieldCode: "validQuotationPrice",
          formCol: 1,
          formRow: 6,
        },
        {
          fieldCode: "validNetPrice",
          formCol: 2,
          formRow: 6,
        },
        {
          fieldCode: "priceBatchQuantity",
          formCol: 1,
          formRow: 7,
        },
        {
          fieldCode: "freightIncludedFlagMeaning",
          formCol: 2,
          formRow: 7,
        },
        {
          fieldCode: "totalPrice",
          formCol: 1,
          formRow: 8,
        },
        {
          fieldCode: "validQuotationQuantity",
          formCol: 2,
          formRow: 8,
        },
        {
          fieldCode: "allottedQuantity",
          formCol: 1,
          formRow: 9,
        },
        {
          fieldCode: "allottedRatio",
          formCol: 2,
          formRow: 9,
        },
        {
          fieldCode: "taxIncludedFlagMeaning",
          formCol: 1,
          formRow: 10,
        },
        {
          fieldCode: "taxRate",
          formCol: 2,
          formRow: 10,
        },
        {
          fieldCode: "validPromisedDate",
          formCol: 1,
          formRow: 11,
        },
        {
          fieldCode: "validDeliveryCycle",
          formCol: 2,
          formRow: 11,
        },
        {
          fieldCode: "candidateSuggestion",
          formCol: 1,
          formRow: 12,
        },
        {
          fieldCode: "suggestedRemark",
          formCol: 1,
          formRow: 13,
        },
        {
          fieldCode: "validQuotationRemark",
          formCol: 1,
          formRow: 14,
        },
      ];
    },
    supplierLineColumns() {
      return [
        {
          fieldCode: "rfxLineItemNum",
          formCol: 1,
          formRow: 1,
        },
        {
          fieldCode: "suggestedFlagMeaning",
          formCol: 2,
          formRow: 1,
        },
        {
          fieldCode: "itemName",
          formCol: 1,
          formRow: 2,
        },
        {
          fieldCode: "itemCode",
          formCol: 1,
          formRow: 3,
        },
        {
          fieldCode: "specs",
          formCol: 2,
          formRow: 3,
        },
        {
          fieldCode: "rfxQuantity",
          formCol: 1,
          formRow: 4,
        },
        {
          fieldCode: "secondaryUomIdMeaning",
          formCol: 2,
          formRow: 4,
        },
        {
          fieldCode: "validQuotationPrice",
          formCol: 1,
          formRow: 5,
        },
        {
          fieldCode: "validNetPrice",
          formCol: 2,
          formRow: 5,
        },
        {
          fieldCode: "priceBatchQuantity",
          formCol: 1,
          formRow: 6,
        },
        {
          fieldCode: "freightIncludedFlagMeaning",
          formCol: 2,
          formRow: 6,
        },
        {
          fieldCode: "totalPrice",
          formCol: 1,
          formRow: 7,
        },
        {
          fieldCode: "validQuotationQuantity",
          formCol: 2,
          formRow: 7,
        },
        {
          fieldCode: "allottedQuantity",
          formCol: 1,
          formRow: 8,
        },
        {
          fieldCode: "allottedRatio",
          formCol: 2,
          formRow: 8,
        },
        {
          fieldCode: "taxIncludedFlagMeaning",
          formCol: 1,
          formRow: 9,
        },
        {
          fieldCode: "taxRate",
          formCol: 2,
          formRow: 9,
        },
        {
          fieldCode: "validPromisedDate",
          formCol: 1,
          formRow: 10,
        },
        {
          fieldCode: "validDeliveryCycle",
          formCol: 2,
          formRow: 10,
        },
        {
          fieldCode: "suggestedRemark",
          formCol: 1,
          formRow: 11,
        },
        {
          fieldCode: "validQuotationRemark",
          formCol: 1,
          formRow: 12,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          fieldName: $T("scux.sourcingApproval.model.attachmentUuid").$D(
            "供应商行附件"
          ),
          formCol: 1,
          formRow: 13,
        },
        {
          fieldCode: "quotationLineStatusMeaning",
          formCol: 2,
          formRow: 13,
        },
        {
          fieldCode: "supplierCompanyNum",
          formCol: 1,
          formRow: 14,
        },
        {
          fieldCode: "stageDescription",
          formCol: 2,
          formRow: 14,
        },
        {
          fieldCode: "validExpiryDateFrom",
          formCol: 1,
          formRow: 15,
        },
        {
          fieldCode: "validExpiryDateTo",
          formCol: 1,
          formRow: 16,
        },
        {
          fieldCode: "minPurchaseQuantity",
          formCol: 1,
          formRow: 17,
        },
        {
          fieldCode: "minPackageQuantity",
          formCol: 2,
          formRow: 17,
        },
        {
          fieldCode: "freightIncludedFlagMeaning",
          formCol: 1,
          formRow: 18,
        },
        {
          fieldCode: "freightAmount",
          formCol: 2,
          formRow: 18,
        },
        {
          fieldCode: "preQuotationPrice",
          formCol: 1,
          formRow: 19,
        },
        {
          fieldCode: "priceFluctuation",
          formCol: 2,
          formRow: 19,
        },
        {
          fieldCode: "paymentTypeIdMeaning",
          formCol: 1,
          formRow: 20,
        },
        {
          fieldCode: "paymentTermIdMeaning",
          formCol: 2,
          formRow: 20,
        },
        {
          fieldCode: "origin",
          formCol: 1,
          formRow: 21,
        },
        {
          fieldCode: "itemCategoryIdMeaning",
          formCol: 2,
          formRow: 21,
        },
        {
          fieldCode: "prDisplayNum",
          formCol: 1,
          formRow: 22,
        },
        {
          fieldCode: "prDisplayLineNum",
          formCol: 2,
          formRow: 22,
        },
      ];
    },
  },
  created() {
  },
  async mounted() {
    const supplier = await getSupplierInfoApi(this.changeReqId);
    this.supplierInfo = [ ...supplier.content ];
  },
  methods: {
    onChange(val) {
      this.supplierLineDataSet.addBodyParameter("supplierCompanyId", val[0]);
      this.supplierLineDataSet.refresh();
    }
  },
};
</script>

<style scoped lang="stylus">
  .price-execute-approval {
    width: 100%;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    >>> .srm-line-tab {
      height: 100%;
    }
    >>> .srm-line-tab-content {
      background-color: var(--color-border-default);
    }

    >>> .srm-tab-pane {
      background-color: var(--color-border-default);
    }
    >>> .srm-tab-pane-title {
      background-color: var(--color-border-default);
    }
  }
  </style>