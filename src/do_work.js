import do_w_item from "./do_w_item.js";
import {
  ENUM_WORK_ITEM_RESULT,
  WorkItemResult,
} from "./common/constWorkItemResult.js";

export default async (store = global.store) => {
  console.log("## do_work");
  const { outJson } = store;
  // console.log("<< outJson =", outJson);
  // console.log("# store =", store);
  const { inputFiles } = store;
  const keys = Object.keys(inputFiles);
  for (let i = 0; i < keys.length; i++) {
    const v = keys[i];
    let vOutResult = {};
    // console.log("<<", outJson[v]);
    if (!outJson[v]) {
      outJson[v] = {};
    } else {
      if (outJson[v].code === ENUM_WORK_ITEM_RESULT.Ok) {
        console.log(`[${v}] ... skip`);
        continue;
      }
    }
    console.log(`[${v}]`);
    try {
      const result = await do_w_item({ key: v, files: inputFiles[v] });
      // console.log("# result =", result);
      vOutResult = WorkItemResult(ENUM_WORK_ITEM_RESULT.Ok, { result });
      console.log(`... Ok`);
    } catch (reason) {
      vOutResult = WorkItemResult(ENUM_WORK_ITEM_RESULT.Error, {
        descr: `Ошибка обработки л/с`,
        // data: { key: v, files: inputFiles[v] },
        reason,
      });
      console.log(`[${v}] ... Error:`, reason);
      // throw reason;
    }
    outJson[v] = vOutResult;
  }
};
