export const ENUM_WORK_ITEM_RESULT = new Object({
  Ok: 0,
  Error: 1,
});

export function WorkItemResult(code, rest = {}) {
  return new Object({ code, ...rest });
}
