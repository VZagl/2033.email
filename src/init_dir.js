// import fs from "fs";
import fse from "fs-extra";
import path from "path";

export default async (store = global.store) => {
  console.log("## init_dir");
  store.inputFiles = {};
  const dir = fse
    .readdirSync(store.dirInp, { recursive: false })
    .filter((v) => fse.statSync(path.join(store.dirInp, v)).isDirectory());
  dir.forEach((v) => {
    const vPathCur = path.join(store.dirInp, v);
    store.inputFiles[v] = fse
      .readdirSync(vPathCur, {
        recursive: false,
      })
      .filter((v) => !fse.statSync(path.join(vPathCur, v)).isDirectory());
  });
};
