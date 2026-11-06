<template>
  <section>
    <!-- 多标段 -->
    <srm-flex v-if="dbdList.length > 1"
              justify="between"
              align="start"
              :style="{height: showAll ? '' : '41px','overflow': 'hidden','padding':'8px 15px 0px 15px','border-bottom': '#f6f6f6 solid 1px', 'background': '#ffffff'}">
      <srm-flex-item>
        <srm-button v-for="(item, index) in dbdList"
                    :key="index"
                    style="height: 24px;font-size: 12px;margin: 0px 0px 8px 0px;min-width: 44px;max-width: 100px;"
                    :class="chooseWord === item.sourceHeaderId ? 'circle' : 'defined-style'"
                    :type="chooseWord === item.sourceHeaderId ? 'primary' : ''"
                    @click="chooseBtn(item.sourceHeaderId)">
          {{ item.sectionName }}
        </srm-button>
      </srm-flex-item>
      <srm-flex-item style="height: 24px;line-height: 24px;position: absolute;right: 0px;padding: 0px 15px;">
        <em v-if="!showAll" class="srm-icon icon-grid" @click="showAll = true"/>
        <em v-if="showAll" class="srm-icon icon-grid" style="color: var(--font-color-primary)" @click="showAll = false"/>
      </srm-flex-item>
    </srm-flex>

    <!-- 多阶段 发布准备、(资格预审)、报价中、(开标)、(专家评分/初审)、核价、完成 -->
    <srm-step-progress v-if="rfxProgress.length > 1" justify="start" :steps="rfxProgress" @indexChange="onIndexChange"/>

    <!-- 阶段组件 -->
    <component :is="currentCom[nodeStatus] || firstChildComp" v-if="isComponent" :rfx-header-id="rfxHeaderId"/>
  </section>
</template>

<script>
const storage = window.localStorage;
import { getAllSectionApi, getProgressApi } from "../api";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.inquiryHall" ],
  name: "RfxDetail",
  props: {
    changeReqId: {
      type: String,
    }
  },
  data() {
    return {
      firstCom: null,
      firstChildComp: () => ({
        component: this.firstCom,
      }),
      currentCom: {},
      isComponent: false,
      dbdList: [],
      chooseWord: "",
      showAll: false,
      rfxProgress: [],
      rfxHeaderId: "",
      nodeStatus: "",
      isFirst: true,
    };
  },
  mounted() {
    this.rfxHeaderId = this.changeReqId;
    try {
      // 获取多标段
      getAllSectionApi(this.rfxHeaderId).then((res) => {
        if (res.projectLineSectionList && res.projectLineSectionList.length > 1) {
          this.dbdList = [ ...res.projectLineSectionList ];
          this.chooseWord = this.dbdList[0].sourceHeaderId;
        } else {
          this.dbdList = [];
        }
        this.getManyProgress();
      });
    } catch (error) {
      this.dbdList = [];
    }
  },
  methods: {
    //获取多阶段
    getManyProgress() {
      this.rfxProgress = [];
      this.isComponent = false;
      getProgressApi({
        condition: { tenant: "SRM-ZHENYUN" },
        configKeys: [ "sourceLayout", "checkPriceWay", "sectionBidSwitchInform" ],
        rfxHeaderId: this.rfxHeaderId,
        tableCode: "source_old_ui_config",
      }).then((val) => {
        if (val && !val.faile) {
          val.processBar.map((item, index) => {
            this.rfxProgress.push({
              nodeSeq: index + 1,
              nodeDes: item.nodeStatusMeaning,
              nodeState: item.nodeFlag,
              nodeStatus: item.nodeStatus,
              forbiddenState: item.nodeFlag > 0,
            });
            if (item.nodeFlag === 0 && this.isFirst) {
              this.nodeStatus = item.nodeStatus;
              this.getCurrentNode();
            } else {
              this.isComponent = true;
            }
          });
        }
        this.isFirst = false;
      });
    },
    chooseBtn(word) {
      this.chooseWord = word;
      if (word) {
        storage.setItem("hallDetailRfxHeaderId", word);
      }
      this.rfxHeaderId = storage.getItem("hallDetailRfxHeaderId");
      this.getManyProgress();
      // 头部标题需要动态变化 - 根据标段
      this.$emit("changeSection");
    },
    onIndexChange(newNode) {
      if (newNode.nodeState > 0) {
        this.$notification.open({ message: this.$T("ssrc.inquiryHall.view.warning.noCurrentStatusView", [ newNode.nodeDes ]).$D("尚未到{nodeStatusMeaning}阶段，不能查看"), duration: 1000, });
        return;
      }
      this.nodeStatus = newNode.nodeStatus;
      this.getCurrentNode();
    },
    // 判断当前是哪个阶段
    getCurrentNode() {
      let that = this;
      that.isComponent = false;
      let componentName = "";
      switch (that.nodeStatus) {
      case "RELEASE_PREPARE": // 发布准备
        componentName = "ReleasePreparation";
        break;
      case "IN_PREQUAL": // 资格预审
        componentName = "Prequalification";
        break;
      case "IN_QUOTATION": // 报价中
        componentName = "InQuotation";
        break;
      case "OPEN_BID_PENDING": // 开标
        componentName = "BidOpening";
        break;
      case "SCORING": // 专家评分
        componentName = "ExpertScore";
        break;
      case "PRETRIAL_PENDING": // 初审
        componentName = "Preliminary";
        break;
      case "CHECK_PENDING": // 核价
        componentName = "Pricing";
        break;
      case "FINISHED": // 完成
        componentName = "Complete";
        break;
      default:
        componentName = "";
        break;
      }
      setTimeout(() => {
        that.firstCom = SrmUtil.quietlyImportComponent(import(`../components/${componentName}.vue`));
        that.currentCom[that.nodeStatus] = () => ({
          component: SrmUtil.quietlyImportComponent(import(`../components/${componentName}.vue`)),
        });
        that.isComponent = true;
      }, 0);
    }
  },
};
</script>

<style lang="stylus" scoped>
.defined-style {
  background: #ffffff;
  color: #333333;
}
</style>