<template>
  <div style="height: 100vh;">
    <div class="main-info">
      <!-- 内容区域      -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('sslm.sample.view.message.basicInfo').$D('基础信息')" >
          <div class="customize-card">
            <customize :need-padding="true" type="list" code="SMBL.SAMPLE_DELIVERY_CALLBACK.BASIC_INFO" :data-source="sampleBasicInfo" :columns="getsampleBasicInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.sample.view.message.sampleDelivery').$D('送样信息')" >
          <div class="customize-card">
            <customize :need-padding="true" code="SMBL.SAMPLE_DELIVERY_CALLBACK.LINE_FORM" :data-source="sampleDeliveryInfo" :columns="getsampleDeliveryInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.sample.view.message.sampleInfo').$D('样品信息')" >
          <srm-list v-if="sampleInfoDataSet" :data-set="sampleInfoDataSet" :scrollable="false" :columns="getsampleInfoColumns" customize-code="SMBL.SAMPLE_DELIVERY_CALLBACK.SAMPLE_INFO"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 供应商附件信息弹窗 -->
    <srm-popup :visible.sync="vendorAttachmentPop" position="right" width="100%" height="100%" :title="$T('sslm.sample.model.attachmentUuid').$D('供应商附件')">
      <div style="height: 100%; overflow: auto;">
        <srm-list v-if="currentSampleVendorAttachment" customize-code="SMBL.SAMPLE_DELIVERY_CALLBACK.VENDOR_ATTACHMENT" :data-set="currentSampleVendorAttachment" :columns="getSampleVendorAttachmentColumns"/>
      </div>
    </srm-popup>
    <srm-bottom-handler :btn-arr="getBtnArr" />
  </div>
</template>

<script>

import { isEmpty, Exception } from "../../../utils/index";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import sampleVendorAttachmentDS from "../datasource/sampleVendorAttachmentDS";
import sampleInfoDS from "../datasource/SampleInfoDS";
import {
  getsampleBasicInfoApi,
  sampleFeedbacksaveApi,
  sampleFeedbackSubmmitApi } from "../api/index";

