<template>
  <section class="mainDetail" >
    <div class="contentWrap wrapper">
      <srm-scroll-tab class="content">
        <!-- 基础信息 -->
        <srm-scroll-tab-item class="infoContent" :label="$T('ssrc.bidHall.view.tab.baseInfos').$D('基础信息')">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-else>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getBasicInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.CALIBRATION_APPROVAL.BASIC_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 其他信息 -->
        <srm-scroll-tab-item class="infoContent"
                             :label="$T('ssrc.bidHall.model.bidHall.otherSupplementaryIssues').$D('其它信息')">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-else>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getOtherInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.CALIBRATION_APPROVAL.OTHER_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 物料明细 -->
        <srm-scroll-tab-item class="infoContent" :label="$T('ssrc.bidHall.view.message.tab.itemDetails').$D('物料明细')">
          <div
            v-if="JSON.stringify(materialDetail) === '[]'"
            class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-else class="card">
            <div v-for="(item,index) in materialDetail" :key="index">
              <!-- 个性化组件替换后的代码 -->
              <customize :need-padding="true" :columns="getItemsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.CALIBRATION_APPROVAL.ITEMS_INFO"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 投标信息 -->
        <srm-scroll-tab-item class="infoContent bidInfo" :label="$T('hipspfm.workFlowbidHall.view.message.tab.bidDetails').$D('投标信息')">
          <div v-if="JSON.stringify(bidInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.workFlow.view.message.noItemLineInfo").$D("暂无投标信息") }}</span>
          </div>
          <div v-else>
            <srm-collapse :max-open="1">
              <srm-collapse-item v-for="(item,index) in bidInfo" :key="index" :name="index">
                <div>
                  <customize :need-padding="true" :columns="getBidTitleColumns" :data-source="item"/>
                </div>
                <div slot="content">
                  <div
                    v-for="(li,key) in item.quotationDetail"
                    :key="key"
                    class="collapse-info infoContent headInfo"
                    @click="showBidInfoDetail(li)">
                    <div class="card">
                      <!-- 个性化组件替换后的代码 -->
                      <customize :need-padding="true" :columns="getBiddingInfoColumns" :data-source="li" code="SMBL.WORKFLOW.CALIBRATION_APPROVAL.BIDDING_INFO"/>
                    </div>
                  </div>
                </div>
              </srm-collapse-item>
            </srm-collapse>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 供应商信息详情弹窗 -->
    <supplier-info v-model="supplierInfoPop" date-type="supplier" :supplier-assign-info="supplierAssignInfo"/>

    <!-- 招标结果详情弹窗 -->
    <calibration-bid-info-detail
      v-model="calibrationBidInfoDetailPop"
      :calibration-bid-info-detail="calibrationBidInfoDetail"/>
  </section>
</template>

