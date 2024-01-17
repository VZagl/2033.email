import fse from "fs-extra";
import path from "path";

import {
  ENUM_WORK_ITEM_RESULT,
  WorkItemResult,
} from "./common/constWorkResult.js";
import { SendEmail } from "./common/email.js";

export default async ({ key, files }) => {
  // console.log("## do_w_item");
  const store = global.store;
  // console.log("store.env =", store.env);
  // console.log(key, `: `, files);
  // await Promise.all([]);
  try {
    const fileEmailDir = path.join(store.dirInp, key);
    const fileEmailPath = path.join(fileEmailDir, "email.json");
    // console.log(fileEmailPath);
    const fileEmailData = fse.readFileSync(fileEmailPath);
    // console.log(fileEmailData);
    try {
      const fileEmailJson = JSON.parse(fileEmailData);
      // console.log(typeof fileEmailJson, fileEmailJson);
      if (
        !fileEmailJson.email ||
        typeof fileEmailJson.email !== "string" ||
        fileEmailJson.email.trim().length < 3
      ) {
        const res = WorkItemResult(ENUM_WORK_ITEM_RESULT.Error, {
          descr: `Ошибка получения email из файла в JSON`,
          path: fileEmailPath,
          error,
        });
        return res;
      }
      const curEmail = fileEmailJson.email.trim();
      const curFile = files.filter((v) => path.extname(v) === ".htm");
      const curFilePath = path.join(fileEmailDir, curFile[0]);
      // console.log("curEmail =", curEmail);
      // console.log("curFilePath =", curFilePath);
      if (curFile.length !== 1) {
        const res = WorkItemResult(ENUM_WORK_ITEM_RESULT.Error, {
          descr: "Количество файлов на отправку != 1",
          dir: fileEmailDir,
        });
        return res;
      }
      const sendResult = await SendEmail({
        host: store.env.smtp_server,
        auth: {
          user: store.env.smtp_user,
          pass: store.env.smtp_pwd,
        },
        // to: curEmail,
        to: "zagl_kpts@ukr.net",
        body: {
          file: curFilePath,
        },
      });
      // throw "all ok";
      return WorkItemResult(ENUM_WORK_ITEM_RESULT.Error);
      // return WorkItemResult(ENUM_WORK_ITEM_RESULT.Ok);
    } catch (error) {
      const res = WorkItemResult(ENUM_WORK_ITEM_RESULT.Error, {
        descr: `Ошибка преобразования файла в JSON`,
        path: fileEmailPath,
        error,
      });
      return res;
    }
  } catch (error) {
    const res = WorkItemResult(ENUM_WORK_ITEM_RESULT.Error, {
      descr: `Ошибка открытия файла`,
      path: fileEmailPath,
      error,
    });
    return res;
  }
};
