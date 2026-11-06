<script>
// 类似PC端 Alert组件
export default {
  modules: [ "smodr.orderDetail" ],
  name: "NoticeBar",
  props: {
    // 传入的提示内容
    text: {
      type: [ String, Function ],
      default: "",
    },
    // 字体颜色
    color: {
      type: String,
      default: "#276ef1",
    },
    backgroundColor: {
      type: String,
      default: "#eff3fe",
    },
    fontSize: {
      type: String,
      default: "12px",
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    updateVisible() {
      this.visible = false;
    },
  },
  render() {
    return (
      this.visible &&
        <div
          class="content-wrapper"
          style={{
            color: this.color,
            backgroundColor: this.backgroundColor,
            fontSize: this.fontSize,
          }}
        >
          <div class="content-text">
            {this.text &&
              (typeof this.text === "function" ?
                this.text() :
                <div>{this.text}</div>
              )}
          </div>
          <span
            class="icon srm-icon icon-x"
            onClick={this.updateVisible}
          />
        </div>

    );
  },
};
</script>
<style scoped>
.content-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  line-height: 16px;
  font-weight: 500;
  align-items: center;
}
.content-text {
  padding-right: 16px;
}
.icon {
  flex: none;
}
</style>
