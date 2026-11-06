<template>
  <div v-loading="isSubmit" style="height: 100vh">
    <NavHead
      :title="
        $T('sinv.common.model.common.purchasingApprove').$D('非商城采购申请')
      "/>
    <div class="detail-wrap">
      <!-- 内容区 -->
      <srm-scroll-tab class="content">
        <!-- 基本信息 -->
        <srm-scroll-tab-item
          :label="
            $T('ssrc.common.view.message.basicInformation').$D('基本信息')
          ">
          <div class="content-item">
            <div class="purchase-info">
              <div class="content">
                <!-- 个性化组件替换后的代码 -->
                <CustomizeDetail
                  :columns="getBasicInfoColumns"
                  :data-source="purchasingInfo"/>
              </div>
            </div>
          </div>
        </srm-scroll-tab-item>

        <!-- 申请信息 -->
        <srm-scroll-tab-item
          :show-title="false"
          :label="$T('mallf.common.view.myRequestInfo').$D('申请信息')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("mallf.common.view.myRequestInfo").$D("申请信息") }}
            <span v-if="statusFlag=='NEW'" class="new" @click="createLineBill">
              <em class="srm-icon icon-plus" />{{
                $T("mallf.common.view.new").$D("新建")
              }}
            </span>
            <span v-if="statusFlag=='NEW'&&isEdit" class="edit" @click="editLineBill">
              <em class="srm-icon icon-edit" />{{
                $T("mallf.common.view.edit").$D("编辑")
              }}
            </span>
            <div v-if="statusFlag=='NEW'&&!isEdit" style="display: flex">
              <span @click="cancelEditLineBill">{{
                $T("mallf.common.view.cancleEdit").$D("取消编辑")
              }}</span>
              <SrmCheckbox v-model="isSelectAll" style="width: auto">
                {{
                  $T("ssrc.common.button.selectAll").$D("全选")
                }}
              </SrmCheckbox>
            </div>
          </div>
          <div
            v-for="(purchase) in qschouReqLineDTOList"
            :key="purchase.lineNum"
            class="content-item">
            <div class="purchase-info">
              <div class="content">
                <!-- 个性化组件替换后的代码 -->
                <CustomizeDetail
                  :columns="getApplyInfoColumns"
                  :data-source="purchase"/>
              </div>
              <srm-blank size="large" theme="fill" />
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <SrmBottomHandler v-if="isRouterAlive" :btn-arr="getBtnArr" />
  </div>
</template>

