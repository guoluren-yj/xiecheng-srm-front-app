<template>
  <srm-list
    :scrollable="false"
    height="auto"
    style="height: auto"
    :columns="getColumns"
    :data-set="ds"
    customize-code="SMBL.WORKFLOW.ORDER_GIFTINFO"/>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "sodr.workspace" ],
  name: "GiftInfo",
  props: {
    poHeaderId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      ds: new DataSet({
        autoQuery: true,
        selection: 0,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: true,
        queryParameter:{
          customizeUnitCode: "SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.GIFTINFO"
        },
        pathParameter: {
          organizationId: SrmUtil.getTenantId(),
          poHeaderId: this.poHeaderId,
        },
        transport: {
          read: {
            url: "/spuc/v1/{organizationId}/po-line-gifts/{poHeaderId}",
            method: "get",
          },
        },
      }),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.itemName").$D(
            "物料名称"
          ),
          fieldType: "EMPTY",
          fieldCode: "itemName",
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ "font-size": "14px", "font-weight": "bold" }}>
                {val || "-"}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.order").$D("序号"),
          fieldCode: "order",
          render: (val, item, field, record) => record.index + 1,
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.displayLineNum").$D(
            "赠品来源行号"
          ),
          fieldCode: "giftSourceDisplayLineNum",
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.categoryId").$D(
            "物料类别"
          ),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.quantity").$D(
            "数量"
          ),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.uomId").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T(
            "sodr.workspace.model.giftInfo.enteredTaxIncludedPrice"
          ).$D("单价（含税）"),
          fieldCode: "enteredTaxIncludedPrice",
        },
        {
          fieldName: this.$T("sodr.workspace.model.giftInfo.unitPrice").$D(
            "单价（不含税）"
          ),
          fieldCode: "unitPrice",
        },
        {
          fieldName: this.$T("sodr.workspace.model.common.needByDate").$D(
            "需求日期"
          ),
          fieldCode: "needByDate",
          // eslint-disable-next-line new-cap
          render: (val) => this.$options.filters["CalcDate"](val),
        },
      ];
    },
  },
  methods: {
    // formatAumont(aumont, precision, isSupplement) {
    //   if (isNaN(parseFloat(aumont))) {
    //     return null;
    //   }
    //   const decimal = String(aumont).split(".")[1];
    //   let newPrecision = Number(precision);
    //   newPrecision = isNaN(newPrecision) ? null : newPrecision > 20 ? 20 : newPrecision;
    //   if ((decimal && decimal.length && decimal.length < newPrecision || !decimal) && !isSupplement) {
    //     newPrecision = null;
    //   }
    //   return SrmMath.toFormat(aumont, newPrecision, BigNumber.ROUND_HALF_CEIL);
    // }
  },
};
</script>

<style lang="stylus" scoped></style>
