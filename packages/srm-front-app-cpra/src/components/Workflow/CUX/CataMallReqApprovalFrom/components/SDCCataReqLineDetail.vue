<template>
  <hips-popup v-model="value" class="FullPop" style="height:100%;width:100%" position="bottom">
    <div class="orderLineDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/Comp/icon_navigationbars_off_normal@3x.png">
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('hipspfm.workFlowCata.model.common.purchaseLineInfo').$D('采购申请明细信息') }}
        </div>
      </hips-nav-bar>
      <section class="headInfo">
        <li class="lineNum">
          <span>{{ $T('sprm.common.model.common.lineNumber').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productNum').$D('商品编码') }}：{{ lineInfoDetail.productNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productName').$D('商品名称') }}：{{ lineInfoDetail.productName }}</span>
        </li>
      </section>

      <div class="prequalification-detail language-class-ul-li">
        <ul>
          <li>
            <span>{{ $T('sprm.common.model.common.budgetAccountDeptName').$D('预算部门') }}：</span>
            <span>{{ lineInfoDetail.budgetAccountDeptnoMeaning }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.budgetAccountName').$D('预算科目') }}：</span>
            <span>{{ lineInfoDetail.budgetAccountName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.budgetAccountPrice').$D('预算金额') }}：</span>
            <span>{{ lineInfoDetail.budgetAccountPrice }}</span>
          </li>
          <li>
            <span>{{ $T('entity.supplier.tag').$D('供应商') }}：</span>
            <span>{{ lineInfoDetail.supplierCompanyName }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlow.model.common.cardName').$D('个性物料-姓名') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar1 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlow.model.common.cardPhone').$D('个性物料-手机号') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar2 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlow.model.common.cardMail').$D('个性物料-邮箱') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar3 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlow.model.common.cardQRCode').$D('个性物料-筹款二维码') }}：</span>
            <span v-if="lineInfoDetail.attributeLongtext1"
                  class="font-blue"
                  @click="preView(lineInfoDetail.attributeLongtext1)">
              {{ $T('hrpt.labelTemplate.view.option.cke.p.label.type.qr').$D('二维码') }}
            </span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlow.model.common.vCardQRCode').$D('个性物料—微信二维码') }}：</span>
            <span v-if="lineInfoDetail.attributeLongtext2"
                  class="font-blue"
                  @click="preView(lineInfoDetail.attributeLongtext2)">
              {{ $T('hipspfm.common.message.weChatQR').$D('微信二维码') }}
            </span>
          </li>
          <li>
            <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveAddress").$D("收货人地址") }}：</span>
            <span>{{ lineInfoDetail.receiveAddress }}</span>
          </li>
          <li>
            <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveContactName").$D("收货联系人") }}：</span>
            <span>{{ lineInfoDetail.receiveContactName }}</span>
          </li>
          <li>
            <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveTelNum").$D("收货人联系方式") }}：</span>
            <span>{{ lineInfoDetail.receiveTelNum }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.catalogName').$D('商品目录') }}：</span>
            <span>{{ lineInfoDetail.catalogName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.itemName').$D('物料名称') }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.itemCode').$D('物料编码') }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.categoryName').$D('物料分类') }}：</span>
            <span>{{ lineInfoDetail.categoryName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.uomName').$D('单位') }}：</span>
            <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.quantity').$D('数量') }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.taxType').$D('税种') }}：</span>
            <span>{{ lineInfoDetail.taxCode }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.taxRate').$D('税率') }}(%)：</span>
            <span>{{ lineInfoDetail.taxRate?lineInfoDetail.taxRate:'0' }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.currencyCode').$D('币种') }}：</span>
            <span>{{ lineInfoDetail.currencyCode }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.linePrice').$D('行金额') }}：</span>
            <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.neededDate').$D('需求日期') }}：</span>
            <span>{{ lineInfoDetail.neededDate | CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.common.message.remark').$D('备注') }}：</span>
            <span>{{ lineInfoDetail.remark }}</span>
          </li>
          <li class="language-attachment">
            <span>{{ $T('entity.attachment.tag').$D('附件') }}：</span>
            <span
              v-if="lineInfoDetail.attachmentUuid"
              class="font-blue"
              @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">
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
  </hips-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";
import uuid from "uuid";
export default {
  modules: [ "hipspfm.workFlowCata","sprm.common","hipspfm.workFlow","hrpt.labelTemplate","hipspfm.common","entity.supplier","entity.attachment","sprm.purchaseReqCreation" ],
  name: "SDCCataReqLineDetail",
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
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      uuid: ""
    };
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    preView(url) {
      this.$previewImage([ url ], { showClose: true });
    },
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

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
    padding: 12px 20px 12px 20px;
    border-bottom: solid 8px var(--color-border-default);

    li {
      display: flex;
      margin-bottom: 4px;
      justify-content: space-between;
      font-weight: bold;

      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default);
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
        color: var(--color-font-default-e);
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}
</style>
