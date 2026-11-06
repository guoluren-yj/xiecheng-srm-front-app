<template>
  <div>
    <div style="height: 100vh; overflow-y: auto">
      <div class="detail-wrap create-receive-detail-scroll-el">
        <div class="detail-wrap create-receive-detail-scroll-el">
          <srm-swiper
            v-if="
              headerDataDs.data[0].pictureList &&
                headerDataDs.data[0].pictureList.length > 0
            "
            height="250px"
            auto>
            <srm-swiper-item
              v-for="(item, index) in headerDataDs.data[0].pictureList &&
                headerDataDs.data[0].pictureList"
              :key="index">
              <div class="photos">
                <img
                  height="100%"
                  :src="buildImgUrl(item.fileUrl, 'private-bucket', false)"
                  alt="">
              </div>
            </srm-swiper-item>
          </srm-swiper>
          <srm-scroll-tab>
            <srm-scroll-tab-item
              :label="
                $T('scux.PurChasePointondeMandDetails.title.basics1').$D(
                  '基础信息'
                )
              ">
              <srm-form
                style="
                  padding: 0 15px 10px 15px;
                  min-height: 264px;
                  margin-bottom: 0px;
                "
                :data-set="headerDataDs"
                :columns="getHeaderInfoColumns"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item
              :label="
                $T(
                  'scux.PurChasePointondeMandDetails.title.createinformation'
                ).$D('创建信息')
              ">
              <srm-form
                style="
                  padding: 15 15px 10px 15px;
                  min-height: 80px;
                  margin-bottom: 0px;
                "
                :data-set="headerDataDs"
                :columns="getCreateColumns"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item
              :label="
                $T(
                  'scux.PurChasePointondeMandDetails.title.spaceinformation'
                ).$D('刊位信息')
              ">
              <srm-list
                :scrollable="false"
                :data-set="lineDetalisDataDs"
                :columns="getLieDetailsColumns"/>
            </srm-scroll-tab-item>
          </srm-scroll-tab>
        </div>
      </div>
      <srm-bottom-handler
        v-if="
          (Number(tabFlag) === 0 &&
            headerDataDs.toData()[0].journalPositionStatus !== 'NOT_STARTED') ||
            Number(tabFlag) === 1
        "
        :btn-arr="bottomBtn()"
        class="bottom-receive-box"/>
    </div>
    <history-record v-model="operationPopup" :action-data="approvalRecords" />
    <upload-prop
      :upload-flag="uploadFlag"
      :journal-position-id="journalPositionId"
      :moint-ds="mointDs"
      :status="status"
      :list-upload="lineDetalisDataDs"
      :uuids="uuids"
      :locations="locations"
      :supplier-id="supplierId"
      :inspect-id="inspectId"
      :create-id="createId"
      :records="records"
      :query-lis="queryLis"
      @uploads="uploads"
      @inspectIds="inspectIds"
      @uuid="uuid"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { headerDs, lineDetailsDs, mointDataDs } from "../datasource/index";
