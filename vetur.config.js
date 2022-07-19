module.exports = {
    projects: [
        {
            root: "./",
            package: "./package.json",
            tsconfig: "./src/renderer/tsconfig.json",
            globalComponents: [
                "./src/renderer/components/Global/*.vue"
            ]
        }
    ]
};