<script>
import {
  getApplyBillReceiveInfoApi,
  getEasyPreparePurchasingDetailApi,
  createPurchasingBillApi,
  deleteLinePurchasingBillApi,
  cancelVertificatePurchasingBillApi,
  sumbitPurchasingBillApi,
  vertificatePurchasingBillApi,
  deletePurchasingBillApi
} from "../api/index";
import uuid from "uuid";
import moment from "moment";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.common","ssrc.common","hebk.draft","scux.visitArchive","sodr.common","hwfp.commom","sslm.sampleHead","hwfm.commom","sprm.common","sslm.supplierInfoChange","scux.soSend","smpc.product","mallf.purchaseDetail","ssrc.projectSetup","sinv.common","sqam.common","scux.watsons","ssrc.common","hzero.common","ssrc.common","spcm.common","mallf.common","hipspfm.createDelivery" ],
  name: "EasyPreparePurchasingApproveDetail",
  components: {
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      purchasingInfo: {},
      reqHeaderId: "",
      isShow: false,
      isEdit: true,
      getBtnArr: [],
      receiveInfo:[],
      checkFlag:false,
      statusFlag:"NEW",
      isCreate:false,
      qschouReqLineDTOList:[],
      count:0,
      isActualDelete:false,
      submitTitle:this.$T("ssrc.common.button.submit").$D("提交"),
      isSubmit:false,
      isRouterAlive:true,
      isCreateFlag: false,
    };
  },
  computed: {
    //基本信息
    getBasicInfoColumns() {
      const columns = [
        {
          fieldName: "",
          fieldCode: "attachmentInformationHeader",
          editable:this.statusFlag === "NEW" || this.statusFlag === "WRITTEN_OFF",
          render:(val)=>{
            return (
              <SrmButton fill>
                <SrmUpload
                  onShowFilePopup={this.viewHeaderAttachment}
                  can-delete={true}
                  attachment-uuid={val}
                  show-count={false}
                  show-icon={false}
                  can-upload={true}
                  desc-title={
                    this.$T(
                      "spcm.common.view.message.title.purchaseAttachmentList"
                    ).$D("附件信息")}
                />
              </SrmButton>
            );
          }
        },
        {
          fieldName: "标题",
          fieldCode: "title",
          fieldType: "INPUT",
          required: this.statusFlag !== "WRITTEN_OFF",
          editable:this.statusFlag === "NEW",
          langCode: "ssrc.common.title",
        },
        {
          fieldName: "",
          fieldCode: "titleDescription",
          fieldType: "INPUT",
          editable: false,
        },
        {
          fieldName: "申请日期",
          fieldCode: "reqDate",
          editable: false,
          render:(val)=>{
            return <span>{val && val.split(" ")[0]}</span>;
          },
          langCode: "hebk.draft.model.draft.applicationDate",
        },
        {
          fieldName: "申请单号",
          fieldCode: "reqNum",
          fieldType: "INPUT",
          editable: false,
          langCode: "scux.visitArchive.model.visitArchive.visitApplicationNum",
        },
        {
          fieldName: "申请类型",
          fieldCode: "reqType",
          fieldType: "SELECT",
          lovCode: "SCUX.QSCHOU.APPLY_TYPE",
          langCode: "sodr.common.model.common.attributeBigint3",
          displayField: "reqTypeMeaning",
          disabled:this.statusFlag !== "NEW",
          required: this.statusFlag !== "WRITTEN_OFF",
        },
        {
          fieldName: "申请人",
          fieldCode: "reqByName",
          fieldType: "INPUT",
          editable: false,
          langCode: "hwfp.commom.model.apply.owner",
        },
        {
          fieldName: "申请人电话",
          fieldCode: "phone",
          fieldType: "INPUT_NUMBER",
          editable: false,
          langCode: "sslm.sampleHead.model.reqUserPhone",
        },
        {
          fieldName: "部门",
          fieldCode: "unitId",
          langCode: "hwfm.commom.modal.unit",
          fieldType: "LOV",
          lovCode: "SCUX.QSCHOU.SBUD_UNIT",
          required: this.statusFlag !== "WRITTEN_OFF",
          displayField: "departmentName",
          options: {
            multiple: false,
            displayField: "unitName", // 主键
            subDisplayField: "unitCode",
            valueField: "unitId",
            inputChange: this.changeFieldCallBack,
            callback: function ([ item ]) {
              this.inputChange(item);
            },
          },
          disabled:this.statusFlag !== "NEW",
        },
        {
          fieldName: "预估申请总额",
          fieldCode: "reqAmount",
          fieldType: "INPUT_NUMBER",
          editable: false,
          langCode: "hwfm.commom.model.view.budget.price",
        },
        {
          fieldName: "实际采购总额",
          fieldCode: "purchaseAmount",
          fieldType: "INPUT_NUMBER",
          editable:false,
          langCode: "hwfm.commom.model.view.leadershipReport.title",
        },
        {
          fieldName: "申请说明",
          fieldCode: "comments",
          fieldType: "INPUT",
          editable:this.statusFlag === "NEW",
          langCode: "sprm.common.model.common.applyExplain",
        },
        {
          fieldName: "申请状态",
          fieldCode: "status",
          fieldType: "LOV",
          lovCode:"SCUX.QSCHOU.APPLY_STATUS",
          editable: false,
          displayField:"statusMeaning",
          langCode: "sslm.supplierInfoChange.view.supplier.applicationStatus",
        },
      ];

      return columns;
    },
    //申请信息
    getApplyInfoColumns() {
      const columns = [
        {
          fieldName: "",
          fieldCode: "attachmentInformationLine",
          required: this.statusFlag === "WRITTEN_OFF",
          editable:this.statusFlag === "NEW" || this.statusFlag === "WRITTEN_OFF",
          render:(val,record)=>{
            return (
              <div style="display: flex">
                {
                  this.isShow &&
                <SrmCheckbox
                  value={record.checked}
                  // eslint-disable-next-line no-return-assign
                  onInput={(value)=>record.checked = value}
                  style="width: auto"/>
                }
                <SrmButton fill>
                  <SrmUpload
                    onShowFilePopup={this.viewLineAttachment(record)}
                    can-delete={true}
                    attachment-uuid={val}
                    show-count={false}
                    show-icon={false}
                    can-upload={true}
                    desc-title={
                      this.$T(
                        "ssrc.common.view.message.title.purchaseAttachmentList"
                      ).$D("附件信息")}
                  />
                </SrmButton>
              </div>
            );
          },
          formRow: 10,
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          fieldType: "INPUT_NUMBER",
          editable: false,
          langCode: "ssrc.common.model.soSend.lineNumber",
          formRow: 20,
        },
        {
          fieldName: "物资类型",
          fieldCode: "materialType",
          fieldType: "EMPTY",
          lovCode: "SMAL.CATALOG_THREE",
          langCode: "ssrc.common.model.materialType",
          displayField: "materialTypeMeaning",
          render:(val,record)=>{
            return (
              this.statusFlag !== "NEW" ?
                <SrmLovField disabled v-model={record.materialType} display={record.materialTypeMeaning} code="SMAL.CATALOG_THREE" placeholder="请选择物资类型"/> :
                <SrmLovField v-model={record.materialType} display={record.materialTypeMeaning} code="SMAL.CATALOG_THREE" placeholder="请选择物资类型"/>
            );
          },
          required: this.statusFlag !== "WRITTEN_OFF",
          formRow: 30,
        },
        {
          fieldName: "物资名称",
          fieldCode: "materialName",
          fieldType: "INPUT",
          langCode: "ssrc.common.view.goodsOfName",
          required: this.statusFlag !== "WRITTEN_OFF",
          editable:this.statusFlag === "NEW",
          formRow: 40,
        },
        {
          fieldName: "尺寸",
          fieldCode: "size",
          fieldType: "INPUT",
          langCode: "ssrc.common.model.common.size",
          required: this.statusFlag !== "WRITTEN_OFF",
          editable:this.statusFlag === "NEW",
          formRow: 50,
        },
        {
          fieldName: "申请数量",
          fieldCode: "reqQuantity",
          fieldType: "INPUT_NUMBER",
          langCode: "ssrc.common.model.common.purchaseQuantity",
          inputChange:(val,record)=>{
            record.estimatedLinePrice = val * record.estimatedUnitPrice;
            record.actualPurchaseQuantity = val;
            if (this.qschouReqLineDTOList.length > 0) {
              const list = this.qschouReqLineDTOList.map((item)=>{
                return Number(item.estimatedLinePrice);
              });
              if (list.length > 0) {
                const reqAmount = list.reduce((prev,cur)=>{
                  return prev + cur;
                });
                if (isNaN(reqAmount)) {
                  return;
                }
                this.purchasingInfo.reqAmount = reqAmount || 0;
              }
            }
          },
          required: this.statusFlag !== "WRITTEN_OFF",
          editable:this.statusFlag === "NEW",
          formRow: 60,
        },
        {
          fieldName: "实际采购数量",
          fieldCode: "actualPurchaseQuantity",
          langCode: "ssrc.common.model.common.actual.purchaseQuantity",
          fieldType: "INPUT_NUMBER",
          disabled:this.statusFlag !== "WRITTEN_OFF",
          inputChange:(val,record)=>{
            record.actualLinePrice = val * record.actualUnitPrice;
            if (this.qschouReqLineDTOList.length > 0) {
              const list = this.qschouReqLineDTOList.map((item)=>{
                return Number(item.actualLinePrice);
              });
              if (list.length > 0) {
                const purchaseAmount = list.reduce((prev,cur)=>{
                  return prev + cur;
                });
                if (isNaN(purchaseAmount)) {
                  return;
                }
                this.purchasingInfo.purchaseAmount = purchaseAmount || 0;
              }
            }
          },
          required: this.statusFlag === "WRITTEN_OFF",
          formRow: 70,
        },
        {
          fieldName: "预估单价（含税）",
          fieldCode: "estimatedUnitPrice",
          fieldType: "INPUT_NUMBER",
          disabled:this.statusFlag !== "NEW",
          langCode: "ssrc.common.model.common.taxIncludedUnitPrice",
          inputChange:(val,record)=>{
            record.actualUnitPrice = val;
            record.estimatedLinePrice = val * record.reqQuantity;
            if (this.qschouReqLineDTOList.length > 0) {
              const list = this.qschouReqLineDTOList.map((item)=>{
                return Number(item.estimatedLinePrice);
              });
              if (list.length > 0) {
                const reqAmount = list.reduce((prev,cur)=>{
                  return prev + cur;
                });
                if (isNaN(reqAmount)) {
                  return;
                }
                this.purchasingInfo.reqAmount = reqAmount || 0;
              }
            }
          },
          formRow: 80,
          required: this.statusFlag !== "WRITTEN_OFF",
        },
        {
          fieldName: "实际单价（含税）",
          fieldCode: "actualUnitPrice",
          fieldType: "INPUT_NUMBER",
          disabled:this.statusFlag !== "WRITTEN_OFF",
          inputChange:(val,record)=>{
            record.actualLinePrice = record.actualPurchaseQuantity * val;
            if (this.qschouReqLineDTOList.length > 0) {
              const list = this.qschouReqLineDTOList.map((item)=>{
                return Number(item.actualLinePrice);
              });
              if (list.length > 0) {
                const purchaseAmount = list.reduce((prev,cur)=>{
                  return prev + cur;
                });
                if (isNaN(purchaseAmount)) {
                  return;
                }
                this.purchasingInfo.purchaseAmount = purchaseAmount || 0;
              }
            }
          },
          required: this.statusFlag === "WRITTEN_OFF",
          langCode: "ssrc.common.model.common.actualIncludedUnitPrice",
          formRow: 90,
        },
        {
          fieldName: "预估行金额",
          fieldCode: "estimatedLinePrice",
          fieldType: "INPUT_NUMBER",
          disabled:true,
          langCode: "ssrc.common.model.projectSetup.estimatedAmount",
          formRow: 100,
        },
        {
          fieldName: "实际行金额",
          fieldCode: "actualLinePrice",
          fieldType: "INPUT_NUMBER",
          editable:false,
          langCode: "ssrc.common.model.projectSetup.actualAmount",
          formRow: 110,
        },
        {
          fieldName: "需求日期",
          fieldCode: "demandDate",
          fieldType: "DATE_PICKER",
          langCode: "ssrc.common.model.common.needByDate",
          required: this.statusFlag !== "WRITTEN_OFF",
          disabled:this.statusFlag !== "NEW",
          formRow: 120,
        },
        {
          fieldName: "物资用途",
          fieldCode: "materialUse",
          fieldType: "INPUT",
          langCode: "ssrc.common.model.common.materialUse",
          required: this.statusFlag !== "WRITTEN_OFF",
          disabled:this.statusFlag !== "NEW" ,
          formRow: 130,
        },
        {
          fieldName: "收货地址",
          fieldCode: "address",
          fieldType: "LOV",
          lovCode: "SCUX.QSCHOU.CUSTOMER_ADDRESS",
          langCode: "ssrc.common.model.common.receiveAddress",
          inputChange:(val,record)=>{
            this.receiveInfo.forEach((item)=>{
              if (item.address === record.address) {
                record.receiver = item.receiver;
                record.receiverPhone = item.receiverphone;
              }
            });
          },
          displayField: "address",
          options:{
            valueField: "address",
            displayField:"address",
            queryParams:{
              ownedBy: SrmUtil.getUserInfo().id
            },
          },
          required: this.statusFlag !== "WRITTEN_OFF",
          disabled:this.statusFlag !== "NEW",
          formRow: 140,
        },
        {
          fieldName: "收货人",
          fieldCode: "receiver",
          fieldType: "INPUT",
          langCode: "ssrc.common.docAuthExport.model.docAuth.receiverName",
          disabled:true,
          formRow: 150,
        },
        {
          fieldName: "收货电话",
          fieldCode: "receiverPhone",
          fieldType: "INPUT",
          langCode: "ssrc.common.model.common.receivePhone",
          disabled:true,
          formRow: 160,
        },
      ];

      return columns;
    },
    // 新建单据按钮
    createBillBtnArr() {
      return [
        {
          type: "success",
          title: this.$T("ssrc.common.button.save").$D("保存"),
          handler: this.saveBill,
        },
        {
          title: this.$T("ssrc.common.button.submit").$D("提交"),
          handler: this.submitBill,
        },
      ];
    },
    //已取消按钮
    getCancelBtnArr() {
      return [
        {
          type: "cancel",
          title: this.$T("ssrc.common.button.canceled").$D("已取消"),
        },
      ];
    },
    //已完成按钮
    getCompletedBtnArr() {
      return [
        {
          type: "cancel",
          title: this.$T("ssrc.common.button.completed").$D("已完成"),
        },
      ];
    },
    // 新建状态按钮
    getNewBtnArr() {
      return [
        {
          type: "success",
          title: this.$T("ssrc.common.button.save").$D("保存"),
          handler: this.saveBill,
        },
        {
          title: this.submitTitle,
          handler: this.submitBill,
        },
        {
          type: "danger",
          title: this.$T("ssrc.common.button.toDelete").$D("删除"),
          handler: this.deleteBill,
        },
      ];
    },
    // 已提交状态按钮
    getSumbitedBtnArr() {
      return [
        {
          type: "cancel",
          title: this.$T("ssrc.common.button.cancel").$D("取消"),
          handler: ()=> this.cancelBill(1),
        },
      ];
    },
    // 待核销状态按钮
    getCheckOffBtnArr() {
      return [
        {
          type: "cancel",
          title: this.$T("ssrc.common.button.cancel").$D("取消"),
          handler:()=> this.cancelBill(0),
        },
        {
          type: "success",
          title: this.$T("ssrc.common.button.checkOff").$D("核销"),
          handler: this.checkBill,
        },
      ];
    },
    // 删除行信息按钮
    deleteLineBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("ssrc.common.button.delete").$D("删除"),
          handler: this.deleteLine,
        },
      ];
    },
    //选中列表项的数量
    checkedSize() {
      return (
        this.qschouReqLineDTOList.length > 0 &&
        this.qschouReqLineDTOList.reduce(
          (pre, item) => pre + (item.checked ? 1 : 0),
          0
        )
      );
    },
    //新建未保存行信息的列表项
    unsaveCheckIds() {
      if (this.qschouReqLineDTOList) {
        return this.qschouReqLineDTOList.map((item) => {
          if (item.checked) {
            return item.lineNum;
          }
        }).filter((item) => {
          return item;
        });
      }
      return [];
    },
    //选中列表项的数据
    checkedIds() {
      if (this.qschouReqLineDTOList) {
        return this.qschouReqLineDTOList.map((item) => {
          if (item.checked) {
            return item.reqLineId;
          }
        }).filter((item) => {
          return item;
        });
      }
      return [];
    },
    //是否全部选中
    isSelectAll: {
      get() {
        // eslint-disable-next-line eqeqeq
        return (
          this.qschouReqLineDTOList.length > 0 &&
          this.qschouReqLineDTOList.length === this.checkedSize
        );
      },
      set(value) {
        this.selectAllOrNotAll(value);
      },
    },
  },
  mounted() {
    this.reqHeaderId = this.$route.query.reqHeaderId;
    this.isCreateFlag = Number(this.reqHeaderId) === 0;
    this.getApplyBillReceiveInfo();
    this.getEasyPreparePurchasingDetail();
  },
  methods: {
    //新建行信息表单
    createLineBill() {
      this.qschouReqLineDTOList.unshift({});
      this.count = this.qschouReqLineDTOList.length;
      this.$set(this.qschouReqLineDTOList,0,{ checked: false,lineNum: this.count,attachmentInformationLine:"" });
    },
    //编辑行信息表单
    editLineBill() {
      this.isShow = true;
      this.isEdit = false;
      this.getBtnArr = this.deleteLineBtnArr;
    },
    //取消编辑
    cancelEditLineBill() {
      this.isEdit = true;
      this.isShow = false;
      if (this.isCreateFlag) {
        this.getBtnArr = this.createBillBtnArr;
      } else {
        this.getBtnArr = this.getNewBtnArr;
      }
    },
    //全选按钮的操作
    selectAllOrNotAll(isChecked) {
      this.qschouReqLineDTOList.forEach((item) => {
        item.checked = isChecked;
      });
    },
    //字段校验
    checkField() {
      this.checkFlag = false;
      let applyAlert = "";
      const checkBaiscList = this.getBasicInfoColumns.map((item)=>{
        if (item.required) {
          return item;
        }
      }).filter((item) => {
        return item;
      });
      const checkApplyList = this.getApplyInfoColumns.map((item)=>{
        if (item.required) {
          return item.fieldCode;
        }
      }).filter((item) => {
        return item;
      });
      // eslint-disable-next-line no-unused-vars
      for (let basic of checkBaiscList) {
        if (!this.purchasingInfo[basic.fieldCode]) {
          this.$notification.open({
            message: `${this.$T("ssrc.common.view.validation.fillRequire").$D(
              "请填写"
            )} ${basic.fieldName}`,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 2,
          });
          this.checkFlag = true;
          return;
        }
      }
      let isBreak = false;
      // eslint-disable-next-line no-unused-vars
      for (let item of checkApplyList) {
        // eslint-disable-next-line no-unused-vars
        for (let purchase of this.qschouReqLineDTOList) {
          if (!purchase[item]) {
            // eslint-disable-next-line no-unused-vars
            for (let apply of this.getApplyInfoColumns) {
              if (item === apply.fieldCode) {
                if (apply.fieldCode === "attachmentInformationLine") {
                  applyAlert = this.$T(
                    "ssrc.common.view.message.title.lineAttachment"
                  ).$D("行信息附件信息");
                  break;
                }
                applyAlert = apply.fieldName;
                isBreak = true;
                break;
              }
            }
            this.$notification.open({
              message: `${this.$T("ssrc.common.view.validation.fillRequire").$D(
                "请填写")}${applyAlert}`,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2,
            });
            this.checkFlag = true;
            break;
          }
        }
        if (isBreak) {
          break;
        }
      }

    },
    //获取非商城采购申请数据
    async getEasyPreparePurchasingDetail() {
      if (this.reqHeaderId === 0) {
        this.getBtnArr = this.createBillBtnArr;
        const purInfo = {};
        purInfo.qschouReqLineDTOList = [];
        purInfo.reqByName = SrmUtil.getUserInfo().realName;
        purInfo.phone = SrmUtil.getUserInfo().phone;
        purInfo.reqDate = moment().format("YYYY-MM-DD hh:mm:ss");
        purInfo.attachmentInformationHeader = "";
        await createPurchasingBillApi({ reqBy: SrmUtil.getUserInfo().id }).then((res)=>{
          purInfo.status = res.status;
          purInfo.reqHeaderId = res.reqHeaderId;
          purInfo.reqNum = res.reqNum;
          purInfo.department = res.department;
          purInfo.unitId = res.unitId;
          this.reqHeaderId = res.reqHeaderId;
        });
        await getEasyPreparePurchasingDetailApi(this.reqHeaderId).then((res)=>{
          purInfo.departmentName = res.departmentName;
        });
        this.purchasingInfo = purInfo;
        this.isCreate = true;
      } else {
        this.$loading.show();
        getEasyPreparePurchasingDetailApi(this.reqHeaderId).then((res) => {
          if (res && res.qschouReqLineDTOList) {
            if (res.status === "NEW" || res.status === "REJECTED") {
              this.getBtnArr = this.getNewBtnArr;
              this.statusFlag = "NEW";
            } else if (res.status === "SUBMITTED") {
              this.getBtnArr = this.getSumbitedBtnArr;
              this.statusFlag = "SUBMITTED";
            } else if (res.status === "CANCELLED") {
              this.getBtnArr = this.getCancelBtnArr;
              this.statusFlag = "CANCELLED";
            } else if (res.status === "COMPLETED") {
              this.getBtnArr = this.getCompletedBtnArr;
              this.statusFlag = "COMPLETED";
            } else {
              this.getBtnArr = this.getCheckOffBtnArr;
              this.statusFlag = "WRITTEN_OFF";
            }
            for (let i = 0; i < res.qschouReqLineDTOList.length; i++) {
              res.qschouReqLineDTOList[i].lineNum = i + 1;
              res.qschouReqLineDTOList[i].checked = false;
              res.qschouReqLineDTOList[i].demandDate = res.qschouReqLineDTOList[i].demandDate && res.qschouReqLineDTOList[i].demandDate.split(" ")[0];
            }
            this.purchasingInfo = res;
            const list = this.purchasingInfo.qschouReqLineDTOList;
            this.qschouReqLineDTOList = list.map((item)=>({
              ...item,
              actualPurchaseQuantity: item.actualPurchaseQuantity || item.reqQuantity,
              actualUnitPrice:item.actualUnitPrice || item.estimatedUnitPrice,
              actualLinePrice:(item.actualPurchaseQuantity || item.reqQuantity) * (item.actualUnitPrice || item.estimatedUnitPrice)
            }));
            const actualPriceList = this.qschouReqLineDTOList.map((item)=>{
              return item.actualLinePrice;
            });
            const prePriceList = this.qschouReqLineDTOList.map((item)=>{
              return item.estimatedLinePrice;
            });
            if (actualPriceList.length > 0) {
              this.purchasingInfo.purchaseAmount = actualPriceList.reduce((prev,cur)=>{
                return prev + cur;
              });
            }
            if (prePriceList.length > 0) {
              this.purchasingInfo.reqAmount = prePriceList.reduce((prev,cur)=>{
                return prev + cur;
              });
            }
            this.$loading.hide();
          }
        });
      }
    },
    //保存非商城采购单
    saveBill() {
      this.$hips.dialog.confirm({
        closable: false,
        title: this.$T("ssrc.common.message.tip").$D("提示"),
        content: this.$T("ssrc.common.message.confirm.save").$D("确认保存吗？"),
        okText: this.$T("ssrc.common.button.confirm").$D("确定"),
        cancelText: this.$T("ssrc.common.view.button.cancel").$D("取消"),
        onOk: () => {
          this.checkField();
          if (!this.checkFlag) {
            if (this.qschouReqLineDTOList.length === 0) {
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.lineDataRequire").$D(
                  "请增加并填写行数据！"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
              return;
            }
            this.purchasingInfo.qschouReqLineDTOList = this.qschouReqLineDTOList;
            if (this.isCreate) {
              if (this.purchasingInfo.reqDate.indexOf === -1) {
                this.purchasingInfo.reqDate = this.purchasingInfo.reqDate + " 00:00:00";
              }
              this.purchasingInfo.reqBy = SrmUtil.getUserInfo().id;
              this.purchasingInfo.reqHeaderId = this.reqHeaderId;
            }
            // eslint-disable-next-line no-unused-vars
            for (let item of this.purchasingInfo.qschouReqLineDTOList) {
              if (item.demandDate && item.demandDate.indexOf("00:00:00") === -1) {
                item.demandDate = `${item.demandDate} 00:00:00`;
              }
            }
            if (!this.purchasingInfo.currency) {
              this.purchasingInfo.currency = "CNY";
            }
            if (!this.purchasingInfo.currencyMeaning) {
              this.purchasingInfo.currencyMeaning = this.$T("ssrc.common.model.CNY").$D("人民币");
            }
            createPurchasingBillApi(this.purchasingInfo).then(() => {
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.saveSuccess").$D(
                  "保存成功"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
              if (this.isCreate) {
                setTimeout(() => {
                  this.$router.replace("/EasyPreparePurchasingApproveList");
                }, 2000);
                localStorage.setItem("status","new");
              }
              this.getEasyPreparePurchasingDetail();
            });
          }
        },
        onCancel() {
          // on cancel
        },
      });
    },
    //取消表单按钮
    cancelBill(status) {
      this.$hips.dialog.confirm({
        closable: false,
        title: this.$T("ssrc.common.message.tip").$D("提示"),
        content: this.$T("ssrc.common.message.confirm.cancel").$D(
          "确认取消吗？"
        ),
        okText: this.$T("ssrc.common.button.confirm").$D("确定"),
        cancelText: this.$T("ssrc.common.view.button.cancel").$D("取消"),
        onOk: () => {
          this.purchasingInfo.summitFlag = status;
          cancelVertificatePurchasingBillApi(this.purchasingInfo).then(
            () => {
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.cancelSuccess").$D(
                  "取消成功"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
              setTimeout(() => {
                this.$router.replace("/EasyPreparePurchasingApproveList");
              }, 2000);
            }
          );
        },
        onCancel() {
          // on cancel
        },
      });
    },
    //核销非商城采购单
    checkBill() {
      this.$hips.dialog.confirm({
        closable: false,
        title: this.$T("ssrc.common.message.tip").$D("提示"),
        content: this.$T("ssrc.common.message.confirm.writeoff").$D(
          "确认核销吗？"
        ),
        okText: this.$T("ssrc.common.button.confirm").$D("确定"),
        cancelText: this.$T("ssrc.common.view.button.cancel").$D("取消"),
        onOk: async () => {
          this.checkField();
          if (!this.checkFlag) {
            if (Number(this.purchasingInfo.purchaseAmount) > Number(this.purchasingInfo.reqAmount)) {
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.limitPurchaseAmount").$D(
                  "实际购买总金额不能大于预计总金额，请重新填写！"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
            } else {
              this.purchasingInfo.qschouReqLineDTOList = this.qschouReqLineDTOList;
              vertificatePurchasingBillApi(this.purchasingInfo).then(
                (res) => {
                  if (res && res.failed) {
                    this.$notification.open({
                      message:res.message,
                      description: "",
                      // eslint-disable-next-line no-undef
                      key,
                      class: "notification",
                      duration: 2,
                    });
                  } else {
                    this.$notification.open({
                      message: this.$T("ssrc.common.view.validation.writeoffSuccess").$D(
                        "核销成功"
                      ),
                      description: "",
                      // eslint-disable-next-line no-undef
                      key,
                      class: "notification",
                      duration: 2,
                    });
                    setTimeout(() => {
                      this.$router.replace("/EasyPreparePurchasingApproveList");
                    }, 2000);
                  }
                }
              );
            }
          }
        },
        onCancel() {
          // on cancel
        },
      });
    },
    //提交非商城采购单
    submitBill() {
      this.$hips.dialog.confirm({
        closable: false,
        title: this.$T("ssrc.common.message.tip").$D("提示"),
        content: this.$T("ssrc.common.message.confirm.sumbit").$D(
          "确认提交吗？"
        ),
        okText: this.$T("ssrc.common.button.confirm").$D("确定"),
        cancelText: this.$T("ssrc.common.view.button.cancel").$D("取消"),
        onOk:  async () => {
          this.checkField();
          if (!this.checkFlag) {
            if (this.qschouReqLineDTOList.length === 0) {
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.lineDataRequire").$D(
                  "请增加并填写行数据！"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
              return;
            }
            this.submitTitle = this.$T("ssrc.common.button.submiting").$D("提交中");
            this.isSubmit = true;
            this.getBtnArr = this.getNewBtnArr;
            // eslint-disable-next-line no-unused-vars
            for (let item of this.qschouReqLineDTOList) {
              if (item.demandDate && item.demandDate.indexOf("00:00:00") === -1) {
                item.demandDate = `${item.demandDate} 00:00:00`;
              }
            }
            this.purchasingInfo.qschouReqLineDTOList = this.qschouReqLineDTOList;
            if (!this.purchasingInfo.currency) {
              this.purchasingInfo.currency = "CNY";
            }
            if (!this.purchasingInfo.currencyMeaning) {
              this.purchasingInfo.currencyMeaning = this.$T("ssrc.common.model.CNY").$D("人民币");
            }
            sumbitPurchasingBillApi(this.purchasingInfo).then((res)=>{
              this.submitTitle = this.$T("ssrc.common.button.submit").$D("提交");
              this.isSubmit = false;
              this.getBtnArr = this.getNewBtnArr;
              if (res && res.failed) {
                this.$notification.open({
                  message:res.message,
                  description: "",
                  // eslint-disable-next-line no-undef
                  key,
                  class: "notification",
                  duration: 3,
                });
                return;
              }
              this.$notification.open({
                message: this.$T("ssrc.common.view.validation.sumbitSuccess").$D(
                  "提交成功"
                ),
                description: "",
                // eslint-disable-next-line no-undef
                key,
                class: "notification",
                duration: 2,
              });
              setTimeout(() => {
                this.$router.replace("/EasyPreparePurchasingApproveList");
              }, 2000);
            });
          }
        },
        onCancel() {
          // on cancel
        },
      });
    },
    //删除行信息
    deleteLine() {
      this.isActualDelete = false;
      if (this.checkedSize <= 0) {
        return;
      }
      // eslint-disable-next-line no-unused-vars
      for (let item of this.qschouReqLineDTOList) {
        if (item.checked && item.reqLineId) {
          this.isActualDelete = true;
        }
      }
      if (this.isActualDelete) {
        deleteLinePurchasingBillApi(this.checkedIds).then(() => {
          this.$notification.open({
            message: this.$T("ssrc.common.view.validation.deleteSuccess").$D(
              "删除成功"
            ),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 2,
          });
        });
      }
      this.qschouReqLineDTOList = this.qschouReqLineDTOList.filter((item)=>{
        return !item.checked;
      });
    },
    //删除非商城采购单
    deleteBill() {
      this.$hips.dialog.confirm({
        closable: false,
        title: this.$T("ssrc.common.message.tip").$D("提示"),
        content: this.$T("ssrc.common.message.confirm.delete").$D(
          "确认删除吗？"
        ),
        okText: this.$T("ssrc.common.button.confirm").$D("确定"),
        cancelText: this.$T("ssrc.common.view.button.cancel").$D("取消"),
        onOk:()=> {
          deletePurchasingBillApi(this.reqHeaderId).then(()=>{
            this.$notification.open({
              message: this.$T("ssrc.common.view.validation.deleteSuccess").$D(
                "删除成功"
              ),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 2,
            });
            setTimeout(() => {
              this.$router.replace("/EasyPreparePurchasingApproveList");
            }, 2000);
          });
        },
        onCancel() {
          // on cancel
        },
      });
    },
    // 查看头信息附件
    viewHeaderAttachment() {
      this.purchasingInfo.attachmentInformationHeader = this.purchasingInfo.attachmentInformationHeader || uuid();
    },
    // 查看行信息附件
    viewLineAttachment(lineInfo) {
      return ()=>{
        lineInfo.attachmentInformationLine = lineInfo.attachmentInformationLine || uuid();
      };
    },
    changeFieldCallBack(obj) {
      this.purchasingInfo["unitId"] = obj.unitId;
      this.purchasingInfo["departmentName"] = obj.unitName;
      this.purchasingInfo["department"] = obj.unitCode;
    },
    //获取非商城采购申请单据收货信息-移动端
    getApplyBillReceiveInfo() {
      getApplyBillReceiveInfoApi().then((res)=>{
        this.receiveInfo = res.content;
      });
    }
  },
};
</script>

