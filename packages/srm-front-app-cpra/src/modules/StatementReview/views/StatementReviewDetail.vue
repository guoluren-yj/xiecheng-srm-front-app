<template>
  <!-- 对账单详情 - 采购方 -->
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <srm-detail-head ref="headInfoHeight" :columns="getHeaderColumns()" :data-source="info">
        <srm-button class="approval-button" size="small" icon="icon-paperclip" fill bordered @click="showAttachRecords(1)">
          {{ $T("ssta.invoicePool.model.status.attach").$D("附件") }}
        </srm-button>
        <srm-button class="approval-button" size="small" icon="icon-clock" bordered @click="showHistoryRecords">
          {{ $T("ssta.invoicePool.model.status.operationRecord").$D("操作记录") }}
        </srm-button>
      </srm-detail-head>

      <statement-review-approval-form v-if="info.billHeaderId" :change-req-id="info.billHeaderId" @getData="getData"/>
      <!-- 获取底部的高度 -->
      <div v-if="getBtnArr.length > 0" class="approval-detail-bottom"/>
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"
                        type="action-sheet"/>

    <!-- 操作记录 -->
    <history-record
      v-model="showHistoryRecord"
      :loading="historyRecordLoading"
      :action-data="historyRecords"
      operation-meaning-field-name="processStatusMeaning"
      operator-field-name="processUser"
      process-remark-info-field-name="processRemark"/>
  </div>
</template>

