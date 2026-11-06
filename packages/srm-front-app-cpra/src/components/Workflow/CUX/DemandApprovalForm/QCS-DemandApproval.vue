<template>
  <div>
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <div ref="content" class="content">
          <srm-scroll-tab class="content">
            <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandHeadInfo').$D('需求头信息')" code="demandHeadInfo">
              <div ref="headInfo" class="infoContent headInfo">
                <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
                  <span>{{ $T("hipspfm.supplierDelivery.view.message.title.noDeliveryHeaderInfo").$D("暂无头信息") }}</span>
                </div>
                <ul v-else>
                  <customize :columns="getHeadColumns" :data-source="headInfo" />
                </ul>
              </div>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandLineInfo').$D('需求行信息')" code="demandLineInfo">
              <div ref="lineInfo" class="infoContent lineInfo">
                <srm-list
                  class="scoll-list"
                  :scrollable="false"
                  :columns="getLineColumns"
                  :data-set="prLineDataSet"
                  @itemClick="showLineInfoDetail"/>
                <!-- <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
                  <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
                </div>
                <div v-else>
                  <div v-for="(item,index) in lineInfo" :key="index" @click="showLineInfoDetail(item)">
                    <div class="headCompany">
                      <span class="block"/>
                      <span class="code">
                        <span class="materiel-name">{{ item.itemName }}</span>
                        <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}：{{ item.displayLineNum }}</span>
                      </span>
                    </div>
                    <ul>
                      <Customize :columns="getLineColumns" :data-source="item" />
                    </ul>
                    <div class="footInfo">
                      <span>{{ $T("sinv.common.model.common.neededDate").$D("需求日期") }}：</span>
                      <span>{{ item.requestDate|CalcDate }}</span>
                    </div>
                  </div>
                </div> -->
              </div>
            </srm-scroll-tab-item>
          </srm-scroll-tab>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="bottom">
        <section class="lineInfoDetail">
          <hips-nav-bar slot="header" :have-border="false">
            <div slot="left" class="left-button" @click="closeLineInfoDetail">
              <img class="image-gray-default" src="@/assets/Comp/icon_close_normal@3x.png" alt >
            </div>
            <div slot="center" class="header">{{ $T("sprm.purchaseRequisitionInquiry.view.title.requirementDetail").$D("需求明细") }}</div>
          </hips-nav-bar>
          <div class="lineHead">
            <customize-detail :columns="getLineDetailColumns" :data-source="lineInfoDetail"/>
            <div class="line-div">
              <span class="line-block"/>
            </div>
          </div>
        </section>
      </hips-popup>
    </section>
  </div>
</template>

<script>
import uuid from "uuid";
import { Popup, NavBar } from "hips";
import { DataSet } from "srm-mobile-ui";
import {
  getOrderHeaderInfoApi,
} from "./api";
import { purchaseRequisitionLineDS } from "./datasource/PurchaseRequisitionLineDS";

