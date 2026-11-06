import { http } from "srm-mobile-ui";
import { invert, isArray, isObject, isFunction, isString } from "lodash";
import ListHeader from "@/components/ListHeader";
export class PermissionCaller {
  constructor(permissionCodeMap) {
    this.data = {};
    this.permissionCodeMap = permissionCodeMap;
    this.init();
  }

  async init() {
    const res = await http.post("/iam/hzero/v1/menus/check-permissions", Object.values(this.permissionCodeMap))
      .catch((error) => {
        throw error;
      });
    if (res) {
      const invertCodeMap = invert(this.permissionCodeMap);
      res.map(({ code, approve }) => {
        const permissionKey = invertCodeMap[code];
        this.set(permissionKey, approve);
      });
      // 触发computed更新
      this.data = Object.assign({}, this.data);
    }
  }

  set(permissionKey, approve) {
    this.data[permissionKey] = approve;
  }

  get(permissionKey) {
    return this.data[permissionKey];
  }
}

export function formatListColumns(fieldsList, options = {}) {
  const { endRow = 10, showTitle, dataSet, rightTagRender } = options;
  let formRow = 0;
  const takeList = fieldsList.reduce((total, current) => {
    if (formRow >= endRow) {
      formRow++;
      return total;
    }
    const currentList = [];
    const item = isString(current) ? { fieldCode: current } : current;
    if (isArray(item)) {
      const formColList = item.reduce((childTotal, childCurrent, formCol) => {
        const childItem = isString(childCurrent) ? { fieldCode: childCurrent } : childCurrent;
        if (isObject(childItem)) {
          childTotal.push({ formRow, formCol, ...childItem });
        }
        return childTotal;
      }, []);
      if (formColList.length > 0) {
        currentList.push(...formColList);
        if (!formColList.every((childItem) => childItem.visible === false)) {
          formRow++;
        }
      }
    } else if (isObject(item)) {
      let baseItem = { ...item, formRow };
      if (formRow === 0) {
        baseItem = {
          // 顺序不可更改
          render: (value, record) => {
            const content = value || "-";
            return <ListHeader showTitle={showTitle} showMoreIcon={formRow > endRow} dataSet={dataSet}>
              {content}
              {isFunction(rightTagRender) && <div slot="rightTag">{rightTagRender(value, record)}</div>}
            </ListHeader>;
          },
          ...baseItem,
          fieldType: showTitle ? "EMPTY" : item.fieldType,
        };
      }
      currentList.push(baseItem);
      if (item.visible !== false) {
        formRow++;
      }
    }
    return total.concat(currentList);
  }, []);
  return takeList;
}

export function formatDetailColumns(fieldsList) {
  const newList = fieldsList.reduce((total, current) => {
    const currentList = [];
    const item = isString(current) ? { fieldCode: current } : current;
    if (isArray(item)) {
      item.forEach((childCurrent) => {
        const childItem = isString(childCurrent) ? { fieldCode: childCurrent } : childCurrent;
        if (childItem && isObject(childItem)) {
          currentList.push(childItem);
        }
      });
    } else if (isObject(item)) {
      currentList.push(item);
    }
    return total.concat(currentList);
  }, []);
  return newList;
}

export function formatColumns(fieldsList, options = {}) {
  const { takeFlag } = options;
  const newList = takeFlag ? formatListColumns(fieldsList, options) : formatDetailColumns(fieldsList, options);
  return newList;
}