export const ENUM_WORK_ITEM_RESULT = new Object({
  Ok: 0,
  Error: 1,
});

export const WorkItemResult = (code, ...data) => {
  const res = { code, data: data.length > 0 ? data : undefined };
  // const res = { code, ...data };
  // console.log("## WorkItemResult/res =", res);
  return res;
};
