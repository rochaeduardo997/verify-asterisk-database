const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class Verify {
  async verifyPSQL() {
    try {
      const verifyResult = await execAsync(`systemctl status postgresql-9.6 | sed -n 3p | awk '{ print $2 }'`);
      const verifyResultFormated = verifyResult.stdout.trim().toLowerCase();

      if(verifyResultFormated === "active") {
        return {
          status: true,
          from: "PSQL",
          message: "Banco conectado",
          psqlMessage: `${verifyResultFormated}`,
        };
      } else {
        console.trace("Error at else in verifyPSQL");

        return {
          status: false,
          from: "PSQL",
          message: "Banco não conectado",
          psqlMessage: `${verifyResultFormated}`,
        };
      }
    } catch(error) {
      console.trace("Error at verifyPSQL function\n", error);

      return {
        status: false,
        from: "PSQL",
      };
    }
  }

  async verifyCDR() {
    try {
      const verifyResult = await execAsync(`asterisk -rx "cdr show pgsql status" | sed -n 1p | awk '{ print $1 }'`);
      const verifyResultFormated = verifyResult.stdout.trim().toLowerCase();

      const verifyConnectionTime = await execAsync(`asterisk -rx "cdr show pgsql status" | sed -n 1p | awk '{ print $10,$11,$12,$13,$14,$15,$16,$17 }'`);
      const verifyConnectionTimeFormated = verifyConnectionTime.stdout.trim().toLowerCase();

      if(verifyResultFormated === "connected") {
        return {
          status: true,
          from: "CDR",
          message: "Asterisk sincronizado com o banco",
          cdrMessage: `${verifyResultFormated}`,
          cdrConnectionTime: `${verifyConnectionTimeFormated}`,
        }
      } else {
        return {
          status: false,
          from: "CDR",
          message: "Asterisk não sincronizado com o banco",
          cdrMessage: `${verifyResultFormated}`,
        }
      }

      console.log(verifyResultFormated);
    } catch(error) {
      return {
        status: false,
        from: "CDR",
      }
    }
  }
}

module.exports = new Verify;
