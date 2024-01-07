import { useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
export default function index() {
    useShareAppMessage((res) => {
        if (res.from === "button") {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: "测试分享",
            path: "/page/user?id=123",
        };
    });
    return <View></View>;
}
