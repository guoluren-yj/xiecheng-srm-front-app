<template>
  <hips-popup
    v-model="value"
    style="height: 100%; width: 100%; overflow: hidden"
    position="bottom"
    :overlay-on-click-close="false"
    @click-overlay="$emit('input', false)">
    <!-- 导航 -->
    <NavPopHead :title="$T('ssrc.inquiryHall.view.inquiryHall.headerDetail').$D('表头详情')" :show-pop-head-flag="true" @clickBack="$emit('input',false)" />
    <div ref="content" class="rfxprice-detail">
      <!-- 内容区 -->
      <div class="card-personalized">
        <CustomizeDetail :columns="getColumns" :data-source="headerInfo" code="SMBL.SUMEC.INSPECTNOTICE.HEADER_DETAIL" />
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { Popup } from "hips";
import NavHead from "@/components/NavHead";
import NavPopHead from "@/components/NavPopHead";

export default {
  modules: [ "ssrc.inquiryHall","smbl.common","sodr.common" ],
  name: "InspectNoticeHeaderPop",
  components: {
    NavHead,
    NavPopHead,
    [Popup.name]: Popup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    headerInfo:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
    };
  },
  computed:{
    getColumns() {
      const columns = [
        {
          fieldName: "单号",
          fieldType: "TEXT",
          fieldCode: "qqcNum",
          langCode:"smbl.common.message.NoOfInspectionNotice"
        },
        {
          fieldName: "验货类型",
          fieldType: "TEXT",
          fieldCode: "qqcTypeMeaning",
          langCode:"smbl.common.model.inspectionType"
        },
        {
          fieldName: "公司",
          fieldType: "TEXT",
          fieldCode: "companyName",
          langCode:"sodr.common.model.common.companyName"
        },
        {
          fieldName: "部门",
          fieldType: "TEXT",
          fieldCode: "unitName",
          langCode:"sodr.common.model.common.departmente"
        },
        {
          fieldName: "QA",
          fieldType: "TAG",
          fieldCode: "qaUserName",
          langCode:"smbl.common.model.QA"
        },
        {
          fieldName: "创建日期",
          fieldType: "TAG",
          fieldCode: "creationDate",
          langCode:"sodr.common.model.common.creationDate",
          render: (val) => {
            return this.$options.filters["CalcDate"](val);
          }
        },
      ];
      return columns;
    }
  },
  methods: {
    //switch切换
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    /**
     * ************************
     * 组件属性控制方法
     * ************************
     */
    // 返回
    goBack() {
      //取父页面v-model的绑定值，设置其值为false，效果为隐藏报价明细pop
      this.$emit("input",false);
    },
    //退出子应用
    goClose() {
      this.$emit("input",false);
    },
    //回到顶部
    goTop() {
      this.$refs.content.scrollTop = 0;
    },
  },
};
</script>

<style lang="stylus" scoped>

.rfxprice-detail {
  width: 100%;
  height calc(100vh - 44px);
  overflow-y: auto;

  .card-personalized {
    width: 100%;
    color: #666666;
    padding 12px 15px;
    background: var(--color-bg-default);

    .card-first-single{
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
      padding: 12px 0;
    }

    .card-first-between{
      display: flex;
      justify-content: space-between;
      padding: 12px 0;

      .line-code {
        text-align: left;
        font-size: 16px;
        color: var(--color-font-default, #1b1e2b);
        font-weight: bold;
      }

      .line-num {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }
}

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}
</style>
