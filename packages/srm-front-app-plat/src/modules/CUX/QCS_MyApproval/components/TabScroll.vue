<template>
  <div>
    <section class="mainDetail">
      <div class="navWrap">
        <ul class="navContent">
          <li
            v-for="(item,index) in navArr"
            :key="index"
            :class="{'active': navIndex === index}"
            @click="changeNav(index)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div ref="wrapper" class="contentWrap wrapper">
        <div ref="content" class="content">
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T("sinv.supplierDelivery.view.message.title.deliveryHeaderInfo").$D("头信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
              <span>{{ $T("hipspfm.supplierDelivery.view.message.title.noDeliveryHeaderInfo").$D("暂无头信息") }}</span>
            </div>
            <ul v-else>
              <Customize :columns="getHeadColumns" :data-source="headInfo" />
            </ul>
          </div>
          <div ref="addressInfo" class="infoContent headInfo">
            <h3>{{ $T("sodr.common.view.message.receivingInformation").$D("收货/收单信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
              <span>{{ $T("hipspfm.supplierDelivery.view.message.title.noDeliveryHeaderInfo").$D("暂无头信息") }}</span>
            </div>
            <ul v-else>
              <Customize :columns="getAddressColumns" :data-source="headInfo" />
            </ul>
          </div>
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T("hipspfm.common.view.message.title.lineInfo").$D("行信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
            </div>
            <ul
              v-for="(item,index) in lineInfo"
              v-else
              :key="index"
              @click="showLineInfoDetail(item,index)">
              <li>
                <span>
                  <span class="block"/>
                  {{ item.itemName }}
                </span>
                <span>{{ $T("sinv.purchaseReception.view.message.lineNum").$D("行号") }}：{{ item.displayLineNum }}</span>
              </li>
              <Customize :columns="getLineColumns" :data-source="item" />
              <li>
                <span>{{ $T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期") }}：</span>
                <span>{{ item.promisedDate|CalcDate }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <div v-if="lineInfoDetail">
        <OrderLineDetail
          v-model="show"
          :show-file-pop="showFilePop"
          :line-info-detail="lineInfoDetail"/>
      </div>
    </section>
    <div class="supplier-confirm">
      <span @click="handleReject">{{ $T("hipspfm.common.message.reject").$D("拒绝") }}</span>
      <span @click="handleAdopt">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
    </div>
    <Opinion v-model="opinionPopup" :type="option" @comfirmOpinion="comfirmOpinion" />

    <!-- 附件弹窗 -->
    <AttachedFile
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :title="$T('hipspfm.common.message.title.viewAttachment').$D('附件查看')"/>
  </div>
</template>

<script>
import uuid from "uuid";
import BScroll from "better-scroll";
import Opinion from "./Opinion";
import { detailAdoptApi, rejectApi } from "../api";
import OrderLineDetail from "./OrderLineDetail";
import AttachedFile from "../../../../../src/components/File/AttachedFile";
import { Popup, Icon, NavBar, Textarea } from "hips";

export default {
  modules: [ "sinv.supplierDelivery","sodr.common","hipspfm.common","hwfp.task","hipspfm.supplierDelivery","sinv.purchaseReception","sinv.common","sodr.feedback","sprm.common","sagm.common","sslm.supplyAbility","sodr.orderType","mallf.common","sodr.confirmOrder","sodr.sendOrder","spcm.common" ],
  name: "TabScroll",
  components: {
    Opinion,
    AttachedFile,
    OrderLineDetail,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    lineInfo: Array,
  },
  data() {
    return {
      scroll: "",
      navIndex: 0,
      show: false,
      saveButtonFlag: true,
      showEditDate: false,
      showFeedBackInfo: false,
      contentLenArr: [],
      lineInfoDetail: {},
      promiseDate: "",
      filePopup: false,
      attachmentUuid: "",
      navArr: [
        this.$T(
          "sinv.supplierDelivery.view.message.title.deliveryHeaderInfo"
        ).$D("头信息"),
        this.$T("sodr.common.view.message.receivingInformation").$D("收货/收单信息"),
        this.$T("hipspfm.common.view.message.title.lineInfo").$D("行信息"),
      ],
      textareaHeight: "180",
      currentIndex: "",
      opinionPopup: false,
      option: "adopt",
      approvedRemark: ""
    };
  },
  computed: {
    getHeadColumns() {
      const columns = [
        {
          fieldName: "创建人",
          fieldCode: "createByName",
          langCode: "sodr.feedback.model.feedback.create",
        },
        {
          fieldName: "所属部门",
          fieldCode: "unitName",
          langCode: "sprm.common.modal.unitName",
        },
        {
          fieldName: "区域",
          fieldCode: "attributeVarchar1Meaning",
          langCode: "sagm.common.model.area",
        },
        {
          fieldName: "市场",
          fieldCode: "attributeBigint1Meaning",
          langCode: "sslm.supplyAbility.model.supplyAbility.market",
        },
        {
          fieldName: "采购品类",
          fieldCode: "categoryName",
          langCode: "sodr.orderType.model.orderType.categoryIds",
        },
        {
          fieldName: "CE No",
          fieldCode: "ceNum",
          langCode: "sodr.common.model.ceNumber",
        },
        {
          fieldName: "送货方式",
          fieldCode: "attributeVarchar3Meaning",
          langCode: "mallf.common.view.delivery",
        },
        {
          fieldName: "联系电话",
          fieldCode: "mobile",
          langCode: "mallf.common.view.contactPhone",
        },
        {
          fieldName: "费用说明",
          fieldCode: "remark",
          langCode: "mallf.common.view.amount.remark",
        },
      ];
      return columns;
    },
    // 收货/收单信息
    getAddressColumns() {
      const columns = [
        {
          fieldName: "收货联系人",
          fieldCode: "receiverContactName",
          langCode: "sodr.confirmOrder.model.common.receiverContactName",
        },
        {
          fieldName: "收货联系电话",
          fieldCode: "receiverTelNum",
          langCode: "sodr.confirmOrder.model.common.receiverTelNum",
        },
        {
          fieldName: "收货方地址",
          fieldCode: "receiverAddressName",
          langCode: "sodr.sendOrder.model.common.shipToLocationAddress",
        },
      ];
      return columns;
    },
    getLineColumns() {
      const columns = [
        {
          fieldName: "商品品类",
          fieldCode: "categoryName",
          langCode: "sinv.common.model.common.itemCategoryName",
        },
        {
          fieldName: "单位",
          fieldCode: "uomName",
          langCode: "sodr.common.model.unit",
        },
        {
          fieldName: "数量",
          fieldCode: "quantity",
          langCode: "sodr.common.model.common.purLineCount",
        },
        {
          fieldName: "税率",
          fieldCode: "taxRate",
          langCode: "sodr.common.model.common.taxRates",
        },
        {
          fieldName: "含税单价(含运费)",
          fieldCode: "taxIncludedUnitPrice",
          langCode: "sodr.common.model.common.includingTaxAndFreightPrice",
        },
        {
          fieldName: "本地含税行金额",
          fieldCode: "lineFreight",
          langCode: "spcm.common.model.common.purchaseTaxLineAmount",
        },
        // {
        //   fieldName: "行运费",
        //   fieldCode: "",
        //   langCode: "sprm.common.model.common.lineFreight",
        // },
        {
          fieldName: "需求日期",
          fieldCode: "requestDate",
          langCode: "sodr.sendOrder.model.common.needByDate",
        },
        {
          fieldName: "供应商",
          fieldCode: "supplierName",
          langCode: "sodr.common.model.common.erpSupplierCode",
        },
        {
          fieldName: "CMS合同号",
          fieldCode: "cmsNumber",
          langCode: "mallf.common.model.CMS.num",
        },
        {
          fieldName: "费用承担部门",
          fieldCode: "costDepartmentName",
          langCode: "mallf.common.view.cost.shopping.bumen",
        },
        {
          fieldName: "写字楼/店铺/仓库",
          fieldCode: "invOrganizationName",
          langCode: "mallf.common.view.costShopWarehouse",
        },
        {
          fieldName: "附件",
          fieldCode: "",
          langCode: "sodr.sendOrder.view.button.attachment",
          render: () => {
            return <span style="color: #276EF1">{this.$T("sinv.common.button.viewAttachment").$D("查看附件")}</span>;
          },
          callBack: (data) => {
            this.showFilePop(data.attachmentUuid);
          }
        },
      ];
      return columns;
    },
  },
  mounted() {
    console.log(this.$router.query, 999999933333333333);
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
      });
      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
        this.$refs.addressInfo.offsetHeight,
        this.$refs.lineInfo.offsetHeight,
      ];
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 250;
      this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
      this.scroll.refresh();
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.show = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    // 打开附件
    showFilePop(attUuid) {
      this.filePopup = !this.filePopup;
      this.attachmentUuid = attUuid || uuid();
    },
    // 打开审批意见弹窗
    showOpinionPopup() {
      this.opinionPopup = !this.opinionPopup;
    },
    //填写审批意见后拒绝or通过
    comfirmOpinion(inputValue, type) {
      this.approvedRemark = inputValue;
      if (type === "adopt") {
        this.confirmAdopt();
        this.showOpinionPopup();
      } else if (type === "reject" && !inputValue) {
        this.opinionPopup = true;
        this.$notification.open({
          message: this.$T("hwfp.task.view.message.commentNotBeNull").$D("审批意见不能为空"),
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.confirmReject();
        this.showOpinionPopup();
      }
    },
    // 拒绝该订单
    handleReject() {
      this.option = "reject";
      this.showOpinionPopup();
    },
    confirmReject() {
      const self = this;
      this.$hips.dialog.confirm({
        content: "是否拒绝该送货单?",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = self.buildParams();
          rejectApi(params).then((res) => {
            if (res.length) {
              self.$notification.open({
                message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.push({ name: "DeliveryBillList" });
              }, 1500);
            } else {
              self.$notification.open({
                message: res.message,
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
              });
            }
          });
        },
        onCancel(tx) {
          // on cancel
        }
      });
    },
    // 通过该订单
    handleAdopt() {
      this.option = "adopt";
      this.showOpinionPopup();
    },
    confirmAdopt() {
      const self = this;
      this.$hips.dialog.confirm({
        content: "是否通过该送货单",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = self.buildParams();
          const id = "";
          detailAdoptApi(id ,params).then((res) => {
            if (res.length) {
              self.$notification.open({
                message: this.$T(
                  "hipspfm.common.view.validation.approvelSuccess"
                ).$D("审批通过成功"),
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.push({ name: "DeliveryBillList" });
              }, 1500);
            } else {
              // self.$hips.toast({ message: res.message });
              self.$notification.open({
                message: res.message,
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
              });
            }
          });
        },
        onCancel(tx) {
          // on cancel
        }
      });
    },
    buildParams() {
      const { _token, asnHeaderId, objectVersionNumber } = this.headInfo;
      const params = [
        {
          asnHeaderId,
          objectVersionNumber,
          _token
        }
      ];
      if (this.approvedRemark) {
        params[0].approvedRemark = this.approvedRemark;
      }
      return params;

      const query = {
        action: "complete",
        assignee: null,
        attachmentUuid: "779744cdd04359564870893586123219cc6a",
        carbonCopyUsers: "",
        comment: "112233",
        currentTaskId: "__-Rm7hAJKGEVWd9Fh_WEbMXg-__",
        jumpTarget: null,
        jumpTargetName: null,
        processDefinitionId: "SCUX.WATSONS.PR_HO_REGION:3:8002233",
        processInstanceId: "__-_kKzgO-re4t4t_dVEN9VxA-__",
        variables: [ {
          name: "approveResult",
          value: "Approved",
        },{
          name: "comment",
          value: "112233",
        } ]
      };
    },
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 600, "bounce");
      });
      this.navIndex = index;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.navIndex = 2;
      } else {
        this.navIndex = 3;
      }
    }
  }
};
</script>

