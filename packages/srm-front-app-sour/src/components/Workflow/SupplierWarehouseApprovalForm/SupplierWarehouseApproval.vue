<template>
  <div v-loading="initLoading" style="min-height: 500px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- <div v-if="showUpdateBtn" class="switch-div">
            <div :class="{'checked-div': changed}"
                 style="position: absolute;left: 0;"
                 @click="changeAfter">
              {{ getLanguageDefine("updateAfter") }}
            </div>
            <div :class="{'checked-div': !changed}"
                 style="position: absolute;right: 0;"
                 @click="changeBefore">
              {{ getLanguageDefine("updateBefore") }}
            </div>
          </div> -->
          <!-- <change-type-btn :btn-params="changeTypeParam" /> -->
          <!-- 供应商基础信息 -->
          <srm-scroll-tab-item v-if="!hiddenTab.headInfo" :label="getLanguageDefine('supplierBaseInfo')">
            <srm-list
              :scrollable="false"
              :data-set="tabTableDsList.headerDs"
              :columns="getColumns('supplierBaseInfo').slice(0, 10)"
              :customize-code="getCustomizeCode('simpleSupplierWarehouse-supplierBaseInfo')"
              @itemClick="onHeadInfoClick"/>
          </srm-scroll-tab-item>

          <!-- 联系人 -->
          <srm-scroll-tab-item v-if="!hiddenTab.contact" :label="getLanguageDefine('contact')">
            <srm-list
              :scrollable="false"
              :data-set="tabTableDsList.contactDs"
              :columns="getColumns('contact')"
              :customize-code="getCustomizeCode('simpleSupplierWarehouse-contact')"/>
          </srm-scroll-tab-item>

          <!-- 地址 -->
          <srm-scroll-tab-item v-if="!hiddenTab.address" :label="getLanguageDefine('address')">
            <srm-list
              :scrollable="false"
              :data-set="tabTableDsList.addressDs"
              :columns="getColumns('address')"
              :customize-code="getCustomizeCode('simpleSupplierWarehouse-address')"/>
          </srm-scroll-tab-item>

          <!-- 银行账户 -->
          <srm-scroll-tab-item v-if="!hiddenTab.bank" :label="getLanguageDefine('bankAccount')">
            <srm-list
              :scrollable="false"
              :data-set="tabTableDsList.bankAccountDs"
              :columns="getColumns('bankAccount')"
              :customize-code="getCustomizeCode('simpleSupplierWarehouse-bankAccount')"/>
          </srm-scroll-tab-item>

          <!-- 采购/财务信息 -->
          <srm-scroll-tab-item v-if="!hiddenTab.purchaseHeader || !hiddenTab.purchaseLine" :label="getLanguageDefine('purchaseInfo')">
            <div class="infoContent headInfo">
              <h2>{{ getLanguageDefine("purchaseHeader") }}</h2>
              <div v-if="!purchaseHeaderInfo.extPfReqId" class="noContent">
                <span>
                  {{ getLanguageDefine("noData") }}
                </span>
              </div>
              <ul v-else>
                <customize
                  :columns="getColumns('purchaseHeader')"
                  :data-source="purchaseHeaderInfo"
                  type="list"
                  :need-padding="false"
                  :code="getCustomizeCode('simpleSupplierWarehouse-purchaseHeader')"/>
              </ul>
            </div>
            <div class="infoContent headInfo">
              <h2>{{ getLanguageDefine("purchaseLine") }}</h2>
              <srm-list
                :scrollable="false"
                :data-set="tabTableDsList.purchaseLineDs"
                :columns="getColumns('purchaseLine').slice(0, 10)"
                :customize-code="getCustomizeCode('simpleSupplierWarehouse-purchaseLine')"
                @itemClick="onPurchaseLineClick"/>
            </div>
          </srm-scroll-tab-item>
          <!-- 附件 -->
          <srm-scroll-tab-item v-if="!hiddenTab.attachment" :label="getLanguageDefine('attachment')">
            <srm-list
              :scrollable="false"
              :data-set="tabTableDsList.attachmentDs"
              :columns="getColumns('attachment')"
              :customize-code="getCustomizeCode('simpleSupplierWarehouse-attachment')"/>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
    </section>
  </div>
</template>

<script>
import { $T } from "srm-mobile-ui";