export default {
  modules: [ "sslm.sample", "hzero.common", "smbl.common", "smbl.small" ],
  name: "DeliveryBillDetail",
  components: {
  },
  data() {
    return {
      reqId:"", //送样单头id
      sampleBasicInfo: {}, //送样基础信息
      sampleDeliveryInfo: {}, //送样信息
      sampleInfo: [], //样品信息
      currentSampleVendorAttachment: null, //当前行供应商附件信息
      sampleOrderAttachments:[], // 样件反馈采购方附件信息列表
      unreadCount: 0,
      vendorAttachmentPop: false,
      sampleInfoDataSet: null,
    };
  },
  computed: {
    // 样件基础信息
    getsampleBasicInfoColumns() {
      const columns = [
        {
          formRow: 10,
          fieldName: this.$T("sslm.sample.model.reqNum").$D("申请单号"),
          fieldCode: "reqNum",
          fieldType: "TEXT"
        },
        {
          formRow: 20,
          fieldName: this.$T("sslm.sample.model.reqUserName").$D("申请人"),
          fieldCode: "reqUserName",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.sample.releaseTime").$D("发布时间"),
          fieldCode: "releaseDate",
          fieldType: "TEXT"
        },
        {
          formRow: 40,
          fieldName: this.$T("sslm.sample.model.sample.customer").$D("客户"),
          fieldCode: "companyName",
          fieldType: "TEXT"
        },
        {
          formRow: 50,
          fieldName: this.$T("sslm.sample.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
          fieldType: "TEXT"
        },
        {
          formRow: 50,
          fieldName: this.$T("sslm.sample.model.organization").$D("库存组织"),
          fieldCode: "organizationName",
          fieldType: "TEXT"
        },
        {
          formRow: 60,
          fieldName: this.$T("sslm.sample.model.typeCodeMeaning").$D("送样类型"),
          fieldCode: "typeCodeMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 60,
          fieldName: this.$T("sslm.sample.model.sampleSendAddress").$D("送样地址"),
          fieldCode: "sampleSendAddress",
          fieldType: "TEXT"
        },
        {
          formRow: 70,
          fieldName: this.$T("sslm.sample.model.urgencyDegreeMeaning").$D("紧急程度"),
          fieldCode: "urgencyDegreeMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 70,
          fieldName: this.$T("sslm.sample.model.recUserName").$D("接样人"),
          fieldCode: "recUserName",
          fieldType: "TEXT"
        },
        {
          formRow: 80,
          fieldName: this.$T("sslm.sample.model.recUserPhone").$D("接样人联系电话"),
          fieldCode: "recUserPhone",
          fieldType: "TEXT",
          render: (val, item) => {
            let recUserPhone;
            if (isEmpty(item.recUserPhone)) {
              recUserPhone = "-";
            } else {
              recUserPhone = item.recInternationalTelMeaning + "|" + item.recUserPhone;
            }
            return recUserPhone;
          }
        },
        {
          formRow: 90,
          fieldName: this.$T("sslm.sample.model.reqUserPhone").$D("申请人联系电话"),
          fieldCode: "reqUserPhone",
          fieldType: "TEXT",
          render: (val, item) => {
            let recUserPhone;
            if (isEmpty(item.reqUserPhone)) {
              recUserPhone = "-";
            } else {
              recUserPhone = item.reqInternationalTelMeaning + "|" + item.reqUserPhone;
            }
            return recUserPhone;
          }
        },
        {
          formRow: 100,
          fieldName: this.$T("sslm.sample.model.reqStatusMeaning").$D("单据状态"),
          fieldCode: "reqStatusMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 100,
          fieldName: this.$T("sslm.sample.model.receiveUnit").$D("接收部门"),
          fieldCode: "receiveUnitName",
          fieldType: "TEXT"
        },
        {
          formRow: 110,
          fieldName: this.$T("sslm.sample.model.needFeedback").$D("需要供应商反馈"),
          fieldCode: "needFeedbackFlagMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 120,
          fieldName: this.$T("sslm.sample.model.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
      ];

      return columns;
    },
    // 送样信息
    getsampleDeliveryInfoColumns() {
      const columns = [
        {
          formRow: 10,
          fieldName: this.$T("sslm.sample.model.sendUserName").$D("送样人"),
          fieldCode: "sendUserName",
          fieldType: "INPUT"
        },
        {
          formRow: 20,
          fieldName: this.$T("sslm.sample.model.sendUserPhone").$D("送样人联系电话"),
          fieldCode: "sendUserPhone",
          fieldType: "INPUT_NUMBER",
          prefixField:{
            lovCode:"HPFM.IDD",
            defaultValue:{ value: "+86", meaning:this.$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
            // displayField:"internationalTelCodeMeaning",
            fieldCode:"sendInternationalTelCode",
            fieldType: "SELECT"
          },
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!SrmUtil.isMobileNumber(val)) {
                return this.$T("smbl.small.message.sale.notMobile.customerMobilePhone").$D("手机号码格式不正确！");
              }
            }
          },
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间"),
          fieldCode: "expectedDeliveryDate",
          fieldType: "DATE_PICKER",
          required:true,
          timePicker: true,
          options: {
            onClear: () => {
              this.sampleInfoDataSet.records.forEach((record) => {
                record.setField("expectedDeliveryDate", null);
              });
            },
            callback: (val) => {
              this.sampleInfoDataSet.records.forEach((record) => {
                record.setField("expectedDeliveryDate", val);
              });
            }
          },
        },
        {
          formRow: 40,
          fieldName: this.$T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式"),
          fieldCode: "sendTypeCode",
          fieldType: "SELECT",
          required:true,
          lovCode:"SSLM.SEND_TYPE_CODE",
          displayField:"sendTypeCodeMeaning",
          options: {
            onClear: () => {
              this.sampleInfoDataSet.records.forEach((record) => {
                record.setField("sendTypeCodeMeaning", null);
                record.setField("sendTypeCode", null);
                // 将快递单号去掉
                record.setField("trackingNumber", null);
                this.sampleDeliveryInfo.trackingNumber = null;
              });
            },
            callback: (val) => {
              let item = {};
              if (val && val.length && val[0]) {
                item = val[0];
              }
              this.sampleInfoDataSet.records.forEach((record) => {
                record.setField("sendTypeCodeMeaning", item.meaning);
                record.setField("sendTypeCode", item.value);
                // 如果不是快递，则将快递单号去掉
                if (item.value !== "EXPRESS_DELIVERY") {
                  record.setField("trackingNumber", null);
                  this.sampleDeliveryInfo.trackingNumber = null;
                }
              });
            }
          },
        },
        {
          formRow: 50,
          fieldName: this.$T("sslm.sample.model.trackingNumber").$D("快递单号"),
          fieldCode: "trackingNumber",
          fieldType: "INPUT",
          disabled: (val, item) => item.sendTypeCode !== "EXPRESS_DELIVERY",
          inputChange: (val, item) => {
            // 初始自动执行一次，存在sampleInfoDataSet还没有初始化的可能
            if (this.sampleInfoDataSet) {
              this.sampleInfoDataSet.records.forEach((record) => {
                record.setField("trackingNumber", item.trackingNumber);
              });
            }
          }
        },
        {
          formRow: 60,
          fieldName: this.$T("sslm.sample.model.supplierRemark").$D("供应商备注"),
          fieldCode: "supplierRemark",
          fieldType: "INPUT"
        },
      ];

      return columns;
    },
    // 样品信息
    getsampleInfoColumns() {
      const columns = [
        {
          formRow: 10,
          fieldCode: "lineNum",
          fieldType: "EMPTY",
          render: (val, item) => {
            let lineHeaderDesc = item.lineNum + ":" + item.itemCode + "-" + item.itemName;
            return <SrmListHeader show-open-tag={false}>
              <span>{lineHeaderDesc}</span>
            </SrmListHeader>;
          }
        },
        {
          formRow: 20,
          fieldName: this.$T("sslm.sample.model.itemDesc").$D("物料说明"),
          fieldCode: "itemDesc",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.uomName").$D("单位"),
          fieldCode: "uomCodeAndName",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.itemCategoryCode").$D("品类代码"),
          fieldCode: "categoryCodes",
          fieldType: "TEXT"
        },
        {
          formRow: 40,
          fieldName: this.$T("sslm.sample.model.itemCategoryName").$D("品类名称"),
          fieldCode: "categoryNames",
          fieldType: "TEXT"
        },
        {
          formRow: 45,
          fieldName: this.$T("sslm.sample.model.reqQuantity").$D("送样需求数量"),
          fieldCode: "reqQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(record.uomPrecision),
        },
        {
          formRow: 50,
          fieldName: this.$T("sslm.sample.model.reqTime").$D("送样需求时间"),
          fieldCode: "reqTime",
          fieldType: "TEXT"
        },
        {
          formRow: 60,
          fieldName: this.$T("sslm.sample.model.tryUseDepartment").$D("试用部门"),
          fieldCode: "tryUseDepartment",
          fieldType: "TEXT"
        },
        {
          formRow: 60,
          fieldName: this.$T("sslm.sample.model.tryUseWorkshop").$D("试用车间"),
          fieldCode: "tryUseWorkshop",
          fieldType: "TEXT"
        },
        {
          formRow: 70,
          fieldName: this.$T("sslm.sample.model.sample.purchaserAttachment").$D("采购方附件"),
          fieldCode: "buyerAttachmentUuid",
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          formRow: 70,
          fieldName: this.$T("sslm.sample.model.attachmentUuid").$D("供应商附件"),
          fieldCode: "vendorAttachmentUuid",
          fieldType: "EMPTY",
          render: (val, item) => <div>{this.$T("sslm.sample.model.attachmentUuid").$D("供应商附件")}：<span style={{
            color: "var(--font-color-primary)"
          }} onClick={(e) => {
            e.stopPropagation();
            this.getSampleVendorAttachmentInfo(item);
          }} >
            <span>{this.$T("hzero.common.upload.txt").$D("上传")}</span>
          </span></div>
        },
        {
          formRow: 80,
          fieldName: this.$T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间"),
          fieldCode: "expectedDeliveryDate",
          fieldType: "DATE_PICKER",
          required: true,
          timePicker: true,
        },
        {
          formRow: 90,
          fieldName: this.$T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式"),
          fieldCode: "sendTypeCode",
          fieldType: "SELECT",
          required:true,
          lovCode:"SSLM.SEND_TYPE_CODE",
          displayField:"sendTypeCodeMeaning",
          options: {
            onClear: (ds) => {
              ds.current.setField("trackingNumber", null);
            },
            callback: (val, valueField, displayField, ds) => {
              if (val && val.length && val[0] && val[0].value !== "EXPRESS_DELIVERY") {
                ds.current.setField("trackingNumber", null);
              }
            },
          }
        },
        {
          formRow: 100,
          fieldName: this.$T("sslm.sample.model.trackingNumber").$D("快递单号"),
          fieldCode: "trackingNumber",
          fieldType: "INPUT",
          //如果是送样类是快递，则允许输入快递单号，否则删除快递单号且将快递单号格置为不可输入
          disabled: (val, item) => item.sendTypeCode !== "EXPRESS_DELIVERY",
        },
        {
          formRow: 110,
          fieldName: this.$T("sslm.sample.model.tryUseResults").$D("试用结果"),
          visible: () => this.sampleBasicInfo.reqStatus === "RETURNED",
          fieldCode: "sampleResultMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 110,
          fieldName: this.$T("sslm.sample.model.sample.tryUseRemark").$D("试用说明"),
          visible: () => this.sampleBasicInfo.reqStatus === "RETURNED",
          fieldCode: "remark",
          fieldType: "TEXT",
        },
        {
          formRow: 120,
          fieldName: this.$T("sslm.sample.model.sample.trialResultsAttachment").$D("试用结果附件"),
          visible: () => this.sampleBasicInfo.reqStatus === "RETURNED",
          fieldCode: "trialResultsUuid",
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
      ];

      return columns;
    },
    // 样品信息行供应商附件信息
    getSampleVendorAttachmentColumns() {
      const columns = [
        {
          formRow: 10,
          fieldName: this.$T("sslm.sample.model.attachmentType").$D("附件类型"),
          fieldCode: "attachmentTypeMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 20,
          fieldName: this.$T("sslm.sample.model.requiredFlag").$D("供应商是否必传"),
          fieldCode: "requiredFlag",
          fieldType: "TEXT",
          render: (val) => {
            let requiredFlagDesc;
            if (val === 1) {
              requiredFlagDesc = this.$T("hzero.common.yes").$D("是");
            } else {
              requiredFlagDesc = this.$T("hzero.common.no").$D("否");
            }
            return requiredFlagDesc;
          }
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.attachmentDesc").$D("附件描述"),
          fieldCode: "attachmentDesc",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          fieldName: this.$T("sslm.sample.model.attachmentUuid").$D("供应商附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          canUpload: true,
          canDelete: true
        },
      ];

      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("hzero.common.save").$D("保存"),
          handler: () => this.handlerPre("save")
        },
        {
          title: this.$T("sslm.sample.view.button.submitCallBack").$D("提交反馈"),
          handler: () => this.handlerPre("commit"),
          fill: true
        },
      ];
    },
  },
  async mounted() {
    this.$loading.show();
    const {
      reqId
    } = this.$route.query;
    this.reqId = reqId;
    await this.initData();
    this.$loading.hide();
  },
  methods: {
    //获取送样反馈基础信息 和 送样信息
    async getsampleBasicInfo() {
      const sampleBasicInfo = await getsampleBasicInfoApi(this.reqId);
      this.sampleBasicInfo = sampleBasicInfo;
      this.sampleDeliveryInfo = sampleBasicInfo;
    },
    //获取样品信息
    getsampleInfo() {
      this.sampleInfoDataSet = new DataSet(sampleInfoDS(this.reqId));
      this.sampleInfoDataSet.refresh();
      // getsampleInfoApi(this.reqId).then((res) => {
      //   this.sampleInfo = res.content;
      // });
    },
    //获取样品信息中供应商附件信息
    // eslint-disable-next-line vue/no-dupe-keys
    getSampleVendorAttachmentInfo(item) {
      this.currentSampleVendorAttachment = new DataSet(sampleVendorAttachmentDS(item));
      this.currentSampleVendorAttachment.refresh(true);
      this.vendorAttachmentPop = true;
    },
    //初始化数据，获取样件基础信息、送样信息、样品信息
    async initData() {
      try {
        await this.getsampleBasicInfo();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
      this.getsampleInfo();
    },
    //按钮
    handlerPre(type) {
      //校验必输
      //预计送达时间是否输入
      if (isEmpty(this.sampleDeliveryInfo.expectedDeliveryDate)) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间") ]);
      }
      //校验送样方式是否输入
      if (isEmpty(this.sampleDeliveryInfo.sendTypeCode)) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式") ]);
      }
      //样品信息必输校验
      if (!this.sampleInfoDataSet.validate()) {
        return;
      }
      if (type === "save") {
        this.sampleFeedbackSave(type);
      } else {
        this.sampleFeedbackSubmmit(type);
      }
    },
    // 保存明细信息
    async sampleFeedbackSave(type) {
      const that = this;
      const saveParams = that.buildParams(type);
      this.$loading.show();
      sampleFeedbacksaveApi(saveParams).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
        } else {
          this.initData();
          this.$notification.open({
            message: this.$T("sslm.sample.view.message.optionSuccess").$D("操作成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 提交反馈
    sampleFeedbackSubmmit() {
      const that = this;
      const saveParams = that.buildParams();
      this.$loading.show();
      sampleFeedbackSubmmitApi(saveParams).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
        } else {
          //this.initData();
          this.$notification.open({
            message: this.$T("sslm.sample.view.message.optionSuccess").$D("操作成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 处理传参
    buildParams(type) {
      let params;
      let oneparam;
      //校验必输
      //预计送达时间是否输入
      if (isEmpty(this.sampleDeliveryInfo.expectedDeliveryDate)) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间") ]);
      }
      //校验送样方式是否输入
      if (isEmpty(this.sampleDeliveryInfo.sendTypeCode)) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.$T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式") ]);
      }
      /*
      //样品信息必输校验
      this.sampleInfo.forEach((item) => {
        if (isEmpty(item.expectedDeliveryDate)) {
          // eslint-disable-next-line new-cap
          Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
            [ this.$T("sslm.sample.model.expectedDeliveryDate").$D("预计送达时间") ]);
        }
        //校验送样方式是否输入
        if (isEmpty(item.sendTypeCode)) {
          // eslint-disable-next-line new-cap
          Exception(this, this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
            [ this.$T("sslm.sample.model.sendTypeCodeMeaning").$D("送样方式") ]);
        }
      });
      */
      // 取出sampleInfo
      let sampleInfo = [];
      this.sampleInfoDataSet.records.forEach((record) => {
        sampleInfo.push({
          ...record.data,
        });
      });
      //保存封装数据格式不同
      oneparam = this.sampleDeliveryInfo;
      oneparam.infoDtoList = sampleInfo;
      if (type === "save") {
        params = oneparam;
      } else {
        params = [
          oneparam
        ];
      }
      return params;
    },
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
  .customize-card {
    padding: 6px 0px 6px 0px;
  }
</style>