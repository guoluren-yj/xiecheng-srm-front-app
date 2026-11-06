<template>
  <div class="content">
    <nav-head :title="$T('smbl.common.view.title.packingMaterialManage').$D('包材管理')"/>
    <srm-list class="list" :columns="getColumns()" :data-set="dataSet" :buttons="getButtons()" @itemClick="onItemClick">
      <div slot="filter" class="list-header-view">
        <span class="total-count">{{ $T("smbl.common.view.packingMaterialCount", [ dataSet.totalCount ]).$D("当前共有{}条包材信息") }}</span>
        <div class="edit-button" @click="editButtonAction">{{ dataSet.editFlag ? $T("smbl.common.view.button.cancel").$D("取消") : $T("smbl.common.view.button.edit").$D("编辑") }}</div>
      </div>
    </srm-list>
    <XBPackingMaterialSelecter v-model="showChangeSelecterFlag"
                               :title="$T('smbl.common.view.title.modifyPackingMaterial').$D('修改包材信息')"
                               :current-item-id="shouldChangeItem.itemCode"
                               @didSelectAtItem="didSelectAtItem" />
    <XBPackingMaterialSelecter v-model="showAddMaterialFlag"
                               :title="$T('smbl.common.view.title.addPackingMaterial').$D('新建包材信息')"
                               @didSelectAtItem="didAddMaterialItem" />
    <div v-show="!dataSet.editFlag" class="action-buttons">
      <srm-button size="x-large" :fill="false" @click="addMaterialAction">
        {{ $T("smbl.common.view.add").$D("新建") }}
      </srm-button>
      <srm-button size="x-large" fill style="margin-left: 15px;" @click="saveMaterialAction">
        {{ $T("smbl.common.view.save").$D("保存") }}
      </srm-button>
    </div>
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import packingMaterialsDatasource from "../datasource/XBPackingMaterialsDS";
import { DataSet } from "srm-mobile-ui";
import XBPackingMaterialSelecter from "../components/XBPackingMaterialSelecter";
import { savePackingMaterialApi } from "../api/index";

