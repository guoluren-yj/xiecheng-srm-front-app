import SrmAppCore from "srm-front-app-core";
import { $T } from "srm-mobile-ui"; // SrmUtil
import { Exception } from "../../../utils/index";
import { updateCux3sbio, updateQurnningApprovalData } from "../../PurchaseReqWorkbench/api/index";
import RichText from "@/components/RichText.vue";

// 查看单据 弹框
function openOtherDoc({ prHeaderId = "", vm }) {
  if (prHeaderId) {
    vm.$router.push({
      path: "/appCpra/PurchaseReqWorkbenchDetail",
      query: {
        prHeaderId: prHeaderId,
        type: "readOnly",
      },
    });
  }
}

// 跳转商品页面
const routerMall = ({ record, vm }) => {
  const {
    uomCodeAndName,
    currencyCode,
    itemName,
    itemCode,
    productId,
    localCurrencyNoTaxUnit,
    localCurrencyTaxUnit,
    categoryName,
    attributeVarchar40,
    taxRate,
  } = record;
  vm.$router.push({
    path: "/appPlat/skuPreview",
    query: {
      skuId: productId, // 商品id
      unitPrice: localCurrencyTaxUnit, // 含税单价
      unTaxedPrice: localCurrencyNoTaxUnit, // 未税单价
      uom: uomCodeAndName, // 单位
      tax: taxRate, // 税率
      currency: currencyCode, // 币种
      itemName, // 物料编码
      itemCode, // 物料名称
      categoryCode: attributeVarchar40, // 品类编码
      categoryName, // 品类名称
    },
  });
};

//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
function zhenYunToDetail(vm) {
  return [
    {
      fieldCode: "attributeVarchar15",
      formRow: 90,
      fieldName: $T("sprm.common.model.cux.attributeVarchar15").$D(
        "关联采购申请查询"
      ),
      render: (_, item) =>
        <span style="color: var(--color-other-default-b)">
          {item.attributeVarchar18Meaning}
        </span>,
      callBack: (record) => {
        openOtherDoc({ prHeaderId: record.attributeVarchar18, vm });
      },
    },
    {
      formRow: 100,
      formCol: 10,
      fieldCode: "attributeLongtext22",
      fieldName: "申请原因",
      render: (val, item) => {
        return <RichText val={val} />;
      },
    },
  ];
}

// function saveAttribute(vm) {
//   if (!vm?.basicInfoDataSet?.validate()) {
//     return false;
//   }
//   if (!vm?.prLineDataSet?.validate()) {
//     return false;
//   }
//   // 保存数据
//   return new Promise((resolve, reject) => {
//     vm.prLineDataSet.toData().map((data) => {
//       data.neededDate = SrmUtil.dateFormat(
//         data.neededDate,
//         "yyyy-MM-dd hh:mm:ss"
//       );
//     });
//     updateApi({
//       ...vm?.basicInfoDataSet?.toData()[0],
//       prLineList: vm?.prLineDataSet?.toData(),
//     }).then((res) => {
//       if (res && res.failed) {
//         // eslint-disable-next-line new-cap
//         Exception(vm, res?.message, []);
//         reject(false);
//       }
//       resolve(true);
//     });
//   });
// }

function saveSbioAttribute(vm) {
  const { formDom } = vm.parameters;
  if (vm?.basicInfoDataSet && formDom === "1") {
    console.log(vm?.basicInfoDataSet?.toData(), vm.prLineDataSet.toData(), vm.prLineDataSet.validate());
    const [headerData = {}] = vm?.basicInfoDataSet?.toData() || [];
    if (
      ["01", "02"].includes(headerData?.attributeVarchar26) ||
      [2, "2"].includes(headerData?.attributeVarchar7)
    ) {
      if (!vm.prLineDataSet.validate()) {
        console.log("行校验不通过");
        return false;
      }
      if (!vm.basicInfoDataSet.validate()) {
        console.log("头校验不通过");
        return false;
      }
      return new Promise((resolve, reject) => {
        updateCux3sbio({
          ...headerData,
          prLineList: vm?.prLineDataSet?.toData(),
        }).then((res) => {
          if (res && res.failed) {
            // eslint-disable-next-line new-cap
            Exception(vm, res?.message, []);
            reject(false);
          } else {
            resolve(true);
          }
        }).catch(() => {
          reject(false);
        });
      });
    } else {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  } else {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

// 宁波球冠 - 支持申请行信息可编辑保存
function saveQrunningApprovalAttribute(vm) {
  const taskInfo = vm && vm.$parent && (vm.$parent.taskInfo || vm.$parent.$parent.taskInfo);
  const formDefinitionCode = (taskInfo || {}).formDefinitionCode;
  if (formDefinitionCode === 'SPUC_SRM_SUBMIT_DOC:EDIT_DOM' && vm && vm.basicInfoDataSet && vm.prLineDataSet) {
    const [headerData = {}] = vm.basicInfoDataSet.toData() || [];
    
    if (!vm.prLineDataSet.validate()) {
      console.log("行校验不通过");
      return false;
    }
    if (!vm.basicInfoDataSet.validate()) {
      console.log("头校验不通过");
      return false;
    }
    return new Promise((resolve, reject) => {
      updateQurnningApprovalData({
        ...headerData,
        prLineList: vm.prLineDataSet.toData() || [],
      }).then((res) => {
        if (res && res.failed) {
          // eslint-disable-next-line new-cap
          Exception(vm, res.message, []);
          reject(false);
        } else {
          resolve(true);
        }
      }).catch(() => {
        reject(false);
      });
    });
  } else {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

function getColumnForXxjt(vm) {
  return [
    {
      fieldCode: "routerMall",
      formRow: 900,
      fieldName: $T("sprm.common.model.cux.routerMall").$D("商品跳转"),
      render: () =>
        <span style="color: #276EF1;">
          {$T("hzero.common.buttonhzero.common.button.look").$D("查看")}
        </span>,
      callBack: (record) => {
        routerMall({ record, vm });
      },
    },
  ];
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-WEILONG": {
    getColumns: zhenYunToDetail, //key 标准方法名称，value二开方法
    getEditColumns: zhenYunToDetail,
  },
  // "SRM-DQSOLAR": {
  //   getApproveCheck: saveAttribute,
  // },
  "SRM-3SBIO": {
    getApproveCheck: saveSbioAttribute,
  },
  "SRM-XXJT": {
    getColumns: getColumnForXxjt,
  },
  "SRM-QRUNNING": {
    getBeforeApproveSaveData: saveQrunningApprovalAttribute,
  },
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
