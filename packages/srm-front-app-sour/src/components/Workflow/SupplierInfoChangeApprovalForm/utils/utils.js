/*
 * @Date: 2025-04-22 15:39:13
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2024, Hand
 */
// 标红标识
export const getRedFlag = ({ name, record }) => {
  let flag =
      [ "CREATE", "DELETE" ].includes(record.objectFlag) ||
      [ "insert", "CREATE", "DELETE" ].includes(record.firmChangeBeanStateFlag) ||
      record[`${name}Flag`] === "UPDATE" ||
      [ "insert", "delete" ].includes(record.supChangeBeanStateFlag) ||
      [ "update", "insert", "delete", "UPDATE", "DELETE", "INSERT" ].includes(
        record[`${name}StateFlag`]
      );
  return flag;
};

// 标红渲染
export const renderRedNode = ({ name, record, code }) => {
  if (record) {
    const redFlag = getRedFlag({ name, record });
    return <span style={{ color: redFlag && "red" }}>
      {record[code] || record[name] || "-"}
    </span>;
  }
  return "-";
};