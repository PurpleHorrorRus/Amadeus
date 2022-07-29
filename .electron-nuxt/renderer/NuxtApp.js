const path = require("path");
const { fork } = require("child_process");
const { utils } = require("@xpda-dev/core");
const { killWithAllSubProcess } = utils;

const NUXT_PROCESS_PATH = path.join(__dirname, "nuxt-process.js");

/**
 * @implements {IStep}
 */
class NuxtApp {
    constructor(logger) {
        this.logger = logger;
    }

    build() {
        this.nuxtProcess = fork(NUXT_PROCESS_PATH, { silent: true });
        this.redirectStdout();

        return new Promise((resolve, reject) => {
            this.nuxtProcess.send({ 
                action: "build", 
                target: process.env.NODE_ENV 
            });

            this.nuxtProcess.once("message", ({ status, err }) => {
                if (status === "ok") resolve();
                else reject(err);
            });
        });
    }

    redirectStdout() {
        this.nuxtProcess.stdout.pipe(this.logger.stdout);
        this.nuxtProcess.stderr.pipe(this.logger.stderr);
    }

    terminate() {
        this.nuxtProcess.kill();

        if (this.nuxtProcess && !this.nuxtProcess.killed) {
            killWithAllSubProcess(this.nuxtProcess.pid);
        }

        this.nuxtProcess = null;
    }
}

module.exports = NuxtApp;