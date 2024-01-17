import init_dir from "./init_dir.js";
import init_out_json from "./init_out_json.js";

export default async () => {
  console.log("## do_init");
  await Promise.all([init_dir(), init_out_json()]);
};
