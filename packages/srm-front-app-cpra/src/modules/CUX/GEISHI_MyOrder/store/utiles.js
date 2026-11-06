import { isEmpty, cloneDeep } from "lodash";
import { $T, DataSet, SrmList } from "srm-mobile-ui";
import {
  associatedPcCheck,
  associatedPcAmountCheck,
  budgetVerification,
} from "../api/index";

/**
 * 订单提交预校验协议与占用金额
 * @param {Number} pageType 页面来源： 1(明细页提交) | 2(列表页提交) | 3(变更页提交)
 * @param {Object} body 调用校验接口入参
 */
export async function associatedPcAndAmountCheck(pageType, body, _this) {
  const newBody = cloneDeep(body);
  if ([1, 3].includes(pageType)) {
    // 明细页面提交只有一条数据
    const [{ pcHeaderIdLov, poHeaderId, poLineExpVOList = [] }] = newBody;
    // 处理新增行没有头id 后续有问题可以给后端处理
    newBody[0].poLineExpVOList = poLineExpVOList.map((i) => {
      if (!i.poHeaderId) return { ...i, poHeaderId };
      return i;
    });
    // 前端需校验 先维护头关联采购协议字段，隐藏后再维护行关联采购协议 的场景
    if (
      pcHeaderIdLov &&
      poLineExpVOList.find(
        ({ pcSubjectId, priceSource }) =>
          pcSubjectId && priceSource !== "CONTRACT",
      )
    ) {
      console.log(343434);
      _this.$loading.hide();
      return _this.$notification.open({
        message: $T(
          "sodr.workspace.view.message.associatedPcAndAmountCheck",
        ).$D(
          "同一个订单下，订单整单关联的协议信息和订单行关联的协议信息不能并存",
        ),
      });
    }
  }
  const pcRes = await associatedPcCheck({ pageType, body: newBody });
  if (pcRes.failed) {
    console.log(353535);
    _this.$loading.hide();
    return false;
  }
  if (!isEmpty(pcRes)) {
    const columns = [
      {
        fieldCode: "nums",
      },
      {
        fieldCode: "message",
      },
    ];
    const ds = new DataSet({
      paging: false,
      selection: false,
      fields: [
        {
          fieldCode: "nums",
          fieldName:
            pageType === 2
              ? $T("sodr.workspace.gaishi.model.common.displayPoNum").$D(
                  "订单号",
                )
              : $T("sodr.workspace.gaishi.model.common.orderLineNum").$D(
                  "订单行号",
                ),
        },
        {
          fieldCode: "message",
          fieldName: $T("sodr.workspace.gaishi.model.common.message").$D(
            "提示",
          ),
        },
      ],
      data: pcRes,
    });
    _this.$dialog({
      closable: true,
      content: <div>
        <p>
          {$T("sodr.workspace.gaishi.view.message.associatedPcCheck").$D(
            "以下【订单信息】和【关联协议的信息】有差异，请检查关联协议是否选择正确。若选择错误，请修改更新后提交；若选择正常，请继续提交。",
          )}
        </p>
        <SrmList dataSet={ds} columns={columns} />
      </div>,
      onCancel() {
        return false;
      },
    });
  }
  const pcAmountRes = await associatedPcAmountCheck({
    pageType,
    body: newBody,
  });
  if (pcAmountRes && pcAmountRes.failed) {
    console.log(45435454);
    _this.$loading.hide();
    return false;
  }
  if (!isEmpty(pcAmountRes)) {
    const amountColumns = [
      {
        fieldCode: "executionBillNum",
      },
      {
        fieldCode: "executionBillLineNum",
      },
      {
        fieldCode: "contractNum",
      },
      {
        fieldCode: "errorMessage",
      },
    ];
    const amountDs = new DataSet({
      paging: false,
      selection: false,
      fields: [
        {
          fieldCode: "executionBillNum",
          fieldName: $T(
            "sodr.workspace.gaishi.model.common.executionBillNum",
          ).$D("订单号"),
        },
        {
          fieldCode: "executionBillLineNum",
          fieldName: $T("sodr.workspace.gaishi.model.common.lineNum").$D(
            "行号",
          ),
        },
        {
          fieldCode: "contractNum",
          fieldName: $T("sodr.workspace.gaishi.model.common.contractNum").$D(
            "占用采购协议",
          ),
        },
        {
          fieldCode: "errorMessage",
          fieldName: $T("sodr.workspace.gaishi.model.confirm.title").$D("提示"),
        },
      ],
      data: pcAmountRes,
    });
    _this.$dialog({
      closable: true,
      content:
        <div>
          <p>
            {$T(
              "sodr.workspace.gaishi.view.message.associatedPcAmountCheck",
            ).$D("以下订单行已超预警线或超量占用，请确认是否继续提交。")}
          </p>
          <SrmList dataSet={amountDs} columns={amountColumns} />
        </div>,
      onCancel() {
        return false;
      },
    });
  }
  return true;
}

