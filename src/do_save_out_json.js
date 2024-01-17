// import fs from "fs";
import fse from "fs-extra";
import * as path from "path";

export default async (store = global.store) => {
  console.log("## do_save_out_json");
  const fileJson = path.join(store.dirInp, "email.json");
  await fse
    .writeFile(fileJson, JSON.stringify(store.outJson, null, "\t"), {
      encoding: "utf8",
      flag: "w+",
    })
    .then(() => {
      console.log("\tsave ok");
    })
    .catch((err) => {
      console.log("\tsave error:");
      // console.error(err);
      throw err;
    });
};
