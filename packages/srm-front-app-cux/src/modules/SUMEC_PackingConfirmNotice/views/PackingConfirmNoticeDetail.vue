<template>
  <hips-view>
    <!-- 导航 -->
    <NavHead :title="$T('smbl.common.message.packingNoticeDetails').$D('装箱/装柜通知详情')" @goTop="goTop" @goBack="goBack" @goClose="goClose"/>

    <div ref="content" class="rfxprice-detail">
      <!-- 头信息 -->
      <SrmDetailHead
        :data-source="headInfo"
        :columns="headerColumns">
        <div class="button-right-margin">
          <SrmButton size="small" icon="icon-paperclip" @click="showFilePop">
            <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
            <span>{{ $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件') }}</span>
          </SrmButton>
          <SrmButton size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <!-- <img src="@/assets/4.0/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('smbl.common.message.OperationRecord').$D('操作记录') }}</span>
          </SrmButton>
        </div>
      </SrmDetailHead>
      <!-- 内容区 -->
      <SrmTab v-if="JSON.stringify(headInfo) !== '{}'" class="content" @changeTab="changeTab">
        <!-- 装箱/装柜通知单头信息 -->
        <SrmTabPane :label="$T('smbl.common.message.tab.packNoticeHeaderInfo').$D('装箱/装柜通知单头信息')" prop-key="headerInfoList">
          <div class="card-personalized">
            <!-- <div class="card-first-between">
              <span class="line-code open-tag">
                {{ $T("spuc.common.model.common.uniqlo.companyName").$D("公司") }}: {{ headInfo.companyName }}
              </span>
            </div> -->
            <Customize :columns="getHeaderColumns" :data-source="headInfo" code="SMBL.SUMEC.PACKINGCONFIRMATIONNOTICE.HEADERINFO" />
          </div>
        </SrmTabPane>
        <!-- 明细信息 -->
        <SrmTabPane :label="$T('smbl.common.message.tab.detailInfo').$D('明细信息')" prop-key="detailInfoList">
          <!-- 标签 -->
          <div v-if="lineInfo.length>0" class="tag-box">
            <div class="srm-tag">
              <SrmTag size="small" fill type="primary">{{ $T("smbl.common.message.shipmentQuantitySum").$D("本次出运总数量") }}：{{ lineInfo[0].shipmentQuantitySum }}</SrmTag>
              <SrmTag size="small" fill type="success">{{ $T("smbl.common.message.boxQuantitySum").$D("总箱数") }}：{{ lineInfo[0].boxQuantitySum }}</SrmTag>
              <SrmTag size="small" fill type="brown">{{ $T("smbl.common.message.grossWeightSum").$D("总毛重") }}：{{ lineInfo[0].grossWeightSum }}</SrmTag>
              <SrmTag size="small" fill type="purple">{{ $T("smbl.common.message.netWeightSum").$D("总净重") }}：{{ lineInfo[0].netWeightSum }}</SrmTag>
              <SrmTag size="small" fill type="warn">{{ $T("smbl.common.message.volumeSum").$D("总体积") }}：{{ lineInfo[0].volumeSum }}</SrmTag>
            </div>
          </div>
          <!-- 行信息 -->
          <div v-for="(item,index) in lineInfo" :key="index" class="card-personalized">
            <!-- //////////////////////// -->
            <!-- <div class="form-item">
              <div class="label">
                {{$T("smbl.common.message.volumeSum").$D("总体积")}}
              </div>
              <div class="line-text">
                <div>
                  <SrmTextarea
                    v-model= item.productName
                  />
                </div>
                <div class="aaa">
                  <img src="@/assets/4.0/icon_12px_line_list_highlight@3x.png"/>
                  <img src="@/assets/4.0/icon_12px_line_list_highlight@3x.png"/>
                </div>
              </div>
            </div> -->
            <!-- //////////////////////// -->

            <div class="card-first-between">
              <span class="line-code open-tag">
                {{ item.productName }}
              </span>
            </div>
            <Customize :columns="getDetailColumns" :data-source="item" unit-type="Form" />
            <div class="card-last-center">
              <span @click="showSrmDetailPop(item)"> {{ $T('hzero.common.button.viewDetail').$D('查看详情') }} </span>
            </div>
          </div>
        </SrmTabPane>
        <!-- 汇总信息 -->
        <SrmTabPane :label="$T('smbl.common.message.tab.summaryInfo').$D('汇总信息')" prop-key="summaryInfoList">
          <!-- 标签 -->
          <div v-if="summaryLineInfo.length>0" class="tag-box">
            <div class="srm-tag">
              <SrmTag size="small" fill type="primary">{{ $T("smbl.common.message.shipmentQuantitySum").$D("本次出运总数量") }}：{{ summaryLineInfo[0].shipmentQuantitySum }}</SrmTag>
              <SrmTag size="small" fill type="success">{{ $T("smbl.common.message.boxQuantitySum").$D("总箱数") }}：{{ summaryLineInfo[0].boxQuantitySum }}</SrmTag>
              <SrmTag size="small" fill type="brown">{{ $T("smbl.common.message.grossWeightSum").$D("总毛重") }}：{{ summaryLineInfo[0].grossWeightSum }}</SrmTag>
              <SrmTag size="small" fill type="purple">{{ $T("smbl.common.message.netWeightSum").$D("总净重") }}：{{ summaryLineInfo[0].netWeightSum }}</SrmTag>
              <SrmTag size="small" fill type="warn">{{ $T("smbl.common.message.volumeSum").$D("总体积") }}：{{ summaryLineInfo[0].volumeSum }}</SrmTag>
            </div>
          </div>
          <!-- 行信息 -->
          <div v-for="(item,index) in summaryLineInfo" :key="index" class="card-personalized">
            <div class="card-first-between" @click="goSummaryDetail(item)">
              <span class="line-code-blue open-tag">
                {{ item.containerNumber }}
              </span>
            </div>
            <Customize :columns="getSummaryColumns" :data-source="item" unit-type="Form" />
            <div class="card-last-center">
              <span @click="showConfirmNoticeSumDetailPop(item)"> {{ $T('hzero.common.button.viewDetail').$D('查看详情') }} </span>
            </div>
          </div>
        </SrmTabPane>
      </SrmTab>
    </div>
    <div>
      <BottomHandler v-if="bottomHandlerFlag" :btn-arr="btnArr"/>
    </div>
    <!-- 头附件弹窗-->
    <AttachedFiles v-model="filePopup" :file-arr="fileArr" />
    <!-- 操作记录弹窗 -->
    <OperationRecord
      v-model="operationPopup"
      :operation-arr="operationInfo"
      :load-refresh="getPackConfirmNoticeOperationInfo"/>
    <!-- 日期弹窗 -->
    <!-- <DateChooser v-model="datePopup" @submitDate="handleConfirm" /> -->
    <!-- 明细详情页pop -->
    <!-- <ConfirmNoticeDetailPop
      v-model="confirmNoticeDetailPop"
      :detailInfo="detailInfo"
    /> -->

    <!-- 明细详情页pop -->
    <SrmDetailPop
      :visible.sync="srmDetailPop"
      :pop-title="$T('smbl.common.message.detailInfo').$D('明细信息详情')"
      :data-source="detailInfo"
      :columns="getColumns"/>
    <!-- 汇总详情页pop -->
    <ConfirmNoticeSumDetailPop
      v-model="confirmNoticeSumDetailPop"
      :detail-info="summaryDetailInfo"/>

    <NoticeSumDetailLinesPop
      v-model="noticeSumDetailLinesPop"
      :summer-lines-info="summerLinesInfo"/>
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
  getPackConfirmNoticeHeadApi,
  getPackConfirmNoticeLineApi,
  getPackConfirmNoticeOperationApi,
  getPackConfirmNoticeSummaryLineApi,
  packConfirmNoticeFeedbackApi,
  packConfirmNoticeConfirmApi,
  getPackSummaryDetailLineApi
} from "../api/index";
import uuid from "uuid";
import OperationRecord from "../components/OperationRecord";
import AttachedFile from "@/components/File/AttachedFile";
import AttachedFiles from "@/components/File/AttachedFiles";
import NavHead from "@/components/NavHead";
import DateChooser from "@/components/DateChooser";
import ConfirmNoticeDetailPop from "../components/ConfirmNoticeDetailPop";
import ConfirmNoticeSumDetailPop from "../components/ConfirmNoticeSumDetailPop";
import NoticeSumDetailLinesPop from "../components/NoticeSumDetailLinesPop";
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import SrmTextareaBox from "@/components/V5/SrmTextareaBox";

export default {
  modules: [ "smbl.common","hipspfm.orderConfirmation","ssrc.inquiryHall","hzero.common","spuc.common" ],
  name: "PackingConfirmNoticeDetail",
  components: {
    NavHead,
    // eslint-disable-next-line vue/no-unused-components
    AttachedFile,
    AttachedFiles,
    OperationRecord,
    // eslint-disable-next-line vue/no-unused-components
    ConfirmNoticeDetailPop,
    ConfirmNoticeSumDetailPop,
    NoticeSumDetailLinesPop,
    SrmDetailPop,
    // eslint-disable-next-line vue/no-unused-components
    SrmTextareaBox,
    // eslint-disable-next-line vue/no-unused-components
    DateChooser,
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

      packConfirmNoticeInfo:{},//通知单信息
      headInfo: {},//头信息
      lineInfo: [],//行信息
      summaryLineInfo:[],//汇总行信息
      operationInfo:[],//操作记录

      confirmNoticeDetailPop: false,//明细详情pop
      srmDetailPop: false,
      detailInfo:{},//明细信息

      confirmNoticeSumDetailPop: false,//汇总明细详情pop
      summaryDetailInfo:{},//汇总明细信息

      noticeSumDetailLinesPop: false,//汇总信息详情pop
      summerLinesInfo:[],//汇总信息

      operationPopup: false,//操作记录Pop
      filePopup: false,//头附件Pop
      datePopup: false,//日期控制Pop


      propKey: "headerInfoList",//tab切换对应值

      btnArr: [
        {
          title: this.$T("smbl.common.button.feedback").$D("反馈"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.feedback();
          }
        },
        {
          title: this.$T("smbl.common.button.confirm").$D("确认"),
          color: "var(--color-other-default-f)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.confirm();
          }
        }
      ],

      //头字段
      headerColumns:[
        {
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName"
        },
        {
          fieldType: "TEXT",
          fieldCode: "encasementNumber"
        },
      ],
    };
  },
  computed: {
    getHeaderColumns() {
      const columns = [
        {
          fieldName: "公司",
          fieldCode: "companyName",
          langCode: "spuc.common.model.common.uniqlo.companyName",
        },
        {
          fieldName: "部门",
          fieldCode: "deptName",
          langCode: "spuc.common.model.deptName",
        },
        {
          fieldName: "创建人",
          fieldCode: "createdName",
          langCode: "smbl.common.model.createdByName",
        },
        {
          fieldName: "创建时间",
          fieldCode: "creationDate",
          langCode: "smbl.common.model.creationDate",
        },
        {
          fieldName: "备注",
          fieldCode: "comment",
          langCode: "smbl.common.model.comment",
          fieldType: "EMPTY",
          placeholder: this.$T("smbl.common.message.pleaseEnterRemarks").$D("请输入备注"),
          disabled:true,
          render: (val, record, item)=> {
            return (
              <SrmTextareaBox
                rowName = {item.newFieldName || this.$T(item.langCode).$D(item.fieldName)}
                v-model={record.comment}
                placeholder={item.placeholder}
                disabled={item.disabled}
              />
            );
          }
        },
        {
          fieldName: "供应商备注",
          fieldCode: "supplierFeedbackRemark",
          langCode: "smbl.common.model.supplyRemark",
          fieldType: "EMPTY",
          placeholder: this.$T("smbl.common.message.pleaseEnterSupplierRemarks").$D("请输入供应商备注"),
          disabled:false,
          render: (val, record, item)=> {
            return (
              <SrmTextareaBox
                rowName = {item.newFieldName || this.$T(item.langCode).$D(item.fieldName)}
                v-model={record.supplierFeedbackRemark}
                placeholder={item.placeholder}
                disabled={item.disabled}
              />
            );
          }
        },
      ];

      return columns;
    },
    getDetailColumns() {
      const columns = [
        {
          fieldName: "本次出运数量",
          fieldCode: "shipmentQuantity",
          langCode: "smbl.common.model.shipmentQuantity",
          formRow: 1,
          formCol: 1
        },
        {
          fieldName: "包装数量",
          fieldCode: "packagesQuantity",
          langCode: "smbl.common.model.packagesQuantity",
          formRow: 1,
          formCol: 2
        },
        {
          fieldName: "尺码",
          fieldCode: "boxSize",
          langCode: "smbl.common.model.boxSize",
          formRow: 2,
          formCol: 1
        },
        {
          fieldName: "颜色",
          fieldCode: "boxColor",
          langCode: "smbl.common.model.boxColor",
          formRow: 2,
          formCol: 2
        },
        {
          fieldName: "箱数",
          fieldCode: "boxQuantity",
          langCode: "smbl.common.model.boxQuantity",
          formRow: 3,
          formCol: 1
        },
        {
          fieldName: "箱规",
          fieldCode: "boxLength",
          langCode: "smbl.common.model.casesOfGauge",
          formRow: 3,
          formCol: 2,
          render: (val,record) => {
            return record.boxLength + "*" + record.boxWidth + "*" + record.boxHeight;
          }
        },
        {
          fieldName: "毛重/kg",
          fieldCode: "grossWeight",
          langCode: "smbl.common.model.grossWeight",
          formRow: 4,
          formCol: 1
        },
        {
          fieldName: "净重/kg",
          fieldCode: "netWeight",
          langCode: "smbl.common.model.netWeight",
          formRow: 4,
          formCol: 2
        },
        {
          fieldName: "体积/m3",
          fieldCode: "volume",
          langCode: "smbl.common.model.volume",
          formRow: 5,
          formCol: 1
        },
        {
          fieldName: "装箱日期",
          fieldCode: "vanningDate",
          langCode: "smbl.common.model.vanningDate",
          formRow: 5,
          formCol: 2,
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "采购合同号",
          fieldCode: "contractNumber",
          langCode: "smbl.common.model.contractNumber",
          formRow: 6,
          formCol: 1
        },
        {
          fieldName: "合同行号",
          fieldCode: "lineNumber",
          langCode: "smbl.common.model.contractLineNumber",
          formRow: 7,
          formCol: 1
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "smbl.common.model.lineNumber",
          formRow: 7,
          formCol: 2
        },
      ];

      return columns;
    },
    getSummaryColumns() {
      const columns = [
        {
          fieldName: "本次出运数量",
          fieldCode: "shipmentQuantity",
          langCode: "smbl.common.model.shipmentQuantity",
          formRow: 1,
          formCol: 1
        },
        // {
        //   fieldName: "包装数量",
        //   fieldCode: "packagesQuantity",
        //   langCode: "smbl.common.model.packagesQuantity",
        //   formRow: 1,
        //   formCol: 2
        // },
        {
          fieldName: "箱数",
          fieldCode: "boxQuantity",
          langCode: "smbl.common.model.boxQuantity",
          formRow: 1,
          formCol: 2
        },
        // {
        //   fieldName: "箱规",
        //   fieldCode: "boxLength",
        //   langCode: "smbl.common.model.casesOfGauge",
        //   formRow: 2,
        //   formCol: 2,
        //   render: (val) => {
        //     return val + "*";
        //   }
        // },
        {
          fieldName: "毛重/kg",
          fieldCode: "grossWeight",
          langCode: "smbl.common.model.grossWeight",
          formRow: 3,
          formCol: 1
        },
        {
          fieldName: "净重/kg",
          fieldCode: "netWeight",
          langCode: "smbl.common.model.netWeight",
          formRow: 3,
          formCol: 2
        },
        {
          fieldName: "体积/m3",
          fieldCode: "volume",
          langCode: "smbl.common.model.volume",
          formRow: 4,
          formCol: 1
        },
        {
          fieldName: "装箱日期",
          fieldCode: "vanningDate",
          langCode: "smbl.common.model.vanningDate",
          formRow: 4,
          formCol: 2,
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "采购合同号",
          fieldCode: "contractNumber",
          langCode: "smbl.common.model.contractNumber",
          formRow: 5,
          formCol: 1
        },
      ];

      return columns;
    },
    //详情页Columns
    getColumns() {
      const columns = [
        {
          fieldName: "商品名称",
          fieldType: "TEXT",
          fieldCode: "productName",
          langCode:"smbl.common.model.productName"
        },
        {
          fieldName: "行号",
          fieldType: "TEXT",
          fieldCode: "lineNum",
          langCode:"smbl.common.model.lineNumber"
        },
        {
          fieldName: "本次出运数量",
          fieldType: "TEXT",
          fieldCode: "shipmentQuantity",
          langCode:"smbl.common.model.shipmentQuantity"
        },
        {
          fieldName: "包装数量",
          fieldType: "TEXT",
          fieldCode: "packagesQuantity",
          langCode:"smbl.common.model.packagesQuantity"
        },
        {
          fieldName: "尺码",
          fieldType: "TEXT",
          fieldCode: "boxSize",
          langCode:"smbl.common.model.boxSize"
        },
        {
          fieldName: "颜色",
          fieldType: "TEXT",
          fieldCode: "boxColor",
          langCode:"smbl.common.model.boxColor"
        },
        {
          fieldName: "箱数",
          fieldType: "TEXT",
          fieldCode: "boxQuantity",
          langCode:"smbl.common.model.boxQuantity"
        },
        {
          fieldName: "箱规",
          fieldType: "TEXT",
          fieldCode: "boxLength",
          langCode:"smbl.common.model.casesOfGauge"
        },
        {
          fieldName: "毛重",
          fieldType: "TEXT",
          fieldCode: "grossWeight",
          langCode:"smbl.common.model.grossWeight"
        },
        {
          fieldName: "净重",
          fieldType: "TEXT",
          fieldCode: "netWeight",
          langCode:"smbl.common.model.netWeight"
        },
        {
          fieldName: "体积",
          fieldType: "TEXT",
          fieldCode: "volume",
          langCode:"smbl.common.model.volume"
        },
        {
          fieldName: "装箱日期",
          fieldType: "TEXT",
          fieldCode: "vanningDate",
          langCode:"smbl.common.model.vanningDate",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "采购合同号",
          fieldType: "TEXT",
          fieldCode: "contractNumber",
          langCode:"smbl.common.model.contractNumber"
        },
        {
          fieldName: "合同行号",
          fieldType: "TEXT",
          fieldCode: "lineNumber",
          langCode:"smbl.common.model.contractLineNumber"
        },
        {
          fieldName: "P0#",
          fieldType: "TEXT",
          fieldCode: "poNum",
          langCode:"smbl.common.model.tag.poNum"
        },
        {
          fieldName: "Customer PO#",
          fieldType: "TEXT",
          fieldCode: "customerPoNum",
          langCode:"smbl.common.model.tag.customerPoNum"
        },
        {
          fieldName: "集装箱号",
          fieldType: "TEXT",
          fieldCode: "containerNumber",
          langCode:"smbl.common.model.containerNumber"
        },
        {
          fieldName: "集装箱柜型",
          fieldType: "TEXT",
          fieldCode: "contractSize",
          langCode:"smbl.common.model.contractSize"
        },
        {
          fieldName: "集装箱封号",
          fieldType: "TEXT",
          fieldCode: "sealNumber",
          langCode:"smbl.common.model.sealNumber"
        },
        {
          fieldName: "船名",
          fieldType: "TEXT",
          fieldCode: "vessel",
          langCode:"smbl.common.model.vessel"
        },
        {
          fieldName: "运编号",
          fieldType: "TEXT",
          fieldCode: "invoiceNumber",
          langCode:"smbl.common.model.invoiceNumber"
        },
        {
          fieldName: "提单号",
          fieldType: "TEXT",
          fieldCode: "billLadingNumber",
          langCode:"smbl.common.model.billLadingNumber"
        },
        {
          fieldName: "装箱地址",
          fieldType: "TEXT",
          fieldCode: "packingAddress",
          langCode:"smbl.common.model.packingAddress"
        },
        {
          fieldName: "备注",
          fieldType: "TEXT_AREA",
          fieldCode: "remark",
          langCode:"smbl.common.model.comment",
          disabled: true
        },
      ];

      return columns;
    },
    fileArr() {
      let newFileArr = [
        {
          title: this.$T("smbl.common.view.purchaserAttachmentView").$D("采购方附件查看"),
          attachmentUuid: this.headInfo.purchaseAttr,
          readOnly: true
        },
        {
          title: this.$T("smbl.common.view.supplierAttachmentUpload").$D("供应商附件上传"),
          attachmentUuid: this.headInfo.supplierFeedbackAttr,
          readOnly: !this.bottomHandlerFlag
        }
      ];

      return newFileArr;
    },
    bottomHandlerFlag() {
      return this.packConfirmNoticeInfo.encasementHeaderStatus === "ADJUST_TO_BE_CONFIRMED" || this.packConfirmNoticeInfo.encasementHeaderStatus === "TO_BE_CONFIRMED";
    }

  },

  async mounted() {
    const { packConfirmNoticeInfo } = this.$route.query;

    this.packConfirmNoticeInfo = packConfirmNoticeInfo;
    const encasementHeaderId = packConfirmNoticeInfo.encasementHeaderId;

    try {
      this.$loading.show();
      await this.getHeadInfo(encasementHeaderId);
      await this.getLineInfo(encasementHeaderId);
      await this.getSummaryLineInfo(encasementHeaderId);
      await this.getPackConfirmNoticeOperationInfo(encasementHeaderId);

      // await this.getInspectOperationInfo(qqcReqId);
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {

    //切换tab触发方法
    changeTab(data) {
      this.propKey = data.propKey;
    },

    //获取装箱/装柜通知头信息
    async getHeadInfo(encasementHeaderId) {
      const params = {
        page: 0,
        size: 10,
        encasementHeaderId: encasementHeaderId,
      };

      await getPackConfirmNoticeHeadApi(params).then((res)=>{
        if (res && !res.failed) {
          this.headInfo = res;
        }
      });
    },

    //获取装箱/装柜通知行信息
    async getLineInfo(encasementHeaderId) {
      const params = {
        page: 0,
        size: 10000,
        encasementHeaderId: encasementHeaderId
      };

      await getPackConfirmNoticeLineApi(params).then((res)=>{
        if (res && !res.empty) {
          const temp = res.content.map((item,index)=>({ ...item, lineNum: index + 1 }));

          this.lineInfo = temp;
        }
      });
    },

    //获取装箱/装柜通知汇总信息
    async getSummaryLineInfo(encasementHeaderId) {
      const params = {
        page: 0,
        size: 10000,
        searchType: "CONTAINER",
        encasementHeaderId: encasementHeaderId
      };

      await getPackConfirmNoticeSummaryLineApi(params).then((res)=>{
        if (res && !res.empty) {
          const temp = res.content.map((item,index)=>({ ...item, lineNum: index + 1 }));

          this.summaryLineInfo = temp;
        }
      });
    },

    goSummaryDetail(item) {
      //获取汇总信息
      this.getSummaryDetailLineInfo(item);
      this.noticeSumDetailLinesPop = !this.noticeSumDetailLinesPop;
    },

    //获取装箱/装柜通知汇总信息详情
    async getSummaryDetailLineInfo(item) {
      const params = {
        page: 0,
        size: 10000,
        encasementLineIds:item.encasementLineIds,
        vessel:item.vessel,
        billLadingNumber:item.billLadingNumber,
        invoiceNumber:item.invoiceNumber,
        containerNumber:item.containerNumber,
        encasementHeaderId:item.encasementHeaderId
      };

      await getPackSummaryDetailLineApi(params).then((res)=>{
        if (res && !res.empty) {
          const temp = res.content.map((lineItem,index) => ({ ...lineItem,lineNum: index + 1 }));

          this.summerLinesInfo = temp;
        }
      });
    },

    //获取操作记录信息
    async getPackConfirmNoticeOperationInfo(encasementHeaderId) {
      const params = {
        page: 0,
        size: 10000,
        encasementHeaderId: encasementHeaderId
      };

      await getPackConfirmNoticeOperationApi(params).then((res) =>{
        if (res && res.content) {
          this.operationInfo = res.content;
        }
      });
    },

    //反馈
    async feedback() {
      let params = [];

      params.push(this.headInfo);
      //反馈数据
      this.$loading.show();
      await packConfirmNoticeFeedbackApi(params).then((res) => {
        if (res) {
          console.log("反馈失败");
          this.$notification.open({
            message: res.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.orderConfirmation.validation.message.feedbackSuccess").$D("反馈成功"),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
          this.goBack();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },

    //确定
    async confirm() {
      let params = [];

      params.push(this.headInfo);
      //反馈数据
      this.$loading.show();
      await packConfirmNoticeConfirmApi(params).then((res) => {
        if (res) {
          console.log("操作失败");
          this.$notification.open({
            message: res.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
          this.goBack();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },

    //开启日期弹窗
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },

    //选择时间
    // handleConfirm(value) {
    //   console.log("选择时间",value)
    //   this[this.changeDate] = value;
    //   this.inspectHeaderInfo[this.changeDate] = value+" 00:00:00";
    //   this.datePopup = false;
    // },

    //操作记录显示
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },

    //头附件显示
    showFilePop() {
      if (!this.headInfo.purchaseAttr) {
        this.headInfo.purchaseAttr = uuid();
      }
      if (!this.headInfo.supplierFeedbackAttr) {
        this.headInfo.supplierFeedbackAttr = uuid();
      }
      this.filePopup = !this.filePopup;
    },

    //明细pop显示
    showConfirmNoticeDetailPop(val) {
      this.detailInfo = val;
      // this.confirmNoticeDetailPop = !this.confirmNoticeDetailPop;
      this.srmDetailPop = !this.srmDetailPop;
    },

    //明细pop显示
    showSrmDetailPop(val) {
      this.detailInfo = val;
      this.srmDetailPop = !this.srmDetailPop;
    },

    //明细pop显示
    showConfirmNoticeSumDetailPop(val) {
      this.summaryDetailInfo = val;
      this.confirmNoticeSumDetailPop = !this.confirmNoticeSumDetailPop;
    },

    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        // eslint-disable-next-line no-undef
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
  height calc(100vh - 50px);
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

.form-item {
    padding: 16px 15px 16px 0;
    width: 100%;
    border-top: 1px solid #f6f6f6;

    .label {
      color: #AFAFAF;
      font-size: 12px;
      line-height: 16px;
    }

    .value {
      margin-top: 8px;
      color: #1f1f1f;
      min-height: 20px;
      line-height: 20px;
      font-size: 14px;

      .form-input {
        width: 290px;
        height: 20px;
        border: 0; // 去除未选中状态边框
        outline: none; // 去除选中状态边框
        background-color: rgba(0, 0, 0, 0); // 透明背景
      }

      .edit-icon {
        width: 20px;
        height: 20px;
      }
    }

    .line-text {
      height: 64px;
      margin-top: 8px;
      border-radius: 8px;
      width: 100%;
      background: var(--color-bg-default-b);

    }
  }

.tag-box{
  padding: 12px 15px;

  .srm-tag{
    margin-right: 5px;
    margin-top: 5px;
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

    .line-code {
      text-align: left;
      font-size: 14px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-code-blue {
      text-align: left;
      font-size: 14px;
      color: #276EF1;
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }

  .card-last-center{
    display: flex;
    justify-content: center;

    span{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 72px;
      height: 24px;
      margin: 12px 0;
      background: #276ef1;
      border: 1px solid #276ef1;
      border-radius: 13px;
      font-size: 12px;
      color: #ffffff;
      line-height: 16px;
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
