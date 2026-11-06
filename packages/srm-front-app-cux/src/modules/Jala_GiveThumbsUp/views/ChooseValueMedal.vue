<template>
  <div style="height: 100vh;overflow-y: auto">
    <div class="detail-wrap create-receive-detail-scroll-el" >
      <img v-if="supplierId" src="@/assets/medalIcons/suppliermedal.png" width="100%" alt>
      <p v-if="supplierId && otherData.supplierName" class="jala-coin-title">
        {{ otherData.supplierName }}{{ $T('scux.supplierGiveThumbsUp.view.tab.get.coin').$D('共获得勋章') }}{{ otherData.medalCount }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}
      </p>
      <div class="jala-medalIcons">
        <span @click="handleChange(medalIconsData.innovation)">
          <img
            v-if="medalIconsData.innovation === 'INNOVATION_FALSE'"
            src="@/assets/medalIcons/innovationB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.innovation').$D('创新突破')">
          <img
            v-if="medalIconsData.innovation === 'INNOVATION_SURMOUNT'"
            src="@/assets/medalIcons/innovation.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.innovation').$D('创新突破')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.innovation').$D('创新突破') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.innovationNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.client)">
          <img
            v-if="medalIconsData.client === 'CLIENT_FALSE'"
            src="@/assets/medalIcons/clientB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.client').$D('客户至上')">
          <img
            v-if="medalIconsData.client === 'CLIENT_SUPREME'"
            src="@/assets/medalIcons/client.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.client').$D('客户至上')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.client').$D('客户至上') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.clientNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.cooperate)">
          <img
            v-if="medalIconsData.cooperate === 'COOPERATE_FALSE'"
            src="@/assets/medalIcons/cooperateB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.cooperate').$D('合作共赢')">
          <img
            v-if="medalIconsData.cooperate === 'COOPERATE_WIN'"
            src="@/assets/medalIcons/cooperate.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.cooperate').$D('合作共赢')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.cooperate').$D('合作共赢') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.cooperateNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.altruism)">
          <img
            v-if="medalIconsData.altruism === 'ALTRUISM_FALSE'"
            src="@/assets/medalIcons/altruismB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.altruism').$D('利他')">
          <img
            v-if="medalIconsData.altruism === 'ALTRUISM'"
            src="@/assets/medalIcons/altruism.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.altruism').$D('利他')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.altruism').$D('利他') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.altruismNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.trustworthy)">
          <img
            v-if="medalIconsData.trustworthy === 'TRUSTWORTHY_FALSE'"
            src="@/assets/medalIcons/trustworthyB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.trustworthy').$D('守信')">
          <img
            v-if="medalIconsData.trustworthy === 'TRUSTWORTHY'"
            src="@/assets/medalIcons/trustworthy.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.trustworthy').$D('守信')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.trustworthy').$D('守信') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.trustworthyNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.responsibility)">
          <img
            v-if="medalIconsData.responsibility === 'RESPONSIBILITY_FALSE'"
            src="@/assets/medalIcons/responsibilityB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.responsibility').$D('负责任')">
          <img
            v-if="medalIconsData.responsibility === 'RESPONSIBILITY'"
            src="@/assets/medalIcons/responsibility.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.responsibility').$D('负责任')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.responsibility').$D('负责任') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.responsibilityNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.master)">
          <img
            v-if="medalIconsData.master === 'MASTER_FALSE'"
            src="@/assets/medalIcons/masterB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.master').$D('主人翁')">
          <img
            v-if="medalIconsData.master === 'MASTER'"
            src="@/assets/medalIcons/master.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.master').$D('主人翁')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.master').$D('主人翁') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.masterNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.usenumber)">
          <img
            v-if="medalIconsData.usenumber === 'USE_NUMBER_FALSE'"
            src="@/assets/medalIcons/usenumberB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.usenumber').$D('善用数字')">
          <img
            v-if="medalIconsData.usenumber === 'USE_NUMBER'"
            src="@/assets/medalIcons/usenumber.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.usenumber').$D('善用数字')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.usenumber').$D('善用数字') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.usenumberNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
        <span @click="handleChange(medalIconsData.pursue)">
          <img
            v-if="medalIconsData.pursue === 'PURSUE_FALSE'"
            src="@/assets/medalIcons/pursueB.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.pursue').$D('追求结果')">
          <img
            v-if="medalIconsData.pursue === 'PURSUE'"
            src="@/assets/medalIcons/pursue.png"
            height="60"
            :alt="$T('scux.supplierGiveThumbsUp.view.tab.pursue').$D('追求结果')">
          <p class="jala-medalIcons-text">{{ $T('scux.supplierGiveThumbsUp.view.tab.pursue').$D('追求结果') }}</p>
          <p v-if="supplierId" class="jala-medalIcons-text">{{ medalIconsNumber.pursueNum }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
        </span>
      </div>
      <srm-bottom-handler
        :btn-arr="getBtnArr"
        type="action-sheet"/>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@/utils/index";
import { fetchThumbsUp } from "../api/index";

export default {
  modules: [ "scux.supplierGiveThumbsUp", "hzero.common" ],
  props: {
    handleLikeLanuchConfirm: {
      type: Function,
    },
    supplierId: {
      type: Number,
    },
    closePopupParent: {
      type: Function,
    },
  },
  data() {
    return {
      medalIconsData: {
        innovation: "INNOVATION_FALSE", // INNOVATION_SURMOUNT
        client: "CLIENT_FALSE", // CLIENT_SUPREME
        cooperate: "COOPERATE_FALSE", // COOPERATE_WIN
        altruism: "ALTRUISM_FALSE", // ALTRUISM
        trustworthy: "TRUSTWORTHY_FALSE", // TRUSTWORTHY
        responsibility: "RESPONSIBILITY_FALSE", // RESPONSIBILITY
        master: "MASTER_FALSE", // MASTER
        usenumber: "USE_NUMBER_FALSE", // USE_NUMBER
        pursue: "PURSUE_FALSE", // PURSUE
      },
      medalIconsNumber: {
        innovationNum: 0,
        clientNum: 0,
        cooperateNum: 0,
        altruismNum: 0,
        trustworthyNum: 0,
        responsibilityNum: 0,
        masterNum: 0,
        usenumberNum: 0,
        pursueNum: 0,
      },
      otherData: {
        medalCount: 0,
        supplierName: "",
      },
    };
  },
  computed: {
    getBtnArr() {
      return [
        isEmpty(this.supplierId) ? {
          title: this.$T("hzero.common.view.button.confirm").$D("确认"),
          handler: () => {
            this.handleLikeLanuchConfirm(this.medalIconsData);
          },
        } : {
          title: this.$T("hzero.common.view.button.back").$D("返回"),
          handler: () => {
            this.closePopupParent();
          },
        },
      ];
    }
  },
  mounted() {
    if (!isEmpty(this.supplierId)) {
      fetchThumbsUp({ supplierId: this.supplierId }).then((res) => {
        if (res && !res.failed) {
          const { medalCount, supplierName, medalLines = [] } = res;
          this.otherData = { medalCount, supplierName };
          medalLines.forEach((item) => {
            switch (item.medalType) {
            case "INNOVATION_SURMOUNT":
              this.medalIconsData.innovation = "INNOVATION_SURMOUNT";
              this.medalIconsNumber.innovationNum = item.piecesNum; break;
            case "CLIENT_SUPREME": this.medalIconsData.client = "CLIENT_SUPREME"; this.medalIconsNumber.clientNum = item.piecesNum; break;
            case "COOPERATE_WIN": this.medalIconsData.cooperate = "COOPERATE_WIN"; this.medalIconsNumber.cooperateNum = item.piecesNum; break;
            case "ALTRUISM": this.medalIconsData.altruism = "ALTRUISM"; this.medalIconsNumber.altruismNum = item.piecesNum; break;
            case "TRUSTWORTHY": this.medalIconsData.trustworthy = "TRUSTWORTHY"; this.medalIconsNumber.trustworthyNum = item.piecesNum; break;
            case "RESPONSIBILITY": this.medalIconsData.responsibility = "RESPONSIBILITY"; this.medalIconsNumber.responsibilityNum = item.piecesNum; break;
            case "MASTER": this.medalIconsData.master = "MASTER"; this.medalIconsNumber.masterNum = item.piecesNum; break;
            case "USE_NUMBER": this.medalIconsData.usenumber = "USE_NUMBER"; this.medalIconsNumber.usenumberNum = item.piecesNum; break;
            case "PURSUE": this.medalIconsData.pursue = "PURSUE"; this.medalIconsNumber.pursueNum = item.piecesNum; break;
            default: break;
            }
          });
        }
      });
    }
  },
  methods: {
    // 图片选择判断
    handleChange(val) {
      switch (val) {
      case "INNOVATION_SURMOUNT": this.medalIconsData.innovation = "INNOVATION_FALSE"; break;
      case "CLIENT_SUPREME": this.medalIconsData.client = "CLIENT_FALSE"; break;
      case "COOPERATE_WIN": this.medalIconsData.cooperate = "COOPERATE_FALSE"; break;
      case "ALTRUISM": this.medalIconsData.altruism = "ALTRUISM_FALSE"; break;
      case "TRUSTWORTHY": this.medalIconsData.trustworthy = "TRUSTWORTHY_FALSE"; break;
      case "RESPONSIBILITY": this.medalIconsData.responsibility = "RESPONSIBILITY_FALSE"; break;
      case "MASTER": this.medalIconsData.master = "MASTER_FALSE"; break;
      case "USE_NUMBER": this.medalIconsData.usenumber = "USE_NUMBER_FALSE"; break;
      case "PURSUE": this.medalIconsData.pursue = "PURSUE_FALSE"; break;
      case "INNOVATION_FALSE": this.medalIconsData.innovation = "INNOVATION_SURMOUNT"; break;
      case "CLIENT_FALSE": this.medalIconsData.client = "CLIENT_SUPREME"; break;
      case "COOPERATE_FALSE": this.medalIconsData.cooperate = "COOPERATE_WIN"; break;
      case "ALTRUISM_FALSE": this.medalIconsData.altruism = "ALTRUISM"; break;
      case "TRUSTWORTHY_FALSE": this.medalIconsData.trustworthy = "TRUSTWORTHY"; break;
      case "RESPONSIBILITY_FALSE": this.medalIconsData.responsibility = "RESPONSIBILITY"; break;
      case "MASTER_FALSE": this.medalIconsData.master = "MASTER"; break;
      case "USE_NUMBER_FALSE": this.medalIconsData.usenumber = "USE_NUMBER"; break;
      case "PURSUE_FALSE": this.medalIconsData.pursue = "PURSUE"; break;
      default: break;
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.jala-medalIcons {
  display: grid;
  margin-top: 15px;
    text-align: center;
    grid-template-columns: 110px 110px 110px;
    padding: 10px 20px;
    grid-template-rows: 119px 119px 119px;
    grid-row-gap: 30px;
}
.jala-medalIcons-text {
  margin-top: 16px;
    font-weight: 600;
}
.jala-coin-title {
  text-align: center;
    font-size: 14px;
    margin-top: 14px;
    font-weight: 600;
}
</style>
