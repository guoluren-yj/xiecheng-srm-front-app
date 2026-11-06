<!--<template>-->
<!--  <srm-flex class="score" align="start" direction="column">-->
<!--    <div class="score-title">{{ title }}</div>-->
<!--    <srm-blank size="1px" theme="fill"/>-->
<!--    <div class="score-star">-->
<!--      <srm-score :achieved-score="score" :half-flag="true" style-type="starFill" :total-score-flag="true" :total-score="5" @itemClick="onItemClick"/>-->
<!--    </div>-->
<!--    <srm-flex class="score-character-number" justify="between">-->
<!--      <div class="score-character-number-desc">{{ $T("smbl.common.data.estimate").$D("单据评价") }}</div>-->
<!--    </srm-flex>-->
<!--    <div class="score-description">-->
<!--      <srm-textarea-field v-model="val" :height="76" theme="fill" :max-length="150"/>-->
<!--    </div>-->
<!--    <srm-blank size="1px" theme="fill"/>-->
<!--  </srm-flex>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  modules: [ "smbl.common" ],-->
<!--  name: "Score",-->
<!--  props: {-->
<!--    title: {-->
<!--      type: String,-->
<!--      default: "",-->
<!--    },-->
<!--    value:{-->
<!--      type:Object,-->
<!--      default: null-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      val:"",-->
<!--      score:null,-->
<!--    };-->
<!--  },-->
<!--  watch:{-->
<!--    value(nVal) {-->
<!--      if (nVal) {-->
<!--        this.val = nVal.description;-->
<!--        this.score = nVal.score ? nVal.score : 0;-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  onShow() {-->

<!--  },-->
<!--  beforeMount() {-->

<!--  },-->
<!--  mounted() {-->

<!--  },-->
<!--  methods: {-->
<!--    onItemClick(score) {-->
<!--      this.score = score;-->
<!--    },-->
<!--    getResult() {-->
<!--      return { description:this.val, score:this.score };-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style lang="stylus" scoped>-->

<!--@import "~srm-mobile-ui/src/style/var.styl"-->
<!--.score{-->
<!--  .score-title{-->
<!--    display flex;-->
<!--    align-items center;-->
<!--    padding-left  15px;-->
<!--    font-family: PingFangSC-Medium;-->
<!--    font-size: 12px;-->
<!--    color: #333333;-->
<!--    line-height: 16px;-->
<!--    font-weight: 500;-->
<!--    height 32px;-->
<!--    width 100%;-->
<!--  }-->
<!--  .score-star{-->
<!--    display flex-->
<!--    align-items center;-->
<!--    width 100%;-->
<!--    height 48px;-->
<!--    padding-left  15px;-->
<!--  }-->
<!--  .score-character-number{-->
<!--    height 32px;-->
<!--    padding-left  15px;-->
<!--  }-->
<!--  .score-character-number-desc{-->
<!--    font-family: PingFangSC-Medium;-->
<!--    font-size: 12px;-->
<!--    color: #AFAFAF;-->
<!--    line-height: 16px;-->
<!--    font-weight: 500;-->
<!--  }-->
<!--  .score-character-number-show{-->
<!--    font-family: PingFangSC-Regular;-->
<!--    font-size: 12px;-->
<!--    color: #333333;-->
<!--    text-align: right;-->
<!--    line-height: 16px;-->
<!--    font-weight: 400;-->
<!--  }-->
<!--  .score-description{-->
<!--    padding-left  15px;-->
<!--    width 100%-->
<!--    padding-right 15px;-->
<!--  }-->
<!--}-->

<!--</style>-->