import ChangeTypeBtn from "./ChangeTypeBtn.vue";
import SwMixin from "./SwMixin";
// import { getBtnPowerApi } from "../api/SupplierWarehouseApproval";
// import { getBtnPowerApi } from "./api/SupplierWarehouseApproval";
export default {
  modules: [ "sslm.supplierWarehouse", "hipspfm.common", "sslm.supplierInform", "spfm.importErp", "sslm.common", "spfm.bank", "hzero.common", "smbl.common" ],
  name: "SupplierWarehouseApproval",
  components: {
    // ChangeTypeBtn,
  },
  mixins: [ SwMixin ],
  data() {
    return {
      changed: true,
      changeTypeParam: { // 全部、仅变更按钮
        activeAll: true,
        handleChangeType: this.handleChangeType,
        showBtnComp: false,
      },
      hiddenTab: {}, // 隐藏的页签集合 notChangeTab
    };
  },
  beforeMount() {
    this.$emit(
      "InitMountNode", {
        headerButtonRight: <ChangeTypeBtn btnParams={this.changeTypeParam} />,
        // bottomTextTip: this.updateSupplierFlag ? $T("sslm.common.view.message.changeBtnTips").$D("变更的内容用红色字体标识，可点击切换仅查看变更内容") : "",
      }
    );
  },
  mounted() {
    // getBtnPowerApi([ "srm.partner.my-partner.supplier-warehouse.ps.button" ]).then((res) => {
    //   if (res && res.length > 0 && res[0].approve) {
    //     this.showUpdateBtn = true;
    //   } else {
    //     this.showUpdateBtn = false;
    //   }
    // });
  },
  methods: {
    handleChangeType(value) {
      this.initLoading = true;
      let tabData = {};
      if (!value) {
        this.hiddenTab = this.notChangeTab;
        tabData = this.changeTabData;
      } else {
        this.hiddenTab = {};
        tabData = this.allTabData;
      }
      // 重新加载数据
      const { contact = [], address = [], bank = [], purchaseLine = [], attachment = [] } = tabData;
      // 每次切换需要重新加载ds, 不然数据不正确
      const { contactDs, addressDs, bankAccountDs, purchaseLineDs, attachmentDs } = this.createDs() || {};
      this.tabTableDsList.contactDs = contactDs;
      contactDs.setData(contact);

      this.tabTableDsList.addressDs = addressDs;
      addressDs.setData(address);

      this.tabTableDsList.bankAccountDs = bankAccountDs;
      bankAccountDs.setData(bank);

      this.tabTableDsList.purchaseLineDs = purchaseLineDs;
      purchaseLineDs.setData(purchaseLine);

      this.tabTableDsList.attachmentDs = attachmentDs;
      attachmentDs.setData(attachment);

      this.changeTypeParam.activeAll = value;
      this.initLoading = false;
    },
    onHeadInfoClick() {
      this.$popup({
        title: $T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={this.getHeaderModalInfo()}
          dataSet={this.tabTableDsList.headerDs}
          customizeCode={this.getCustomizeCode("simpleSupplierWarehouse-supplierBaseInfo")}
        />,
      });
    },
    // 采购财务行
    onPurchaseLineClick() {
      this.$popup({
        title: $T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={this.getPurchaseLineModalInfo()}
          dataSet={this.tabTableDsList.purchaseLineDs}
          customizeCode={this.getCustomizeCode("simpleSupplierWarehouse-purchaseLine")}
        />,
      });
    },
  }
};
</script>

<style scoped lang="stylus">
.default-p-class {
  background: #276EF1;
  border: 1px solid #276EF1;
  border-radius: 2px;
  padding: 0px 3px;
  span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F6F6F6;
    line-height: 12px;
  }
}
.start-p-class {
  background: #05944F;
  border: 1px solid #05944F;
  border-radius: 2px;
  padding: 0px 3px;
  span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F6F6F6;
    line-height: 12px;
  }
}
.stop-p-class {
  background: #E11900;
  border: 1px solid #E11900;
  border-radius: 2px;
  padding: 1px 2px;
  span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F6F6F6;
    line-height: 12px;
  }
}
.title-p {
  min-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px 0 0 0;
  span {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
  flex: 1;
}
.switch-div{
  position: relative;
  border-radius: 14px;
  width: 120px;
  height: 30px;
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  font-size: 12px;
  background-color: #eeeeee;
  margin: 12px 0px 10px 15px;
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    color: #757575;
  }
  .checked-div {
    width: 70px;
    height: 30px;
    background: #FFFFFF;
    border: 1px solid #E2E2E2;
    border-radius: 14px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #1F1F1F;
    line-height: 16px;
  }
}
.mainDetail {
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
        }
      }
    }
  }

  .contentWrap {
    overflow visible;
    .content {
      >>> .srm-tab-pane-title {
        background: var(--color-border-default) !important;
      }
      .headInfo {
        ul {
          padding: 16px 15px 16px 15px;
          font-family: auto;
        }
        .card {
          border-bottom: 1px solid #F6F6F6;
          padding-bottom: 15px;
          padding-top: 16px;
          &:first-child {
            padding-top: 0px !important;
          }
          &:last-child {
            padding-bottom: 0px !important;
            border-bottom: 0px solid #F6F6F6 !important;
          }
        }
        .first-item {
          display: flex;
          align-items: center;
          position: relative;
          .block {
            width: 7px;
            height: 10px;
            background-color: var(--color-other-default-b);
            position: absolute;
            left: -15px;
            top: 4px;
          }
          .text {
            line-height: 20px;
            font-size: 14px;
            color: var(--color-font-default);
            font-weight: bold;
          }
        }
        .lookSomePop {
          background: #276EF1;
          border: 1px solid #276EF1;
          border-radius: 16px;
          padding: 5px 10px;
          color: #FFFFFF;
          font-size: 12px
        }
        >>> .customize {
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item {
          margin-top: 0px !important;
          margin-bottom: 12px !important;
          &:last-child  {
            // margin-bottom: 0px !important;
          }
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }
    }
  }
  .sslm-bank-field-header{
    >>> .srm-list-item-card-head-left{
        max-width: 50% !important;
      }
    >>> .srm-list-item-card-head-right{
      max-width: 50% !important;
    }
  }
}
.purchase-line-wrap{
  background: var(--background-color-empty-tab-title);
  .purchase-line-item{
    padding: 0 !important;
    .purchase-line-detail{
      padding: 4.267vw 4vw;
      background: #fff;
      margin-bottom: 8px;
    }
  }
}

</style>
