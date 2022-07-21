const root = "~plugins";
const plugins = [
    "globalComponents.js",
    "i18n.ts",
    "directives.js",
    "plyr.js",
    "tooltip.js"
];

// eslint-disable-next-line no-undef
module.exports = () => {
    return plugins.map(plugin => {
        return {
            src: `${root}/${plugin}`,
            mode: "client"
        };
    });
};