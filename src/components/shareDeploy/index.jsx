import { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { View } from "@tarojs/components";

export default function index() {
    const shareData = {
        title: "新年到，“伊”起接好运！",
        path: "packageCS/pages/index/index",
        imageUrl: "https://huanghe.ronghuiad.com/tempAssets/images/share.png",
    };
    useShareAppMessage((res) => {
        if (res.from === "button") {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return shareData;
    });
    useShareTimeline(() => {
        return shareData;
    });
    return <View></View>;
}
