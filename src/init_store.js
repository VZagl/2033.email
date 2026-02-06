import dotenv from "dotenv";

import { date2text } from "./common/helper.js";

export default ({ taskNum, taskDate }) => {
	console.log("## init_store");
	dotenv.config();
	const store = new Object(null);
	global.store = store;
	store.dirProg = process.cwd();
	store.env = process.env;

	store.taskNum = taskNum;

	const curDate = new Date();
	store.curDate = curDate;
	store.taskDate =
		taskDate || store.env.task_date || date2text({ date: curDate });

	store.taskId = store.taskNum + "." + store.taskDate;
};
