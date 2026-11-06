<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.baseInfo').$D('基本信息')">
        <srm-form :data-set="headerDataDs" :columns="getBaseInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.reviewFile').$D('评审表预览')">
        <srm-form :data-set="headerDataDs" :columns="getFileReview" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.detailLine').$D('评审表明细信息')">
        <srm-form :data-set="headerDataDs" :columns="getSupplierList" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="visibleBack" title="" height="90%" show-back :show-close="false" header-align="left" @onClose="onClose">
      <srm-list
        :data-set="lineDataDs"
        :columns="getItemColumns"/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs, supplierDs, lineDs } from "../datasource/index";
import { isEmpty } from "@/utils/index";
export default {
  modules: [ "scux.HbsrmReviewSelectForm", "hipspfm.common" ],
  name: "HbsrmReviewReadForm",
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
      supplierDataDs: new DataSet(supplierDs()),
      lineDataDs: new DataSet(lineDs()),
      nowSupplierRecord: "", // 确认时使用
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "rfxSplitNum",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitNum").$D("评审表编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "docStatusMeaning",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.docStatus").$D("评审表状态"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "templateName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.templateName").$D("寻源模板"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxTitle",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxTitle").$D("标题"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sourceProjectNum",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectNum").$D("项目编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sourceProjectName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectName").$D("项目名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "lastApprover",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApprover").$D("审批人"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "lastApproverComment",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApproverComment").$D("审批意见"),
          fieldType: "TEXT",
        },
      ];
    },
    getFileReview() {
      return [
        {
          fieldCode: "rfxSplitUuid",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitUuid").$D("评审表附件"),
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
        },
      ];
    },
    getSupplierList() {
      return [
        {
          fieldCode: "bidding",
          fieldType: "EMPTY",
          formRow: 90,
          render: () => {
            const data = this.supplierDataDs.toData();
            return <srm-flex>
              <table>
                <tr>
                  <th>{this.$T("scux.HbsrmReviewSelectForm.model.quotationSupplier").$D("报价供应商")}</th>
                  <th>{this.$T("scux.HbsrmReviewSelectForm.model.taxIncludedAmountSum").$D("总金额（元）")}</th>
                </tr>
                {
                  isEmpty(data) &&
                  <tr>
                    <td colspan="2">{this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据")}</td>
                  </tr>
                }
                {
                  this.supplierDataDs.records.map((item, index) => <tr>
                    <td>
                      <a onClick={() => {
                        this.openModal(index);
                      }}>
                        {item.get("supplierCompanyName")}
                      </a>
                    </td>
                    <td>{item.get("taxIncludedAmountSum")}</td>
                  </tr>)
                }
              </table>
            </srm-flex>;
          }
        }
      ];
    },
    getItemColumns() {
      return [
        {
          fieldCode: "rfxLineItemNum",
          fieldType: "EMPTY",
          render: (val, record) => <span onClick={() => {
            this.goSourceDetail(record);
          }} style="fontWeight: bold; color: #00BFBF">{ (record.rfxNum || "") + "-" + record.rfxLineItemNum }</span>,
        },
        {
          fieldCode: "ouName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.ouName").$D("公司"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.itemCode").$D("物料编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.itemName").$D("物料名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "specifications",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.specification").$D("规格型号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "uomName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.uomName").$D("单位"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxQuantity").$D("数量"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "currentQuotationQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.currentQuotationQuantity").$D("可供数量"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.unitPrice").$D("单价（元）"),
          fieldType: "TEXT",
        },
      ];
    }
  },
  created() {
    this.headerDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId });
    this.headerDataDs.refresh();
    this.supplierDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId });
    this.supplierDataDs.refresh();
  },
  mounted() {
  },
  methods: {
    openModal(index) {
      // 拿到点击的供应商行数据
      const record = this.supplierDataDs.get(index);
      this.nowSupplierRecord = record;
      // 创建弹窗的行信息ds
      this.lineDataDs = new DataSet({ ...lineDs() });
      // 行信息查询
      const supplierCompanyId = record.get("supplierCompanyId");
      this.lineDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId, "supplierCompanyId": supplierCompanyId });
      this.lineDataDs.refresh();
      this.visibleBack = true;
      // 设置标题
      setTimeout(() => {
        const titleDom = document.getElementsByClassName("srm-list-search-line")[0];
        const childElement = document.createElement("div");
        childElement.id = "titleSupplier";
        childElement.innerHTML = record.get("supplierCompanyName");
        childElement.style.marginLeft = "10%";
        childElement.style.fontSize = "16px";
        childElement.style.fontWeight = "400";
        titleDom.appendChild(childElement);
      }, 200);
    },
    onClose() {
      const titleDom = document.getElementsByClassName("srm-list-search-line")[0];
      const childElement = document.getElementById("titleSupplier");
      titleDom.removeChild(childElement);
    },
    goSourceDetail(record) {
      const { rfxHeaderId, itemCode } = record;
      this.$router.push({ path: "/appSour/PricingApprovalNew", query: { rfxHeaderIds: rfxHeaderId, secondarySourceCategory: itemCode, } });
    },
  },
};
</script>

<style lang="stylus" scoped>
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
