<template>
  <div style="height: 100vh">
    <nav-head :title="$T('spfm.invitationList.view.message.title').$D('企业邀约汇总')" @goBack="goBack" />
    <srm-list :data-set="type === 'send' ? dataSet0 : dataSet1"
              customize-code="SMBL.INVITATION_SUMMARY.LIST"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('spfm.invitationList.view.message.title.send').$D('我发出的邀约'),
                     $T('spfm.invitationList.view.message.title.receive').$D('我收到的邀约')
                   ]"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
    <srm-popup
      :visible.sync="visible"
      height="40%"
      position="bottom"
      rounded
      :title="$T('spfm.invitationList.model.invitationList.registerUrl').$D('邀请链接')">
      <div class="srm-span-text">
        {{ registerUrl }}
      </div>
      <div class="srm-span-text-blue" @click="copyText(registerUrl)">
        {{ $T('spfm.invitationList.view.copylink').$D('复制链接') }}
      </div>
    </srm-popup>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "spfm.invitationRegister", "hipspfm.disposeInvite", "spfm.invitationList", "sodr.receivedOrder", "hipspfm.common" ],
  name: "MyReceiveOrderList",
  components: {
  },
  data() {
    return {
      //receive
      type: "send",
      dataSet0: new DataSet(indexDS("send")),
      dataSet1: new DataSet(indexDS("receive")),
      visible:false,
      registerUrl:null,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            let codeClassaStyle;
            let statuClassaStyle;
            //邀请code属性
            if (item.inviteType === "SUPPLIER") {
              if (this.type === "send") {
                codeClassaStyle = "srm-code-status-a srm-span-block";
              } else if (this.type === "receive") {
                codeClassaStyle = "srm-code-status-c srm-span-block";
              }
            } else if (item.inviteType === "CUSTOMER") {
              if (this.type === "send") {
                codeClassaStyle = "srm-code-status-b srm-span-block";
              } else if (this.type === "receive") {
                codeClassaStyle = "srm-code-status-d srm-span-block";
              }
            } else {
              codeClassaStyle = "srm-code-status-a srm-span-block";
            }
            //状态属性
            //调查表审批中和认证:黄色
            //同意和已认证:绿色
            if (item.processStatus === "APPROVED") {
              statuClassaStyle = "srm-span-status srm-status-c";
            } else if (item.processStatus === "REJECT") {
              statuClassaStyle = "srm-span-status srm-status-b";
            } else if (item.processStatus === "INVESTIGATE_APPROVING") {
              statuClassaStyle = "srm-span-status srm-status-a";
            } else if (item.processStatus === "CERTIFICATED") {
              statuClassaStyle = "srm-span-status srm-status-c";
            } else if (this.searchType === "send") {
              if (item.processStatus === "INVESTIGATE" || item.processStatus === "SUBMIT" && item.processStatus === "CUSTOMER") {
                statuClassaStyle = "srm-span-status srm-status-a";
              }
            } else if (this.searchType === "receive") {
              if (item.processStatus === ("INVESTIGATE" && item.processStatus === "CUSTOMER") || item.processStatus === "SUBMIT" && item.processStatus === "SUPPLIER") {
                statuClassaStyle = "srm-span-status srm-status-a";
              }
            }
            if (this.type === "send") {
              return <SrmListHeader showOpenTag={false}>
                <span class={ codeClassaStyle }>{ this.splitOverFlow(this.$T("spfm.invitationList.model.invitationList.invitation").$D("邀请")) }{item.inviteTypeMeaning}</span>
                {
                  item.displayInviteId
                }
                <span slot="right" class={ statuClassaStyle }>{item.processStatusMeaning}</span>
              </SrmListHeader>;
            } else if (this.type === "receive") {
              return <SrmListHeader showOpenTag={false}>
                <span class={ codeClassaStyle }>{ this.splitOverFlow(this.$T("spfm.invitationList.model.invitationList.toBe").$D("成为")) }{item.inviteTypeMeaning}</span>
                {
                  item.displayInviteIdStr
                }
                <span slot="right" class={ statuClassaStyle }>{item.processStatusMeaning}</span>
              </SrmListHeader>;
            }
          }
        },
        {
          fieldName: this.$T("spfm.invitationList.model.invitationList.companyName").$D("发起邀请公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("spfm.invitationList.model.invitationList.inviteCompanyName").$D("被邀请企业"),
          fieldCode: "inviteCompanyName",
        },
        {
          fieldName: this.$T("spfm.invitationList.model.invitationList.investigateFalg").$D("是否发出调查表"),
          fieldCode: "investigateFlag",
          render:(val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("spfm.invitationList.model.invitationList.creationDate").$D("发出邀请时间"),
          fieldCode: "creationDate",
        },
        // 仅我发出的邀约页面显示该字段
        this.type === "send" && {
          fieldName: this.$T("spfm.invitationList.model.invitationList.registerUrl").$D("邀请链接"),
          fieldCode: "registerUrl",
          render:(val, record) => {
            //邀请类型(inviteType)：REGISTER/注册
            //邀约状态(processStatus): REGISTERED/注册
            //当邀请类型为"注册"，邀约状态为"注册"时，可以查看复制，状态为认证/已认证不可查看
            if (record.inviteType === "REGISTER") {
              if (record.processStatus === "REGISTERED") {
                return <span style="color: blue">{this.$T("hipspfm.common.button.view").$D("查看")}</span>;
                // return this.$T("hipspfm.common.button.view").$D("查看");
              }
              return this.$T("hipspfm.common.button.view").$D("查看");
            }
          },
          callBack:(record) => {
            //邀请类型(inviteType)：REGISTER/注册
            //邀约状态(processStatus): REGISTERED/注册
            //当邀请类型为"注册"，邀约状态为"注册"时，可以查看复制，状态为认证/已认证不可查看
            if (record.inviteType === "REGISTER") {
              if (record.processStatus === "REGISTERED") {
                this.showRegisterUrl(record.registerUrl);
              }
            }
          }
        },
      ];
    },
  },
  methods: {
    copyText(url) {
      this.$copyText(url).then(() => {
        this.$notification.open({ message: this.$T("hipspfm.common.message.copy.success").$D("复制成功") });
      }, () => {
        this.$notification.open({ message: this.$T("hipspfm.common.message.copy.error").$D("复制失败") });
      });
    },
    // 链接详情弹窗
    showRegisterUrl(registerUrl) {
      this.visible = !this.visible;
      this.registerUrl = registerUrl;
    },
    // tab栏切换
    onTabIndexChange(index) {
      if (index === 0) {
        this.type = "send";
        this.dataSet0.refresh();
      } else if (index === 1) {
        this.type = "receive";
        this.dataSet1.refresh();
      }
    },
    goToDetail(item) {
      if (this.type === "receive" && item.data.processStatus === "INVESTIGATE") {
        this.$dialog({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          type: "alert",
          content: this.$T(
            "hipspfm.disposeInvite.validation.message.summitGoToPC"
          ).$D("该邀约需提交调查表，请前往PC端进行操作！"),
          okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
          onOk() {}
        });
      } else {
        this.$router.push({
          path: "/InvitationSummaryDetail",
          query: {
            searchType: this.type,
            inviteId: item.data.inviteId,
            inviteCompanyName: item.data.inviteCompanyName,
            companyName: item.data.companyName,
            // processStatus: li.processStatus,
            // inviteType: li.inviteType,
            // investigateTemplateId: li.investigateTemplateId,
          }
        });
      }
    },
    splitOverFlow (value) {
      if (value) {
        return (value.split("{")[0] || "").concat(value.split("}")[1] || "");
      }
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-span-text {
  padding: 5px 15px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  line-height: 20px;
  color: var(--color-font-default);
}

.srm-span-text-blue {
  padding: 5px 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-other-default-b);
}

.srm-span-block {
  border-radius: 2px;
  margin-right: 8px;
  padding: 1px 4px;
  font-weight: normal;
  font-size: 10px !important;
  line-height: 18px;
  position: relative;
  display: inline-block;
  bottom: 1px;
}

.srm-code-status-a {
  background:var(--color-bg-default-c);
  color: var(--color-other-default-b);
}

.srm-code-status-b {
  background:var(--color-bg-default-g);
  color: var(--color-other-default-c);
}

.srm-code-status-c {
  background:var(--color-bg-default-e);
  color: var(--color-other-default);
}

.srm-code-status-d {
  background:var(--color-bg-default-h);
  color: var(--color-other-default-d);
}

.srm-span-status {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-other-default-b);
  text-align: right;
  line-height: 22px;
}

.srm-status-a {
  color: var(--color-other-default-c) !important;
}

.srm-status-b {
  color: var(--color-other-default) !important;
}

.srm-status-c {
  color: #05944F;;
}

</style>