<style lang="stylus"scoped>
.mainDetail {
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color:var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }

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
        color:var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color:var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 15px 20px;
          margin-bottom: 4px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 28px;
          font-weight: 600;
          background: var(--color-bg-default-b);
        }

        ul {
          padding: 0 15px 12px 15px;

          li {
            padding: 16px 20px 15px 0px;
            border-bottom:1px solid var(--color-border-default);

            span {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;

              img {
                width: 20px;
                height: 20px;
              }

              &:nth-child(2) {
                color:var(--color-font-default-b);
                display: inline-block;
                text-align: right;
                word-wrap: break-word;
                word-break: break-all;
              }
            }
          }
        }
      }

      .headInfo {
        ul {
          // border-bottom: 8px solid var(--color-border-default);
          li {
            span {
              &:nth-child(1) {
                display: inline-block;
                width: 84px;
              }
            }
          }
        }
      }

      .lineInfo {
        ul {
          border-bottom: 8px solid var(--color-border-default);

          li {
            padding: 12px 0px;

            &:nth-child(1) {
              display: flex;
              justify-content: space-between;
              padding: 15px 20px 11px 0px;

              span {
                line-height: 22px;

                &:nth-child(1) {
                  font-weight: bold;
                  font-size: 16px;
                  color:var(--color-font-default);
                }

                &:nth-child(2) {
                  font-size: 14px;
                  color: var(--color-font-default-e);
                }
              }

              .block {
                display: inline-block;
                height: 14px;
                width: 6px;
                border-radius: 1px;
                background: var(--color-other-default-b);
                margin: 4px 10px 0 0;
              }
            }

            &:nth-child(2) {
              border-bottom: 0;
              padding-top: 13px;
            }

            &:nth-child(2), &:nth-child(3) {
              display: flex;

              span {
                color:var(--color-font-default);

                &:nth-child(1) {
                  display: inline-block;
                  width: 187px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                &:nth-child(2) {
                  margin-left: 16px;
                }
              }
            }

            &:nth-child(4) {
              padding-top: 11px;

              span {
                color:var(--color-font-default);
                font-size: 14px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  div {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color:var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color:var(--color-font-default);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1) {
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color:var(--color-font-default);
      line-height: 22px;

      &:nth-child(2) {
        color:var(--color-font-default-b);
        display: inline-block;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-weight: 600;
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.1);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(odd) {
    color: var(--color-other-default);
  }
}
</style>