<script>
import HistoryRecord from "@/components/HistoryRecord";
import StatementReviewApprovalForm from "../component/StatementReviewApprovalForm";
// , cancelApi, syncApi, submitApi, saveApi
import { getHistory, returnApi, confirmApi } from "../api";
export default {
  modules: [ "ssta.purchaseInvoicePool", "hipspfm.common", "ssta.purchaseSettlePool", "ssta.purchaseSettle", "smbl.common", "ssta.invoicePool", "hipspfm.invoiceBill", "sfin.invoiceBill" ],
  name: "StatementReviewDetail",
  components: { HistoryRecord, StatementReviewApprovalForm },
  data() {
    return {
      historyRecords: [],
      showHistoryRecord: false,
      historyRecordLoading: false,
      info: {
        billNum: "",
        creationDate: "",
        billHeaderId: "",
      },
      loading: false,
      approvalPop: false,
      approvedRemark: "",
      data: {},
    };
  },
  computed: {
    getBtnArr() {
      if (this.$route.query.type === "ALL") {
        return [];
      }
      // 可审核
      if ([ "SUBMITED", "CANCELING", "WAIT_SUPPLIER_CANCEL", "WAIT_SUPPLIER_CONFIRM" ].includes(this.info.billStatus)) {
        return [
          {
            title: this.$T("ssta.purchaseSettlePool.view.button.back").$D("退回"),
            type: "danger",
            bordered: true,
            handler: () => {
              this.approvalPop = this.$popup({
                showHeader: false,
                height: "240px",
                position: "top",
                content: <div style="height:240px;display: flex;flex-direction: column;justify-content: space-between;">
                  <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 16px 15px 8px 15px;">
                    <span style="font-size: 12px;color: #AFAFAF;">{this.$T("sfin.invoiceBill.model.invoiceBill.approvedRemark").$D("审核意见")}</span>
                  </div>
                  <srm-textarea-field
                    theme="fill"
                    style="padding: 0px 15px 16px 15px;height:152px;margin-bottom:0px"
                    height={120}
                    max-length={150}
                    v-model={this.approvedRemark}
                    show-resizer={false}
                    edit-button={false}
                    placeholder={ this.$T("hipspfm.invoiceBill.message.validation.approvedRemark").$D("请输入审核意见") }/>
                  <div style="border-top: 1px solid #f5f6fa;display: flex;flex-direction: row;justify-content: space-between;">
                    <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #AFAFAF;"
                      onClick={() => {
                        this.approvalPop.closePopup();
                      }}>{ this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消") }</div>
                    <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #FFFFFF;background: #E11900;"
                      onClick={() => {
                        this.$loading.show();
                        const { billStatus } = this.data;
                        returnApi([ {
                          ...this.data,
                          approvedRemark: billStatus !== "CANCELING" ? this.approvedRemark : null,
                          canceledRemark: billStatus === "CANCELING" ? this.approvedRemark : null,
                        } ]).then((res) => {
                          this.info.billHeaderId = "";
                          if (res && res.failed) {
                            this.$notification.open({
                              message: res.message,
                              duration: 3000,
                            });
                          } else {
                            this.$notification.open({
                              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                              duration: 1000,
                            });
                            this.approvalPop.closePopup();
                            setTimeout(() => this.$router.back(), 0);
                            setTimeout(() => {
                              if (res.length && res[0]) { // 增加判断
                                this.info.billHeaderId = res[0].billHeaderId;
                              }
                            }, 500);
                          }
                        }).finally(() => {
                          this.$loading.hide();
                        });
                      }}>{ this.$T("ssta.purchaseSettlePool.view.button.back").$D("退回") }</div>
                  </div>
                </div>,
              });
            }
          },
          {
            title: this.$T("ssta.purchaseSettlePool.view.button.submit").$D("确认"),
            type: "primary",
            fill: true,
            handler: () => {
              this.approvalPop = this.$popup({
                showHeader: false,
                height: "240px",
                position: "top",
                content: <div style="height:240px;display: flex;flex-direction: column;justify-content: space-between;">
                  <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 16px 15px 8px 15px;">
                    <span style="font-size: 12px;color: #AFAFAF;">{this.$T("sfin.invoiceBill.model.invoiceBill.approvedRemark").$D("审核意见")}</span>
                  </div>
                  <srm-textarea-field
                    theme="fill"
                    style="padding: 0px 15px 16px 15px;height:152px;margin-bottom:0px"
                    height={120}
                    max-length={150}
                    v-model={this.approvedRemark}
                    show-resizer={false}
                    edit-button={false}
                    placeholder={ this.$T("hipspfm.invoiceBill.message.validation.approvedRemark").$D("请输入审核意见") }/>
                  <div style="border-top: 1px solid #f5f6fa;display: flex;flex-direction: row;justify-content: space-between;">
                    <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #AFAFAF;"
                      onClick={() => {
                        this.approvalPop.closePopup();
                      }}>{ this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消") }</div>
                    <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #FFFFFF;background: #276EF1;"
                      onClick={() => {
                        this.$loading.show();
                        const { billStatus } = this.data;
                        confirmApi([ {
                          ...this.data,
                          approvedRemark: billStatus !== "CANCELING" ? this.approvedRemark : null,
                          canceledRemark: billStatus === "CANCELING" ? this.approvedRemark : null,
                        } ]).then((res) => {
                          // this.info.billHeaderId = "";
                          if (res && res.failed) {
                            this.$notification.open({
                              message: res.message,
                              duration: 3000,
                            });
                          } else {
                            this.info.billHeaderId = "";
                            this.$notification.open({
                              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                              duration: 1000,
                            });
                            this.approvalPop.closePopup();
                            setTimeout(() => this.$router.back(), 0);
                            setTimeout(() => {
                              if (res.length && res[0]) { // 增加判断
                                this.info.billHeaderId = res[0].billHeaderId;
                              }
                            }, 500);
                          }
                        }).finally(() => {
                          this.$loading.hide();
                        });
                      }}>{this.$T("ssta.purchaseSettlePool.view.button.submit").$D("确认")}</div>
                  </div>
                </div>,
              });
            }
          }
        ];
      }
      // // 可编辑
      // if ([ "NEW", "RETURN" ].includes(this.info.billStatus)) {
      //   return [
      //     {
      //       title: this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消"),
      //       type: "danger",
      //       bordered: true,
      //       handler: ()=>{
      //         this.approvalPop = this.$popup({
      //           showHeader: false,
      //           height: "240px",
      //           position: "top",
      //           content: <div style="height:240px;display: flex;flex-direction: column;justify-content: space-between;">
      //             <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 16px 15px 8px 15px;">
      //               <span style="font-size: 12px;color: #AFAFAF;">取消信息</span>
      //             </div>
      //             <srm-textarea-field
      //               theme="fill"
      //               style="padding: 0px 15px 16px 15px;height:152px;margin-bottom:0px"
      //               height={120}
      //               max-length={150}
      //               v-model={this.approvedRemark}
      //               show-resizer={false}
      //               edit-button={false}
      //               placeholder="请输入取消原因…"/>
      //             <div style="border-top: 1px solid #f5f6fa;display: flex;flex-direction: row;justify-content: space-between;">
      //               <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #AFAFAF;"
      //                 onClick={()=>{
      //                   this.approvalPop.closePopup();
      //                 }}>取消</div>
      //               <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #FFFFFF;background: var(--color-primary);"
      //                 onClick={()=>{
      //                   cancelApi([ {
      //                     ...this.data,
      //                     canceledReason: this.approvedRemark
      //                   } ]).then((res)=>{
      //                     this.info.billHeaderId = "";
      //                     if (res && res.failed) {
      //                       this.$notification.open({
      //                         message: res.message,
      //                         duration: 3000,
      //                       });
      //                     } else {
      //                       this.$notification.open({
      //                         message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //                         duration: 1000,
      //                       });
      //                       this.approvalPop.closePopup();
      //                       setTimeout(() => {
      //                         this.info.billHeaderId = res[0].billHeaderId;
      //                       }, 500);
      //                       this.$router.back();
      //                     }
      //                   }).finally(()=>{
      //                     this.$loading.hide();
      //                   });
      //                 }}>确定</div>
      //             </div>
      //           </div>,
      //         });
      //       }
      //     },
      //     {
      //       title: this.$T("ssta.purchaseSettlePool.view.button.subsubmit").$D("提交"),
      //       type: "primary",
      //       fill: true,
      //       handler: ()=>{
      //         submitApi([ {
      //           ...this.data,
      //         } ]).then((res)=>{
      //           this.info.billHeaderId = "";
      //           if (res && res.failed) {
      //             this.$notification.open({
      //               message: res.message,
      //               duration: 3000,
      //             });
      //           } else {
      //             this.$notification.open({
      //               message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //               duration: 1000,
      //             });
      //             setTimeout(() => {
      //               this.info.billHeaderId = res[0].billHeaderId;
      //             }, 500);
      //             this.$router.back();
      //           }
      //         }).finally(()=>{
      //           this.$loading.hide();
      //         });
      //       }
      //     },
      //     {
      //       title: this.$T("ssta.purchaseSettlePool.view.button.save").$D("保存"),
      //       handler: ()=>{
      //         saveApi({
      //           ...this.data,
      //         }).then((res)=>{
      //           this.info.billHeaderId = "";
      //           if (res && res.failed) {
      //             this.$notification.open({
      //               message: res.message,
      //               duration: 3000,
      //             });
      //           } else {
      //             this.$notification.open({
      //               message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //               duration: 1000,
      //             });
      //             setTimeout(() => {
      //               this.info.billHeaderId = res[0].billHeaderId;
      //             }, 500);
      //           }
      //         }).finally(()=>{
      //           this.$loading.hide();
      //         });
      //       }
      //     },
      //   ];
      // }
      // // 可取消 / 可同步
      // if ([ "CONFIRM" ].includes(this.info.billStatus)) {
      //   if ([ "UNSYNCHRONIZED" ].includes(this.info.syncStatus)) {
      //     return [
      //       {
      //         title: this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消"),
      //         type: "danger",
      //         bordered: true,
      //         handler: ()=>{
      //           this.approvalPop = this.$popup({
      //             showHeader: false,
      //             height: "240px",
      //             position: "top",
      //             content: <div style="height:240px;display: flex;flex-direction: column;justify-content: space-between;">
      //               <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 16px 15px 8px 15px;">
      //                 <span style="font-size: 12px;color: #AFAFAF;">取消信息</span>
      //               </div>
      //               <srm-textarea-field
      //                 theme="fill"
      //                 style="padding: 0px 15px 16px 15px;height:152px;margin-bottom:0px"
      //                 height={120}
      //                 max-length={150}
      //                 v-model={this.approvedRemark}
      //                 show-resizer={false}
      //                 edit-button={false}
      //                 placeholder="请输入取消原因…"/>
      //               <div style="border-top: 1px solid #f5f6fa;display: flex;flex-direction: row;justify-content: space-between;">
      //                 <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #AFAFAF;"
      //                   onClick={()=>{
      //                     this.approvalPop.closePopup();
      //                   }}>取消</div>
      //                 <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #FFFFFF;background: var(--color-primary);"
      //                   onClick={()=>{
      //                     cancelApi([ {
      //                       ...this.data,
      //                       canceledReason: this.approvedRemark
      //                     } ]).then((res)=>{
      //                       this.info.billHeaderId = "";
      //                       if (res && res.failed) {
      //                         this.$notification.open({
      //                           message: res.message,
      //                           duration: 3000,
      //                         });
      //                       } else {
      //                         this.$notification.open({
      //                           message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //                           duration: 1000,
      //                         });
      //                         this.approvalPop.closePopup();
      //                         setTimeout(() => {
      //                           this.info.billHeaderId = res[0].billHeaderId;
      //                         }, 500);
      //                         this.$router.back();
      //                       }
      //                     }).finally(()=>{
      //                       this.$loading.hide();
      //                     });
      //                   }}>确定</div>
      //               </div>
      //             </div>,
      //           });
      //         }
      //       },
      //     ];
      //   }
      //   if ([ "SYNC_FAILURE" ].includes(this.info.syncStatus)) {
      //     return [
      //       {
      //         title: this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消"),
      //         type: "danger",
      //         bordered: true,
      //         handler: ()=>{
      //           this.approvalPop = this.$popup({
      //             showHeader: false,
      //             height: "240px",
      //             position: "top",
      //             content: <div style="height:240px;display: flex;flex-direction: column;justify-content: space-between;">
      //               <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 16px 15px 8px 15px;">
      //                 <span style="font-size: 12px;color: #AFAFAF;">取消信息</span>
      //               </div>
      //               <srm-textarea-field
      //                 theme="fill"
      //                 style="padding: 0px 15px 16px 15px;height:152px;margin-bottom:0px"
      //                 height={120}
      //                 max-length={150}
      //                 v-model={this.approvedRemark}
      //                 show-resizer={false}
      //                 edit-button={false}
      //                 placeholder="请输入取消原因…"/>
      //               <div style="border-top: 1px solid #f5f6fa;display: flex;flex-direction: row;justify-content: space-between;">
      //                 <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #AFAFAF;"
      //                   onClick={()=>{
      //                     this.approvalPop.closePopup();
      //                   }}>取消</div>
      //                 <div style="display: flex;;align-items: center;justify-content: center;height: 48px;width:50%;font-size: 16px;color: #FFFFFF;background: var(--color-primary);"
      //                   onClick={()=>{
      //                     cancelApi([ {
      //                       ...this.data,
      //                       canceledReason: this.approvedRemark
      //                     } ]).then((res)=>{
      //                       this.info.billHeaderId = "";
      //                       if (res && res.failed) {
      //                         this.$notification.open({
      //                           message: res.message,
      //                           duration: 3000,
      //                         });
      //                       } else {
      //                         this.$notification.open({
      //                           message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //                           duration: 1000,
      //                         });
      //                         this.approvalPop.closePopup();
      //                         setTimeout(() => {
      //                           this.info.billHeaderId = res[0].billHeaderId;
      //                         }, 500);
      //                         this.$router.back();
      //                       }
      //                     }).finally(()=>{
      //                       this.$loading.hide();
      //                     });
      //                   }}>确定</div>
      //               </div>
      //             </div>,
      //           });
      //         }
      //       },
      //       {
      //         title: this.$T("ssta.purchaseSettlePool.view.button.sync").$D("同步"),
      //         type: "primary",
      //         fill: true,
      //         handler: ()=>{
      //           syncApi([ {
      //             ...this.data,
      //           } ]).then((res)=>{
      //             this.info.billHeaderId = "";
      //             if (res && res.failed) {
      //               this.$notification.open({
      //                 message: res.message,
      //                 duration: 3000,
      //               });
      //             } else {
      //               this.$notification.open({
      //                 message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //                 duration: 1000,
      //               });
      //               setTimeout(() => {
      //                 this.info.billHeaderId = res[0].billHeaderId;
      //               }, 500);
      //               this.$router.back();
      //             }
      //           }).finally(()=>{
      //             this.$loading.hide();
      //           });
      //         }
      //       },
      //     ];
      //   }
      // }
      // // 可同步
      // if ([ "CANCEL" ].includes(this.info.billStatus)) {
      //   return [
      //     {
      //       title: this.$T("ssta.purchaseSettlePool.view.button.sync").$D("同步"),
      //       type: "primary",
      //       fill: true,
      //       handler: ()=>{
      //         syncApi([ {
      //           ...this.data,
      //         } ]).then((res)=>{
      //           this.info.billHeaderId = "";
      //           if (res && res.failed) {
      //             this.$notification.open({
      //               message: res.message,
      //               duration: 3000,
      //             });
      //           } else {
      //             this.$notification.open({
      //               message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
      //               duration: 1000,
      //             });
      //             setTimeout(() => {
      //               this.info.billHeaderId = res[0].billHeaderId;
      //             }, 500);
      //             this.$router.back();
      //           }
      //         }).finally(()=>{
      //           this.$loading.hide();
      //         });
      //       }
      //     },
      //   ];
      // }
      return [];
    }
  },
  mounted() {
    this.info.billHeaderId = this.$route.query.id;
  },
  methods: {
    showHistoryRecords() {
      this.showHistoryRecord = true;
      this.historyRecordLoading = true;
      getHistory(this.info.billHeaderId).then((res) => {
        if (res && res.content) {
          this.historyRecords = res.content;
        }
      }).finally(() => {
        this.historyRecordLoading = false;
      });
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "billNum",
        render: (val) => val
      }, {
        fieldCode: "creationDate",
        render: (val) => <span>{ this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.creationDate").$D("创建日期") }：{ val }</span>
      } ];
    },
    // 附件
    showAttachRecords(flag) {
      if (flag === 1) {
        this.$showFileList({
          title: this.$T("ssta.invoicePool.model.status.attach").$D("附件"),
          attachmentUuid: this.info.attachmentUuid,
          canUpload: Boolean([ "NEW", "RETURN" ].includes(this.info.billStatus)),
          canDelete: Boolean([ "NEW", "RETURN" ].includes(this.info.billStatus)),
        });
      }
    },
    getData(data) {
      this.data = { ...data };
      this.info = { ...data };
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
</style>
