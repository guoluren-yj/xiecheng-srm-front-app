<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup v-if="value" class="FullPop" style="height: 100%;width:100%" position="right">
    <div class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/icon_screenlist_delete_normal@3x.png" class="image-black-default">
        </div>
        <div slot="center" class="header">{{ $T('ssrc.inquiryHall.view.message.tab.allQuotationDetails').$D('供应商报价明细') }}</div>
      </hips-nav-bar>
      <div style="height: 100%" class="language-class-ul-li">
        <ul>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.company').$D('公司') }}</span>
            <span>{{ supplierQuotationDetail.companyName }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.isSuggestedFlag').$D('是否选用') }}</span>
            <span>{{ supplierQuotationDetail.suggestedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(supplierQuotationDetail.suggestedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.taxInclude').$D('是否含税') }}</span>
            <span>{{ supplierQuotationDetail.taxIncludedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(supplierQuotationDetail.taxIncludedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.taxRate').$D('税率（%）') }}</span>
            <span>{{ supplierQuotationDetail.taxRate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.prTypeName').$D('申请类型') }}</span>
            <span>{{ supplierQuotationDetail.itemPropertiesMeaning }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.platformPrice.flag').$D('是否平台售价') }}</span>
            <span>{{ supplierQuotationDetail.platformPriceFlagMeaning }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.unitPrice').$D('单价') }}</span>
            <span>{{ supplierQuotationDetail.validQuotationPrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity').$D('可供数量') }}</span>
            <span>{{ supplierQuotationDetail.validQuotationQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.priceBatch').$D('价格批量') }}</span>
            <span>{{ supplierQuotationDetail.batchPrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.allottedQuantity').$D('分配数量') }}</span>
            <span>{{ supplierQuotationDetail.allottedQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.reason').$D('选用理由') }}</span>
            <span>{{ supplierQuotationDetail.suggestedRemark }}</span>
          </li>
          <li
            v-if="supplierQuotationDetail.rfxLadderQuotationList"
            class="language-attachment"
            @click="showStepQuotationDetail(supplierQuotationDetail)">
            <span>{{ $T('ssrc.inquiryHall.view.message.button.ladderInquiryFlag').$D('阶梯报价') }}</span>
            <span class="font-blue">
              {{ $T('hipspfm.supplierQuotation.view.message.viewDetail').$D('查看详情') }}
              <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
            </span>
          </li>
          <li v-else class="language-attachment">
            <span>{{ $T('ssrc.inquiryHall.view.message.button.ladderInquiryFlag').$D('阶梯报价') }}</span>
            <span class="font-gray">
              {{ $T('hipspfm.supplierQuotation.view.message.viewDetail').$D('查看详情') }}
              <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
            </span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.lastQuotation').$D('上次报价') }}</span>
            <span>{{ supplierQuotationDetail.lastQuotationPrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.priceFluctuation').$D('价格浮动') }}</span>
            <span>{{ supplierQuotationDetail.priceFluctuation }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('').$D('付款条件') }}</span>
            <span>{{supplierQuotationDetail.psaEvaluationScore}}</span>
          </li> -->
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.qVFrom').$D('报价有效期从') }}</span>
            <span>{{ supplierQuotationDetail.validExpiryDateFrom|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.qVTo').$D('报价有效期至') }}</span>
            <span>{{ supplierQuotationDetail.validExpiryDateTo|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inEnquiryHall.validPromisedDate').$D('承诺交期') }}</span>
            <span>{{ supplierQuotationDetail.validPromisedDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.deliveryPeriod').$D('供货周期') }}</span>
            <span>{{ supplierQuotationDetail.validDeliveryCycle }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.minimumPurchaseAmount').$D('最小购买量') }}</span>
            <span>{{ supplierQuotationDetail.minPurchaseQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.minimumPackageAmount').$D('最小包装量') }}</span>
            <span>{{ supplierQuotationDetail.minPackageQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.includingFreight').$D('是否含运费') }}</span>
            <span>{{ supplierQuotationDetail.freightIncludedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(supplierQuotationDetail.freightIncludedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.freightAmount').$D('运费') }}</span>
            <span>{{ supplierQuotationDetail.freightAmount }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.prTypeName').$D('申请类型') }}</span>
            <span>{{ supplierQuotationDetail.freightAmount }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.platformPrice.flag').$D('是否平台售价') }}</span>
            <span>{{ supplierQuotationDetail.freightAmount }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.quotationStatus').$D('报价状态') }}</span>
            <span>{{ supplierQuotationDetail.quotationLineStatusMeaning }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.referencePrice').$D('参考价') }}</span>
            <span>{{ supplierQuotationDetail.referencePrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.linePrice').$D('行金额') }}</span>
            <span>{{ supplierQuotationDetail.totalPrice }}</span>
          </li>
          <li class="language-attachment">
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.quotationDetail').$D('报价明细') }}</span>
            <span
              v-if="supplierQuotationDetail.quotationDetailFlag"
              class="font-blue"
              @click="showQuotationDetailPop(supplierQuotationDetail)">
              {{ $T('ssrc.inquiryHall.model.inquiryHall.viewQuotationDetails').$D('查看报价明细') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
            <span v-else class="font-gray">
              {{ $T('ssrc.inquiryHall.model.inquiryHall.viewQuotationDetails').$D('查看报价明细') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </li>
          <li class="language-attachment">
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment').$D('供应商行附件') }}</span>
            <span
              v-if="supplierQuotationDetail.attachmentUuid"
              class="font-blue"
              @click="showFilePop(supplierQuotationDetail.attachmentUuid||uuid)">
              {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
            <span v-else class="font-gray">
              {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <step-quotation-detail
      v-model="stepQuotationDetailPop"
      :step-quotation-detail="stepQuotationDetail"/>
    <quotation-detail
      v-if="quotationDetailPop"
      v-model="quotationDetailPop"
      :supplier-quotation-detail="quotationDetail"/>
  </hips-popup>
</template>

<script>
import { View, Input, Popup, NavBar } from "hips";
import uuid from "uuid";
import StepQuotationDetail from "./StepQuotationDetail";
import QuotationDetail from "./Quotation";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation" ],
  name: "JinSupplierQuotationDetail",
  components: {
    QuotationDetail,
    StepQuotationDetail,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    supplierQuotationDetail: {
      type: Object,
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      uuid: "",
      // filePopup:false,
      stepQuotationDetail: {},
      stepQuotationDetailPop: false,
      quotationEchartsPop: false,
      quotationDetailPop:false,
      quotationDetail:{}
    };
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    showStepQuotationDetail(data) {
      this.stepQuotationDetail = data;
      this.stepQuotationDetailPop = !this.stepQuotationDetailPop;
    },
    showQuotationDetailPop(data) {
      this.quotationDetail = data;
      this.quotationDetailPop = !this.quotationDetailPop;
    }
    // showQuotationEcharts(data){
    //   // this.quotationEcharts = data;
    //   this.quotationEchartsPop = !this.quotationEchartsPop;
    // }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.font-gray {
  color: var(--color-font-default-e) !important;
}

.lineInfoDetail {
  background:var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
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
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }
}
</style>
