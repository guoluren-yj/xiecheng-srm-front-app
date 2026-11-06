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