export default {
  modules: [ "sprm.common", "hipspfm.common", "hipspfm.supplierDelivery", "sinv.common", "sprm.purchaseRequisitionInquiry", "sodr.feedback", "sagm.common", "sslm.supplyAbility", "sodr.orderType", "sodr.common", "mallf.common", "sodr.confirmOrder", "sodr.sendOrder", "spuc.common", "spcm.common", "ssrc.projectDetailReport", "hipspfm.workFlowDemand" ],
  name: "QCSDemandApproval",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    lotFlag: {
      type: String | Number
    }
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      loading:false,
      scroll: "",
      show: false,
      navIndex: 0,
      uuid: "",
      contentLenArr: [],
      lineInfoDetail: {},
      prSourcePlatform: "",
      prLineDataSet:  new DataSet(purchaseRequisitionLineDS(this.changeReqId)), // 行信息
    };
  },
  computed:{
    // 头信息
    getHeadColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.feedback.model.feedback.create").$D("创建人"),
          fieldCode: "createByName",
        },
        {
          fieldName: this.$T("sprm.common.modal.unitName").$D("所属部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("sagm.common.model.area").$D("区域"),
          fieldCode: "attributeVarchar1Meaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.market").$D("市场"),
          fieldCode: "attributeBigint1Meaning",
        },
        {
          fieldName: this.$T("sodr.orderType.model.orderType.categoryIds").$D("采购品类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: "CE No",
          fieldCode: "ceNo",
          langCode: "sodr.common.model.ceNumber",
        },
        {
          fieldName: this.$T("mallf.common.view.delivery").$D("送货方式"),
          fieldCode: "attributeVarchar3Meaning",
        },
        {
          fieldName: this.$T("mallf.common.view.contactPhone").$D("联系电话"),
          fieldCode: "receiverTelNum",
        },
        {
          fieldName: this.$T("mallf.common.view.amount.remark").$D("费用说明"),
          fieldCode: "remark",
        },
      ];
      return columns;
    },
    // 收货/收单信息
    getAddressColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.receiverContactName").$D("收货联系人"),
          fieldCode: "receiverContactName",
        },
        {
          fieldName: this.$T("sodr.confirmOrder.model.common.receiverTelNum").$D("收货联系电话"),
          fieldCode: "receiverTelNum",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.shipToLocationAddress").$D("收货方地址"),
          fieldCode: "receiverAddressName",
        },
      ];
      return columns;
    },
    // 行信息
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldType: "EMPTY",
          fieldCode: "itemName",
          render: (val, item) => <srm-list-header>
            <span>{val || "-"}</span>
            <span slot="right">{item.displayLineNum}</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCategoryName").$D("商品品类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sodr.common.model.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.purLineCount").$D("数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("sprm.common.model.common.needDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "neededDate",
          render: (val, item) => item.neededDate || item.CalcDate,
        },
      ];
      return columns;
    },
    // 行信息详情
    getLineDetailColumns() {
      const columns = [
        // {
        //   fieldName: "尺寸（长）",
        //   fieldCode: "",
        //   langCode: "sodr.common.model.size.long",
        // },
        // {
        //   fieldName: "尺寸（宽）",
        //   fieldCode: "",
        //   langCode: "sodr.common.model.size.width",
        // },
        // {
        //   fieldName: "尺寸（高）",
        //   fieldCode: "",
        //   langCode: "sodr.common.model.size.height",
        // },
        // {
        //   fieldName: "面积",
        //   fieldCode: "",
        //   langCode: "sodr.common.model.common.area",
        // },
        {
          fieldName: this.$T("sinv.common.model.common.itemCategoryName").$D("商品品类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("spuc.common.model.common.uniqlo.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("spuc.common.model.common.uniqlo.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("mallf.common.view.costShopWarehouse").$D("写字楼/店铺/仓库"),
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("mallf.common.view.cost.shopping.bumen").$D("费用承担部门"),
          fieldCode: "expBearDep",
        },
        {
          fieldName: this.$T("mallf.common.view.cost.shopping.shouhuocang").$D("仓转店收货仓"),
          fieldCode: "attributeBigint5Meaning",
        },
        {
          fieldName: this.$T("mallf.common.model.CMS.num").$D("CMS合同号"),
          fieldCode: "attributeBigint3Meaning",
        },
        {
          fieldName: this.$T("sodr.common.model.common.purLineCount").$D("数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("sodr.common.model.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.needByDate").$D("需求日期"),
          fieldCode: "requestDate",
          render: (val) => this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.common.model.common.taxRates").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sodr.common.model.common.includingTaxAndFreightPrice").$D("含税单价(含运费)"),
          fieldCode: "taxIncludedUnitPrice",
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "lineFreight",
        },
        {
          fieldName: this.$T("sprm.common.model.receiveAddress").$D("收货地址"),
          fieldCode: "receiveAddress",
        },
        {
          fieldName: this.$T("sprm.common.model.receiveTelNum").$D("收货人联系方式"),
          fieldCode: "receiveTelNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.erpSupplierCode").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("ssrc.projectDetailReport.model.projectDetailReport.displayPrNum").$D("采购申请单号"),
          fieldCode: "prNum",
        },
        {
          fieldName: "CE NO",
          fieldCode: "ceNo",
          langCode: "sodr.common.model.ceNumber",
        },
        {
          fieldName: this.$T("sodr.common.model.deliverType").$D("送货类型"),
          fieldCode: "deliveryMethodMeaning",
        },
        {
          fieldName: this.$T("mallf.common.view.amount.remark").$D("费用说明"),
          fieldCode: "feeDesc",
        },
        {
          fieldName: this.$T("sodr.sendOrder.view.button.attachment").$D("附件"),
          fieldCode: "",
          render: () => <span style="color: #276EF1">{this.$T("sinv.common.view.button.viewAttach").$D("查看附件")}</span>,
          callBack: (data) => {
            this.showFilePop(data.attachmentUuid);
          }
        },
      ];
      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getDemandOrderHeader();
        await this.getDemandOrderLine();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.loading = true;
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("sprm.common.model.common.prLineDetail").$D("需求明细"));
    this.uuid = uuid();
  },
  methods: {
    // 获取头信息
    async getDemandOrderHeader() {
      await getOrderHeaderInfoApi(this.changeReqId, this.lotFlag).then((res) => {
        this.headInfo = res || {};
        const { prSourcePlatform } = this.headInfo;
        this.prSourcePlatform = prSourcePlatform;
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
        // this.getDemandOrderLine()
      });
    },
    //获取需求行信息
    async getDemandOrderLine() {
      this.prLineDataSet.refresh().then(() => {
        this.lineInfo = this.prLineDataSet.data;
      });
    },
    // 显示行信息详情
    showLineInfoDetail(record) {
      this.lineInfoDetail = { ...record.data };
      setTimeout(() => {
        this.show = true;
      }, 150);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}

.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.mainDetail {
  overflow visible;

  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    overflow visible;
    // height: calc(100vh - 260px);

    .content {
      .headInfo {
        ul {
          padding-left: 20px;
        }

        & ul li {
          margin-bottom: 8px;
          padding: 9px 10px 14px 0;
          border-bottom: 1px solid var(--color-border-default);
          display: flex;
          align-items: baseline;

          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: var(--color-font-default);
            line-height: 22px;
          }

          span:nth-child(1) {
            flex: 0 1 126px;
          }

          span:nth-child(2) {
            flex: 0 1 209px;
            color: var(--color-font-default-b);
          }
        }

        & ul li:nth-child(1) {
          padding: 20px 20px 11px 0;

          span:nth-child(1) {
            flex: 0 1 126px;
          }
        }

        & ul li:nth-child(1) span:nth-child(2) {
          flex: 0 1 190.7px;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        & ul li:nth-last-child(1) {
          border-bottom: 0;
          margin-bottom: 1px;
        }
      }

      .moreInfo {
        align-self: flex-end;
        width: 18.3px;
        height: 18.3px;
      }

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 235px;
        }

        .materialCode {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: 80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 10px;
          margin: 16px 0 0 15px;
          border-bottom: 1px solid var(--color-border-default);
          padding-right: 15px;

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: var(--color-font-default);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .left-button {
    // margin-left: 20px;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color: var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .lineBody {
    background-color: var(--color-font-default-d);
    overflow: auto;

    ul {
      padding: 20px 20px 11px 20px;
    }

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom: 1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color: var(--color-font-default-b);
          display: inline-block;
          width: 213px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}
</style>
