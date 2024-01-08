import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
useShareAppMessage((res) => {
    if (res.from === "button") {
        // 来自页面内转发按钮
        console.log(res.target);
    }
    return {
        title: "新年到，“伊”起接好运！",
        path: "packageCS/pages/index/index",
        imageUrl: "https://huanghe.ronghuiad.com/tempAssets/images/share.png",
    };
});
useShareTimeline(() => {
    return {
        title: "新年到，“伊”起接好运！",
        path: "packageCS/pages/index/index",
        imageUrl: "https://huanghe.ronghuiad.com/tempAssets/images/share.png",
    };
});
