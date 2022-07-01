/* eslint-disable no-undef */
module.exports = [
    {
        test: /\.svg$/,
        exclude: /(img)/,
        use: "babel-loader",

        oneOf: [
            {
                loader: "vue-svg-loader",
                options: {
                    svgo: {
                        plugins: [
                            { removeDimensions: true }, 
                            { removeViewBox: false }
                        ]
                    }
                }
            }
        ]
    },

    {
        test: /\.(png|jpe?g)$/i,
        use: {
            loader: "url-loader",
            options: {
                name: "img/[name].[contenthash:7].[ext]",
                esModule: false
            }
        }
    }
];