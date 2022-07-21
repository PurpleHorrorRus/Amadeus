const { Nuxt, Builder, Generator } = require("nuxt");
const { SERVER_PORT } = require("../config");
const nuxtConfig = require("./nuxt.config.js");

const nuxt = new Nuxt(nuxtConfig);

process.on("message", async ({ action, target }) => {
    if (action !== "build") {
        console.warn("Unknown action");
        process.send({ status: "error", err: `Nuxt process: unknown action ('${action}')` });
        return;
    }

    await nuxt.ready();

    const builder = new Builder(nuxt);
    if (target === "development") {
        await builder.build().catch(err => {
            console.error(err);
            process.send({ status: "error", err: err.message });
        });
    
        nuxt.listen(SERVER_PORT);
        process.send({ status: "ok" });
    } else {
        const { errors } = await new Generator(nuxt, builder).generate({
            build: true,
            init: true
        }).catch(err => {
            console.error(err);
            process.send({ status: "error", err: err.message });
        });

        if (errors.length === 0) process.send({ status: "ok" }); 
        else process.send({ status: "error", err: "Error occurred while generating pages" });
    }
});