import fse from "fs-extra";
import nodemailer from "nodemailer";
import iconv from "iconv-lite";

export default async (config = {}) => {
  // console.log("## SendEmail");
  // console.log("config =", config);
  const fileBodyPath = config.body.file;
  // console.log("config =", config.body.file);
  let htmlData;
  try {
    const rawData = fse.readFileSync(fileBodyPath);
    const data1251 = iconv.decode(rawData, "win1251");
    const strReplaceFrom = "charset=windows-1251";
    const strReplaceTo = "charset=utf-8";
    const newData = data1251.replace(strReplaceFrom, strReplaceTo);
    htmlData = iconv.encode(newData, "utf8");
  } catch (reason) {
    throw {
      descr: `Ошибка чтения текста из файла`,
      path: fileBodyPath,
      reason,
    };
  }
  const configOptions = {
    host: config.host,
    port: config.port || 465,
    secure: config.secure || true,
    tls: config.tls || {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
    auth: config.auth,
  };
  // console.log("configOptions =", configOptions);

  const transporter = nodemailer.createTransport(configOptions);
  // console.log("# transporter =", transporter);

  const sendObj = {
    from: `КПТМ "Криворіжтепломережа" <${store.env.smtp_user}>`,
    to: config.to,
    subject: 'КПТМ "Криворіжтепломережа", рахунок',
    // text: "text: This message was sent from Node js server.",
    // html: "html: This <i>message</i> was sent from <strong>Node js</strong> server.",
    html: htmlData,
  };
  // console.log(sendObj);

  console.log("... sending");

  // return "стоп обработка: OK";
  // throw "стоп обработка: ERR";

  return await transporter.sendMail(sendObj);
  /*
  await transporter
    .sendMail(sendObj)
    .then((result) => {
      console.log("# send result =", result);
      return result;
    })
    .catch((reason) => {
      throw reason;
    });
    */
};
