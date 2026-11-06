<!-- 评分要素滑块组件 -->
<script>


import { SrmUtil, } from "srm-mobile-ui";
import { isNil, isEmpty, throttle } from "lodash";

import { fetchNewSupplierQuotationFile } from "../api/";

export default {
  modules: [ "ssrc.common", "ssrc.inquiryHall", "hzero.common", ],
  name: "FileGroup",
  props: {
    // 激活当前卡片时，禁止重复触发回调方法，默认开启
    name: {
      type: String,
      default: true,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    fileType: {
      type: String,
      default: "",
    },
    fileCountName: {
      type: String,
      default: "totalDisplayFileCount",
    },
    fileButtonText: {
      type: String,
      default: "",
    },
    totalDisplayFileCount: {
      type: String,
      default: "totalDisplayFileCount",
    },
  },
  data() {
    return {
      organizationId: SrmUtil.getOrganizationId(),
      bucketName: SrmUtil.getDefaultBucketName(),
      popVisible: false,
      data: {},
      fileList: [],
      loading: false,
      count: 0,
      fileGroupModalRef: null,
      common: {
        bucketName: this.bucketName,
        bucketDirectory: "ssrc-rfx-rfxheader",
      },
      lineCommon: {
        bucketName: this.bucketName,
        bucketDirectory: "ssrc-rfx-quotationline",
      },
    };
  },
  computed: {
  },
  watch: {
    record(val) {
      this.data = val;
    },
  },
  beforeUnmount() {
    this.closeModal();
  },
  methods: {
    getTitle() {
      return this.fileButtonText || this.$T("ssrc.common.model.common.viewAttachment").$D("查看附件");
    },
    closeModal() {
      this.closeAbandonModal();
      this.fileList = [];
    },
    // current quotation stage
    quotationStageRender(data = {}) {
      const {
        quotationNode,
        quotationNodeMeaning,
        quotationCount,
        bargainTimes,
        quotationRoundNumber,
      } = data || {};
      let currentNodeTitle = "";

      switch (quotationNode) {
        case "QUOTATION_PRICE":
        case "PRICE_CLARIFICATION":
          currentNodeTitle = quotationNodeMeaning;
          break;
        case "ROUND_QUOTATION_PRICE":
          currentNodeTitle = this.$T("ssrc.inquiryHall.view.message.commonQuotationRound", [ quotationRoundNumber ]).$D("第{round}轮报价");
          break;
        case "BARGAIN_PRICE":
          currentNodeTitle = this.$T("ssrc.common.theRoundBargainNum", [ bargainTimes ]).$D("第{bargainTimes}次议价");
          break;
        default:
          currentNodeTitle = quotationNodeMeaning;
          break;
      }

      if (quotationCount) {
        currentNodeTitle = `${currentNodeTitle}-${quotationCount}`;
      }

      return currentNodeTitle;
    },
    renderModal() {
      const files = this.fileList || [];
      if (isEmpty(this.fileList)) {
        return (
          <div class="ssrc-empty-data-text">
            {this.$T("hzero.common.message.data.none").$D("暂无数据")}
          </div>
        );
      }

      const firstLine = [];
      firstLine.push(files[0]?.uniqueKey);

      return (
        <div>
          <srm-collapse value={firstLine}>
            {files.map((file) => {
              const { uniqueKey, realName = null, } = file || {};
              const currentLineTitle = this.quotationStageRender(file);

              return (
                <srm-collapse-item name={uniqueKey}>
                  <div class="ssrc-file-group-collapse-header-wrap">
                    <span>{currentLineTitle ?? ""}</span>
                    <span>
                      {this.$T("ssrc.common.model.common.uploadBy").$D("上传人")} :{" "}
                      <srm-tooltip title={realName ?? ""}>{realName ?? ""}</srm-tooltip>
                    </span>
                  </div>

                  <div slot="content" class="ssrc-component-file-group-slot-content">
                    {this.renderFileGroup(file)}
                  </div>
                </srm-collapse-item>
              );
            })}
          </srm-collapse>
        </div>
      );
    },
    renderFileGroup(file) {
      const {
        businessAttachmentUuid = null,
        techAttachmentUuid = null,
        lineAttachmentUuid = null,
      } = file || {};

      if (this.fileType === "LINE") {
        return (
          <srm-attachment
            name="lineAttachmentUuid"
            {...this.LineCommon}
            attachment-uuid={lineAttachmentUuid}
            readonly
          />
        );
      }

      return (
        <div class="ssrc-file-group-header-wrap">
          <div>
            <div class="title-text">
              {this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件")}
            </div>
            <div>
              <srm-attachment
                name="businessAttachmentUuid"
                {...this.Common}
                attachment-uuid={businessAttachmentUuid}
                readonly
              />
            </div>
          </div>
          <div>
            <div class="title-text">
              {this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件")}
            </div>
            <div>
              <srm-attachment
                name="techAttachmentUuid"
                {...this.Common}
                attachment-uuid={techAttachmentUuid}
                readonly
              />
            </div>
          </div>
        </div>
      );
    },
    async fetchFile(queryParams = {}) {
      const {
        quotationHeaderId,
        quotationLineId,
      } = this.$props?.record || {};

      if (!quotationHeaderId && !quotationLineId) {
        return;
      }

      const params = {
        organizationId: this.organizationId,
        quotationHeaderId,
        quotationLineId: this.fileType === "HEADER" ? null : quotationLineId,
        ...(queryParams || {}),
      };

      let result = null;

      this.loading = true;
      result = await fetchNewSupplierQuotationFile(params);
      if (result && result.failed) {
        return;
      }
      this.loading = false;
      if (isEmpty(result)) {
        return;
      }

      this.fileList = result || [];
    },
    async viewFile() {
      if (this.loading) {
        return;
      }
      await this.fetchFile();

      const title = this.getTitle();

      this.fileGroupModalRef = this.$popup({
        title,
        headerAlign: "center",
        height: "100%",
        showHeader: true,
        showClose: true,
        rounded: true,
        content: this.renderModal(),
        onClose: () => {
          this.fileList = [];
        },
      });
    },
    // 关闭放弃弹窗
    closeAbandonModal() {
      if (this.fileGroupModalRef) {
        this.fileGroupModalRef.closePopup();
      }
    },
  },
  render() {
    const buttonText = this.getTitle();
    const { record } = this.$props;
    const { totalDisplayFileCount = 0, } = record || {};
    const fileCountRender = !isNil(totalDisplayFileCount) ? ` (${totalDisplayFileCount})` : "(0)";

    return (
      <a class="ssrc-file-group-button" onClick={throttle(this.viewFile, 1200)}>
        {buttonText}
        {fileCountRender}
      </a>
    );
  }
};
</script>

<style lang="stylus" scoped>

.ssrc-file-group-collapse-header-wrap {
  font-size: 12px;
  color: #333333;
  font-weight: 400;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
}

.ssrc-component-file-group-slot-content {
  width: 100%;
}

.ssrc-file-group-header-wrap {
  .title-text {
    font-size: 12px;
    color: #333333;
    height: 34px;
    line-height: 34px;
    padding-left: 20px;
    margin-top: 16px;
  }
}

.ssrc-file-group-button {
  color: var(--font-color-primary);
}

.ssrc-empty-data-text {
  font-size: 14px;
  text-align: center;
  margin-top: 24px;
}

</style>

