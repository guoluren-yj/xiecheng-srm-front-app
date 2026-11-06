<template>
  <!-- 组件 -->
  <div v-loading="initLoading" style="min-height: 500px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- 基本信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('baseInfo')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.invoiceHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noData") }}
                </span>
              </div>
              <ul v-else @click="openDetailPop('header', headInfo)">
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getHeadColumns"
                  code="SMBL.PURCHASER_INVOICE.HEADER"
                  :data-source="headInfo"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item>

          <!-- 发票行信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('invoiceLineInfo')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="linesInfo.length === 0" class="noContent">
                <span>
                  {{ getLanguageDefine("noData") }}
                </span>
              </div>
              <ul v-else>
                <template v-for="(item, index) in linesInfo" >
                  <!-- 个性化组件替换后的代码 -->
                  <div :key="index" @click="openDetailPop('line', item)">
                    <customize
                      :columns="getLineColumns"
                      code="SMBL.PURCHASER_INVOICE.LINE"
                      :data-source="item"
                      type="list"
                      :need-padding="false"/>
                    <hr v-if="index !== (linesInfo.length-1)" style="height: 8px;background: #f0f2f5;border: 0px;margin: 8px -15px;">
                  </div>
                </template>
              </ul>
            </div>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>

      <!-- 弹框 -->
      <srm-popup :visible.sync="visible"
                 height="100%"
                 :show-header="false"
                 :show-close="true"
                 :show-back="false">
        <customize-detail
          class="card-pop"
          :columns="getDetailColumns(customizeInfo.name)"
          :code="customizeInfo.code"
          :data-source="detailInfo"/>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import invoiceMixin from "../datasource/invoiceMixin";
export default {
  modules: [ "hipspfm.common", "scux.demandContactFrom", "hzero.common", "ssta.purchaseInvoicePool", "ssta.invoicePool" ],
  name: "InvoiceApprovalForm",
  mixins: [ invoiceMixin ],
  data() {
    return {
      visible: false,
      // 查看详情
      detailInfo: {},
      customizeInfo: {
        title: "",
        name: "",
      }
    };
  },
  methods: {
    openDetailPop(name, item = {}) {
      this.detailInfo = { ...item };
      this.customizeInfo = {
        name: name
      };
      if (name === "header") {
        this.customizeInfo["title"] = this.getLanguageDefine("baseInfo");
        this.customizeInfo["code"] = "SMBL.PURCHASER_INVOICE.HEADER_DETAIL";
      }
      if (name === "line") {
        this.customizeInfo["title"] = this.getLanguageDefine("invoiceLineInfo");
        this.customizeInfo["code"] = "SMBL.PURCHASER_INVOICE.LINE_DETAIL";
      }
      this.visible = true;
    },
  }
};
</script>

<style scoped lang="stylus">
.card-pop {
  padding: 0 12px;
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
          padding: 12px 15px 12px 15px;
          font-family: auto;
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
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }
    }
  }
}
</style>