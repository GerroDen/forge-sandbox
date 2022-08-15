module.exports = {
    stories: [
        "../src/**/*.stories.@(j|t)sx",
    ],
    addons: [
        "@storybook/addon-essentials",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-vite",
    },
}
