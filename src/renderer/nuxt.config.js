/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");

const headConfig = require("../../nuxt-config/head");
const webpackRules = require("../../nuxt-config/rules");
const webpackPlugins = require("../../nuxt-config/plugins");
const routerConfig = require("../../nuxt-config/router.json");
const optimizationConfig = require("../../nuxt-config/optimization.js");
const vueConfig = require("../../nuxt-config/vue");
const themesList = require("../../nuxt-config/themes.json");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    target: "server",
    ssr: false,

    head: headConfig,

    loading: false,
    telemetry: false,
    dev: isDev,

    build: {
        publicPath: "./_nuxt/",

        extend(config, { isClient }) {
            config.devtool = (isDev ? "eval-source-map" : false);

            if (isClient) {
                config.target = "electron-renderer";
                config.optimization.splitChunks.maxSize = optimizationConfig.maxSize;
                console.log(config.target);
            }

            config.mode = process.env.NODE_ENV;
            config.performance = optimizationConfig.performance;

            config.module.rules.find(rule => rule.test.test(".svg")).test = /\.(gif|webp)$/;
            config.module.rules = config.module.rules.concat(webpackRules);

            console.log(config.resolve.alias.vue);
        },

        babel: {
            presets() {
                return [
                    ["@nuxt/babel-preset-app", {
                        corejs: { version: 3 }
                    }]
                ];
            }
        },

        standalone: true,

        html: isDev ? optimizationConfig.html : {},
        optimization: !isDev ? optimizationConfig.optimization : {},
        splitChunks: isDev ? optimizationConfig.splitChunks : {},
        filenames: !isDev ? optimizationConfig.filenames : {},
        extractCSS: false
    },

    alias: {
        "~icons": path.resolve("./src/renderer/assets/icons"),
        vue: isDev ? "vue/dist/vue.common" : "vue/dist/vue.min"
    },

    resolve: {
        alias: {
            vue: isDev ? "vue/dist/vue.common" : "vue/dist/vue.min"
        }
    },

    vue: vueConfig(isDev),
    plugins: webpackPlugins(),
    router: routerConfig,

    buildModules: [
        "@nuxtjs/color-mode",
        "@nuxt/typescript-build"
    ],

    css: [
        "~assets/css/global.scss",

        "vue-plyr/dist/vue-plyr.css",
        "vue-range-component/dist/vue-range-slider.css",
        "vue-loading-skeleton/dist/vue-loading-skeleton.css",

        ...themesList
    ]
};