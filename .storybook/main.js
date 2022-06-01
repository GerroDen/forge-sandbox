module.exports = {
    stories: [
        "../src/web/**/*.stories.@(j|t)sx",
    ],
    addons: [
        "@storybook/addon-essentials",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-vite",
    },
}
