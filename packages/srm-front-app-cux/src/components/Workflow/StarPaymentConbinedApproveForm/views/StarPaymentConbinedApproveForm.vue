<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.paymentConbined.view.baseInfo').$D('基本信息')">
        <srm-form :data-set="headerDataDs" :columns="getBaseInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.paymentConbined.view.detailLine').$D('付款申请明细')">
        <srm-list
          class="star-list-seach"
          :data-set="lineDataDs"
          :columns="getItemColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs, lineDs } from "../datasource/index";
import { thousandBitSeparator } from "../../../../utils/filter";
export default {
  modules: [ "scux.paymentConbined", "smbl.common" ],
  name: "StarPaymentConbinedApproveForm",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      visibleBack: false, // 弹窗显隐
      headerDataDs: new DataSet(headerDs()),
      lineDataDs: new DataSet(lineDs()),
      nowSupplierRecord: "", // 确认时使用
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "documentCode",
          fieldName: $T("scux.paymentConbined.model.documentCode").$D("付款申请组合编号"),
          fieldType: "EMPTY",
          render: (val, record) => <div>
            <span>
              {record.documentCode}
            </span>
            <span style="fontWeight: bold; color: #00BFBF; margin-left: 50px">
              {record.documentApprovalStatusMeaning}
            </span>
          </div>,
        },
        {
          fieldCode: "paymentGroupName",
          fieldName: $T("scux.paymentConbined.model.paymentGroupName").$D("付款申请组合名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "remark",
          fieldName: $T("scux.paymentConbined.model.remark").$D("付款组合摘要"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sumTaxIncludedAmount",
          fieldName: $T("scux.paymentConbined.model.sumTaxIncludedAmount").$D("付款组合汇总金额（含税）"),
          fieldType: "TEXT",
          render: (val, record) => {
            if (typeof record.sumTaxIncludedAmount !== "undefined" && typeof record.sumTaxIncludedAmount !== "object") {
              return <span>{thousandBitSeparator(record.sumTaxIncludedAmount)}</span>;
            }
          }
        },
        {
          fieldCode: "firstUnitName",
          fieldName: $T("scux.paymentConbined.model.firstUnitName").$D("大部门"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("scux.paymentConbined.model.creationDate").$D("创建日期"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "totalAttachmentUuid",
          fieldName: $T("scux.paymentConbined.model.totalAttachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
        },
      ];
    },
    getItemColumns() {
      return [
        {
          fieldCode: "settleNum",
          fieldName: $T("scux.paymentConbined.model.settleNum").$D("付款申请编号"),
          fieldType: "TEXT",
          render: (val, record) => <span onClick={() => {
            this.goSourceDetail(record);
          }} style="fontWeight: bold; color: #00BFBF;">{ record.settleNum }</span>,
        },
        {
          fieldCode: "supplierName",
          fieldName: $T("scux.paymentConbined.model.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "companyName",
          fieldName: $T("scux.paymentConbined.model.companyName").$D("法人公司"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "taxIncludedAmount",
          fieldName: $T("scux.paymentConbined.model.taxIncludedAmount").$D("付款申请金额(含税)"),
          fieldType: "TEXT",
          render: (val, record) => {
            if (typeof record.taxIncludedAmount !== "undefined" && typeof record.taxIncludedAmount !== "object") {
              return <span>{thousandBitSeparator(record.taxIncludedAmount)}</span>;
            }
          }
        },
        {
          fieldCode: "remark",
          fieldName: $T("scux.paymentConbined.model.remark").$D("付款申请摘要"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "paymentCreatedName",
          fieldName: $T("scux.paymentConbined.model.paymentCreatedBy").$D("付款创建人"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "unitName",
          fieldName: $T("scux.paymentConbined.model.createdUnitName").$D("创建人部门"),
          fieldType: "TEXT",
        },
      ];
    }
  },
  created() {
    this.headerDataDs.setQueryParameter({ "headerId": this.changeReqId });
    this.headerDataDs.refresh();
    this.lineDataDs.setQueryParameter({ "headerId": this.changeReqId });
    this.lineDataDs.refresh();
  },
  mounted() {
  },
  methods: {
    goSourceDetail(record) {
      const { settleHeaderId, documentType } = record;
      this.$router.push({
        path: "/appCpra/StarBucks-SettleSubmitApproval",
        query: {
          source: "detail",
          settleHeaderId: settleHeaderId,
          documentType: documentType,
          type: "ALL",
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.star-list-seach {
  >>>.srm-list-search-line {
    display: none;
  }
}
.srm-form{
  min-height: 10vh;
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
}
td {
  height: 30px;
  a {
    color: #00BFBF;
  }
  .srm-check-box{
    margin-top: 5px;
  }
}
</style>
