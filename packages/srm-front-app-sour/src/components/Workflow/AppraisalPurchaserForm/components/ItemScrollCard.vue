<!--
 * @Date: 2024-08-15 17:28:16
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<script>
import { $T } from "srm-mobile-ui";

export default {
  modules: [ ],
  name: "ItemScrollCard",
  props:{
    supplierDimension:{ // 是否供应商维度
      type: Boolean,
      default: true,
    },
    evalGranularity:{ // 维度
      type: String,
      default: "",
    },
    dataList: { // 数据源
      type: Array,
      default: () => [],
    },
    activeCard: { // 当前活动的key
      type: Number,
      default: 0,
    },
    handClick:{ // 点击卡片的回调
      type: Function,
      default: () => {},
    },
    handleClickAll:{ // 点击卡片全部的回调
      type: Function,
      default: () => {},
    },
  },
  computed: {
  },
  methods: {
    // 卡片点击回调
    handCardClick(data, index) {
      if (this.activeCard !== index) {
        this.handClick(data, index);
      }
    },
    cardScrollTo(index) {
      // 卡片宽度
      const cardWidth = this.$refs.scrollCardRef.offsetWidth;
      // 滑动卡片宽度
      const toWidth = index * cardWidth;
      // 设置滑动宽度
      this.$refs.scrollCardWrapRef.scrollTo(toWidth, 0);
    },
  },
  render() {
    const displayName = this.supplierDimension ? "supplierName" : this.evalGranularity === "SU+CA" ? "categoryName" : "itemName";
    const displayCode = this.supplierDimension ? "supplierNum" : this.evalGranularity === "SU+CA" ? "categoryCode" : "itemCode";
    return (
      <div class="scroll-card-container">
        <div class="scroll-card-wrap" ref="scrollCardWrapRef">
          {this.dataList.map((data, index) => <div class="scroll-card" ref="scrollCardRef" onClick={() => this.handCardClick(data, index)} style={index === this.activeCard ? { backgroundImage: "linear-gradient(109deg, #034BF1 0%, #4D8CFF 100%)" } : {}}>
            <div class="scroll-card-name" style={index === this.activeCard ? { color: "#fff" } : {}}>
              {data[displayName]}
            </div>
            <div class="scroll-card-code" style={index === this.activeCard ? { color: "#fff" } : {}}>
              {data[displayCode]}
            </div>
          </div>)}
        </div>
        <div class="scroll-card-operation-bg"/>
        <div class="scroll-card-operation" onClick={() => this.handleClickAll(this.cardScrollTo)}>
          <span class="scroll-card-operation-title" >
            {$T("sslm.common.view.button.all").$D("全部")}
          </span>
          <em class="srm-icon icon-grid" />
        </div>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.scroll-card-container{
   display: flex;
  .scroll-card-wrap{
    flex: 1;
    display: flex;
    overflow: scroll;
    .scroll-card{
      padding: 8px;
      flex-shrink: 0;
      width: 160px;
      height: 56px;
      margin-right: 8px;
      border-radius: 4px;
      background-image: linear-gradient(109deg, #F2F3F5 0%, #F7F8FA 100%);
      .scroll-card-name{
        font-size: 12px;
        color: #1D2129;
        line-height: 18px;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .scroll-card-code{
        font-size: 10px;
        color: #868D9C;
      }
    }
  }
  .scroll-card-operation-bg{
    width: 3px;
    background-image: linear-gradient(90deg, rgba(238,238,238,0.00) 0%, rgba(194,194,194,0.20) 100%);
  }
  .scroll-card-operation{
    width 26px;
    padding: 8px;
    color: #868D9C;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .scroll-card-operation-title{
      font-size: 10px;
      line-height: 12px;
    }
    >>> .srm-icon.icon-grid{
         font-size: 12px;
         margin-top: 4px
      }
  }
}
</style>

