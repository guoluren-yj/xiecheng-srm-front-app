<template>
  <div style="height: 100vh; overflow-y: scroll">
    <div class="main-info">
      <nav-head :title="$T('scux.expertReply.view.message.expertReply').$D('专家回复')"/>
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
      </srm-detail-head>
      <!-- 内容区域 -->
      <srm-scroll-tab class="content" content-scroll>
        <srm-scroll-tab-item
          :label="
            $T('scux.expertReply.view.message.panel.baseInfos').$D('基础信息')
          ">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
           <srm-form
            v-else
            :data-set="basicInfoDs"
            :columns="getBasicInfoColumns"/>
          <!-- <customize
            v-else
            :need-padding="true"
            :data-source="headInfo"
            :columns="getBasicInfoColumns"/> -->
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <srm-bottom-handler v-if="operate==='waitReply'" :btn-arr="getBtnArr" />
    </div>
    <srm-popup :visible.sync="visibleBack" title="" height="50%" show-back :show-close="false" header-align="left" @onClose="onClose">
       <srm-form
        :data-set="basicInfoDs"
        :columns="getPopupClomns"/>
      <span slot="right"><a style="color: #00BFBF" @click="onOk">{{ $T('scux.expertReply.view.button.confirm').$D('确认') }}</a></span>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T, } from "srm-mobile-ui";
import { expertReplyApi } from "../api/index";
import SrmAppCore from "srm-front-app-core";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { isEmpty } from "@/utils/index";
import { basicInfoData } from "../datasource/index";
export default {
  modules: [ "scux.expertReply", "hipspfm.common" ],
  name: "ExpertReplyDetail",
  data() {
    return {
      headInfo: {}, // 头信息
      basicInfoDs: new DataSet(basicInfoData()),
      operate: '',
      visibleBack: false,
      getBasicInfoColumns: [],
      replyStatus: '',
    };
  },
  computed: {
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "sourceFromNum",
        },
        {
          fieldCode: "sourceFromTitle",
        },
      ];
      return columns;
    },
    getBtnArr() {
      return [
        {
          text: this.$T("scux.expertReply.model.button.attend").$D("出席"),
          fill: true,
          title: this.$T("scux.expertReply.model.button.attend").$D("出席"),
          handler: this.handleAttend
        },
        {
          text: this.$T("scux.expertReply.model.button.absent").$D("不出席"),
          fill: true,
          title: this.$T("scux.expertReply.model.button.absent").$D("不出席"),
          handler: this.handleAbsent
        },
      ];
    },
    getPopupClomns() {
      return [
        {
          fieldCode: "replyContent",
          fieldType: "TEXT_AREA",
          editor: true,
        },
      ]
    }
  },
  created() {

  },
  mounted() {
    this.headInfo = this.$store.getters["Naura_ExpertReply/getExpertRatingList"];
    console.log(this.headInfo);
    this.basicInfoDs.setData([this.headInfo])
    this.basicInfoDs.locate(0);
    this.operate = this.$store.getters["Naura_ExpertReply/getExpertRatingOperates"];
    this.getBasicInfoColumns = this.getBasicCloumns();
  },
  methods: {
    getBasicCloumns () {
      const waitColumns = [
        {
          fieldCode: "attributeDatetime12",
        },
        {
          fieldCode: "attributeVarchar17",
        },
        {
          fieldCode: "purName",
        },
        {
          fieldCode: "purPhone",
        },
        {
          fieldCode: "purEmail",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "replyEndTime",
        },
      ];
      const allColumns = [
        {
          fieldCode: "attributeDatetime12",
        },
        {
          fieldCode: "attributeVarchar17",
        },
        {
          fieldCode: "replyStatusMeaning",
        },
        {
          fieldCode: "replyContent",
        },
        {
          fieldCode: "realStatusMeaning",
        },
        {
          fieldCode: "replyTime",
        },
        {
          fieldCode: "replyTypeMeaning",
        },
        {
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldCode: "purName",
        },
        {
          fieldCode: "purPhone",
        },
        {
          fieldCode: "purEmail",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "replyEndTime",
        },
      ];
      let operateCopy = this.operate || this.$store.getters["ExpertRating/getExpertRatingOperates"];
      return operateCopy === 'waitReply' ? waitColumns : allColumns;
    },
    handleAttend() {
      this.replyStatus = 'ATTEND';
      this.visibleBack = true;
      console.log(this.basicInfoDs.current);
    },
    handleAbsent() {
      this.replyStatus = 'ABSENT';
      this.visibleBack = true;
      console.log(this.basicInfoDs.current);
    },
    async onOk () {
      const that = this;
      const {
        extractResultId,
        sourceFromNum
      } = this.basicInfoDs.current?.data || {};
      const commonData = {
        sourceFromNum,
        extractResultIdList: [extractResultId],
        replyStatus: this.replyStatus,
      }
      const handleReply = async (replyContent) =>{
        const data = {
          replyContent,
          ...commonData,
        };
        this.$loading.show();
        await expertReplyApi(data).then(res => {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("scux.expertReply.message.acction.success").$D("操作成功"),
              class: "notification",
              duration: 3
            });
            that.$router.back();
          }
          this.$loading.hide();
        })
      }
      const replyContent = this.basicInfoDs.current.get('replyContent');
      if(this.replyStatus === 'ABSENT'){
        console.log(replyContent);
        if(replyContent){
          // 调用回复接口
          await handleReply(replyContent);
          that.$router.back();
        }else{
          this.$notification.open({ message: "请填写原因", duration: 1000, });
        }
      }else{
        await handleReply(replyContent);
        that.$router.back();
      }
    },
    onClose () {
      
    }
  },
};
</script>
<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
.card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }
  .name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }
  .sub-single-title {
    height:50px;
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }
  .line-body {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .line-code {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-font-default-c);
    border-radius: 2px;
    background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
  }

  .line-number {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    margin-left: 8px;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    border-radius: 2px;
    background: var(--color-bg-default-c);
  }
}
>>> .srm-collapse-title{
  padding-left:0;
}
</style>