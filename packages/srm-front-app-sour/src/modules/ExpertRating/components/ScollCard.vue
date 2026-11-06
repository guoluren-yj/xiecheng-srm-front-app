<!-- 评分要素滑块组件 -->
<script>
export default {
  modules: [ "hipspfm.expertScoring", "ssrc.expertScoring" ],
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
    }
  },
  render() {
    return (
      <div class="scroll-one">
        <div class="scroll-two">
          <div class="scroll-container">
            <div class="scroll-card-box">
              {this.dataList.map((data, index) => {
                const { indicateName, evaluateProgress, team } = data || {};

                return <div class="scroll-card">
                  <div class="scroll-card-divider"/>
                  <div class="scroll-card-wrap" style={this.activiteTab === index ? { backgroundImage: "linear-gradient(110deg, #034BF1 0%, #4D8CFF 100%)", color: "#FFFFFF " } : {}} onClick={() => this.handClick(data, index)} tabIndex='1'>
                    <div>
                      <div class="scroll-card-wrap-header">
                        <span class="scroll-card-wrap-header-name">{indicateName}</span>
                        {team === "BUSINESS" ? <img src={this.activiteTab === index ? require("@/assets/icon_bus_select.svg") : require("@/assets/icon_bus_unselect.svg")} alt /> : null}
                        {team === "TECHNOLOGY" ? <img src={this.activiteTab === index ? require("@/assets/icon_tech_select.svg") : require("@/assets/icon_tech_unselect.svg")} alt /> : null}
                      </div>
                      <div class="scroll-card-wrap-content" style={this.activiteTab === index ? { color: "#FFFFFF " } : {}}>
                        <div class="scroll-card-wrap-content-divider" style={this.activiteTab === index ? { border: "0.5px solid #FFFFFF" } : {}}/>
                        <div class="scroll-card-wrap-content-line">
                          <span>{ this.$T("ssrc.expertScoring.view.mobile.evaluateProgress").$D("评估进度") }：{evaluateProgress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>;
              })}
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
    border-radius: 2px;
    .scroll-container {
      overflow: hidden;
      .scroll-card-box{
        display: flex;
        align-items: center;
        overflow-y: hidden;
        overflow-x: scroll;
        padding: 8px 15px 16px
        .scroll-card {
          display: flex;
          align-items: center;
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
              &-name {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
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
                text-overflow: ellipsis;
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
          &:first-child {
            margin-left: -18px
          }
        }
      }
    }
  }
}
</style>

