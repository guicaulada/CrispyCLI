/**
 * CrispyCLI - Minimal installation of crispybot as a chat client.
 * Copyright (C) 2019  Guilherme Caulada (Sighmir)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const chalk = require("chalk");
const { Crispy } = require("crispybot");

const TOKEN = process.env.JUMPIN_TOKEN || "YOUR_TOKEN";
const NICKNAME = process.env.JUMPIN_NICKNAME || "YOUR_NICKNAME"
const ROOM = process.env.JUMPIN_ROOM || "YOUR_ROOM"

const crispy = new Crispy(TOKEN);

crispy.on("connect", () => {
  crispy.join(ROOM);
});

crispy.on("join", (data) => {
  crispy.handleChange(NICKNAME);
});

crispy.on("message", async (data) => {
  console.log(formatMessage(data));
});

crispy.on("status", (data) => {
  console.log(formatMessage(data));
});

crispy.addCliCommand("say", (args) => {
  if (args.length) {
    crispy.message(args.join(" "));
  }
});

function formatMessage(data) {
  const timestamp = data.timestamp.split("T");
  const date = timestamp[0].split("-").slice(1).join("-");
  const time = timestamp[1].split(".")[0];
  if (data.handle) {
    try {
      const color = data.color.replace("alt", "");
      return chalk.keyword(color)(`[${date}  ${time}]  ${data.handle}: ${data.message}`);
    } catch {
      throw new Error(`Unknown color ${data.color}`);
    }
  } else {
    return chalk.keyword("gray")(`[${date}  ${time}]  ${data.message}`);
  }
}

module.exports = crispy;