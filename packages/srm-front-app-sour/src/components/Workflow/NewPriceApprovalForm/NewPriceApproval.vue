<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item
      :label="$T('ssrc.priceExpandStrategy.view.tab.basicInfos').$D('基础信息')">
      <div>
        <customize
          :columns="headColumns"
          :need-padding="true"
          type="list"
          :data-source="head"
          code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.BASIC" />
      </div>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item
      :label="$T('ssrc.priceLibraryNew.excel.fileName').$D('价格信息')" >
      <srm-list
        :data-set="dataSet"
        :scrollable="false"
        height="auto"
        style="height: auto"
        :columns="lineColumns"
        customize-code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.PRICE_DETAIL"
        @itemClick="onItemClick" />
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDs from "./datasource/NewPriceApproveDs";
import {
  getRequestStatus,
  getNewPriceHeadDetail,
  getDimensionId,
  getViewScopeList,
  getScopeDetailListApi
} from "./api/NewPriceApproval";
import { getStatusCodeColor } from "./utils";
import LadderQuotation from "./components/LadderQuotation";
import RelevantPrice from "./components/RelevantPrice";
import ViewScope from "./components/ViewScope";
export default {
  modules: [ "ssrc.priceLibraryNew", "ssrc.priceExpandStrategy", "ssrc.priceLibrary", "ssrc.supplyInfoChange", "ssrc.searchResultImport", "ssrc.inquiryHall" ],
  name: "NewPriceApproval",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LadderQuotation,
    // eslint-disable-next-line vue/no-unused-components
    ViewScope,
    // eslint-disable-next-line vue/no-unused-components
    RelevantPrice,
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      treeList: [],
      head: {},
      ReqStatusList: [], //状态
      ReqTypeList: [], //类型
      dataSet: new DataSet(
        indexDs(this.parameters.requestId, this.parameters.templateCode)
      ),
    };
  },
  computed: {
    headColumns() {
      return [
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.requestNum").$D("申请单号"),
          fieldType: "TEXT",
          fieldCode: "requestNum",
          formRow: 10,
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span style="font-weight: initial">{val}</span>
            <srm-tag size="mid" slot="right" type={getStatusCodeColor(item.requestStatus)}>{this.transReqStatus(item.requestStatus, "REQSTATUS")}</srm-tag>
          </srm-list-header>,
        },
        // {
        //   fieldName: this.$T("ssrc.priceLibraryNew.model.library.requestStatus").$D("状态"),
        //   fieldType: "TEXT",
        //   lovCode: "SSRC.PRICE_LIB_REQUEST_STATUS",
        //   fieldCode: "requestStatus",
        //   formRow: 20,
        //   render: (val) => this.transReqStatus(val, "REQSTATUS"),
        // },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.reqType").$D("变更类型"),
          fieldType: "TEXT",
          fieldCode: "reqType",
          formRow: 20,
          render: (val) => this.transReqStatus(val, ""),
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.creationDate").$D("创建日期"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
          formRow: 30,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.realName").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "realName",
          formRow: 40,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.attachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid",
          formRow: 40,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.updateRemark").$D("更新说明"),
          fieldType: "TEXT",
          fieldCode: "remark",
          formRow: 50,
        },
      ];
    },
    formColumns() {
      let arr = this.lineColumns;
      arr[0] = {
        fieldName: this.$T("ssrc.priceLibraryNew.model.library.priceLibNumber").$D("价格编号"),
        fieldType: "TEXT",
        fieldCode: "priceLibNumber",
        formRow: 10,
      };
      return arr.concat([
        {
          fieldName: this.$T("ssrc.priceLibraryNew.view.title.relevantPrice").$D("相关价格"),
          fieldType: "TEXT",
          fieldCode: "relevantPrice",
          formRow: 90,
          render: () => <span style="color: var(--color-other-default-b)">{this.$T(
            "ssrc.priceLibraryNew.view.title.view"
          ).$D("查看")}</span>,
          callBack: (record) => {
            this.$loading.show();
            let priceLibId = record.priceLibId;
            new Promise((resolve) => {
              getDimensionId(this.parameters.templateCode).then((res) => {
                let s = "";
                res.find((v) => {
                  if (v.dimensionCode === "relevantPrice") {
                    s = v.dimensionId;
                  }
                });
                resolve(s);
              });
            }).then((res) => {
              this.$popup({
                showHeader: false,
                showClose: false,
                showBack: false,
                height: "100vh",
                position: "bottom",
                content: <RelevantPrice priceLibId={priceLibId} fromPriceLibId={record.fromPriceLibId} dimensionId={res} templateCode={this.parameters.templateCode} />,
              });
            }).finally(() => {
              this.$loading.hide();
            });
          },
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
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ouIdMeaning").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouIdMeaning",
          formRow: 110,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.invOrganizationIdMeaning").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationIdMeaning",
          formRow: 120,
        },
        {
          fieldName: this.$T("ssrc.priceLibrary.model.library.buyer").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentIdMeaning",
          formRow: 130,
        },
      ]);
    },
    lineColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "priceLibNumber",
          formRow: 10,
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span>{val}</span>
            <srm-tag size="mid" slot="right" type={getStatusCodeColor(item.approvalStatus)}>{item.approvalStatusMeaning}</srm-tag>
            <span slot="right" class="srm-icon icon-chevron-right" style={{ marginLeft: "8px", fontSize: "16px", color: "var(--color-default)" }} />
          </srm-list-header>,
        },
        // {
        //   fieldName: this.$T("ssrc.priceLibrary.model.priceLibrary.approveStatus").$D("审批状态"),
        //   fieldType: "TEXT",
        //   fieldCode: "approvalStatusMeaning",
        //   formRow: 15,
        // },
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
                <LadderQuotation priceLibId={priceLibId} dataHeader={record} />,
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
          formRow: 100,
        },
      ];
    },
  },
  mounted() {
    this.getApprovalDetail();
    this.getReqStatusList();
  },
  methods: {
    async getScopeDetailAll(priceLibId, arr) {
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
        showHeader: false,
        showClose: false,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content:
          <SrmForm
            style="padding: 0 15px;"
            customize-code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.PRICE_DETAIL"
            customizeType="detail"
            columns={this.formColumns}
            data-set={this.dataSet}
          />
        ,
      });
    },
    //状态
    async getReqStatusList() {
      this.ReqStatusList = await getRequestStatus("SSRC.PRICE_LIB_REQUEST_STATUS");
      this.ReqTypeList = await getRequestStatus("SSRC.PLM_REQ_STATUS");
    },
    transReqStatus(value, type) {
      let s = "";
      if (type === "REQSTATUS") {
        this.ReqStatusList.find((v) => {
          if (v.value === value) {
            s = v.meaning;
          }
        });
      } else {
        this.ReqTypeList.find((v) => {
          if (v.value === value) {
            s = v.meaning;
          }
        });
      }
      return s;
    },
    async getApprovalDetail() {
      this.head = await getNewPriceHeadDetail(
        this.parameters.requestId,
        this.parameters.templateCode
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .open-tag::before {
  display: none;
}
>>> .srm-list-item-card-head-left {
  max-width: 80% !important;
}
>>> .srm-field-value {
  font-size: inherit;
}
.srm-header-text {
  font-weight: normal;
}
</style>
