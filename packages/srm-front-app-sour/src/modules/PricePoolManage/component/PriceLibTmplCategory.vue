<template>
  <srm-flex align="start" class="srm-category">
    <srm-flex-item flex="1" class="srm-category-scroll srm-category-scroll-left">
      <srm-checkbox-group v-model="categoryIndex">
        <srm-checkbox v-for="(category, index) in categoryList" :key="index"
                      :cancelable="false"
                      :option="category" position="right">
          <touch-feedback active-class-name="srm-category-document-item-active">
            <span class="srm-category-document-item">
              <span class="srm-category-document-item-text">
                {{ category.templateName }}
              </span>
            </span>
          </touch-feedback>
        </srm-checkbox>
      </srm-checkbox-group>
    </srm-flex-item>
  </srm-flex>
</template>

<script>

import { getAllPriceLibTmplDimsApi } from "../api";

export default {
  modules: [ "smbl.common", "ssrc.priceLibDimension" ],
  name: "PriceLibTmplCategory",
  inject: {
    srmDropdown: {
      default: null,
    }
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    // 初始数据
    initCategory: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      categoryList: [],
      subCategoryList: [],
      categoryIndex: [],
      subCategoryIndex: [],
    };
  },
  watch: {
    type() {
      this.fetchCategoryList();
    },
    categoryIndex(val) {
      this.subCategoryIndex = [];
      if (val && val.length) {
        if (this.srmDropdown) {
          this.srmDropdown.select(val[0], val[0].templateName);
        }
        this.$emit("select", val[0]);
      }
    },
    subCategoryIndex(val) {
      if (val && val.length) {
        if (this.srmDropdown) {
          this.srmDropdown.select(val[0], val[0].templateName);
        }
        this.$emit("select", val[0]);
      }
    }
  },
  mounted() {
    this.fetchCategoryList();
  },
  methods: {
    fetchCategoryList() {
      const params = {
        page: 0,
        size: 10000
      };
      getAllPriceLibTmplDimsApi(params).then((res) => {
        if (res && !res.failed) {
          let category = {};
          let deleteIndex = "";
          this.categoryList = res.content.filter((e) => e.templateStatus === "RELEASED" && e.menuId);
          if (!this.categoryList.length) {
            this.$notification.open({
              message: this.$T("ssrc.priceLibDimension.view.message.noneRelesae").$D("没有已发布的价格库"),
              description: res.message,
              class: "notification",
              duration: 3
            });
            return false;
          }
          if (this.initCategory !== null) {
            this.categoryList.map((e, index) => {
              if (e.templateCode === this.initCategory.templateCode) {
                deleteIndex = index;
              }
            });
            const tempCategory = this.categoryList[deleteIndex];
            this.categoryList.splice(deleteIndex, 1);
            category = tempCategory;
          } else {
            category = {
              templateName: this.$T("smbl.common.view.all").$D("全部"),
              templateCode: "ALL",
            };
          }

          this.categoryList.unshift(category);
          this.$nextTick(() => {
            this.categoryIndex = [ category ];
          });
        } else {
          this.categoryList = [];
          const category = {
            templateName: this.$T("smbl.common.view.all").$D("全部"),
            templateCode: "ALL",
          };
          this.categoryList.unshift(category);
          this.$nextTick(() => {
            this.categoryIndex = [ category ];
          });
        }
      });
    }
  }
}
;
</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

.srm-category {
  width 100%;
  height 324px;
  background var(--background-color-empty);
}

.srm-category-document-item {
  display -webkit-box;
  width 100%;
  font-size: 14px;
  color: var(--font-color-default);
  background var(--background-color-empty);
  margin-left 15px;
  height 54px;
  border-bottom var(--split-line-color-primary) 1px solid;
}

.srm-category-document-item-active {
  color var(--font-color-primary);
  font-weight bold;
  background var(--background-color-empty);
}

.srm-category-scroll {
  height: 100%;
  overflow-y: scroll
}

.srm-category-scroll-left {
  background var(--background-color-empty);
}

.srm-category-document-item-text {
  height 100%;
  width 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: flex;
  overflow hidden;
  align-items center;
}

.srm-category-item {
  display -webkit-box;
  margin-left 10px;
  width 100%;
  font-size: 14px;
  color: var(--font-color-default);
  line-height: 20px;
  background var(--background-color-empty);
  text-align left;
  border-bottom var(--split-line-color-primary) solid 1px
}

.srm-category-item-text {
  margin 20px 0;
  padding 0 30px 0 10px;
  width 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow hidden;
}

.srm-check-box-button-checked + .srm-check-box-content {
  .srm-category-document-item {
    background var(--background-color-empty);
    color var(--font-color-primary);
    font-weight bold;
  }
}

>>> .srm-check-box-button {
  position absolute;
  right 0;
  display none;
}

>>> .srm-check-box-button-checked {
  display block;
  background none;
  border none;
  color var(--font-color-primary);
  font-size 18px;
}
</style>
