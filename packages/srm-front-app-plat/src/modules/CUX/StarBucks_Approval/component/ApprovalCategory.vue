<template>
  <srm-flex align="start" class="approval-category">
    <srm-flex-item flex="1" class="approval-category-scroll approval-category-scroll-left">
      <srm-checkbox-group v-model="categoryIndex">
        <srm-checkbox v-for="(category, index) in categoryList" :key="index"
                      :cancelable="false"
                      :option="category" position="right">
          <touch-feedback active-class-name="approval-category-document-item-active">
            <span class="approval-category-document-item">
              <span class="approval-category-document-item-text">
                {{ category.documentName }}
              </span>
            </span>
          </touch-feedback>
        </srm-checkbox>
      </srm-checkbox-group>
    </srm-flex-item>
  </srm-flex>
</template>

<script>

import { getTaskCategory } from "../api";

export default {
  modules: [ "smbl.workFlow" ],
  name: "ApprovalCategory",
  inject: {
    srmDropdown: {
      default: null,
    }
  },
  props: {
    type: {
      type: String,
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
    categoryIndex(val) {
      this.subCategoryIndex = [];
      if (val && val.length) {
        if (this.srmDropdown) {
          this.srmDropdown.select(val[0], val[0].documentName);
        }
        this.$emit("select", val[0]);
      }
    },
    subCategoryIndex(val) {
      if (val && val.length) {
        if (this.srmDropdown) {
          this.srmDropdown.select(val[0], val[0].categoryName);
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
      getTaskCategory(this.type).then((res) => {
        if (res && !res.failed) {
          this.categoryList = res;
          const category = {
            documentName: this.$T("smbl.workFlow.view.form.all").$D("全部"),
            documentCode: "ALL",
          };

          this.categoryList.unshift(category);
          this.$nextTick(() => {
            this.categoryIndex.push(category);
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

.approval-category {
  width 100%;
  height 324px;
  background white;
}

.approval-category-document-item {
  display -webkit-box;
  width 100%;
  font-size: 14px;
  color: $srm-font-color-default;
  background white
  margin-left 15px;
  height 54px;
  border-bottom #F6F6F6 1px solid;
}

.approval-category-document-item-active {
  color: $srm-theme-color-primary;
  font-weight bold;
  background white;
}

.approval-category-scroll {
  height: 100%;
  overflow-y: scroll
}

.approval-category-scroll-left {
  background white;
}

.approval-category-document-item-text {
  height 100%;
  width 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: flex;
  overflow hidden;
  align-items center;
}

.approval-category-item {
  display -webkit-box;
  margin-left 10px;
  width 100%;
  font-size: 14px;
  color: $srm-font-color-default;
  line-height: 20px;
  background white;
  text-align left;
  border-bottom #F6F6F6 solid 1px
}

.approval-category-item-text {
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
  .approval-category-document-item {
    background white
    color: #276EF1;
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
  color $srm-theme-color-primary;
  font-size 18px;
}
</style>
