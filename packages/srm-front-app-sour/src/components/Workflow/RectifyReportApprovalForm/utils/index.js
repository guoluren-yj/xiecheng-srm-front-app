import { take, isArray, isObject, isFunction } from "lodash";
import ListHeader from "@/components/ListHeader";

export function formatListColumns(fieldsList, options = {}) {
  const { endRow = 10, showTitle, rightTagRender } = options;
  const filterList = fieldsList.filter(Boolean);
  const takeList = take(filterList, endRow).reduce((total, item, formRow) => {
    const currentList = [];
    if (isArray(item)) {
      item.forEach((childItem, formCol) => {
        if (isObject(childItem)) {
          currentList.push({ formRow, formCol, ...childItem });
        }
      });
    } else if (isObject(item)) {
      if (formRow === 0) {
        currentList.push({
          // 顺序不可更改
          render: (value, record) => {
            const content = value || "-";
            return <ListHeader showTitle={showTitle} showMoreIcon={filterList.length > endRow}>
              {content}
              {isFunction(rightTagRender) && <div slot="rightTag">{rightTagRender(value, record)}</div>}
            </ListHeader>;
          },
          ...item,
          fieldType: showTitle ? "EMPTY" : item.fieldType,
        });
      } else {
        currentList.push({ formRow, ...item });
      }
    }
    return total.concat(currentList);
  }, []);
  return takeList;
}

export function formatDetailColumns(fieldsList) {
  const newList = fieldsList.flat().filter(Boolean);
  return newList;
}

export function formatColumns(fieldsList, options = {}) {
  const { takeFlag } = options;
  const newList = takeFlag ? formatListColumns(fieldsList, options) : formatDetailColumns(fieldsList, options);
  return newList;
}

export const getPcUnitCodeMap = () => ({
  basicInfo: "SQAM.INITIATED_8D.DETAIL.BASIC",
  relatedQIReport: "SQAM.INITIATED_8D.DETAIL.CORRELATION_8D_LIST",
  relatedQCDoc: "SQAM.INITIATED_8D.DETAIL.INSPECT",
  relatedQCAffair: "SQAM.INITIATED_8D.DETAIL.TRX",
  problemDesc: "SQAM.INITIATED_8D.DETAIL.PROBLEM",
  groupMember: "SQAM.INITIATED_8D.DETAIL.GROUPMEMBER",
  continueProvide: "SQAM.INITIATED_8D.DETAIL.TEMPMEASURE",
  shortMeature: "SQAM.INITIATED_8D.DETAIL.SHORTMEASURES",
  reasonAnalyze: "SQAM.INITIATED_8D.DETAIL.ROOTCAUSE",
  correctMeature: "SQAM.INITIATED_8D.DETAIL.PERMANENTACTION",
  applyItem: "SQAM.INITIATED_8D.DETAIL.OTHERAPPLICABLE",
  standard: "SQAM.INITIATED_8D.DETAIL.STANDARDIZATION",
  congratulation: "SQAM.INITIATED_8D.DETAIL.TEAMCONGRATULATIONS",
  otherInfo: "SQAM.INITIATED_8D.DETAIL.OTHERINFO",
  effectTrack: "SQAM.INITIATED_8D.DETAIL.RESULTSTRACKING",
  customFormA: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM",
  customFormB: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM_B",
  customFormC: "SQAM.INITIATED_8D.DETAIL.CUSZ_FORM_C",
});

export const getStateKeyMap = () => ({
  continueProvide: "initiated8DProvide",
  shortMeature: "initiated8DFollowUp",
  reasonAnalyze: "initiated8DReason",
  correctMeature: "initiated8DSolution",
  applyItem: "initiated8DSuit",
  standard: "initiated8DStandard",
});