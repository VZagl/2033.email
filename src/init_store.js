import dotenv from "dotenv";

import { date2text } from "./common/helper.js";

export default ({ taskNum, taskDate }) => {
  console.log("## init_store");
  dotenv.config();
  const store = new Object(null);
  global.store = store;
  store.taskNum = taskNum;

  const curDate = new Date();
  store.curDate = curDate;
  store.taskDate = taskDate || date2text({ date: curDate });

  store.taskId = store.taskNum + "." + store.taskDate;
  store.dirProg = process.cwd();
  store.env = process.env;
};
