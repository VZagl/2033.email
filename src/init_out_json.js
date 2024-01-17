// import fs from "fs";
import fse from "fs-extra";
import path from "path";

export default async (store = global.store) => {
  console.log("## init_out_json");
  store.outJson = {};
  const fileJson = path.join(store.dirInp, "email.json");
  try {
    const resFileAccess = await fse.access(fileJson);
    // console.log("## init_out_json > fse.access() = ", resFileAccess);
  } catch {
    // const errMsg = `!!! Error access to JSON [${fileJson}]`;
    // console.log(errMsg);
    // throw errMsg;
    return;
  }
  const resData = await fse.readFile(fileJson, {
    encoding: "utf8",
  });
  // console.log("## init_out_json > fse.readFile() =", resData);
  try {
    const outJson = await JSON.parse(resData);
    store.outJson = outJson;
  } catch (err) {
    const errMsg = `!!! Error parsing JSON [${fileJson}]`;
    console.log(errMsg);
    throw err;
  }
  // console.log("## init_out_json > JSON.parse() =", store.outJson);
};
