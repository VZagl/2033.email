import do_w_item from "./do_w_item.js";
import {
  ENUM_WORK_ITEM_RESULT,
  WorkItemResult,
} from "./common/constWorkResult.js";

export default async (store = global.store) => {
  console.log("## do_work");
  const { outJson } = store;
  // console.log("<< outJson =", outJson);
  // console.log("# store =", store);
  const { inputFiles } = store;
  const keys = Object.keys(inputFiles);
  for (let i = 0; i < keys.length; i++) {
    const v = keys[i];
    // console.log("<<", outJson[v]);
    if (!outJson[v]) outJson[v] = new Object(null);
    const vOutResult = outJson[v];
    if (vOutResult.result?.code === ENUM_WORK_ITEM_RESULT.Ok) {
      console.log(`[${v}] ... skip`);
      continue;
    }
    try {
      vOutResult.result = await do_w_item({ key: v, files: inputFiles[v] });
      // vOutResult.result = ENUM_WORK_ITEM_RESULT.Ok;
      // delete vOutResult.result.error;
      if (vOutResult.result.code === ENUM_WORK_ITEM_RESULT.Ok) {
        console.log(`[${v}] ... Ok`);
      } else {
        console.log(`[${v}] ... Error`);
      }
    } catch (error) {
      vOutResult.result = WorkItemResult(ENUM_WORK_ITEM_RESULT.error, {
        descr: `Ошибка обработки л/с`,
        data: { key: v, files: inputFiles[v] },
        error,
      });
      console.log(`[${v}] ... Error:`, error);
      throw error;
    }
  }
};
