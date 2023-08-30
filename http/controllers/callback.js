const { decryptData } = require("../../utils/hash");

const ctrlCallBack = async (req, res) => {
  const payload = req.query.p;
  const adapterDB = req.db;
  const adapterProvider = req.ws;

  if (!payload) {
    res.send({ data: "Ups algo paso con pago intenta de nuevo!" });
    return;
  }

  const data = decryptData(payload);
  const [phone, status, email] = data.split("__") ?? [
    undefined,
    undefined,
    undefined,
  ];

  if (status === "fail") {

    await adapterProvider.sendText(
      `${phone}@c.us`,
      [
        "Ups! algo paso con tu pago!",
      ].join("\n")
    );

  }

  res.send(`Email:${email}, status:${status}`)


};

module.exports = { ctrlCallBack };
