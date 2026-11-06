<template>
  <!-- 商品工作台（采） -->
  <div style="height: 100vh">
    <srm-list :data-set="dataSetList[tabType]"
              :columns="getListColumns"
              :buttons="getButtons"
              @itemClick="onListItemClick">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     `${$T('smpc.product.view.unApprove').$D('待审批')}`,
                     `${$T('smpc.product.model.approve.reject').$D('审批拒绝')}`,
                   ]"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
    <srm-popup :visible.sync="tempTipPop" :title="$T('smpc.product.model.applyCause').$D('申请原因')" rounded height="204px">
      <div class="purchaser-tip-pop" >{{ tempTip }}</div>
    </srm-popup>
  </div>
</template>

<script>
import indexDs from "../dataSource/indexDs";
import { DataSet, $T } from "srm-mobile-ui";
import { rejectApi } from "../api";
export default {
  modules: [ "smpc.product", "smbl.common", "hzero.common" ],
  name: "PurchaserList",
  data() {
    return {
      tabType: "APPROVE",
      dataSetList: {
        "APPROVE": new DataSet(indexDs("APPROVE")), // 待审批
        "APPROVED": new DataSet(indexDs("APPROVED")), // 已审批
      },
      noImg: require("@/assets/NoLogo@3x.png"),
      remark: "",
      approvalPop: false,
      tempTip: "",
      tempTipPop: false,
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const { skuCode, approveType, approveStatus, approveStatusMeaning } = item;
            const statusType = {
              WAITING: "warn",
              REJECT: "danger",
              REVERTED: "success",
            };
            const update = `-${$T("smbl.common.view.smpc.approveTypeA").$D("更新")}`;
            const invalid = (rejectFlag = false) => <span class="purchaser-invalid">
              <span>-{$T("smbl.common.view.smpc.approveTypeB").$D("失效")}</span>
              {!rejectFlag && <span class="srm-icon icon-alert-circle" onClick={(e) => {
                e.stopPropagation();
                this.previewInvalid(item);
              }}></span>}
            </span>;
            return <SrmListHeader>
              {skuCode}
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[approveStatus] || ""}>
                {approveStatusMeaning}{approveType && (approveType === "UPDATE" && update || approveType === "INVALID" && invalid(approveStatus === "REJECT"))}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        {
          formRow: 2,
          fieldCode: "imagePath",
          fieldType: "EMPTY",
          render: (val) => <img onClick={(e) => {
            e.stopPropagation();
            // this.previewImage();
          }} src={val || this.noImg} width="100" height="100"/>,
        },
        {
          formRow: 2,
          fieldCode: "customize",
          fieldType: "EMPTY",
          render: (val, item) => <Customize
            class="override-Customize"
            columns={this.getDetailColumns}
            data-source={item}
            type="list"
            need-padding={false}
            code="SMBL.PRODUCT_WK.LIST"/>,
        },
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "skuName",
          fieldType: "EMPTY",
          render: (val) => <p style="line-height: 20px;-webkit-line-clamp: 2;-webkit-box-orient: vertical;text-overflow: ellipsis;display: -webkit-box;overflow: hidden;">{val}</p>,
        },
        {
          formRow: 2,
          fieldCode: "itemName",
          fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
        },
        {
          formRow: 3,
          fieldCode: "catalogCode",
          fieldName: $T("smpc.product.model.mallCatalog").$D("商城目录"),
        },
        {
          formRow: 4,
          fieldCode: "supplierCompanyName",
          fieldName: $T("smpc.product.model.supplier").$D("供应商"),
        },
      ];
    },
    getButtons() {
      if (this.tabType === "APPROVE") {
        return [
          {
            text: $T("smpc.product.model.approve.reject").$D("审批拒绝"),
            type: "danger",
            bordered: true,
            visible: true,
            callback: () => {
              if (this.dataSetList[this.tabType].selected.length === 0) {
                this.$notification.open({ message: $T("smbl.common.message.selectOne").$D("请至少选择一条记录") });
                return;
              }
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
                  onClick={() => this.dataSetList[this.tabType].submitSelected()}/>
                {this.dataSetList[this.tabType].selected.every((d) => d.data.approveType === "UPDATE") && <srm-dropdown-item // 失效不展示
                  text={$T("smpc.product.model.approve.passShelf").$D("审批通过并上架")}
                  onClick={() => this.dataSetList[this.tabType].updateSelected()}/>}
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
            rejectApi({
              approvalFlag: 0,
              remark: this.remark,
              skuApproveDTOS: this.dataSetList[this.tabType].selected.map((item) => item.data),
              __dirty: true
            }).then((res) => {
              if (res && res.failed) {
                this.$notification.open({ message: res.message });
              } else {
                this.approvalPop.closePopup();
                this.remark = "";
                this.dataSetList[this.tabType].refresh();
                this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
              }
            }).catch(() => {
              this.approvalPop.closePopup();
              this.remark = "";
              this.dataSetList[this.tabType].refresh();
            });
          }
        }
      ];
    }
  },
  mounted() {
    // 待审批
    if (this.$route.query.type === "APPROVE") {
      this.tabType = "APPROVE";
    } else if (this.$route.query.type === "APPROVED") {
    // 已审批
      this.tabType = "APPROVED";
    } else if (this.$route.query.type) {
      this.$router.push({
        name: "PromptView",
        query: { typeCode:"404" }
      });
    }
  },
  activated() {
    if (this.tabType === "APPROVE") {
      this.dataSetList[this.tabType].refresh();
      this.dataSetList = { ...this.dataSetList };
    }
  },
  methods: {
    onListItemClick(record) {
      this.$router.push({
        name: "CommodityWorkbenchPurchaserDetail",
        query: {
          spuId: record.data.spuId,
          skuId: record.data.skuId,
          skuTemporaryId: record.data.skuTemporaryId,
          type: this.tabType,
        },
        params: {
          data: { ...record.data },
        }
      });
    },
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
    onTabIndexChange(index) {
      if (index === 0) {
        this.tabType = "APPROVE";
      }
      if (index === 1) {
        this.tabType = "APPROVED";
      }
      this.dataSetList[this.tabType].refresh();
      this.dataSetList = { ...this.dataSetList };
    },
    previewInvalid(value = {}) {
      this.tempTip = value.approveReason;
      this.tempTipPop = !this.tempTipPop;
    }
  }
};
</script>

<style lang="stylus" scoped>
.override-Customize {
  width: 232px;
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
.purchaser-invalid{
  display: inline-flex;
  .icon-alert-circle{
    margin-left: 4px;
    font-size: 16px;
    font-weight: normal;
  }
}
.purchaser-tip-pop{
  padding: 16px 15px
  font-size: 14px;
  color: #333333;
  line-height: 23px;
}
</style>