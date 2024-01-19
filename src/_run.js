"use strict";

import path from "path";

import init_store from "./init_store.js";
import do_init from "./do_init.js";
import do_work from "./do_work.js";
import do_save_out_json from "./do_save_out_json.js";

//------------------------------------------------------------------
init_store({ taskNum: "2033", taskDate: "2023-12-15" });
const store = global.store;
const rep2033date = "2023-12-15";
//------------------------------------------------------------------
store.dirInp =
  //
  // `D:\\WORK\\Report\\!2033.${rep2033date}.Prof.!\\OUT\\${rep2033date}\\на_отправку\\`;
  path.join(store.dirProg, "inp");
//------------------------------------------------------------------
await do_init();
try {
  await do_work();
} finally {
  console.log("# finally");
  await do_save_out_json();
  console.log("# end");

  // console.log("\r\n# store =", JSON.stringify(store, null, "\t"));
}
