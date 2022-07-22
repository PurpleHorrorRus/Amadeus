const root = "~plugins";
const plugins = [
    "globalComponents.ts",
    "i18n.ts",
    "directives.ts",
    "plyr.ts",
    "tooltip.ts"
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