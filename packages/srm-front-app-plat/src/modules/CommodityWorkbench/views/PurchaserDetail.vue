<template>
  <!-- 商品工作台 - 采购方 -->
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <!-- 头部信息 -->
      <srm-detail-head
        ref="headInfoHeight"
        :columns="getHeaderColumns()"
        :data-source="data"/>

      <!-- 组件 -->
      <commodity-approval v-if="info.spuId" :parameters="info" @setData="setData"/>

      <!-- 获取底部的高度 -->
      <div v-if="getButtons.length > 0" class="approval-detail-bottom"/>
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getButtons.length > 0"
                        :btn-arr="getButtons"
                        type="action-sheet"/>
  </div>
</template>

<script>
import CommodityApproval from "../components/CommodityApproval";
import { rejectApi, approveApi, approveShelfApi } from "../api";
import { $T } from "srm-mobile-ui";
export default {
  modules: [ "smpc.product", "smbl.common", "hipspfm.common" ],
  name: "PurchaserDetail",
  components: { CommodityApproval },
  data() {
    return {
      info: {
        type: "Purchaser",
      },
      data: {
        info: {}
      },
      // tab栏
      tabType: "",
      params: [],
      remark: "",
      approvalPop: false,
    };
  },
  computed: {
    getButtons() {
      if (this.tabType === "APPROVE") {
        return [
          {
            text: $T("smpc.product.model.approve.reject").$D("审批拒绝"),
            type: "danger",
            bordered: true,
            visible: true,
            handler: () => {
              this.openRemarkPop();
            }
          },
          {
            type: "primary",
            fill: true,
            visible: true,
            rightSlot: <srm-tooltip type="tooltip" visible-arrow={false} placement="top">
              <srm-flex slot="content" direction="column" class="srm-tooltip-button-box">
                <srm-dropdown-item
                  text={$T("smpc.product.model.approve.pass").$D("审批通过")}
                  onClick={() => this.takeApi("approve")}/>
                {(this.params || []).every((d) => d.approveType === "UPDATE") && <srm-dropdown-item
                  text={$T("smpc.product.model.approve.passShelf").$D("审批通过并上架")}
                  onClick={() => this.takeApi("approveShelf")}/>}
              </srm-flex>
              <div onClick={(e) => e.stopPropagation()} style="color: #ffffff">
                <span>{$T("smpc.product.model.approve.pass").$D("审批通过")}</span>
                <em slot="right" class="srm-icon icon-chevron-down"/>
              </div>
            </srm-tooltip>,
          },
        ];
      }
      return [];
    },
    btnArr() {
      return [
        {
          type: "info",
          title: $T("smpc.product.model.approve.cancel").$D("取消"),
          handler: () => {
            this.approvalPop.closePopup();
          }
        },
        {
          type: "danger",
          fill: true,
          title: $T("smpc.product.model.approve.reject").$D("审批拒绝"),
          handler: () => {
            if (!this.remark) {
              this.$notification.open({ message: $T("smpc.product.view.pleaseWriteRejectReason").$D("请输入拒绝原因") });
              return;
            }
            this.approvalPop.closePopup();
            this.takeApi("reject");
          }
        }
      ];
    },
    getColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "imagePath",
          fieldType: "EMPTY",
          render: (val) => <img onClick={() => {
            this.previewImage();
          }} src={val} width="70" height="70"/>,
        },
        {
          formRow: 1,
          fieldType: "EMPTY",
          fieldCode: "customizeOne",
          render: (val, item) => <Customize
            class="override-Customize"
            columns={this.getDetailColumns}
            data-source={item}
            type="list"
            need-padding={false}
            code=""/>
        }
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "skuName",
          fieldType: "EMPTY",
          render: (val) => <span style="color: #ffffff;font-size: 16px;font-weight: 500;">{val}</span>,
        },
        {
          formRow: 2,
          fieldCode: "skuTitle",
          fieldType: "EMPTY",
          render: (val) => <span style="color: #ffffff;font-size: 14px;">{val}</span>,
        }
      ];
    }
  },
  mounted() {
    this.info["tabType"] = this.tabType;
    this.info["spuId"] = this.$route.query.spuId;
    this.info["skuId"] = this.$route.query.skuId;
    this.info["skuTemporaryId"] = this.$route.query.skuTemporaryId;
    this.tabType = this.$route.query.type;
    this.params = [ this.$route.params.data ];
  },
  methods: {
    // 预览图片
    previewImage() {
      let mp4 = [];
      let img = [];
      this.info.skuImageList.map((res) => {
        if (res.mediaType === 1) {
          mp4.push(res.mediaPath);
        } else {
          img.push(res.mediaPath);
        }
      });
      this.$previewImage([ ...mp4, ...img ]);
    },
    getHeaderColumns() {
      return [
        {
          fieldCode: "info",
          render: (val) => <Customize
            columns={this.getColumns}
            data-source={val}
            type="list"
            need-padding={false}
            code=""/>
        }
      ];
    },
    setData(res) {
      this.data = null;
      // 商品图片
      this.info["imagePath"] = res.mediaPath || require("@/assets/NoLogo@3x.png");
      // 商品标题
      this.info["skuName"] = res.skuName;
      // 商品副标题
      this.info["skuTitle"] = res.skuTitle;
      // 商品图片视频集合
      this.info["skuImageList"] = res.skuImageList || [];
      this.data = {
        info: this.info
      };
    },
    // 弹出拒绝原因输入框
    openRemarkPop() {
      this.approvalPop = this.$popup({
        showHeader: false,
        height: "282px",
        position: "bottom",
        rounded: true,
        content: <srm-flex direction="column" style="height:210px;">
          <srm-flex style="padding: 20px 0px 8px 15px;">
            <p style="font-size: 14px;color: #1B1E2B;font-weight: 500;">
              {$T("smpc.product.view.rejectReason").$D("拒绝原因")}
              <span style="color: red">*</span>
            </p>
          </srm-flex>
          <srm-textarea-field
            theme="fill"
            style="padding: 0px 15px 16px 11px;height: 162px;"
            class="override-textarea"
            height={132}
            max-length={100}
            v-model={this.remark}
            edit-button={false}
            show-resizer={false}
            placeholder={ $T("smpc.product.view.pleaseWriteRejectReason").$D("请输入拒绝原因") }/>
          <SrmBottomHandler btn-arr={this.btnArr} />
        </srm-flex>,
      });
    },
    // 调用接口
    takeApi(name) {
      this.$loading.show();
      switch (name) {
      case "approve":
        approveApi({
          approvalFlag: 1,
          skuApproveDTOS: this.params,
        }).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({ message: res.message });
          } else {
            this.remark = "";
            this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
            this.$router.back();
          }
        }).catch(() => {
          this.$loading.hide();
        });
        break;
      case "approveShelf":
        approveShelfApi({
          approvalFlag: 1,
          skuApproveDTOS: this.params,
        }).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({ message: res.message });
          } else {
            this.remark = "";
            this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
            this.$router.back();
          }
        }).catch(() => {
          this.$loading.hide();
        });
        break;
      case "reject":
        rejectApi({
          approvalFlag: 0,
          remark: this.remark,
          skuApproveDTOS: this.params,
          __dirty: true
        }).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({ message: res.message });
          } else {
            this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
            this.$router.back();
          }
        }).catch(() => {
          this.$loading.hide();
        });
        break;
      default:
        break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
  background: #f0f2f5;
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: #f0f2f5;
}

.approval-from-loading {
  width 100%;
  padding 100px 50px;
  text-align center;
}

.approval-button {
  margin-right 10px;
}

.override-Customize {
  width: 70vw;
}

.override-textarea {
  margin-bottom: 0px;
  >>> .srm-field-wrapper-fill{
    background: #ffffff;
  }
  >>> .srm-textarea-counter{
    right: 15px;
  }
}
</style>
