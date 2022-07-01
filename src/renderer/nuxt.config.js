/* eslint-disable no-undef */
const isDev = process.env.NODE_ENV === "development";

module.exports = {
    target: "static",
    ssr: false,

    head: {
        title: "VKGram",

        meta: [
            {
                charset: "utf-8"
            },

            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            }
        ],

        link: [
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com"
            },

            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@700&display=swap"
            },

            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
            },

            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap"
            }
        ]
    },

    loading: false,
    telemetry: false,
    dev: isDev,

    build: {
        publicPath: !isDev ? "/" : process.env.DEV_SERVER_URL,

        extend(config, { isClient }) {
            if (isClient) {
                config.target = "electron-renderer";
                config.optimization.splitChunks.maxSize = 51200;
            }

            config.mode = process.env.NODE_ENV;
            config.devtool = isDev ? "inline-source-map" : false;

            if (!isDev) {
                config.performance = {
                    hints: false,
                    maxEntrypointSize: 512000,
                    maxAssetSize: 512000
                };
            }

            config.module.rules.find(rule => rule.test.test(".svg")).test = /\.(gif|webp)$/;
            config.module.rules.push({
                test: /\.svg$/,
                use: "babel-loader",
                oneOf: [
                    {
                        loader: "vue-svg-loader",
                        options: {
                            svgo: {
                                plugins: [{ removeDimensions: true }, { removeViewBox: false }]
                            }
                        }
                    },
                    {
                        loader: "url-loader",
                        options: {
                            name: "img/[name].[contenthash:7].[ext]"
                        }
                    }
                ],
                exclude: /(img)/
            });

            config.module.rules.push({
                test: /\.(png|jpe?g)$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "img/[name].[contenthash:7].[ext]",
                        esModule: false
                    }
                }
            });
        },

        html: isDev
            ? {
                minify: {
                    collapseBooleanAttributes: true,
                    decodeEntities: true,
                    minifyCSS: true,
                    minifyJS: true,
                    processConditionalComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    trimCustomFragments: true,
                    useShortDoctype: true,
                    minifyURLs: true,
                    removeComments: true,
                    removeEmptyElements: true
                }
            }
            : {},

        optimization: {
            minimize: true,
            splitChunks: {
                chunks: "async"
            }
        },

        splitChunks: isDev
            ? {
                pages: true,
                vendor: true,
                commons: true,
                runtime: false,
                layouts: false
            }
            : {},

        filenames: !isDev
            ? {
                app: () => "[contenthash:7].js",
                chunk: () => "[contenthash:7].js",
                css: () => "[contenthash:7].css"
            }
            : {},

        extractCSS: !isDev
    },

    vue: {
        config: {
            productionTip: false,
            devtools: false,
            silent: !isDev,
            performance: isDev
        }
    },

    css: ["~assets/styles/global.scss"],
    plugins: [],

    router: {
        prefetchLinks: false
    }
};