<style scoped lang="stylus">
>>> .customize-detail .form-item .label{
  font-size: 14px;
}
>>> .customize-detail .form-item:first-of-type{
  display:flex;
}

>>> .srm-field-wrapper-small {
  padding: 0;
}

>>> .srm-tag-mid {
  margin-right: 12px;
}

>>> .srm-tag-fill-info {
  background: #f6f6f6;
  color: #333;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}

>>> .srm-upload-title {
  color: #fff;
}

>>> .srm-tab-pane-title {
  background-color: rgba(240, 242, 245, 1) !important;
}

>>> .text-field {
  line-height: 20px;
  background: #f6f6f6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px;
}

>>> .srm-scroll-tab-item-title .srm-check-box-button-checked-checkbox {
  padding-top: 0 !important;
}
>>> .srm-loading{
  z-index:6 !important;
}
>>> .srm-loading-box{
  position: fixed;
  right: 24px;
  bottom: 24px;
}
.new {
  color: #276ef1;
}

.edit {
  color: #276ef1;
}

.delete {
  color: var(--color-other-default) !important;
}

.disable-delete {
  color: var(--color-bg-default-f);
}

.detail-wrap {
  height: calc(100vh - 100px);
  overflow: scroll;

  .purchase-info {
    width: 100%;
    overflow-y: auto;
    background: #F0F2F5;

    .content {
      padding-left: 15px;
    }
  }

  .message {
    width: 345px;
    height: 24px;
    font-size: 10px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    text-align: left;
    color: #e11900;
    line-height: 12px;
    background: #ffefed;
  }
}
</style>
