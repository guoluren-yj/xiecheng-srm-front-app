
<template>
  <div class="new-head">
    <div class="head-title">{{ title }}</div>
    <slot/>
    <div v-if="!noFile || !noHistory" class="other">
      <div class="othen-left">
        <div v-if="!noFile" class="file" @click="showFilePop">
          <img class="file-img" src="@/assets/Comp/icon_Button_paperclip_highlight@3x.png" >
          <span>{{ fileBoxName || $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件') }}</span>
        </div>
        <div v-if="!noHistory" class="file history" @click="showOperationPop">
          <img class="file-img" src="@/assets/Comp/icon_Button_clock_highlight@3x.png" >
          <span>{{ $T('hzero.common.status.history').$D('历史记录') }}</span>
        </div>
      </div>
      <div class="othen-right">
        <slot name="other"/>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

export default {
  modules: [ "ssrc.inquiryHall", "hzero.common" ],
  name: "NewDetailHead",
  components: {
  },
  props: {
    title:{
      type:String,
      default:""
    },
    noFile:{
      type:Boolean,
      default:false
    },
    noHistory:{
      type:Boolean,
      default:false
    },
    fileBoxName:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      operationPopup:false,
      filePopup:false
    };
  },
  computed: {
  },
  methods: {
    showFilePop() {
      this.$emit("showFilePop");
    },
    showOperationPop() {
      this.$emit("showOperationPop");
    },
  },
};
</script>
<style lang="stylus" scoped>
.new-head{
    background var(--color-other-default-b)
    padding 16px 15px 0 15px
    color var(--color-font-default-d)
    head auto
    .head-title{
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        margin-bottom 4px
        word-break break-all
    }
    .other{
        background: var(--color-bg-default);
        border-radius: 12px 12px 0px 0px;
        box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.08) inset;
        font-size: 12px;
        color var(--color-other-default-b)
        line-height: 16px;
        display flex;
        align-items center
        justify-content space-between
        padding 12px 16px
        margin-top 12px
        .othen-left{
            display flex;
            align-items center
            .file{
                font-weight  bold
                border: 1px solid var(--color-other-default-b);
                border-radius: 12px;
                display flex;
                align-items center
                justify-content center
                padding 3px 5px
                margin-right 12px
                &:nth-last-child(1){
                    margin-right 0
                }
                .file-img{
                    width: 12px;
                    height: 12px;
                    margin-right 4px
                }
            }
            .history{
                border: 1px solid var(--color-other-default-d);
                color var(--color-other-default-d)
            }
        }

    }
}
</style>