// eslint-disable-next-line no-undef
module.exports = {
    maxSize: 51200,

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    html: {
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
    },

    optimization: {
        minimize: true,
        splitChunks: {
            chunks: "async"
        }
    },

    splitChunks: {
        pages: true,
        vendor: true,
        commons: true,
        runtime: false,
        layouts: false
    },

    filenames: {
        app: () => "[contenthash:7].js",
        chunk: () => "[contenthash:7].js",
        css: () => "[contenthash:7].css"
    }
};