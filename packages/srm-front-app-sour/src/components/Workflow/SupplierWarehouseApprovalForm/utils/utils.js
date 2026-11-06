// 标红标识
export const getRedFlag = ({ name, record }) => {
  let flag =
      [ "CREATE", "DELETE" ].includes(record.objectFlag) ||
      record[`${name}Flag`] === "UPDATE";
  return flag;
};

// 标红渲染
export const renderFieldNode = ({ name, record, code, needRed = false }) => {
  if (record) {
    const redFlag = getRedFlag({ name, record });
    return <span style={{ color: needRed && redFlag && "red" }}>
      {record[code] || record[name] || "-"}
    </span>;
  }
  return "-";
};