export default {
  modules: [ "smbl.common", "sinv.deliverycreation" ],
  name: "XBPackingMaterialsDetail",
  components: {
    NavHead,
    XBPackingMaterialSelecter,
  },
  data () {
    return {
      dataSet: null,
      showChangeSelecterFlag: false, // 控制显示“修改包材”
      shouldChangeItem: {},
      showAddMaterialFlag: false, // 控制显示“添加包材”
      asnHeaderId: "", // 送货单ID
    };
  },
  beforeMount() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    this.dataSet = new DataSet(packingMaterialsDatasource(this.asnHeaderId));
    this.dataSet.addQueryParameter("asnHeaderId", this.asnHeaderId);
    this.dataSet.events.beforeDelete = (ds, datas) => {
      let ids = [];

      for (let index = 0; index < datas.length; index++) {
        const ele = datas[index];

        if (ele.asnItemId) {
          ids.push(ele.asnItemId);
        }
      }
      datas.splice(0, datas.length);
      datas.push(...ids);
      return true;
    };
    this.dataSet.events.afterDelete = () => {
      this.dataSet.editFlag = false;
    };
  },
  methods: {
    addMaterialAction() {
      this.showAddMaterialFlag = true;
    },
    didAddMaterialItem(item) {
      this.dataSet.create({
        itemName: item.itemName,
        itemCode: item.itemCode,
        itemId: item.itemId,
        uomName: item.uomName,
        specifications: item.specifications,
        localChanged: true, // 标记本地变化的item
        asnHeaderId: this.asnHeaderId,
        tenantId: localStorage.getItem("organizationId"),
      }, 0);
    },
    // 保存按钮事件
    async saveMaterialAction() {
      // 遍历获取全部的数据，将已变化的数据添加到列表中
      let changedList = [];

      for (let index = 0; index < this.dataSet.records.length; index++) {
        const element = this.dataSet.records[index];
        const item = element.data;

        if (Number(item.quantity) !== Number(item.localQuantity) && (!item.localQuantity || Number(item.localQuantity) === 0)) {
          // 数目变化了，并且数目不合法，提示请输入数量
          this.$notification.open({
            message: this.$T("smbl.common.view.inputErrorNumber").$D("请输入正确的数目"),
            class: "notification"
          });
          return;
        }
        if (Number(item.quantity) !== Number(item.localQuantity) || item.localChanged) {
          changedList.push(item);
        }
      }
      for (let index = 0; index < changedList.length; index++) {
        const element = changedList[index];

        element.quantity = element.localQuantity;
      }

      if (changedList.length === 0) {
        // 没有变化
        return;
      }
      // 请求保存
      await savePackingMaterialApi(changedList).then(() => {
        this.dataSet.refresh();
      });
    },
    didSelectAtItem(val) {
      // 本次选择相同，不执行并抛出提示
      if (this.shouldChangeItem.itemCode === val.itemCode) {
        return;
      }
      this.shouldChangeItem.localChanged = true; // 标记为已变化
      Object.assign(this.shouldChangeItem, val);
    },
    onItemClick() {
      // console.log("item = ", item);
    },
    editButtonAction() {
      this.dataSet.editFlag = !this.dataSet.editFlag;
    },
    codeButtonAction(item) {
      if (this.dataSet.editFlag) {
        this.dataSet.editFlag = false;
      }
      this.showChangeSelecterFlag = true;
      this.shouldChangeItem = item;
    },
    getButtons() {
      return [ "delete" ];
    },
    getColumns() {
      return [ {
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => {
          return <SrmListHeader>
            <span>{item.itemName}</span>
          </SrmListHeader>;
        }
      }, {
        fieldCode: "uomName",
      }, {
        fieldCode: "specifications",
      }, {
        // fieldCode: "companyName",
        fieldType: "EMPTY",
        render: (val, item) => {
          item.localQuantity = item.quantity;
          return (
            <div class="material-count">
              <div class="material-content code" onClick={() => {
                this.codeButtonAction(item);
              }}>
                <span class="name">{this.$T("sinv.deliverycreation.view.message.itemCode").$D("编号")}：{item.itemCode}</span>
                <span class="srm-icon icon-chevron-right"></span>
              </div>
              <div class="material-content count">
                <span>{this.$T("sinv.deliverycreation.view.message.quantity").$D("数量")}：</span>
                <SrmInputField size="small" type="number" theme="transparent" class="input-field" v-model={item.localQuantity}/>
              </div>
            </div>
          );
        },
      }, ];
    }
  },
};
</script>

<style lang="stylus" scoped>
.content {
  width: 100%;
  height: 100vh;
  position: relative;
}
.list {
  padding-bottom: calc(60px + constant(safe-area-inset-bottom));
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

.action-buttons {
  width: 100%;
  height: 48px;
  padding: 0 15px;
  position: absolute;
  bottom: calc(12px + env(safe-area-inset-bottom));
  bottom: calc(12px + constant(safe-area-inset-bottom));
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header-view {
  display: flex;
  align-items: center;
  height: 36px;
  justify-content: space-between;
  font-size: 14;

  .total-count {
    color: var(--color-font-default);
    margin-left: 15px;
  }
  .edit-button {
    color: var(--color-other-default-b);
    margin-right: 15px;
  }
}

>>> .customize-item-field {
    width: 100%;
}

.material-count {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .material-content {
        padding: 0 4px;
        background-color: var(--background-color-field);
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        flex: 1;
        flex-shrink: 0;
        width: 50%;
    }
    .code {
        justify-content: space-between;
        align-items: center;
        .name {
            flex-shrink: 1;
            white-space: nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
        }
    }
    .count {
        justify-content: flex-start;
        align-items: center;
        margin-left: 7px;
        .input-field {
            flex: 1;
            overflow: hidden;
        }
        span {
            flex-shrink: 0;
        }
    }
}
</style>
