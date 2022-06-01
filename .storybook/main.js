module.exports = {
    stories: [
        "../src/**/*.stories.tsx",
    ],
    addons: [
        "@storybook/addon-essentials",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-vite",
    },
}
