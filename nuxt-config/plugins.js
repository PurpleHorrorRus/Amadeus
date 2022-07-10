const root = "~plugins";
const plugins = [
    "globalComponents",
    "directives",
    "plyr",
    "tooltip"
];

// eslint-disable-next-line no-undef
module.exports = () => {
    return plugins.map(plugin => {
        return {
            src: `${root}/${plugin}.js`,
            mode: "client"
        };
    });
};