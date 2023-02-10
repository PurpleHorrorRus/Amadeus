/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs-extra");

// ! Copy custom vk-io build
fs.copySync("./xcopy/@vk-io", "./node_modules/@vk-io");