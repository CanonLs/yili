export default defineAppConfig({
    pages: ["pages/webAR/index", "pages/index/index", "pages/Poster/index"],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#c6151d",
        navigationBarTitleText: "财神",
        navigationBarTextStyle: "white",
    },
    lazyCodeLoading: "requiredComponents",
});
