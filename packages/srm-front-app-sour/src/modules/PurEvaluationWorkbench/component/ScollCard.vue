<!-- 评分要素滑块组件 -->
<script>
export default {
  modules: [ "sslm.purchaserEvaluationDetail", "sslm.common" ],
  name: "ScollCard",
  props:{
    // 激活当前卡片时，禁止重复触发回调方法，默认开启
    bidRepeatClick: {
      type: Boolean,
      default: true,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    activiteTab: {
      type: Number,
      default: 0,
    },
    scoreFlag: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    activiteCard() {
      return this.activiteTab || 0;
    }
  },
  methods: {
    // 卡片点击回调
    handClick(data, index) {
      // 激活当前卡片时，禁止重复触发回调方法
      if (this.bidRepeatClick) {
        if (this.activiteCard !== index) {
          this.$emit("handClick", data, index);
        }
      } else {
        this.$emit("handClick", data, index);
      }
    },
    // 全部操作回调
    onClickAll(dataList) {
      this.$emit("onClickAll", dataList, this.srmCardScrollTo);
    },
    srmCardScrollTo(index) {
      // 卡片宽度
      const cardWidth = this.$refs.srmCardRef.offsetWidth;
      // 滑动卡片宽度
      const toWidth = index * cardWidth;
      // 设置滑动宽度
      this.$refs.srmCardBoxRef.scrollTo(toWidth, 0);
    }
  },
  render() {
    return (
      <div class="scroll-one">
        <div class="scroll-two">
          <div class="scroll-container">
            <div class="scroll-card-box" ref="srmCardBoxRef">
              {this.dataList.map((data, index) => {
                const { indicatorName, respWeight, primaryIndexScore, finishScoreCount, totalScoreCount } = data || {};
                return <div class="scroll-card" ref="srmCardRef">
                  <div class="scroll-card-wrap" style={this.activiteTab === index ? { backgroundImage: "linear-gradient(110deg, #034BF1 0%, #4D8CFF 100%)", color: "#FFFFFF " } : {}} onClick={() => this.handClick(data, index)} tabIndex='1'>
                    <div>
                      <div class="scroll-card-wrap-header">
                        <span>{indicatorName}</span>
                        <span>{respWeight}</span>
                      </div>
                      <div class="scroll-card-wrap-content" style={this.activiteTab === index ? { color: "#FFFFFF " } : {}}>
                        <div class="scroll-card-wrap-content-divider" style={this.activiteTab === index ? { border: "0.5px solid #FFFFFF" } : {}}/>
                        <div class="scroll-card-wrap-content-line">
                          {this.scoreFlag && <span>{ this.$T("sslm.purchaserEvaluationDetail.form.label.progress").$D("评估进度") }：{`${finishScoreCount}/${totalScoreCount}`}</span>}
                          {this.scoreFlag && <div class="scroll-card-wrap-content-line-divider"/>}
                          <span>{ this.$T("sslm.purchaserEvaluationDetail.table.column.label.score").$D("得分") }：{primaryIndexScore || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>;
              })}
            </div>
            <div class="scroll-card-operation-bg"/>
            <div class="scroll-card-operation" onClick={() => this.onClickAll(this.dataList)}>
              <span class="scroll-card-operation-title" >
                {this.$T("sslm.common.view.button.all").$D("全部")}
              </span>
              <em class="srm-icon icon-grid" />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.scroll-one {
  top 0
  .scroll-two{
    padding: 4vw 0 4vw 4vw;
    .scroll-container {
      display: flex;
      overflow: hidden;
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
      .scroll-card-box{
        display: flex;
        overflow: scroll;
        .scroll-card {
          display: flex;
          align-items: center;
          margin-right: 8px;
          &-divider {
            width: 16px;
            flex-shrink: 0;
            background: #c9cdd4;
          }
          &-wrap {
            color: #1D2129;
            padding: 8px;
            font-size: 14px;
            width: 160px;
            height: 61px;
            flex-shrink: 0;
            background-image: linear-gradient(110deg, #F2F3F5 0%, #F7F8FA 100%);
            border-radius: 4px;
            &-header {
              font-size: 12px;
              letter-spacing: 0;
              line-height: 18px;
              font-weight: 600;
              display: flex;
              justify-content: space-between;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: overlay;
            }
            &-content {
              font-size: 10px;
              color: #868D9C;
              letter-spacing: 0;
              font-weight: 400;
              &-divider {
                height: 1px;
                margin: 8px 0;
                flex-shrink: 0;
                border: 0.5px solid #c9cdd4;
              }
              &-line {
                &-divider {
                  display: inline-block;
                  height: 8px;
                  border-left: 1px solid;
                  padding: 0 4px;
                }
                white-space: nowrap;
                overflow: overlay;
                span:first-child {
                  margin-right: 6px;
                }
              }
            }

            &:focus {
              background-color: yellow;
            }
          }
        }
      }
    }
  }
}
</style>

