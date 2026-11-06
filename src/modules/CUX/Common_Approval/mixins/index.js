import SrmAppCore from "srm-front-app-core";
import { http, SrmUtil } from "srm-mobile-ui";

let copyUrl = "";

function toInvolved(vm) {
  vm.$router.replace({ path: "/ApprovalDetail", query: {
    type:"involved",
      processInstanceId: vm.processInstanceId,
  } });
  setTimeout(() => {
    vm.mountApi();
  }, 0);
}
function initJumpInvolved(vm) {
  vm.$router.replace({ path: "/ApprovalDetail", query: {
    type:"involved",
      processInstanceId: vm.processInstanceId,
  } });
  vm.type = "involved";
  // eslint-disable-next-line no-undefined
  vm.taskId = undefined;
  return vm.getProcessInstanceInfo();
}

async function toDetail(vm, flag) {
  if (vm.taskId && vm.listDataSet) {
    // 筛选出配置了移动端审批的数据
    let listRecords = vm.listDataSet.records.filter((item) =>
      item.get("mobileFormUrl"),
    );
    if (listRecords.length) {
      // 只有这一条，不进行任何操作
      if (listRecords.length === 1) {
        vm.$notification.open({
          message: vm
            .$T("hwfp.common.message.view.title.weilong.mobielUrl.noSwitch")
            .$D("当前仅有该条数据配置了移动端审批，无需切换"),
          class: "notification",
        });
        return;
      }
      let curIndex = listRecords.findIndex(
        (record) => record.get("processInstanceId") === vm.processInstanceId,
      );
      if (
        flag === "next" &&
        curIndex === listRecords.length - 1 &&
        vm.listDataSet.hasMore
      ) {
        // 当前页最后一条点下一条，查询更多数据
        try {
          await vm.listDataSet.loadMore();
        } catch (e) {
          console.log("===cache===");
          return; // 正在请求中等异常，直接返回，下次点击重试
        }
        listRecords = vm.listDataSet.records.filter((item) =>
          item.get("mobileFormUrl"),
        );
        curIndex = listRecords.findIndex(
          (record) => record.get("processInstanceId") === vm.processInstanceId,
        );
        if (curIndex === -1) return; // 兜底
      }
      let queryIndex;
      if (flag === "pre") {
        queryIndex = curIndex === 0 ? listRecords.length - 1 : curIndex - 1;
      } else {
        queryIndex = curIndex === listRecords.length - 1 ? 0 : curIndex + 1;
      }
      const newLine = listRecords[queryIndex];
      const taskId = newLine.get("id");
      const processInstanceId = newLine.get("processInstanceId");
      let href = window.location.href;
      href = href.replace(/taskId=[_\-a-zA-Z0-9]*/, `taskId=${taskId}`);
      href = href.replace(
        /processInstanceId=[_\-a-zA-Z0-9]*/,
        `processInstanceId=${processInstanceId}`,
      );
      window.history.replaceState({}, "", href);
      vm.taskId = taskId;
      vm.processInstanceId = processInstanceId;
      vm.currentCom = null;
      vm.componentName = null;
      vm.init();
    } else {
      vm.$notification.open({
        message: vm
          .$T("hwfp.common.message.view.title.finishProcess")
          .$D("当前列表待办已完成"),
        class: "notification",
      });
      // vm.goBack();
    }
  }
}

const getFsConfig = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/I8luzZLUMODQsJEDNw5r3N2v77vMV8cNVWGIbOVV4sI`;
  return http.post(url, params);
};

const getFsUrl = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/qdkHXPDSZgl6LozhxDJyBVpp6hN8qOBz5urxaXuU8ZU`;
  return http.post(url, params);
};

