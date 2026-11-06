<template>
  <div style="height: 100vh">
    <srm-list
      class="sku-list"
      :data-set="listDs"
      :columns="getListColumns"
      @itemClick="onListItemClick"/>
    <srm-popup :visible.sync="scanVisible" height="100%" :show-header="false">
      <html-scan-code
        :value="scanVisible"
        @onScanSuccess="onScanSuccess"
        @onScanFail="onScanFail"
        @onScanBack="onScanFail"/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import CommonImage from "../components/Image.vue";
import HtmlScanCode from "../components/HtmlScanCode.vue";
import { skuListDs } from "../store/ds";
import { fetchItemCodeWithCodeBar } from "../api";
import SrmAppCore from "srm-front-app-core";
export default {
  modules: ["smpc.product"],
  name: "WorkbenchList",
  components: { HtmlScanCode },
  data() {
    return {
      listDs: new DataSet(skuListDs()),
      noImg: require("@/assets/empty.svg"),
      html5QrCode: null,
      scanVisible: false,
      iconElem: null,
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "skuCode",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>{val}</SrmListHeader>,
        },
        {
          formRow: 2,
          fieldCode: "imagePath",
          fieldType: "EMPTY",
          render: (val, record) =>
            <CommonImage
              src={this.getImagePath(record)}
              width="100"
              height="100"
            />
          ,
        },
        {
          formRow: 2,
          fieldCode: "customize",
          fieldType: "EMPTY",
          render: (val, item) =>
            <Customize
              class="card-item-right"
              columns={[
                {
                  formRow: 1,
                  fieldCode: "itemName",
                  fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
                },
                {
                  formRow: 2,
                  fieldCode: "itemCode",
                  fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
                },
                {
                  formRow: 3,
                  formCol: 2,
                  // fieldCode: "operateImage",
                  fieldType: "EMPTY",
                  render: (_, record) =>
                    <SrmButton
                      fill
                      type="primary"
                      class="item-btn"
                      onClick={() => this.openSkuImagePop(record)}
                    >
                      {$T("smpc.product.model.maintainImage").$D("维护图片")}
                    </SrmButton>
                  ,
                },
              ]}
              data-source={item}
              type="list"
              need-padding={false}
            />
          ,
        },
      ];
    },
  },
  mounted() {
    const queryElem = document.querySelector(
      ".sku-list>.srm-list-search-line .srm-search-wrapper"
    );
    if (queryElem) {
      const iconElem = document.createElement("div");
      this.iconElem = iconElem;
      iconElem.innerHTML = "<span class=\"srm-icon icon-scan\" />";
      iconElem.addEventListener("click", this.scanCode);
      queryElem.appendChild(iconElem);
    }
  },
  beforeDestroy() {
    if (this.iconElem) {
      this.iconElem.removeEventListener("click", this.scanCode);
    }
  },
  methods: {
    getImagePath(record) {
      const { imagePath, skuImageList } = record;
      const { mediaPath } =
        (skuImageList || []).find((f) => f.primaryFlag === 1) || {};
      return imagePath || mediaPath || this.noImg;
    },
    // 维护图片
    onListItemClick({ data }) {
      this.$router.push({
        name: "ReceiveSkuDetail",
        query: {
          spuId: data.spuId,
          skuId: data.skuId,
        },
      });
    },
    getSortList(list) {
      const _list = list.sort((a, b) => a - b);
      return [
        ..._list.filter((f) => f.primaryFlag), // 主图在第一个位置
        ..._list.filter((f) => !f.primaryFlag),
      ];
    },
    openSkuImagePop(data) {
      this.$router.push({
        name: "UploadImage",
        query: {
          spuId: data?.spuId,
          skuId: data?.skuId,
        },
        params: {
          dataList: this.getSortList(data.skuImageList || []), // // 主图在第一个位置,
        },
      });
    },
    // 扫码
    async scanCode() {
      const exceptionCallBack = (msg) => {
        console.info(msg, "exceptionCallBack");
      };
      const callBack = (res) => {
        this.onScanSuccess(res);
      };
      try {
        this.$loading.show();
        await SrmAppCore.scanQrCode(callBack, exceptionCallBack);
      } finally {
        this.$loading.hide();
      }
    },
    onScanSuccess(decodedText) {
      this.scanVisible = false;
      if (decodedText) {
        this.queryItemCode(decodedText);
      }
    },
    onScanFail() {
      this.scanVisible = false;
    },
    async queryItemCode(barCode) {
      if (barCode) {
        const res = await fetchItemCodeWithCodeBar(barCode);
        if (res) {
          const params = this.listDs.queryParameter;
          this.listDs.addQueryParameter("itemParam", res.itemCode);
          this.listDs.setQueryParameter({ ...params, itemParam: res.itemCode });
          await this.listDs.refresh();
        }
      }
    },
  },
};
</script>

<style scoped lang='stylus'>
>>>.sku-list {
  .customize .customize-item:has(.customize-item-field) {
    justify-content: flex-start;
  }

  .customize .customize-item-field:has(>img) {
    width: fit-content;
  }

  .customize-item-field:has(.card-item-right) {
    width: calc(100vw - 142px); // 文字超出隐藏
    flex: unset;
    margin-left: 12px;

    .customize-item-field:has(.item-btn) {
      justify-content: flex-end;
    }

    // 按钮与图片底部对齐
    .card-item-right {
      height: 100px;
      display: flex !important;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .srm-icon.icon-scan {
    color: #AFAFAF;
    font-size: 24px;
    margin: 0 7px 0 4px;
    position: relative;
    z-index: 999;
  }
}
</style>
