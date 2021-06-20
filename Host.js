const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class Host {
  async getHost() {
    try {
      const getHostname = await execAsync(`hostname`);
      const getHostnameFormated = getHostname.stdout.trim();

      const getHostIP = await execAsync(`hostname -I`);
      const getHostIPFormated = getHostIP.stdout.trim();

      return {
        getHostnameFormated,
        getHostIPFormated
      };
    } catch(error) {
      console.trace("Error at getHost, fails on get hostname\n", error);

      return {
        status: false
      }
    }
  }
}

module.exports = new Host;
