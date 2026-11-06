<template>
  <div style="height: 100vh;">
    <srm-list
      :scrollable="false"
      height="auto"
      style="height: auto"
      :data-set="dataSet"
      :columns="lineColumns"
      customize-code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.RELEVANT_PRICE"
      @itemClick="onItemClick"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDs from "../datasource/RelevantPriceDs";
import LadderQuotation from "./LadderQuotation";
import ViewScope from "./ViewScope";
import {
  getViewScopeList,
  getScopeDetailListApi
} from "../api/NewPriceApproval";
export default {
  modules: [ "ssrc.priceLibraryNew", "ssrc.priceLibrary", "ssrc.inquiryHall", "ssrc.supplyInfoChange" ],
  name: "RelevantPrice",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ViewScope,
  },
  props: {
    priceLibId: {
      type: String,
    },
    fromPriceLibId: {
      type: String,
    },
    dimensionId: {
      type: String,
    },
    templateCode: {
      type: String,
    },
  },
  data() {
    return {
      dataSet: new DataSet(indexDs(this.priceLibId, this.templateCode, this.dimensionId, this.fromPriceLibId)),
    };
  },
  computed: {
    lineColumns() {
      return [
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.priceLibNumber").$D("价格编号"),
          fieldType: "TEXT",
          fieldCode: "priceLibNumber",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.priceLibrary.model.priceLibrary.approveStatus").$D("审批状态"),
          fieldType: "TEXT",
          fieldCode: "approvalStatusMeaning",
          formRow: 15,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.supplierCompanyIdMeaning").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyIdMeaning",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemID").$D("物料ID"),
          fieldType: "TEXT",
          fieldCode: "itemIdMeaning",
          formRow: 30,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
          formRow: 30,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemCategoryIdMeaning").$D("物料品类"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryIdMeaning",
          formRow: 40,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxIncludedPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedPrice",
          formRow: 40,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.netPrice").$D("未税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "netPrice",
          formRow: 50,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.priceBatchQuantity").$D("价格批量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "priceBatchQuantity",
          formRow: 50,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perTaxIncludedPrice").$D("每一含税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "perTaxIncludedPrice",
          formRow: 60,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perNetPrice").$D("每一未税单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "perNetPrice",
          formRow: 70,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.view.message.ladderQuotation").$D("阶梯报价"),
          fieldType: "TEXT",
          fieldCode: "ladderQuotationFlag",
          formRow: 80,
          render: (val) => val === 1 ?
            <span style="color: var(--color-other-default-b)">{this.$T(
              "ssrc.priceLibraryNew.view.title.view"
            ).$D("查看")}</span> : <span>-</span>,
          callBack: (record) => {
            if (!record.ladderQuotationFlag) {
              return;
            }
            this.$loading.show();
            let priceLibId = record.priceLibId;
            this.$popup({
              title: this.$T(
                "ssrc.priceLibraryNew.view.message.ladderQuotation"
              ).$D("阶梯报价"),
              showHeader: false,
              showClose: false,
              showBack: false,
              height: "100vh",
              position: "bottom",
              content:
                <LadderQuotation priceLibId={priceLibId} dataHeader={record} />
              ,
            });
            this.$loading.hide();
          },
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.viewScope").$D("适用范围"),
          fieldType: "TEXT",
          fieldCode: "viewScope",
          formRow: 80,
          render: () => <span style="color: var(--color-other-default-b)">{this.$T(
            "ssrc.priceLibraryNew.view.title.view"
          ).$D("查看")}</span>,
          callBack: (record) => {
            this.$loading.show();
            let priceLibId = record.priceLibId;
            new Promise((resolve) => {
              getViewScopeList(priceLibId).then((result) => {
                let arr = [];
                for (let i = 0; i < result.length; i++) {
                  let temp = {
                    firstFlag:true,
                    dataCode:null,
                    dataName:result[i].dimensionName,
                    key:result[i].dimensionCode,
                    dimensionCode:result[i].dimensionCode,
                    parentKey:null
                  };
                  arr.push(temp);
                }
                resolve(arr);
              });
            }).then((res) => {
              this.getScopeDetailAll(priceLibId, res);
            }).finally(() => {
              this.$loading.hide();
            });
          },
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.companyIdMeaning").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyIdMeaning",
          formRow: 90,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ouIdMeaning").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouIdMeaning",
          formRow: 100,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.invOrganizationIdMeaning").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationIdMeaning",
          formRow: 110,
        },
        {
          fieldName: this.$T("ssrc.priceLibrary.model.library.buyer").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentIdMeaning",
          formRow: 120,
        },
      ];
    },
  },
  methods: {
    async getScopeDetailAll(priceLibId, arr) {
      this.$loading.show();
      this.treeList = [];
      this.treeList = arr;
      const promise = arr.map((i) => new Promise((resolve) => {
        getScopeDetailListApi(priceLibId, i.dimensionCode).then((res) => {
          let arrTemp = [];
          for (let j = 0; j < res.length; j++) {
            if (!res[j].parentKey) {
              res[j].parentKey = i.dimensionCode;
            }
            let temp1 = {
              firstFlag:false,
              dataCode:res[j].dataCode,
              dataName:res[j].dataName,
              key:res[j].key !== null ? res[j].key : i.dimensionCode + j,
              dimensionCode:res[j].dimensionCode,
              parentKey:res[j].parentKey
            };
            arrTemp.push(temp1);
          }
          resolve(arrTemp);
        });
      }).then((item) => {
        let temp = JSON.stringify(item);
        let t1 = JSON.parse(temp);
        this.treeList = this.treeList.concat(t1);
      }));
      await Promise.all(promise);
      this.$loading.hide();
      this.$popup({
        showHeader: false,
        showClose: false,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content: <ViewScope list={this.treeList} />,
      });
    },
    onItemClick() {
      this.$popup({
        title: this.$T("ssrc.priceLibraryNew.excel.fileName").$D("价格信息"),
        showHeader: false,
        showClose: false,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content:
          <SrmForm
            style="padding: 0 15px;"
            customizeType="detail"
            columns={this.lineColumns}
            data-set={this.dataSet}
          />
        ,
      });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
