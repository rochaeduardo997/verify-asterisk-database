const Verify = require("./Verify");
const Telegram = require("./Telegram");
const { getHost } = require("./Host");

async function main() {
  let verifyPSQLReturned = await Verify.verifyPSQL();
  let verifyCDRReturned = await Verify.verifyCDR();
  let getHostname = await getHost();

  if(!verifyPSQLReturned.status) {
    Telegram.sendTelegramMsg(getHostname, verifyPSQLReturned);
  }

  if(!verifyCDRReturned.status) {
    Telegram.sendTelegramMsg(getHostname, verifyCDRReturned);
  }
}

main();
