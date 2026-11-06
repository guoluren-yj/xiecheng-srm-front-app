<template>
  <div v-if="text">
    <div
      :class="`ssta-dynamic-alert ssta-dynamic-alert-${type}`"
      @click="showAlertDetail">
      <span class="ssta-dynamic-alert-text">
        {{ text }}
        <srm-button v-if="fileUrl" plain>{{ $T('ssta.common.button.viewAnnouncement').$D("查看公告") }}</srm-button>
      </span>
      <span class="srm-icon icon-chevron-right" />
    </div>
    <srm-popup
      rounded
      height="auto"
      :visible.sync="visible"
      :title="$T('hzero.common.message.confirm.title').$D('提示')">
      <div :class="`ssta-dynamic-alert-detail ssta-dynamic-alert-detail-${type}`">
        <span class="ssta-dynamic-alert-detail-text srm-button-text">{{ text }}</span>
        <srm-button v-if="fileUrl" plain @click="previewFile">{{ $T('ssta.common.button.viewAnnouncement').$D("查看公告") }}</srm-button>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import { http, SrmUtil } from "srm-mobile-ui";
import { previewPdf } from "../../../utils";
export default {
  modules: [ "hzero.common", "ssta.common", "smbl.common" ],
  name: "DynamicAlert",
  props: {
    type: {
      type: String,
      default: "primary",
    },
    requestUrl: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      visible: false,
      text: "",
    };
  },
  created() {
    if (this.requestUrl) {
      this.fetchAlertContent();
    }
  },
  methods: {
    async fetchAlertContent() {
      const res = await http.get(this.requestUrl).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        const { announcement, prompt, fileUrl } = res;
        this.text = announcement || prompt;
        this.fileUrl = fileUrl;
      }
    },
    showAlertDetail() {
      this.visible = true;
    },
    previewFile() {
      previewPdf.call(this, this.fileUrl, SrmUtil.getDefaultPubBucketName());
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '~srm-mobile-ui/src/style/var.styl';

.ssta-dynamic-alert {
  display: flex;
  height: 32px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 15px;
  line-height: 32px;
  justify-content: space-between;
}

.ssta-dynamic-alert-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ssta-dynamic-alert-danger {
  color: $srm-theme-color-danger;
  background-color: #FFEFED;
}

.ssta-dynamic-alert-primary {
  color: $srm-theme-color-primary;
  background-color: #EFF3FE;
}

.ssta-dynamic-alert-detail {
  padding: 12px 15px 68px 15px;
  .ssta-dynamic-alert-detail-text {
    font-size: 14px;
  }
}
.ssta-dynamic-alert-detail-danger {
  color: $srm-theme-color-danger;
}
.ssta-dynamic-alert-detail-primary {
  color: $srm-theme-color-primary;
}
</style>