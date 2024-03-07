import fse from "fs-extra";
import path from "path";

import {
  ENUM_WORK_ITEM_RESULT,
  WorkItemResult,
} from "./common/constWorkItemResult.js";
import sendEmail from "./common/email.js";

export default async ({ key, files }) => {
  // console.log("## do_w_item");
  const store = global.store;
  // console.log("store.env =", store.env);
  // console.log(key, `: `, files);

  let fileEmailDir;
  let fileEmailPath;
  try {
    fileEmailDir = path.join(store.dirInp, key);
    fileEmailPath = path.join(fileEmailDir, "email.json");
    // console.log(fileEmailPath);
  } catch (reason) {
    throw {
      descr: `Ошибка открытия файла`,
      path: fileEmailPath,
      reason,
    };
  }

  let fileEmailJson;
  try {
    const fileEmailData = fse.readFileSync(fileEmailPath);
    // console.log(fileEmailData);
    fileEmailJson = JSON.parse(fileEmailData);
    // console.log(typeof fileEmailJson, fileEmailJson);
  } catch (reason) {
    throw {
      descr: `Ошибка преобразования файла в JSON`,
      path: fileEmailPath,
      reason,
    };
  }
  if (
    !fileEmailJson.email ||
    typeof fileEmailJson.email !== "string" ||
    fileEmailJson.email.trim().length < 3
  ) {
    throw {
      descr: `Ошибка получения email из JSON файла`,
      path: fileEmailPath,
      error,
    };
  }
  const curEmail = fileEmailJson.email.trim();
  const curFile = files.filter((v) => path.extname(v) === ".htm");
  const curFilePath = path.join(fileEmailDir, curFile[0]);
  // console.log("curEmail =", curEmail);
  // console.log("curFilePath =", curFilePath);
  if (curFile.length !== 1) {
    throw {
      descr: "Количество файлов на отправку != 1",
      dir: fileEmailDir,
    };
  }
  const sendConfig = {
    host: store.env.smtp_server,
    auth: {
      user: store.env.smtp_user,
      pass: store.env.smtp_pwd,
    },
    to: store.env.debug_to ? store.env.debug_to : curEmail,
    body: {
      file: curFilePath,
    },
  };

  // return "123 стоп обработка: OK";

  try {
    const result = await sendEmail(sendConfig);
    // console.log("# SendEmail.then/result =", result);
    // console.log("# SendEmail.then/result typeof =", typeof result);
    return result;
  } catch (reason) {
    throw {
      descr: `Ошибка при отправке`,
      path: fileEmailDir,
      reason,
    };
  }
};
