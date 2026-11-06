<template>
  <div class="content">
    <ul v-for="(li,key) in msg" :key="key" @click.stop="showMore(li)">
      <li>
        <span>
          <span class="block"/>
          <span
            class="width-wrap">{{ $T('ssrc.supplierQuotation.view.detail.name').$D('明细名称') }}：{{ li.configName }}</span>
        </span>
      </li>
      <li>
        <span>{{ $T('ssrc.supplierQuotation.view.detail.code').$D('明细编码') }}：{{ li.configCode }}</span>
      </li>
      <li>
        <span v-if="li.quotationColumns[0].supQuotationColumnValue">{{ $T('ssrc.supplierQuotation.model.supQuo.quotationQuantity').$D('数量') }}：{{ li.quotationColumns[0].supQuotationColumnValue }}</span>
        <span v-if="li.quotationColumns[1].supQuotationColumnValue">{{ $T('ssrc.supplierQuotation.model.supQuo.unitPrice').$D('单价') }}：{{ li.quotationColumns[1].supQuotationColumnValue }}</span>
      </li>
      <li>
        <span>{{ $T('ssrc.supplierQuotation.model.supQuo.remark').$D('备注') }}：{{ li.quotationColumns[2].supQuotationColumnValue }}</span>
      </li>
      <div v-if="li.children" class="show-more">
        <span v-if="li.showMoreFlag">{{ $T('ssrc.supplierQuotation.view.show.more.supplierQuotation').$D('展开更多报价明细') }}</span>
        <span v-else >{{ $T('ssrc.supplierQuotation.view.close.more.supplierQuotation').$D('收起更多报价明细') }}</span>
        <img :class="li.showMoreFlag ? 'content img-down':'content img-up'" src="@/assets/icon_list_down_normal@3x.png">
      </div>
      <quotation-detail-line :class="li.children && !li.showMoreFlag ? 'showContent':'noShow'" :msg="li.children"/>
    </ul>
  </div>
</template>

<script>
import { View, Popup, NavBar } from "hips";
export default {
  modules: [ "ssrc.supplierQuotation" ],
  name: "QuotationDetailLine",
  components: {
    [NavBar.name]: NavBar,
  },
  props: {
    msg: {
      type:Array | Object
    },
  },
  data() {
    return {
    };
  },
  async mounted() {

  },
  methods: {
    showMore(li) {
      li.showMoreFlag = !li.showMoreFlag;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="stylus" scoped>
.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  margin: 0px 8px 0 0;
}
.content{
    transition: all .5s ease-in-out;
    -webkit-transition: all .5s ease-in-out;
}
.noShow{
    opacity 0;
    max-height 0;
}
.showContent{
    opacity 1;
    max-height:100vw;
}
.img-down{
    -webkit-transform: rotateZ(0) !important;
    transform: rotateZ(0) !important;
}
.img-up{
    -webkit-transform: rotateZ(-180deg) !important;
    transform: rotateZ(-180deg) !important;
}
.lineBody > .content > ul:not(:last-child){
    border-bottom:8px solid var(--color-border-default)
}
.lineBody {
overflow-y: auto;
ul {
    padding: 0;
    ul{
        background:var(--color-bg-default-i)
    }

    li:nth-child(1) {
    padding: 12px 20px 7px 0px;
    margin-bottom: 0px;
    border: none;

    span {
        display: flex;
        align-items: center;
        flex: none;

        .block {
        display: inline-block;
        margin: 0 14px 0 0;
        }

        span:nth-child(2) {
        margin-right: 12px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color:var(--color-font-default,#1b1e2b);
        line-height: 20.1px;
        font-weight: 700;
        }
    }
    }

    li {
    margin-bottom: 2px;
    padding: 5px 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color:var(--color-font-default,#1b1e2b);
    display: flex;
    line-height: 20.1px;
    span{
        flex 1;
    }
    }

    li:nth-last-child(1) {
    padding: 5px 20px 12px 20px;
    border: none;
    margin-bottom: 0px;
    }
}

.show-more{
    padding: 5px 20px 12px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: var(--color-font-default-b);
        text-align: right;
        line-height: 20px;
    }
    img{
        margin-left: 2px;
        widows 16px;
        height 16px;
    }
}

}

.width-wrap {
    max-width: 280px;
    word-break: break-all;
}
</style>
