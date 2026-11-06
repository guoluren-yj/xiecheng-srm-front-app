<template>
  <div>
    <div style="height: 100vh; overflow-y: auto">
      <div class="detail-wrap create-receive-detail-scroll-el">
        <div class="detail-wrap create-receive-detail-scroll-el">
          <srm-swiper
            v-if="
              headerDataDs.data[0] &&
                headerDataDs.data[0].pictureList.length > 0
            "
            height="250px"
            auto>
            <srm-swiper-item
              v-for="(item, index) in headerDataDs.data[0] &&
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
                $T('scux.PointondeMandDetails.title.basics1').$D('基础信息')
              ">
              <srm-form
                :data-set="headerDataDs"
                :columns="getHeaderInfoColumns"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item
              :label="
                $T('scux.PointondeMandDetails.title.spaceinformation').$D(
                  '刊位信息'
                )
              ">
              <srm-list
                :data-set="lineDetalisDataDs"
                :columns="getLieDetailsColumns"
                :scrollable="false"/>
            </srm-scroll-tab-item>
          </srm-scroll-tab>
        </div>
      </div>
      <srm-bottom-handler
        v-if="Number(tabFlag) === 0 || Number(tabFlag) === 1"
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
      :records="records"
      @uploads="uploads"
      @uuid="uuid"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import uuid from "uuid";
import { headerDs, lineDetailsDs, mointDataDs } from "../datasource/index";
import historyRecord from "./history.vue";
import { checkSaveApi, checkSubmitApi, hisToryApi } from "../api/index";
import uploadProp from "./UploadModel.vue";
export default {
  modules: [
    "scux.PointondeMandDetails",
    "scux.PointondeMandList",
    "scux.MonitData",
    "hzero.common",
    "smbl.workFlow",
    "hipspfm.common",
    "smbl.common",
  ],
  name: "PointondeMandDetails",
  components: {
    historyRecord,
    uploadProp,
  },
  data() {
    const { journalPositionId, tabFlag } = this.$route.query;
    return {
      headerDataDs: new DataSet(headerDs(this)),
      lineDetalisDataDs: new DataSet(lineDetailsDs(this)),
      mointDs: new DataSet(mointDataDs(journalPositionId)),
      journalPositionId,
      approvalRecords: [], //操作记录数据
      operationPopup: false, //操作记录弹框
      uploadFlag: false, //上传弹框
      status: "", // 上传弹框类型
      disabledArr: [ "NOT_STARTED", "CLOSED" ],
      tabFlag, //列表状态
      uuids: uuid(),
      locations: "",
      records:null,
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
        {
          fieldCode: "provinceName",
        },
        {
          fieldCode: "cityName",
        },
        {
          fieldCode: "pointLocation",
        },
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
              {$T("scux.PointondeMandDetails.button.look").$D("查看")}
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
                    "scux.PointondeMandDetails.button.journalPositionVersion"
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
            <div>
              <srm-button
                disabled={this.disabledArr.includes(
                  record.journalPositionStatus
                )}
                onClick={() => this.handleOpreation("save")}
                style={{ color: "blue" }}
              >
                {$T("scux.PointondeMandDetails.button.save").$D("保存")}
              </srm-button>
              <srm-button
                class="historyLook"
                onClick={() => this.onItemClick(record, "look")}
                style={{ color: "blue" }}
              >
                {$T("scux.PointondeMandDetails.button.hisoryUpload").$D(
                  "历史资料查看"
                )}
              </srm-button>
            </div>
          ,
        },
        {
          fieldCode: "operatingdata",
          render: (_, record) =>
            <span
              onClick={() => this.handleLook(record, "issue")}
              style={{ color: "blue" }}
            >
              {$T("scux.PointondeMandDetails.button.look").$D("查看")}
            </span>
          ,
        },
      ];
    },
  },
  methods: {
    textCount(val) {
      return `第${val}次`;
    },
    // 上传,历史资料查看
    onItemClick(record, flag) {
      const lineDs = this.lineDetalisDataDs.toData();
      const { journalPositionId } = flag === "uploading" ? lineDs[0] : record;
      this.records = lineDs[0];
      this.journalPositionId = journalPositionId;
      this.status = flag;
      const flags = flag === "uploading" ? "0" : "1";
      const datas = {
        journalPositionId: journalPositionId,
        approveFlag: flags,
        fileStatus: flags === "0" ? "SUBMIT" : "",
      };
      this.mointDs.setQueryParameter(datas);
      this.mointDs.refresh();
      this.uuids = uuid();
      if (flag === "uploading") {
        this.$geoLocation()
          .then((res) => {
            this.locations = res.addr;
            this.uploadFlag = true;
          })
          .catch(() => {
            this.$notification.open({
              message: this.$T("smbl.common.location.errorwarns").$D(
                "定位失败，请检查是否开启位置权限或网络环境是否正常"
              ),
            });
          });
      } else {
        this.uploadFlag = true;
      }
    },
    uploads(value) {
      this.uploadFlag = value;
    },
    uuid(value) {
      this.uuids = value;
    },
    // 保存 提交
    async handleOpreation(type) {
      const data = this.lineDetalisDataDs.toData();
      const obj = data.map((item) => ({
        supplierRemarks: item.supplierRemarks,
        journalPositionId: item.journalPositionId,
        _defaultValueInitialize: null,
      }));
      const list = data.map((item) => item);
      const res =
        type === "save" ?
          await checkSaveApi(obj) :
          await checkSubmitApi(list[0]);
      if (res && !res.failed) {
        this.$notification.open({
          message: $T(
            "scux.PointondeMandDetails.message.please.enter.handLeOks"
          ).$D("操作成功"),
          class: "notification",
        });
        this.lineDetalisDataDs.refresh();
      }
    },
    // 底部按钮
    bottomBtn() {
      return [
        {
          text: $T("scux.PointondeMandDetails.button.upload").$D("上传"),
          type: "primary",
          fill: true,
          bordered: true,
          visible: true,
          disabled:
            this.lineDetalisDataDs.toData().length === 0 ||
            this.lineDetalisDataDs.toData()[0].journalPositionStatus ===
              "CLOSED",
          handler: () => {
            this.onItemClick(_, "uploading");
          },
        },
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
