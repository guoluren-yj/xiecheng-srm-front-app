<template>
  <hips-popup v-model="value" class="FullPop" style="height:100%;width:100%" position="bottom">
    <div class="orderLineDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/Comp/icon_navigationbars_off_normal@3x.png" >
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('hipspfm.orderApproval.view.message.title.orderDetail').$D('订单详情') }}
        </div>
      </hips-nav-bar>
      <section class="headInfo">
        <li class="lineNum">
          <span>{{ $T('sodr.orderApproval.model.common.displayLineNum').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
          <span>{{ $T('sodr.orderApproval.model.common.shipmentNum').$D('发运号') }}：{{ lineInfoDetail.displayLineLocationNum }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.itemCode').$D('物料编码') }}：{{ lineInfoDetail.itemCode }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.description').$D('物料名称') }}：{{ lineInfoDetail.itemName }}</span>
        </li>
      </section>

      <div class="prequalification-detail language-class-ul-li">
        <ul>
          <li class="edit-wrap">
            <span>{{ $T('sodr.orderApproval.model.common.unit').$D('单位') }}：</span>
            <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.quantity').$D('数量') }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.over.execute.quantity').$D('协议超量执行数量') }}：</span>
            <span>{{ lineInfoDetail.attributeDecimal1 }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.taxedEnteredUnitPrice').$D('原币含税单价') }}：</span>
            <span>{{ lineInfoDetail.enteredTaxIncludedPrice|CalcMoney }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.taxedLineAmount').$D('含税行金额') }}：</span>
            <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.unitPrice').$D('不含税单价') }}：</span>
            <span>{{ lineInfoDetail.unitPrice }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.lineAmount').$D('不含税行金额') }}：</span>
            <span>{{ lineInfoDetail.lineAmount }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.taxRate').$D('税率') }}(%)：</span>
            <span>{{ lineInfoDetail.taxRate?lineInfoDetail.taxRate:'0' }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.currencyName').$D('币种') }}：</span>
            <span>{{ lineInfoDetail.currencyCode }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.needByDate').$D('需求日期') }}：</span>
            <span>{{ lineInfoDetail.needByDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.committedDeliveryDate').$D('承诺交货日期') }}：</span>
            <span>{{ lineInfoDetail.promiseDeliveryDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.purReqNum').$D('采购申请号') }}：</span>
            <span>{{ lineInfoDetail.displayPrNum }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.purReqLineNum').$D('申请行号') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li>
          <li>
            <span>{{ $T('sodr.orderApproval.model.common.purchaserComments').$D('采购方行备注') }}：</span>
            <span>{{ lineInfoDetail.remark ? lineInfoDetail.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
          </li>
        </ul>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";
export default {
  modules: [ "hipspfm.orderApproval","sodr.orderApproval","hipspfm.common" ],
  name: "Sw-OrderApprovalLineDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    lineInfoDetail: {
      type: Object
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.orderLineDetail {
  height: 100%;
  position: relative;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .headInfo {
    padding: 16px 20px 12px 20px;
    border-bottom: solid 8px #F0F2F5;

    li {
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;

      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default, #1b1e2b);
        line-height: 24px;

        &:nth-child(1) {
          // font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: #C6CAD6;
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}
</style>
