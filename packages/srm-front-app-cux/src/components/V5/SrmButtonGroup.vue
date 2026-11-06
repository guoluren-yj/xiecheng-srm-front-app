
<template>
  <div class="srm-button-group" :style="{position,top:positionTop+'px'}">
    <div v-setNeed :class="show?'srm-button-group-true srm-button-group-area':'srm-button-group-area'" :style="{maxHeight:myMax,...aeraStyle}">
      <slot/>
    </div>
    <div v-if="needShow" class="srm-button-group-more" @click.stop="changeShow">
      {{ show ? $T("smbl.common.view.srmBtnGroup.upOperate").$D("收起更多操作"):$T("smbl.common.view.srmBtnGroup.downOperate").$D("展开更多操作") }}
      <!-- 暂时不加图片 -->
      <!-- <img :src="show?'@/assets/4.0/icon_Button_paperclip_highlight@3x.png':'@/assets/4.0/icon_Button_paperclip_highlight@3x.png'" alt=""> -->
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

export default {
  modules: [ "smbl.common" ],
  name: "SrmButtonGroup",
  directives:{
    setNeed:{
      componentUpdated:function(el, binding, vnode) {
        console.log(111111111);
        // 等待动画结束后去获取渲染界面节点
        setTimeout(() => {
          const _this = vnode.context;
          if (el.scrollHeight <= el.offsetHeight && !_this.show) {
            _this.needShow = false;
          } else {
            _this.needShow = true;
          }
        }, 300);

      }
    }
  },
  props: {
    // 定位方式
    position:{
      type:String,
      default:"sticky"
    },
    // 定位方式为指定值生效，距离顶部多远
    positionTop:{
      type:String | Number,
      default:0
    },
    // 超过几行开始隐藏 建议1-10,小数四舍五入
    lineHide:{
      type:Number,
      default:2,
    },
    aeraStyle:{
      type:Object,
      default:() => ({})
    }
  },
  data() {
    return {
      needShow:false,
      show:false
    };
  },
  computed:{
    myMax() {
      let temp = Math.round(this.lineHide);
      if (temp < 1) {
        temp = 1;
      }
      if (temp > 10) {
        temp = 10;
      }
      return (temp * 36 + 12) / 3.75 + "vw";
    }
  },
  methods: {
    changeShow() {
      if (this.show) {
        this.$emit("upOperate");
      } else {
        this.$emit("downOperate");
      }
      this.show = !this.show;
    }
  },
};
</script>
<style lang="stylus" scoped>
.srm-button-group{
    z-index 10
    background-color var(--color-bg-default)
    .srm-button-group-area{
        padding-top 12px
        margin 0px 15px 12px 7px
        overflow hidden
        transition all 0.3s ease-in
        .srm-button{
            margin 4px 0px 4px 9px
        }
    }
    .srm-button-group-true{
        max-height 400px !important
    }

    .srm-button-group-more{
        width 100%
        text-align center
        padding 8px 15px
        background-color var(--color-bg-default-b)
        font-size: 10px;
        color: #AFAFAF;
        line-height: 12px;
    }
}
</style>