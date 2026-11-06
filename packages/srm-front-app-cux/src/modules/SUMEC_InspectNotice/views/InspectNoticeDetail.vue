<template>
  <hips-view>
    <!-- 导航 -->
    <NavHead :title="$T('smbl.common.message.inspectionNoticeDetails').$D('验货通知单明细')" @goTop="goTop" @goBack="goBack" @goClose="goClose"/>

    <div ref="content" class="rfxprice-detail">
      <!-- 头信息 -->
      <SrmDetailHead
        :data-source="inspectHeaderInfo"
        :columns="headerColumns">
        <div class="button-right-margin">
          <SrmButton fill size="small" icon="icon-notes" @click="showInspectNoticeHeaderPop">
            <!-- <img src="@/assets/4.0/icon_notes@3x.png"> -->
            <span>{{ $T('ssrc.inquiryHall.view.inquiryHall.headerDetail').$D('表头详情') }}</span>
          </SrmButton>
          <SrmButton size="small" icon="icon-paperclip" @click="showLineFilePop">
            <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
            <span>{{ $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件') }}</span>
          </SrmButton>
          <SrmButton size="small" icon="icon-clock" type="warn" @click="showOperationPop">
            <!-- <img src="@/assets/4.0/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('smbl.common.message.OperationRecord').$D('操作记录') }}</span>
          </SrmButton>
        </div>
      </SrmDetailHead>
      <!-- 内容区 -->
      <div class="card-personalized">
        <CustomizeDetail :columns="getColumns" :data-source="inspectHeaderInfo" code="SMBL.SUMEC.INSPECTNOTICE.DETAIL" />
      </div>
    </div>
    <div>
      <BottomHandler :btn-arr="btnArr" />
    </div>
    <!-- 头附件弹窗 -->
    <AttachedFile v-model="filePopup" :attachment-uuid="attachmentUuid"/>
    <!-- 头附件弹窗-->
    <AttachedFiles v-model="lineFilePopup" :file-arr="fileArr" />
    <!-- 操作记录弹窗 -->
    <OperationRecord
      v-model="operationPopup"
      :operation-arr="operationInfo"
      :load-refresh="getInspectOperationInfo"/>
    <!-- 询价单头详情 -->
    <InspectNoticeHeaderPop v-model="inspectNoticeHeaderPop" :header-info="inspectHeaderInfo"/>
    <!-- 日期弹窗 -->
    <DateChooser v-model="datePopup" @submitDate="handleConfirm" />
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  Input,
  NavBar,
  Collapse,
  CollapseItem,
} from "hips";
import {
  getInspectNoticeHeaderApi,
  getInspectNoticeLineApi,
  getInspectOperationApi,
  saveInspectApi,
  submitInspectApi
} from "../api/index";
import uuid from "uuid";
import OperationRecord from "../components/OperationRecord";
import AttachedFile from "@/components/File/AttachedFile";
import AttachedFiles from "@/components/File/AttachedFiles";
import NavHead from "@/components/NavHead";
import InspectNoticeHeaderPop from "../components/InspectNoticeHeaderPop";
import DateChooser from "@/components/DateChooser";
import { isEmpty, Exception } from "@/utils/index";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";


export default {
  modules: [ "smbl.common","hipspfm.supplierQuotation","hipspfm.common","hzero.common","spuc.common","sslm.common","ssrc.inquiryHall","sodr.common","hwfl.common","spuc.scheduleReleases" ],
  name: "InspectNoticeDetail",
  components: {
    NavHead,
    AttachedFile,
    AttachedFiles,
    OperationRecord,
    DateChooser,
    InspectNoticeHeaderPop,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  data() {
    return {
      curIndex: "A",
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",

      inspectHeaderInfo:{},//通知单信息
      headInfo: {},//头信息
      lineInfo: [],//行信息
      operationInfo:[],//操作记录
      attachmentUuid: "",//头附件id

      operationPopup: false,//操作记录Pop
      filePopup: false,//头附件Pop
      lineFilePopup: false,//行附件Pop
      inspectNoticeHeaderPop:false,//头详情Pop
      datePopup: false,//日期控制Pop

      btnArr: [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.saveInspectInfo();
          }
        },
        {
          title: this.$T("smbl.common.button.submit").$D("提交"),
          color: "var(--color-other-default-f)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.submitInspectInfo();
          }
        }
      ],

      //头字段
      headerColumns:[
        {
          fieldType: "TEXT",
          fieldCode: "qqcNum"
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
          fieldName: "验货类型",
          fieldType: "TEXT",
          fieldCode: "qqcTypeMeaning",
          langCode:"smbl.common.model.inspectionType"
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
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
      ],
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: "名称",
          fieldCode: "reqDescription",
          langCode: "smbl.common.model.name",
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "spuc.common.model.common.lineNum",
        },
        {
          fieldName: "当前节点",
          fieldCode: "currentNodeMeaning",
          langCode: "hwfl.common.view.message.current.stage",
        },
        {
          fieldName: "状态",
          fieldCode: "statusCodeMeaning",
          langCode: "spuc.common.model.export.asnStatusMeaning",
        },
        {
          fieldName: "申请验货日期",
          fieldCode: "reqTime",
          langCode: "smbl.common.model.requestInspectionDate",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "数量",
          fieldCode: "quantity",
          langCode: "spuc.common.model.common.quantity",
        },
        {
          fieldName: "实际验货日期",
          fieldCode: "qqcTime",
          langCode: "spuc.common.model.actualDate",
          required: true,
          render: (val) => {
            if (val) {
            // eslint-disable-next-line new-cap
              return <sapn style="color:blue"> {this.$options.filters["CalcDate"](val)} </sapn>;
            }
            return <sapn style="color:blue">{this.$T("smbl.common.message.pleaseChoseDate").$D("请选择日期")}</sapn>;

          },
          callBack:()=> {
            this.choseData("qqcTime");
          }
        },
        {
          fieldName: "实际验货数量",
          fieldCode: "qqcQuantity",
          langCode: "spuc.common.model.actualQuantity",
          fieldType: "INPUT",
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerCurrentQuotationQuantity").$D("请输入数量"),
        },
        {
          fieldName: "验货结果",
          fieldCode: "qqcResultMeaning",
          langCode: "spuc.common.model.inspectionResults",
          required: true,
          render: (val) => {
            if (val) {
              return <sapn style="color:blue"> {val} </sapn>;
            }
            return <sapn style="color:blue"> {this.$T("smbl.common.message.pleaseChoseQqcResult").$D("请选择验货结果")} </sapn>;


          },
          callBack:()=>{
            this.openActionSheet();
          }
        },
        {
          fieldName: "第三方验货日期",
          fieldCode: "thirdPartReqTime",
          langCode: "spuc.common.model.thirdPartReqTime",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "上线生产日期",
          fieldCode: "productTime",
          langCode: "spuc.common.model.productTime",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "下线完成日期",
          fieldCode: "finishTime",
          langCode: "spuc.common.model.finishTime",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "包装信息",
          fieldCode: "packageInfo",
          langCode: "spuc.common.model.packageInfo",
        },
        {
          fieldName: "销售订单号",
          fieldCode: "salePoNum",
          langCode: "spuc.scheduleReleases.model.scheduleReleases.salePoNumber",
        },
        {
          fieldName: "业务员",
          fieldCode: "businessUserName",
          langCode: "smbl.common.model.salesman",
        },
        {
          fieldName: "成品工厂",
          fieldCode: "productVendorName",
          langCode: "smbl.common.model.productFactory",
        },
        {
          fieldName: "面料工厂",
          fieldCode: "materialVendorName",
          langCode: "smbl.common.model.fabricFactory",
        },
        {
          fieldName: "是否有黑卡和风格样",
          fieldCode: "styleModeMeaning",
          langCode: "smbl.common.model.blackAndStyle",
        },
        {
          fieldName: "QC",
          fieldCode: "qcUserName",
          langCode: "smbl.common.model.QC",
        },
        {
          fieldName: "QC分配说明",
          fieldCode: "qcAssignRemark",
          langCode: "smbl.common.model.qcAssignRemark",
          fieldType: "TEXT_AREA",
          disabled: true
        },
        {
          fieldName: "申请备注",
          fieldCode: "reqComments",
          langCode: "smbl.common.model.reqComments",
          fieldType: "TEXT_AREA",
          disabled: true
        },
      ];

      return columns;
    },
    fileArr() {
      let newFileArr = [
        {
          title: this.$T("smbl.common.view.inspectionReport").$D(
            "验货报告"
          ),
          attachmentUuid: this.inspectHeaderInfo.rptAttachmentUuid || uuid(),
          readOnly: false
        },
        {
          title: this.$T("smbl.common.view.inspectionPictures").$D(
            "验货图片"
          ),
          attachmentUuid: this.inspectHeaderInfo.imgAttachmentUuid || uuid(),
          readOnly: false
        }
      ];

      return newFileArr;
    }
  },

  async mounted() {
    const { inspectHeaderInfo } = this.$route.query;

    this.inspectHeaderInfo = inspectHeaderInfo;
    // const qqcHeaderId = inspectHeaderInfo.qqcHeaderId;
    const qqcReqId = inspectHeaderInfo.qqcReqId;

    try {
      this.$loading.show();
      await this.getInspectOperationInfo(qqcReqId);
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    /**
     * ******************
     * 获取页面数据接口
     * ******************
     */
    //获取询价单头信息
    async getHeadInfo(qqcHeaderId) {
      const params = {
        page: 0,
        size: 10,
        qqcHeaderId: qqcHeaderId
      };

      await getInspectNoticeHeaderApi(qqcHeaderId,params).then((res)=>{
        if (res && !res.failed) {
          this.attachmentUuid = res.attachmentUuid || uuid();
          this.headInfo = res;
        }
      });
    },

    //获取询价单行信息
    async getLineInfo(qqcHeaderId) {
      const params = {
        page: 0,
        size: 10000
      };

      await getInspectNoticeLineApi(qqcHeaderId,params).then((res)=>{
        if (res && !res.empty) {
          this.lineInfo = res.content;
        }
      });
    },

    //获取操作记录信息
    async getInspectOperationInfo(qqcReqId) {
      const params = {
        page: 0,
        size: 10000
      };

      await getInspectOperationApi(qqcReqId,params).then((res) =>{
        if (res && res.content) {
          this.operationInfo = res.content;
        }
      });
    },

    //保存
    async saveInspectInfo() {
      let params = [];
      let headerInfoData = this.inspectHeaderInfo;

      headerInfoData._status = "update";
      params.push(headerInfoData);
      //保存数据
      this.$loading.show();
      await saveInspectApi(params).then((res) => {
        if (res && res.length) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.saveSuccess").$D("保存成功"),
            class: "notification",
            duration: 3
          });
          // this.goBack();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },


    //提交
    async submitInspectInfo() {
      //数据校验
      if (isEmpty(this.inspectHeaderInfo.qqcTime)) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("spuc.common.model.actualDate").$D("实际验货日期") ]);
      }
      if (isEmpty(this.inspectHeaderInfo.qqcQuantity)) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("spuc.common.model.actualQuantity").$D("实际验货数量") ]);
      }
      if (isEmpty(this.inspectHeaderInfo.qqcResultMeaning)) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("spuc.common.model.inspectionResults").$D("验货结果") ]);
      }
      let params = [];
      let headerInfoData = this.inspectHeaderInfo;

      params.push(headerInfoData);
      //提交数据
      this.$loading.show();
      await submitInspectApi(params).then((res) => {
        if (res) {
          this.$notification.open({
            message: res.message,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("sslm.common.view.message.submit.success").$D("提交成功"),
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
          this.goBack();
        }
      }).finally(() => {
        this.$loading.hide();
      }).catch(() => {
        this.$loading.hide();
      });
    },

    /**
     * ************************
     * 组件属性控制方法
     * ************************
     */

    // 实际校验结果
    openActionSheet() {
      this.$hips.actionsheet.show({
        theme: "android",
        title: "实际验货结果",
        subTitle: "",
        buttons: [
          {
            text: this.$T("smbl.common.message.pass").$D("通过"),
            handler: () => {
              this.$hips.actionsheet.hide();
              this.inspectHeaderInfo.qqcResultMeaning = "通过",
              this.inspectHeaderInfo.qqcResult = "PASS";
            }
          },
          {
            text: this.$T("smbl.common.message.noPass").$D("拒绝"),
            handler: () => {
              this.$hips.actionsheet.hide();
              this.inspectHeaderInfo.qqcResultMeaning = "拒绝",
              this.inspectHeaderInfo.qqcResult = "NO_PASS";
            }
          },
          {
            text: this.$T("smbl.common.message.conditionPass").$D("有条件通过"),
            handler: () => {
              this.$hips.actionsheet.hide();
              this.inspectHeaderInfo.qqcResultMeaning = "有条件通过",
              this.inspectHeaderInfo.qqcResult = "CONDITION_PASS";
            }
          }
        ],
        cancel: {
          text: this.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            console.log("Cancel");
          }
        }
      });
    },

    //开启日期弹窗
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },

    //选择时间
    handleConfirm(value) {
      this[this.changeDate] = value;
      this.inspectHeaderInfo[this.changeDate] = value + " 00:00:00";
      this.datePopup = false;
    },

    //操作记录显示
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },

    //头附件显示
    showFilePop() {
      this.filePopup = !this.filePopup;
    },

    //头附件显示
    showLineFilePop() {
      if (!this.inspectHeaderInfo.rptAttachmentUuid) {
        this.inspectHeaderInfo.rptAttachmentUuid = uuid();
      }
      if (!this.inspectHeaderInfo.imgAttachmentUuid) {
        this.inspectHeaderInfo.imgAttachmentUuid = uuid();
      }
      this.lineFilePopup = !this.lineFilePopup;
    },

    //头详情pop
    showInspectNoticeHeaderPop() {
      this.inspectNoticeHeaderPop = !this.inspectNoticeHeaderPop;
    },


    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      // eslint-disable-next-line no-irregular-whitespace
      this.$refs.content.scrollTop = 0;
    },

  },
};
</script>

<style lang="stylus" scoped>
.rfxprice-detail {
  width: 100%;
  height calc(100vh - 100px);
  overflow-y: auto;

  .head-lin{
    margin-top: 4px;
    height: 20px;
    font-size: 14px;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    display: inline-block;
  }

  .head-tip{
    margin-top: 8px;
    height: 12px;
    font-size: 10px;
    font-weight: 500;
    color: #ffffff;
    line-height: 12px;
  }
}

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

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}
</style>
