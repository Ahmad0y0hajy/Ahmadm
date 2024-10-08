const express = require("express");
const cors = require("cors");
const { version } = require("discord.js");
const os = require("systeminformation");
const { msToDuration, formatBytes } = require("./handlers/functions");

module.exports = async (client) => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  app.get("/", (req, res) => {
    res.send(`Hello World`);
  });

  app.get("/home", (req, res) => {
    res.send(client.user);
  });

  app.get("/commands", (req, res) => {
    function cmdData(cmd) {
      return {
        name: cmd.name,
        description: cmd.description,
        category: cmd.category,
      };
    }
    const commands = {
      mcommands: client.mcommands.map((cmd) => cmdData(cmd)),
      mcategories: client.mcategories.map((cat) => cat),
      scommands: client.commands.map((cmd) => cmdData(cmd)),
      scategories: client.scategories.map((cat) => cat),
    };

    res.send(commands);
  });

  app.get("/about", async (req, res) => {
    let memory = await os.mem();
    let cpu = await os.cpu();

    let options = {
      guildsCount: client.guilds.cache.size,
      usersCount: client.users.cache.size,
      channelsCount: client.channels.cache.size,
      uptime: msToDuration(client.uptime),
      DJSVersion: `v${version}`,
      NodeVersion: `${process.version}`,
      ping: `${client.ws.ping}ms`,
      cpu: cpu.brand,
      ram: {
        total: formatBytes(memory.total),
        usage: formatBytes(memory.used),
      },
    };

    res.send(options);
  });

  app.get("/contact", (req, res) => {
    let options = {
      user: client.user,
    };
    res.send(options);
  });

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};
