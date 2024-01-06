export default defineAppConfig({
    pages: ["pages/index/index", "pages/Poster/index", "pages/webAR/index"],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#c6151d",
        navigationBarTitleText: "财神",
        navigationBarTextStyle: "white",
    },
    lazyCodeLoading: "requiredComponents",
});
