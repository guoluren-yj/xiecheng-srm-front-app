<template>
  <div v-loading="initLoading" style="min-height: 500px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- 需求联络单头信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('需求联络单头信息')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.liaisonNum" class="noContent">
                <span>
                  {{ getLanguageDefine("暂无数据") }}
                </span>
              </div>
              <ul v-else>
                <!-- 个性化组件替换后的代码 -->
                <customize-detail
                  v-if="type==='Four'"
                  :columns="getHeadColumns()"
                  :data-source="headInfo"
                  type="list"
                  :need-padding="false"/>
                <customize
                  v-else
                  :columns="getHeadColumns()"
                  :data-source="headInfo"
                  type="list"
                  :need-padding="false"/>
                <div v-for="(res, index) in headLinesInfo"
                     :key="res.reqLiaisonDetailId">
                  <div v-if="liaisonType === '10'"
                       class="first-item"
                       style="margin-bottom: 5px"
                       @click="openDetailPop('headerLine', res)">
                    <span class="block"/>
                    <span class="text">行号：{{ index+1 }}</span>
                  </div>
                  <customize
                    v-if="type!=='Four' && liaisonType === '10'"
                    :columns="getHeadLineColumns(index)"
                    :data-source="res"
                    type="list"
                    :need-padding="false"/>
                  <customize-detail
                    v-if="type==='Four' && liaisonType === '10'"
                    :columns="getHeadLineColumns(index)"
                    :data-source="res"
                    type="list"
                    :need-padding="false"/>
                </div>
              </ul>
            </div>
          </srm-scroll-tab-item>

          <!-- 需求联络单行信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('需求联络单行信息')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="linesInfo.length === 0" class="noContent">
                <span>
                  {{ getLanguageDefine("暂无数据") }}
                </span>
              </div>
              <ul v-else>
                <template v-for="(item, index) in linesInfo" >
                  <!-- 个性化组件替换后的代码 -->
                  <customize-detail
                    v-if="type==='Four'"
                    :key="item.reqLiaisonLineId"
                    :columns="getLineColumns(index)"
                    :data-source="item"
                    :need-padding="false"
                    type="list"/>
                  <customize
                    v-else
                    :key="item.reqLiaisonLineId"
                    :columns="getLineColumns(index)"
                    :data-source="item"
                    type="list"
                    :need-padding="false"/>
                </template>
              </ul>
            </div>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>

      <!-- 弹框 -->
      <srm-popup :visible.sync="visible"
                 :title="customizeInfo.title"
                 height="90%"
                 rounded>
        <customize-detail
          class="card-pop"
          :columns="getDetailColumns(customizeInfo.name)"
          :data-source="detailInfo"/>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import { changeDemandContactApi } from "./api/JiaLan_DemandContactApproval";
import jiaLanMixin from "./jiaLanMixin";
export default {
  modules: [ "hipspfm.common", "scux.demandContactFrom", "hzero.common" ],
  name: "JiaLanDemandContactApproval",
  mixins: [ jiaLanMixin ],
  data() {
    return {
      visible: false,
      // 查看详情
      detailInfo: {},
      customizeInfo: {
        title: "",
        name: "",
      }
    };
  },
  methods: {
    openDetailPop(name, item = {}) {
      this.detailInfo = { ...item };
      this.customizeInfo = {
        name: name
      };
      if (name === "header") {
        this.customizeInfo["title"] = "需求联络单头信息";
      }
      if (name === "headerLine") {
        this.customizeInfo["title"] = "行信息";
      }
      if (name === "line") {
        this.customizeInfo["title"] = "需求联络单行信息";
      }
      this.visible = true;
    },
    // 校验必输
    beforeApprove() {
      return new Promise((resolve, reject) => {
        if (this.type !== "Four") {
          resolve(true);
        }
        let header = this.getHeadColumns().filter((res) => res.required);
        let headerLine = this.getHeadLineColumns(-1).filter((res) => res.required);
        let line = this.getLineColumns(-1).filter((res) => res.required);
        let headerField = header.find((item) => !this.headInfo[item.fieldCode]);
        let f = false;
        if (headerField) {
          this.$notification.open({
            message: `${headerField.fieldName} 字段必输！`,
            duration: 2000
          });
          f = true;
        }
        this.headLinesInfo.map((res) => {
          headerField = headerLine.find((item) => !res[item.fieldCode]);
          if (headerField) {
            this.$notification.open({
              message: `${headerField.fieldName} 字段必输！`,
              duration: 2000
            });
            f = true;
          }
        });
        this.linesInfo.map((res) => {
          headerField = line.find((item) => !res[item.fieldCode]);
          if (headerField) {
            this.$notification.open({
              message: `${headerField.fieldName} 字段必输！`,
              duration: 2000
            });
            f = true;
          }
        });
        if (f) {
          reject(f);
        } else {
          this.save().then(() => {
            resolve(true);
          }).catch(() => {
            reject(false);
          });
        }
      });
    },
    // 保存数据
    save() {
      return new Promise((resolve, reject) => {
        if (this.liaisonType === "10") {
          this.headInfo["jalaReqLiaisonDtlList"] = this.headLinesInfo;
        }
        this.headInfo["jalaReqLiaisonLnList"] = this.linesInfo;
        changeDemandContactApi(this.headInfo).then((res) => {
          if (res.reqLiaisonHeaderId) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
  }
};
</script>

<style scoped lang="stylus">
.card-pop {
  padding: 0 12px;
}
.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
        }
      }
    }
  }

  .contentWrap {
    overflow visible;
    .content {
      >>> .srm-tab-pane-title {
        background: var(--color-border-default) !important;
      }
      .headInfo {
        ul {
          padding: 12px 15px 12px 15px;
          font-family: auto;
        }
        .first-item {
          display: flex;
          align-items: center;
          position: relative;
          .block {
            width: 7px;
            height: 10px;
            background-color: var(--color-other-default-b);
            position: absolute;
            left: -15px;
            top: 4px;
          }
          .text {
            line-height: 20px;
            font-size: 14px;
            color: var(--color-font-default);
            font-weight: bold;
          }
        }
        .lookSomePop {
          background: #276EF1;
          border: 1px solid #276EF1;
          border-radius: 16px;
          padding: 5px 10px;
          color: #FFFFFF;
          font-size: 12px
        }
        >>> .customize {
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item {
          margin-top: 0px !important;
          margin-bottom: 8px !important;
          &:last-child  {
            margin-bottom: 0px !important;
          }
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }
    }
  }
}
</style>