import historyRecord from "../../PointondeMand/views/history.vue";
import { hisToryApi } from "../api/index";
import uploadProp from "./UploadModel.vue";
export default {
  modules: [
    "scux.PurChasePointondeMandDetails",
    "scux.MonitData",
    "scux.PointondeMandList",
    "scux.PurChasePointondeMandList",
    "scux.PurChaseMandPlaceList",
    "scux.Province",
    "scux.City",
    "hzero.common",
    "smbl.workFlow",
    "hipspfm.common",
    "smbl.common",
    "scux.PointondeMandDetails",
  ],
  name: "PurChasePointondeMandDetails",
  components: {
    historyRecord,
    uploadProp,
  },
  data() {
    const {
      app: {
        _route: {
          query: { journalPositionId },
        },
      },
    } = this.$router;
    // 供应商,点位中标金额字段权限
    const supplierArr = [
      "hndq",
      "sddq",
      "cydq",
      "jsdq",
      "gqddq",
      "dbmddq",
      "xqzdq",
      "yhdq",
      "sgnmxdq",
      "xygdq",
      "xygdq",
      "shdq",
      "ahdq",
      "jjdq",
      "zmdq",
      "jingjdq",
      "hndq",
      "yybry",
      "scglry",
    ];
    // 点位实际执行金额（万元）
    const roleArr = [
      "hndq",
      "sddq",
      "cydq",
      "jsdq",
      "gqddq",
      "dbmddq",
      "xqzdq",
      "yhdq",
      "sgnmxdq",
      "xygdq",
      "xygdq",
      "shdq",
      "ahdq",
      "jjdq",
      "zmdq",
      "jingjdq",
      "hndq",
      "yybry",
      "scglry",
      "leader",
    ];
    const { currentRoleCode } = SrmUtil.getUserInfo();
    const { tabFlag } = this.$route.query;
    return {
      headerDataDs: new DataSet(headerDs(this)),
      lineDetalisDataDs: new DataSet(lineDetailsDs(this)),
      mointDs: new DataSet(mointDataDs(journalPositionId)),
      uuids: uuid(),
      journalPositionId,
      approvalRecords: [],
      operationPopup: false,
      uploadFlag: false,
      status: "",
      disabledArr: [ "NOT_STARTED", "CLOSED" ],
      supplierArr,
      roleArr,
      currentRoleCode,
      locations: "",
      tabFlag,
      supplierId: null,
      inspectId: null,
      createId: null,
      records: null,
      queryLis:{},
    };
  },
  computed: {
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "pointPositionNumber",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <span slot="left" style="color:#276EF1;">
                {record.pointPositionNumber}
              </span>
              <span slot="right" style="color:#276EF1;">
                {record.pointPositionStatusMeaning}
              </span>
            </SrmListHeader>
          ,
        },
        // {
        //   fieldCode: "winBidNumber",
        // },
        {
          fieldCode: "pointLocation",
        },
        // {
        //   fieldCode: "companyName",
        // },
        {
          fieldCode: "resourceStyleMeaning",
        },
        {
          fieldCode: "adStyle",
        },
        {
          fieldCode: "dimension",
        },
        {
          fieldCode: "brandMeaning",
        },
        // {
        //   fieldCode: "regionName",
        // },
        // {
        //   fieldCode: "provinceName",
        // },
        // {
        //   fieldCode: "cityName",
        // },
        this.currentRoleCode.indexOf("bsc") === -1 && !this.supplierArr.includes(this.currentRoleCode) && {
          fieldCode: "winBidAmount",
        },
        this.currentRoleCode.indexOf("bsc") === -1 && !this.roleArr.includes(this.currentRoleCode) && {
          fieldCode: "actualExecuteAmount",
        },
        {
          fieldCode: "publishFrequency",
        },
        // {
        //   fieldCode: "isLastMaterialMeaning",
        // },
        {
          fieldCode: "monitorFrequencyMeaning",
        },
        {
          fieldCode: "monitorValid",
          render: (_, record) => {
            if (record.monitorValidFrom && record.monitorValidTo) {
              return (
                <span>{`${record.monitorValidFrom}'-'${record.monitorValidTo}`}</span>
              );
            }
            return "";
          },
        },
        // {
        //   fieldCode: "relatedContract",
        // },
        {
          fieldCode: "freeReplaceAmount",
        },
        {
          fieldCode: "readMe",
        },
        {
          fieldCode: "uploadUuid",
        },
        {
          fieldCode: "operatingrecord",
          render: (_, record) =>
            <a
              style="color:#276EF1;"
              onClick={() => this.handleLook(record, "point")}
            >
              {$T("scux.PurChasePointondeMandDetails.button.look").$D("查看")}
            </a>
          ,
        },
      ];
    },
    // 刊位信息
    getLieDetailsColumns() {
      return [
        {
          fieldCode: "journalPositionVersion",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>
                {`${
                  $T(
                    "scux.PurChasePointondeMandDetails.button.journalPositionVersion"
                  ).$D("刊位版本:") + this.textCount(val)
                }`}
              </span>
              <span slot="right" style="color:#276EF1;">
                {record.journalPositionStatusMeaning}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "approvalRemarks",
        },

        {
          fieldCode: "readMe",
        },
        {
          fieldCode: "supplierRemarks",
        },
        {
          fieldCode: "monitorValid",
          render: (_, record) => {
            if (record.monitorValidFrom && record.monitorValidTo) {
              return (
                <span>{`${record.monitorValidFrom}'-'${record.monitorValidTo}`}</span>
              );
            }
            return "";
          },
        },
        {
          fieldCode: "monitdata",
          render: (_, record) =>
            <srm-button
              class="historyLook"
              onClick={() => this.onItemClick(record, "look")}
              style={{ color: "blue" }}
            >
              {$T("scux.PurChasePointondeMandDetails.button.hisoryUpload").$D(
                "历史资料查看"
              )}
            </srm-button>
          ,
        },
        {
          fieldCode: "operatingdata",
          render: (_, record) =>
            <span
              onClick={() => this.handleLook(record, "issue")}
              style={{ color: "blue" }}
            >
              {$T("scux.PurChasePointondeMandDetails.button.look").$D("查看")}
            </span>
          ,
        },
      ];
    },
    //创建信息
    getCreateColumns() {
      return [
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
  },
  created() {
    // this.lineDetalisDataDs.setQueryParameter({ supplierFlag: "1" });
    this.lineDetalisDataDs.refresh();
    // this.headerDataDs.query();
  },
  mounted() {
    this.headerDataDs.refresh();
    this.lineDetalisDataDs.refresh();
  },
  methods: {
    textCount(val) {
      return `第${val}次`;
    },
    // onItemClick(record, flag) {
    //   const lineDs = this.lineDetalisDataDs.toData();
    //   const { journalPositionId } = flag === "uploading" ? lineDs[0] : record;
    //   this.journalPositionId = journalPositionId;
    //   this.status = flag;
    //   const flags = flag === "uploading" ? "0" : "1";
    //   const datas = {
    //     journalPositionId: journalPositionId,
    //     approveFlag: flags,
    //   };
    //   this.mointDs.setQueryParameter(datas);
    //   this.mointDs.refresh();
    //   this.uploadFlag = true;
    // },
    uploads(value) {
      this.uploadFlag = value;
    },
    inspectIds(value) {
      this.inspectId = value;
    },
    // 上传,历史资料查看
    onItemClick(record, flag) {
      const lineDs = this.lineDetalisDataDs.toData();
      const { supplierTenantId, createdBy, inspectorId } = lineDs[0];
      this.records = lineDs[0];
      this.createId = createdBy;
      this.supplierId = supplierTenantId;
      this.inspectId = inspectorId;
      const { journalPositionId } = flag === "uploading" ? lineDs[0] : record;
      this.journalPositionId = journalPositionId;
      this.status = flag;
      const flags = flag === "uploading" ? "0" : "1";
      const datas = {
        journalPositionId: journalPositionId,
        approveFlag: flags,
        fileStatus: flags === "0" ? "SUBMIT" : "",
      };
      this.queryLis = datas;
      this.mointDs.setQueryParameter(datas);
      this.mointDs.refresh();
      this.uuids = uuid();
      if (flag === "uploading") {
        // this.$geoLocation()
        //   .then((res) => {
        // this.locations = pointLocation;
        this.uploadFlag = true;
        //   })
        //   .catch(() => {
        //     this.$notification.open({
        //       message: this.$T("smbl.common.location.errorwarns").$D(
        //         "定位失败，请检查是否开启位置权限或网络环境是否正常"
        //       ),
        //     });
        //   });
      } else {
        this.uploadFlag = true;
      }
    },
    uuid(value) {
      this.uuids = value;
    },
    // 保存 提交
    // async handleOpreation(type) {
    //   const data = this.lineDetalisDataDs.toData();
    //   const obj = data.map((item) => ({
    //     supplierRemarks: item.supplierRemarks,
    //     journalPositionId: item.journalPositionId,
    //     _defaultValueInitialize: null,
    //   }));
    //   const list = data.map((item) => item);
    //   const res =
    //     type === "save" ?
    //       await checkSaveApi(obj) :
    //       await checkSubmitApi(list[0]);
    //   if (res && !res.failed) {
    //     this.$notification.open({
    //       message: $T(
    //         "scux.PurChasePointondeMandDetails.message.please.enter.handLeOks"
    //       ).$D("操作成功"),
    //       class: "notification",
    //     });
    //     this.lineDetalisDataDs.refresh();
    //   }
    // },
    // 底部按钮
    bottomBtn() {
      return [
        {
          text: $T("scux.PurChasePointondeMandDetails.button.uploads").$D(
            "上传"
          ),
          type: "primary",
          fill: true,
          bordered: true,
          visible: true,
          handler: () => {
            this.onItemClick(_, "uploading");
          },
          disabled:
            this.lineDetalisDataDs.toData().length === 0 ||
            this.lineDetalisDataDs.toData()[0].journalPositionStatus ===
              "NOT_STARTED",
        },
        // {
        //   text: $T("scux.PurChasePointondeMandDetails.button.submit").$D(
        //     "提交"
        //   ),
        //   type: "primary",
        //   fill: true,
        //   bordered: true,
        //   visible: true,
        //   handler: () => {
        //     this.handleOpreation("submit");
        //   },
        // },
      ];
    },
    // 操作记录
    handleLook(record, type) {
      this.operationPopup = !this.operationPopup;
      const { journalPositionId, pointPositionId } = record;
      if (type === "point") {
        const dwparams = {
          pointPositionId,
          page: 0,
          size: 10,
        };
        hisToryApi(dwparams, type).then((res) => {
          const data = res.content || [];
          const newList = data.map((item) => ({
            operator: item.operator,
            processRemarkInfo: item.tenantIdMeaning,
            processDate: item.creationDate,
            processOperationMeaning: item.operatedActionMeaning,
          }));
          this.approvalRecords = newList;
        });
      } else {
        const kwparams = {
          journalPositionId,
          page: 0,
          size: 10,
        };
        hisToryApi(kwparams, type).then((res) => {
          const data = res.content || [];
          const newList = data.map((item) => ({
            operator: item.operator,
            objectVersionNumber: record.journalPositionVersion,
            processRemark: item.remarks ? item.remarks : "",
            processDate: item.operatedDate,
            processOperationMeaning: item.operatedActionMeaning,
          }));
          this.approvalRecords = newList;
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.create-receive-detail-scroll-el {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 35px;

  .create-receive-detail-button {
    margin-right: 10px;
  }
}

.line-filter {
  display: flex;
  justify-content: space-between;
  color: var(--font-color-primary);
  font-size: 18px;
  font-weight: 600;
  padding: 13px;
}

.srm-list-inspection-line {
  white-space: break-spaces;
}

.bottom-receive-box {
  border-top: 1px solid #ddd;
  padding-top: 21px;
}

.historyLook {
  margin-left: 5px;
}

.photos {
  height: 250px;
}
</style>