const getcurrentUrl = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/w5qc9ZH7kbudEh6Cg50gW5SrD1ke3ur5RSm6x4ibV2I4`;
  return http.post(url, params);
};

function initH5JDk(vm){
  let meta = document.createElement('meta');
  meta.name = 'hideMenuItems';
  meta.content = 'sendToChat';
  meta.setAttribute('lk-config', '');
  document.head.appendChild(meta);
  let script = document.createElement('script');
  script.src = 'https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.38.js';
  script.async = true; // 如果需要异步加载，可以设置这个属性
  document.head.appendChild(script);
  script.onerror = () => {
    console.log("飞书H5JDK加载失败");
  };
  script.onload = () => {
    console.log("飞书H5JDK加载成功window", window);
    console.log("飞书H5JDK加载成功vm", vm);
    // if(window.localStorage.enterSource === 'uniApp'){
    //   if(window.tt.login){
    //     window.tt.login({
    //       success(res) {
    //         console.log('window.tt.login', JSON.stringify(res));
    //       },
    //       fail(res) {
    //         console.log(`login fail: ${JSON.stringify(res)}`);
    //       }
    //     });
    //   }
    // }
  }
}
function weiLongBtn(vm) {
  const fsBtn = {
    title: "转发到飞书",
    handler: async () => {
      if(window.localStorage.enterSource === 'uniApp'){
        console.log('uniAPP壳子下测试发送卡片', window.top.srmFsSendChatMessage);
        if(window.top.srmFsSendChatMessage){
          const currentRoute = vm.$router.currentRoute;
          const {processInstanceId,taskId} = currentRoute.query;
          const fsUrl = await getFsUrl({processInstanceId, taskId});
          const message = {
            "shouldChooseChat": true,
            "cardContent": {
                "msg_type": "interactive",
                "update_multi": false,
                "card": {
                    "elements": [
                  {
                            "tag": "div",
                            "text": {
                              "tag": "plain_text",
                              "content": fsUrl?.description,
                            }
                  },
                  {
                          "actions": [
                      {
                              "tag": "button",
                              "text": {
                                "content": "查看审批表单",
                                "tag": "plain_text"
                        },
                              "type": "primary",
                              "url": fsUrl?.url,
                      },
                    ],
                          "tag": "action"
                        }
                    ]
                }
            }
          };
          window.top.srmFsSendChatMessage(message);
        }
      }else{
        const currentRoute = vm.$router.currentRoute;
        const {processInstanceId,taskId} = currentRoute.query;
        const fsUrl = await getFsUrl({processInstanceId, taskId});
        console.log('getFsUrl Response:', fsUrl);
        const sendCard = () =>{
          console.log("sendCard-----------------------");
          window.tt.sendMessageCard({
            "shouldChooseChat": true,
            // "chooseChatParams": {},
            // "openChatIDs": [
            //     "oc_a8a2a40a61589ec720f709bd45a2a9eb"
            // ],
            "cardContent": {
                "msg_type": "interactive",
                "update_multi": false,
                "card": {
                    "elements": [
                  {
                            "tag": "div",
                            "text": {
                              "tag": "plain_text",
                              "content": fsUrl?.description,
                            }
                  },
                  {
                          "actions": [
                      {
                              "tag": "button",
                              "text": {
                                "content": "查看审批表单",
                                "tag": "plain_text"
                        },
                              "type": "primary",
                              "url": fsUrl?.url,
                      },
                    ],
                          "tag": "action"
                        }
                    ]
                }
            },
            success(res) {
              console.log(`卡片成功: ${JSON.stringify(res)}`);
            },
            fail(res) {
              console.log(`卡片失败sendMessageCard fail: ${JSON.stringify(res)}`);
            }
          });
        }
        const fsConfig = async () =>{
          let url = window.location.href.split("#")[0];
          console.log('url------:', url);
          const pageUrl = encodeURIComponent(url);
          // const pageUrl = encodeURIComponent(window.location.href.split("#")[0]);
          const pagehaseUrl = encodeURIComponent(window.location.href);
          console.log('pageUrl', pageUrl, currentRoute);
          getFsConfig({url: pageUrl, pagehaseUrl}).then(res =>{
            if(res && !res.failed){
              console.log('getFsConfig: ', res);
              const {timestamp, appId, noncestr, signature } = res;
              const jsApiList = ['sendMessageCard', 'getUserInfo', 'chooseContact'];
              const h5Config = {
                appId: appId,
                timestamp: +timestamp,
                nonceStr: noncestr,
                signature: signature,
                jsApiList: jsApiList,
              };
                console.log('h5Config----------:', h5Config);
              if(window.h5sdk){
                window.h5sdk.config({
                  ...h5Config,
                  //成功回调
                  onSuccess: (res) => {
                    console.log(`成功config success: ${JSON.stringify(res)}`);
                  },
                  //失败回调
                  onFail: (err) => {
                    console.log(`错误config failed: ${JSON.stringify(err)}`);
                  },
                });
                window.h5sdk.ready(() => {
                  console.log('window.h5sdk.ready');
                  sendCard();
                });
              }
            }
          })
        }
        await fsConfig()
      }
    }
  }
  const approveButtons = [];
  vm.operateTypeArr.map((item) => {
    if (item === "ACTION_APPROVE") {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.button.approvalPass").$D("审批通过"),
        type: "primary",
        fill: true,
        help: vm.actionTips.approved,
        handler: () => {
          vm.$refs.approvalPopup.showApprove().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    if (item === "ACTION_REJECT") {
      approveButtons.unshift({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.button.approvalReject").$D("审批拒绝"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.rejected,
        handler: () => {
          vm.$refs.approvalPopup.showReject().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    const owner = (vm.taskInfo || {}).owner || "";
    const isAddSign = owner.startsWith("AddSign") || owner.startsWith("ApproveAndAddSign");
    const addSign = vm.$T("smbl.common.action.addSign").$D("加签");
    if (item === "ACTION_ADD_SIGN" && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || addSign,
        help: vm.actionTips.addSign,
        handler: () => {
          vm.$refs.approvalPopup.showAddSign().then((params) => {
            vm.approveTask(params);
          });
        }
      });
      // if (!vm.hasApproveAndAddSignFlag) {
      //   approveButtons.push({
      //     title: vm.$T("smbl.workFlow.view.form.approveAndAddSign", [ vm.approvalActionTitle [item] || addSign ]).$D("同意并加签"),
      //     help: vm.actionTips.approveAndAddSign,
      //     handler: () => {
      //       vm.$refs.approvalPopup.showApproveAndAddSign(false).then((params) => {
      //         vm.approveTask(params);
      //       });
      //     }
      //   });
      // }
    }

    if (item === "ACTION_APPROVE_AND_ADD_SIGN" && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.form.approveAndAddSign", [ addSign ]).$D("同意并加签"),
        help: vm.actionTips.approveAndAddSign,
        handler: () => {
          vm.$refs.approvalPopup.showApproveAndAddSign(true).then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }

    if (item === "ACTION_DELEGATE") {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.common.action.delegate").$D("转交"),
        help: vm.actionTips.delegate,
        handler: () => {
          vm.$refs.approvalPopup.showDelegate().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    if (item === "ACTION_JUMP" && vm.jumpList.length && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.common.action.jumped").$D("驳回"),
        help: vm.actionTips.rebut,
        handler: () => {
          vm.$refs.approvalPopup.showJump().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
  });
  if (vm.type) {
    const startedButtons = [];
    const { remind, recall } = vm.processInstance;
    vm.type === "startedBy" && remind && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.revoke").$D("撤销"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.revoke,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRevoke").$D("确认撤销吗"),
          onOk: vm.revoke
          });
      }
      });
    vm.processInstance && vm.processInstance.remind && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.remind").$D("催办"),
        type: "primary",
        bordered: true,
        help: vm.actionTips.remind,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRemind").$D("确认催办吗"),
          onOk: vm.remind
          });
      }
      });
    (vm.type === "startedBy" || vm.type === "involved") && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.carbonCopy").$D("传阅"),
        type: "primary",
        bordered: true,
        help: vm.actionTips.carbonCopy,
        handler: () => {
          vm.$refs.approvalPopup.showNewCarbonCopy().then((params) => {
            vm.carbonTask(params);
          });
      }
      });
    vm.type === "involved" && recall && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.recall").$D("撤回"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.recall,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRecall").$D("确认撤回吗"),
          onOk: vm.recall
          });
      }
      });
    startedButtons.push({
      title: vm.$T("hwfp.task.view.option.comment").$D("评论"),
      handler: () => {
        vm.showReplyRecordPopup();
      }
    });
    if(window.h5sdk){
      startedButtons.push(fsBtn);
    }
    return startedButtons;
  }
  approveButtons.push({
    title: vm.$T("hwfp.task.view.option.comment").$D("评论"),
    handler: () => {
      vm.showReplyRecordPopup();
    }
  });
  if(window.h5sdk){
    approveButtons.push(fsBtn);
  }
  // 添加上一条/下一条
  const addButtons = [
    {
      title: vm.$T("hwfp.task.view.option.weilong.preItem").$D("上一条"),
      handler: () => {
        toDetail(vm, "pre");
      },
    },
    {
      title: vm.$T("hwfp.task.view.option.weilong.nextItem").$D("下一条"),
      handler: () => {
        toDetail(vm, "next");
      },
    },
  ];
  if(vm.listDataSet){
    // 有列表页ds信息才显示上一条/下一条
    approveButtons.push(...addButtons);
  }
  return approveButtons;
}

function unisocWeiLongBtn(vm) {
  const approveButtons = [];
  vm.operateTypeArr.map((item) => {
    if (item === "ACTION_APPROVE") {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.button.approvalPass").$D("审批通过"),
        type: "primary",
        fill: true,
        help: vm.actionTips.approved,
        handler: () => {
          vm.$refs.approvalPopup.showApprove().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    if (item === "ACTION_REJECT") {
      approveButtons.unshift({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.button.approvalReject").$D("审批拒绝"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.rejected,
        handler: () => {
          vm.$refs.approvalPopup.showReject().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    const owner = (vm.taskInfo || {}).owner || "";
    const isAddSign = owner.startsWith("AddSign") || owner.startsWith("ApproveAndAddSign");
    const addSign = vm.$T("smbl.common.action.addSign").$D("加签");
    if (item === "ACTION_ADD_SIGN" && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || addSign,
        help: vm.actionTips.addSign,
        handler: () => {
          vm.$refs.approvalPopup.showAddSign().then((params) => {
            vm.approveTask(params);
          });
        }
      });
      // if (!vm.hasApproveAndAddSignFlag) {
      //   approveButtons.push({
      //     title: vm.$T("smbl.workFlow.view.form.approveAndAddSign", [ vm.approvalActionTitle [item] || addSign ]).$D("同意并加签"),
      //     help: vm.actionTips.approveAndAddSign,
      //     handler: () => {
      //       vm.$refs.approvalPopup.showApproveAndAddSign(false).then((params) => {
      //         vm.approveTask(params);
      //       });
      //     }
      //   });
      // }
    }
    if (item === "ACTION_APPROVE_AND_ADD_SIGN" && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.workFlow.view.form.approveAndAddSign", [ addSign ]).$D("同意并加签"),
        help: vm.actionTips.approveAndAddSign,
        handler: () => {
          vm.$refs.approvalPopup.showApproveAndAddSign(true).then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    if (item === "ACTION_DELEGATE") {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.common.action.delegate").$D("转交"),
        help: vm.actionTips.delegate,
        handler: () => {
          vm.$refs.approvalPopup.showDelegate().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
    if (item === "ACTION_JUMP" && vm.jumpList.length && !isAddSign) {
      approveButtons.push({
        title: vm.approvalActionTitle [item] || vm.$T("smbl.common.action.jumped").$D("驳回"),
        help: vm.actionTips.rebut,
        handler: () => {
          vm.$refs.approvalPopup.showJump().then((params) => {
            vm.approveTask(params);
          });
        }
      });
    }
  });
  if (vm.type) {
    const startedButtons = [];
    const { remind, recall } = vm.processInstance;
    vm.type === "startedBy" && remind && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.revoke").$D("撤销"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.revoke,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRevoke").$D("确认撤销吗"),
          onOk: vm.revoke
          });
      }
      });

    const { processInstanceId } = vm.$router.currentRoute.query;
    console.log(processInstanceId, 'processInstanceId');
    getcurrentUrl({ processInstanceId }).then((data) => {
      if (data) {
        copyUrl = data;
      }
    });
    startedButtons.push({
      title: vm.$T("hwfp.common.view.message.shareLink").$D("分享链接"),
      type: "primary",
      bordered: true,
      handler: () => {
        vm.$copyText(copyUrl).then(() => vm.$notification.open({ message: vm.$T("hwfp.common.view.message.shareLinkScuess").$D("复制成功!") }));
      }
    });
    vm.processInstance && vm.processInstance.remind && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.remind").$D("催办"),
        type: "primary",
        bordered: true,
        help: vm.actionTips.remind,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRemind").$D("确认催办吗"),
          onOk: vm.remind
          });
      }
      });
    (vm.type === "startedBy" || vm.type === "involved") && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.carbonCopy").$D("传阅"),
        type: "primary",
        bordered: true,
        help: vm.actionTips.carbonCopy,
        handler: () => {
          vm.$refs.approvalPopup.showNewCarbonCopy().then((params) => {
            vm.carbonTask(params);
          });
      }
      });
    vm.type === "involved" && recall && startedButtons.push({
        title: vm.$T("hwfp.common.view.message.recall").$D("撤回"),
        type: "danger",
        bordered: true,
        help: vm.actionTips.recall,
        handler: () => {
          vm.$dialog({
          content: vm.$T("hwfp.common.view.message.confirmRecall").$D("确认撤回吗"),
          onOk: vm.recall
          });
      }
      });
    startedButtons.push({
      title: vm.$T("hwfp.task.view.option.comment").$D("评论"),
      handler: () => {
        vm.showReplyRecordPopup();
      }
    });
    return startedButtons;
  }
  approveButtons.push({
    title: vm.$T("hwfp.task.view.option.comment").$D("评论"),
    handler: () => {
      vm.showReplyRecordPopup();
    }
  });
  return approveButtons;
}

const cuxFunctions = {
  "SRM-SHEDE": {
    toInvolved,
    initJumpInvolved,
  },
  "SRM-WEILONG": {
    weiLongBtn,
    initH5JDk,
  },
  "SRM-UNISOC": {
    weiLongBtn: unisocWeiLongBtn,
  }
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};