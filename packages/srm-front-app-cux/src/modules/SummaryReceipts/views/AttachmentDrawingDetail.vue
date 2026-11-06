<template>
  <div style="height: 100vh">
    <srm-list
      class="detail-list"
      :data-set="listDataSet"
      :columns="getDrawingColumns()"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { drawingData } from "../dataSource/detailDs";
import { SrmUtil } from "srm-mobile-ui";

import ListColumns from "../mixins/ListColumns";

export default {
  modules: [ "scux.summaryReceipt", "hzero.common" ],
  name: "AttachmentDrawingDetail",
  components: {
  },
  mixins: [ ListColumns ],
  props: {
    itemId: {
      type: String,
    },
  },
  data() {
    return {
      listDataSet: new DataSet(drawingData(this.itemId)),
    };
  },
  mounted() {
    if (this.itemId) {
      // this.badProjectDataSet.addQueryParameter("headerId", this.headerId);
      // this.badProjectDataSet.addQueryParameter("spotCheckCount", this.spotCheckCount);
      this.listDataSet.refresh();
    }
  },
  methods: {
    // 下载物料图纸
    async attachmentDrawingLoad(itemCode, drawingVersion) {
      let fileName = "";
      const url = `${SrmUtil.getApiBaseUrl()}/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/V28WHMVY16mpyy2wCZqtmJEmO4ZbB8q5XemjKbuvBq8?itemCode=${itemCode}&itemVersion=${drawingVersion}`;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // 如果需要的话，比如发送 JSON 数据
          "Authorization": `Bearer ${SrmUtil.getUserToken()}`, // 如果需要身份验证
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contentDisposition = response.headers?.get?.("content-disposition");
        const reg = /filename(.*)/;
        const originFileName = reg.exec(contentDisposition)?.[1]?.trim();
        fileName = decodeURIComponent(
            originFileName?.split?.(originFileName?.includes("utf-8''") ? "*=utf-8''" : "=")?.[1]
        );
        return response.blob();
      }).then((blob) => {
        if (blob) {
          const file = new Blob([ blob ], { type: "application/octet-stream" });
          const blobURL = window.URL.createObjectURL(file);

          // 创建a标签，用于跳转至下载链接
          const tempLink = document.createElement("a");
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          tempLink.setAttribute("download", fileName);
          tempLink.setAttribute("target", "_blank");
          tempLink.setAttribute("rel", "noopener noreferrer");
          // 兼容：某些浏览器不支持HTML5的download属性
          // if (typeof tempLink.download === "undefined") {
          //   tempLink.setAttribute("target", "_self");
          // }
          // 挂载a标签
          document.body.appendChild(tempLink);
          tempLink.click();
        }
      });
    }
  }
};
</script>