<script>
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
import CalibrationBidInfoDetail from "./components/CalibrationBidInfoDetail";
// import {
//   getCalibrationOrderHeadApi,
//   getCalibrationMaterialInfoApi,
//   getCalibrationBidInfoApi,
//   getSupplierAssignedApi,
//   getCalibrationSuppliersInfoApi
// } from "../api/Jin";
import {
  getCalibrationOrderHeadApi,
  getCalibrationMaterialInfoApi,
  getCalibrationBidInfoApi,
  getSupplierAssignedApi,
  getCalibrationSuppliersInfoApi
} from "./api";
import { SrmListHeader, SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.common", "ssrc.bidHall", "hipspfm.workFlowbidHall", "hipspfm.bidHall", "hipspfm.workFlow", "ssrc.common", "ssrc.score", "hipspfm.workFlowbidHal" ],
  name: "CalibrationApproval",
  components: {
    CalibrationBidInfoDetail,
    SupplierInfo,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    showLineFileArrPop:{
      type: Function
    },
  },
  data() {
    return {
      headInfo: {},
      materialDetail: [], //物料信息
      bidInfo: [], //投标信息
      scroll: "",
      navScroll: "",
      activeName:[], // 招标
      activeNames: [], // 物料
      supplierCompanyId:"",
      supplierCompany:[],
      filePopup: false,
      show: false,
      lengthArr: [],
      contentLenArr: [],
      attachmentUuid: "",
      bidHeaderId: null,
      supplierInfoPop: false,
      supplierAssignInfo: [], //专家分配信息
      calibrationBidInfoDetail:{},
      calibrationBidInfoDetailPop:false,
    };
  },
  computed: {
    getBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader>{val}</SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidNum").$D("招标编号"),
          fieldCode: "bidNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidTitle").$D("招标事项"),
          fieldCode: "bidTitle",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purceOrgName").$D("采购组织名称"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidType").$D("招标类型"),
          fieldCode: "bidTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourceMethod").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourceStage").$D("招标阶段"),
          fieldCode: "sourceStageMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.subjectMatterRule").$D("标的规则"),
          fieldCode: "subjectMatterRuleMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.maxBidNumber").$D("最大中标数"),
          fieldCode: "maxBidNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourcingTemplate").$D("寻源模版"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件"),
          fieldCode: "businessAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            this.showFilePop(val.businessAttachmentUuid || uuid);
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件"),
          fieldCode: "techAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            this.showFilePop(val.techAttachmentUuid || uuid);
          }
        },
      ];
      return columns;
    },
    getOtherInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidPlanName").$D("寻源计划"),
          fieldCode: "bidPlanLineName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.roundNumber").$D("轮次"),
          fieldCode: "roundNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.versionNumber").$D("版本"),
          fieldCode: "versionNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.projectName").$D("项目名称"),
          fieldCode: "projectName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidLocation").$D("项目地址"),
          fieldCode: "bidLocation",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.currencyType").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidFileExpense").$D("招标文件费"),
          fieldCode: "bidFileExpense",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidBond").$D("保证金"),
          fieldCode: "bidBond",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.paymentTypeId").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.paymentTerm").$D("付款条款"),
          fieldCode: "paymentTerm",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidOpenLocation").$D("开标地点"),
          fieldCode: "bidOpenLocation",
        },
        {
          fieldName: this.$T("ssrc.common.explorationFlag").$D("是否需要现场踏勘"),
          fieldCode: "explorationFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.common.explorationDate").$D("踏勘时间"),
          fieldCode: "explorationDate",
        }
      ];
      return columns;
    },
    getBidTitleColumns() {
      const columns = [
        {
          fieldType:"EMPTY",
          formRow:0,
          fieldCode:"itemName",
          render:(val, record) => <SrmListHeader>
            {record.itemCode}-{val}
          </SrmListHeader>
        },
        {
          fieldType:"EMPTY",
          fieldCode:"itemCategoryName",
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <div class="collapse-title-b">
              {
                record.bidLineItemNum &&
                    <span>{this.$T("ssrc.bidHall.modal.inEnquiryHall.lineNo.").$D("行号")}：{record.bidLineItemNum}</span>
              }
              {record.bidQuantity &&
                    <span>{this.$T("ssrc.bidHall.modal.inqueryHall.quantity").$D("数量")}：{ record.bidQuantity }{ record.uomName }</span>
              }
              {
                record.taxRate &&
                    <span>{this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率") }：{record.taxRate}%</span>
              }
              {
                record.itemCategoryName &&
                  <span>{val}</span>
              }
            </div>
          </SrmListHeader>
        }
      ];
      return columns;
    },
    getItemsInfoColumnsBlock() {
      const columns = [
        {
          fieldType:"EMPTY",
          formRow:0,
          fieldCode:"itemName",
          render:(val, record) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.itemName").$D("物料名称")}：{val}</span>
            <span class="item-num">{this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号")}：{record.bidLineItemNum}</span>;
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.itemCategory").$D("物料类别"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidQuantity").$D("需求数量"),
          fieldCode: "bidQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.costPrice").$D("标底单价"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.businessUnit").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prNum").$D("采购申请号"),
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineNum").$D("采购申请行号"),
          fieldCode: "prLineNum",
        }
      ];
      return columns;
    },
    getItemsInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.itemCategory").$D("物料类别"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidQuantity").$D("需求数量"),
          fieldCode: "bidQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.costPrice").$D("标底单价"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.businessUnit").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prNum").$D("采购申请号"),
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineNum").$D("采购申请行号"),
          fieldCode: "prLineNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商")}</span>,
          callBack:(val) => {
            this.getSupplierAssigned(this.bidHeaderId, val.bidLineItemId);
          }
        }
      ];
      return columns;
    },
    getBiddingInfoColumns() {
      const columns = [
        {
          fieldCode:"supplierCompanyNum",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.supplierCode").$D("编码")}：{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sumScore").$D("总分"),
          fieldCode: "sumScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.validQuotationPrice").$D("报价单价"),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationTotalAmount").$D("报价总金额"),
          fieldCode: "totalAmountMeaning",
          fieldType:"INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.wetherWinbid").$D("是否中标"),
          fieldCode: "suggestedFlag",
          render:(val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.allottedQuantity").$D("中标数量"),
          fieldCode: "allottedQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.attachment").$D("附件"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            let FileArr = [
              {
                title: this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件"),
                attachmentUuid: val.validBusinessAttachmentUuid ? val.validBusinessAttachmentUuid : "",
                readOnly: true
              },
              {
                title: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件"),
                attachmentUuid: val.validTechAttachmentUuid ? val.validTechAttachmentUuid : "",
                readOnly: true
              },
            ];
            this.showLineFileArrPop(FileArr);
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.allottedRatio").$D("中标比例"),
          fieldCode: "allottedRatioMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        }
      ];
      return columns;
    },
  },
  watch: {
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getCalibrationOrderHead();
        await this.getCalibrationMaterialInfo();
        await this.getCalibrationSuppliersInfo();
        await this.getCalibrationBidInfo();
        await this.getCalibrationBidDetail();
        this.bidHeaderId = this.changeReqId;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowbidHall.view.message.title.calibrationApproval").$D("招标定标结果审批"));
  },
  methods: {
    // 获取申请头信息
    async getCalibrationOrderHead() {
      await getCalibrationOrderHeadApi(this.changeReqId).then((res) => {
        this.headInfo = res;
      }
      );
    },
    // 获取物料信息
    async getCalibrationMaterialInfo() {
      const params = {
        page:0,
        size:500
      };
      await getCalibrationMaterialInfoApi(this.changeReqId, params).then((res) => {
        this.materialDetail = res;
      }
      );
    },
    // 获取供应商维度信息
    async getCalibrationSuppliersInfo() {
      const params = {
        bidHeaderId:this.changeReqId,
        organizationId:window.localStorage.getItem("organizationId"),
        page:0,
        size:500
      };
      await getCalibrationSuppliersInfoApi(this.changeReqId, params).then((res) => {
        //供应商附件uuid赋值
        this.supplierCompany = res;
        this.supplierCompanyId = res[0].supplierCompanyId || "";
        if (!this.supplierCompanyId) {
          this.$notification.open({
            message:"supplierCompanyId cannot be empty!",
            key,
            class: "notification"
          });
        }
      });
    },
    // 获取投标信息
    async getCalibrationBidInfo() {
      const params = {
        bidHeaderId:this.changeReqId,
        customizeUnitCode:"SSRC.BID_HALL_CHECK_PRICE.TAB_SUPPLIER",
        supplierCompanyId:this.supplierCompanyId,
        page:0,
        size:500
      };
      await getCalibrationBidInfoApi(params).then((res) => {
        this.bidInfo = res.content;
        let length = this.bidInfo.length - 1;
        const pushIndex = () => {
          this.activeName.push(length);
          if (length <= 0) {
            return;
          }
          length--;
          pushIndex();

        };
        pushIndex();
      }
      );
    },
    // 投标展开信息
    async getCalibrationBidDetail() {
      this.$loading.show();
      let promiseArr = [];
      this.bidInfo.map((item) => {
        let temp = new Promise((resolve) => {
          const params = {
            page: 0,
            size: 500,
            customizeUnitCode:"SSRC.BID_HALL_CHECK_PRICE.TAB_ITEM",
            bidHeaderId: this.changeReqId,
            bidLineItemId: item.bidLineItemId
          };
          console.log(13);
          getCalibrationBidInfoApi(params).then((res) => {
            if (res && !res.empty) {
              for (let i = 0; i < res.content.length; i++) {
                // eslint-disable-next-line no-cond-assign
                if (res.content[i].supplierCompanyId = this.supplierCompany[i].supplierCompanyId) {
                  res.content[i].validBusinessAttachmentUuid = this.supplierCompany[i].validBusinessAttachmentUuid;
                  res.content[i].validTechAttachmentUuid = this.supplierCompany[i].validTechAttachmentUuid;
                }
              }
              item.quotationDetail = res.content;
              resolve();
            }
          });
        });
        promiseArr.push(temp);
      });
      Promise.all(promiseArr)
        .then(() => {
          this.$forceUpdate();
          this.$loading.hide();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取招投标供应商分配信息
    getSupplierAssigned(bidHeaderId, bidLineItemId) {
      getSupplierAssignedApi(bidHeaderId, bidLineItemId).then((res) => {
        this.supplierAssignInfo = res;
        this.supplierInfoPop = true;
        console.log(this.supplierAssignInfo, "supplierAssignInfo......");
      });
    },
    // 招标信息详情页
    showBidInfoDetail(data) {
      data.bidNum = this.headInfo.bidNum;
      data.bidTitle = this.headInfo.bidTitle;
      this.calibrationBidInfoDetail = data;
      this.calibrationBidInfoDetailPop = !this.calibrationBidInfoDetailPop;
    },
  }
};
</script>

<style scoped  lang="stylus">
        .collapse-title-b {
          // height: 20px;
          span {
            background: var(--color-bg-default-d,rgba(65,70,96,0.1));
            border-radius: 2px;
            padding: 1px 4px;
            margin-right: 8px;
            display: inline-block;
            font-size: 10px;
            color: var(--color-font-default-c);
            line-height: 18px;
            word-break: break-all;
          }
        }
</style>
