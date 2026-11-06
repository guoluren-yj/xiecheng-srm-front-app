<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div slot="left" class="left-button" @click="showLineInfoDetail(lineInfoDetail)">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息') }}</div>
    </hips-nav-bar>
    <section class="headInfo">
      <li class="lineNum">
        <span>{{ $T('sinv.common.model.common.asnLineNum').$D('行号') }}：{{ lineInfoDetail.asnLineNum }}</span>
      </li>
      <li>
        <span>{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：{{ lineInfoDetail.itemCode }}</span>
      </li>
      <li>
        <span>{{ $T('sinv.common.model.common.itemName').$D('物料名称') }}：{{ lineInfoDetail.itemName }}</span>
      </li>
    </section>

    <div class="prequalification-detail">
      <ul>
        <li class="edit-wrap">
          <span>{{ $T('hipspfm.createDelivery.model.createDelivery.quantityOfShipment').$D('本次发货数') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.shipQuantity"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerShipQuantity').$D('请填写本次发货数')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.anyShipQuantity').$D('剩余可发货数') }}：</span>
          <span>{{ lineInfoDetail.canShipQuantity }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.unit').$D('单位') }}：</span>
          <span>{{ lineInfoDetail.uomName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.displayPoNum').$D('订单号') }}：</span>
          <span>{{ lineInfoDetail.displayPoNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.displayLineLocationNum').$D('发运号') }}：</span>
          <span>{{ lineInfoDetail.displayLineLocationNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.displayReleaseNum').$D('发放号') }}：</span>
          <span>{{ lineInfoDetail.releaseNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：</span>
          <span>{{ lineInfoDetail.displayLineNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：</span>
          <span>{{ lineInfoDetail.neededDate|CalcDate }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.promiseDeliveryDate').$D('承诺交货日期') }}：</span>
          <span>{{ lineInfoDetail.promisedDate|CalcDate }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.productNum').$D('商品编码') }}：</span>
          <span>{{ lineInfoDetail.productNum }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.productName').$D('商品名称') }}：</span>
          <span>{{ lineInfoDetail.productName }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.catalog.name').$D('商品目录') }}：</span>
          <span>{{ lineInfoDetail.catalogName }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.purchaseRemark').$D('采购方行备注') }}：</span>
          <span>{{ lineInfoDetail.purchaseRemark }}</span>
        </li>

        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.supplierRemark').$D('供应商行备注') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.supplierRemark"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerRemake').$D('请填写备注信息')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.unitPackageQuantity').$D('单包装数') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.unitPackageQuantity"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerUnitPackageQuantity').$D('请填写单包装数')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.packageQuantity').$D('件数') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.packageQuantity"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerPackageQuantity').$D('请填写件数')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.remainderQuantity').$D('尾数') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.remainderQuantity"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerRemainderQuantity').$D('请填写尾数')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.lotNum').$D('批次号') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.lotNum"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerLotNum').$D('请填写批次号')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap" @click="showEditDatePop('productionDate','lineInfo')">
          <span>{{ $T('sinv.common.model.common.productionDate').$D('生产日期') }}：</span>
          <span>
            <span v-if="lineInfoDetail.productionDate">{{ lineInfoDetail.productionDate|CalcDate }}</span>
            <span v-else class="placeFont">{{ $T('hipspfm.createDelivery.message.validation.handlerProductionDate').$D('请选择生产日期') }}</span>
            <img src="@/assets/icon_list_date_normals@3x.png" alt="">
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.shelfLife').$D('保质期') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.shelfLife"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerShelfLife').$D('请填写保质期')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap" @click="showEditDatePop('lotExpirationDate','lineInfo')">
          <span>{{ $T('sinv.common.model.common.lotExpirationDate').$D('批次有效期') }}：</span>
          <span>
            <span v-if="lineInfoDetail.lotExpirationDate">{{ lineInfoDetail.lotExpirationDate|CalcDate }}</span>
            <span v-else class="placeFont">{{ $T('hipspfm.createDelivery.message.validation.handlerLotExpirationDate').$D('请选择批次有效期') }}</span>
            <img src="@/assets/icon_list_date_normals@3x.png" alt="">
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.serialNum').$D('序列号') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.serialNum"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerSerialNum').$D('请填写序列号')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sinv.common.model.common.invoiceNum').$D('发票号') }}：</span>
          <span class="edit-input">
            <hips-input
              v-model="lineInfoDetail.invoiceNum"
              :placeholder="$T('hipspfm.createDelivery.message.validation.handlerInvoiceNum').$D('请填写发票号')"
              type="text">
              <div slot="right" style="align-items: center">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.lineAttachmentUuid').$D('行附件') }}：</span>
          <span class="fileBtn flex-between-center" >
            <srm-upload
              :can-upload="true"
              :show-icon="false"
              color="blue"
              :title="$T('sinv.common.model.common.lineAttachmentUuid').$D('行附件')"
              :attachment-uuid="lineInfoDetail.attachmentUuid"
              :desc-title="$T('hipspfm.common.button.uploadAttachment').$D('上传附件')"
              @showFilePopup="showFilePop" />
            <!-- {{ $T('hipspfm.common.button.uploadAttachment').$D('上传附件') }} -->
            <img src="@/assets/icon_list_right_normal@3x.png" class="image-gray-default" alt >
          </span>
        </li>
        <section class="no-more"/>
      </ul>
    </div>
    <div class="handler-bottom" @click="saveDelivery">
      {{ $T('hipspfm.common.button.save').$D('保存') }}
    </div>
  </hips-view>
</template>

<script>
import {
  View,
  NavBar,
  Icon,
  Popup,
  Input,
  Switch,
} from "hips";
import {
  getAttachmentUuidApi,
  flashAttachmentLineUuidApi
} from "../api";
export default {
  modules: [ "hipspfm.common", "sinv.common", "hipspfm.createDelivery" ],
  name: "DeliveryMaterialInfo",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Switch.name]: Switch,
    [Popup.name]: Popup
  },
  props: {
    showLineInfoDetail: {
      type: Function,
    },
    showEditDatePop: {
      type: Function,
    },
    lineInfoDetail: {
      type: Object,
      default: {},
    },
    saveDelivery: {
      type: Function,
    },
    phoneFlag:{
      type:Boolean || String
    }
  },
  data() {
    return {
      filePopup: false,
    };
  },
  methods: {
    async showFilePop() {
      if (!this.lineInfoDetail.attachmentUuid) {
        const { content } = await getAttachmentUuidApi();
        // this.lineInfoDetail.attachmentUuid = content;
        this.$set(this.lineInfoDetail, "attachmentUuid", content);
        const uuParms = {
          attachmentUuid: content,
          _token: this.lineInfoDetail._token,
          asnLineId: this.lineInfoDetail.asnLineId,
          objectVersionNumber: this.lineInfoDetail.objectVersionNumber,
        };
        const res = flashAttachmentLineUuidApi(uuParms);
      }
      // this.filePopup = !this.filePopup;
    },
  },
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
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
  border-bottom: solid 8px var(--color-border-default);

  li {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-between;

    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;

      &:nth-child(1) {
        font-weight: bold;
      }
    }
  }

  &:last-child{
    margin-bottom: 0;
  }

  .lineNum{
    span{
      font-size: 16px;
      color: var(--color-font-default-e);
    }
  }
}

.prequalification-detail{
  padding-bottom: 80px;
  padding-left: 20px;
  height: calc(100vh - 180px);
  overflow: auto;
  ul{
    li{
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 16px 20px 15px 0;

      &:last-child {
        align-items: center;
      }

      >>> .hips-input{
        width: 100%;
        height: 42px;
        padding: 0;
      }

      >>> .hips-input__input-value input::-webkit-input-placeholder {
        color: var(--color-font-default-e);
      }

      >>> .hips-input:first-child:after{
        border-top: none;
      }

      span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        img{
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      .status{
        color: var(--color-other-default-c) !important;
      }

      .edit{
        display: flex;
        justify-content:  space-between;

        span{
          color:var(--color-font-default-b);
        }

        >>> .hips-switch__input {
          width: 36px !important;
          height: 22px !important;
        }
        >>> .hips-switch__input:after {
          width: 20px !important;
          height: 20px !important;
        }
      }

      .edit-input{
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div{
          display: flex;
        }
      }

      span:nth-child(1){
        width: 105px;
      }
      span:nth-child(2){
        width: 230px;
        color:var(--color-font-default-b);
      }

      span.fileBtn{
        color: var(--color-other-default-b);
      }

    }

    .edit-wrap{
      align-items: center;
      .placeFont{
        color: var(--color-font-default-e);
      }
    }
  }
}

>>> .hips-input__input-value input::-webkit-input-placeholder {
    color: var(--color-font-default-e);
  }

.handler-bottom{
  width: 100%;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27,30,43,0.10);
  position: fixed;
  bottom: 0;
  text-align: center;
  z-index: 555;
}
</style>
