const root = "~plugins";
const plugins = [
    "globalComponents.ts",
    "i18n.ts",
    "directives.ts",
    "tooltip.ts"
];

module.exports = () => {
    return plugins.map(plugin => {
        return {
            src: `${root}/${plugin}`,
            mode: "client"
        };
    });
};