/**
 *  handleBudgetVerification
 * 订单提交预算校验(订单工作台)
 * @param {*} payload 参数
 * @param {Function} callback 订单提交
 */
export async function handleBudgetVerification(
  payload = [],
  callback = (e) => e,
  _this,
) {
  const res = await budgetVerification(payload);
  if (!res.failed) {
    if (isEmpty(res)) {
      await callback();
      return true;
    }
    const errList = res.filter((i) => i.errorFlag !== "0");
    if (isEmpty(errList)) {
      await callback();
      return true;
    }
    const budgetVerificationColumns = [
      {
        fieldCode: "displayPoNum",
      },
      {
        fieldCode: "displayLineNum",
      },
      {
        fieldCode: "errorMessage",
      },
    ];
    const budgetVerificationDs = new DataSet({
      paging: false,
      selection: false,
      fields: [
        {
          fieldCode: "displayPoNum",
          fieldName: $T("sodr.workspace.gaishi.model.common.displayPoNum").$D(
            "订单号",
          ),
        },
        {
          fieldCode: "displayLineNum",
          fieldName: $T("sodr.workspace.gaishi.model.common.displayLineNum").$D(
            "行号",
          ),
        },
        {
          fieldCode: "errorMessage",
          fieldName: $T("sodr.workspace.gaishi.model.confirm.errorMessage").$D(
            "提示",
          ),
        },
      ],
      data: errList,
    });
    const modalPromise = new Promise((resolve) => {
      _this.$dialog({
        title: $T("sodr.workspace.gaishi.model.common.budgetCheckTip").$D(
          "预算校验提示",
        ),
        closable: true,
        content:
          <div>
            <p>
              {$T(
                "sodr.workspace.gaishi.view.message.associatedPcAmountCheck",
              ).$D("以下订单行已超预警线或超量占用，请确认是否继续提交？")}
            </p>
            <SrmList
              dataSet={budgetVerificationDs}
              columns={budgetVerificationColumns}
            />
          </div>,
        async onOk() {
          await callback();
          resolve(true);
        },
      });
    });
    const modalRes = await modalPromise;
    return modalRes;
  } else {
    return false;
  }
}

/**
 * 付款计划更新弹窗（维护页面提交展示）
 * @param {Object} body 调用是否弹窗接口所需参数
 */
// export async function openTermsModalForSubmit({ body }, _this) {
//   const res = await paymentCheckSubmit(body);
//   if (res && !res.failed) {
//     const { enableEdit, paymentPlanDTO } = res;
//     if (enableEdit === 1) {
//       const { planNum, paymentAmount, termHeaderId, termNum } = paymentPlanDTO;
//       const modalPromise = new Promise((resolve) => {
//         let currentModal;
//         // 获取弹窗内组件保存方法
//         const onPartChildRef = ({ handleSave }) => {
//           if (currentModal) {
//             currentModal.update({
//               okProps: {
//                 loading: false,
//               },
//               onOk: async () => {
//                 const okRes = await handleSave();
//                 if (okRes) {
//                   return resolve(true);
//                 }
//                 return false;
//               },
//             });
//           }
//         };
//         _this.$popup({
//           title: $T("sodr.workspace.gaishi.model.termsModal.paymentPlanAdjustment").$D("付款计划调整"),
//           showHeader: true,
//           showClose: true,
//           position: "bottom",
//           showBack: true,
//           content:
//         });
//         currentModal = Modal.open({
//           afterClose: () => resolve(false),
//           okProps: {
//             loading: true,
//           },
//           children: (
//             <EmbedPage
//               sourceAmount={paymentAmount}
//               sourcePageData={body} // 订单头数据
//               termsData={{ termHeaderId, termNum }} // 条款信息: 条款编码|条款id
//               onPartChildRef={onPartChildRef}
//               contentStyleType="fullfit"
//               href={`/ssta/payment-plan/detail-by-num/${planNum}?operate=edit&source=sodr`}
//             />
//           ),
//         });
//       });
//       const modalRes = await modalPromise;
//       return modalRes;
//     }
//     return true;
//   }
// }
