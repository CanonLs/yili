import { View, Camera, Canvas, XrSence } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { WebAr } from "../../utils/WebAr";
import "./index.scss";
import XrFrame from "../../components/xrFrame/index";

export default function Index() {
    const [webArCtr, setWebArCtr] = useState();
    const [showBtn, setShowBtn] = useState(false);

    const CONFIG = {
        token: "", // 认证token, 请从开发者中心获取
        endpoint:
            "https://aip.baidubce.com/rest/2.0/image-classify/v2/logo?access_token=",
        quantity: 0.7, // 图片压缩质量, 0~1
        interval: 2000, // 识别间隔(毫秒)
    };
    function getToken() {
        return new Promise((resolve, reject) => {
            Taro.request({
                url: `https://huanghe.ronghuiad.com/api/index.php/YiliARApi/getBaduAiAccessToken`,
                method: "POST",
                success: (res) => {
                    resolve(res.data.access_token);
                },
            });
        });
    }
    useLoad(() => {
        getToken()
            .then((res) => {
                CONFIG.token = res;
            })
            .then(() => {
                const query = Taro.createSelectorQuery();
                query
                    .select("#canvas")
                    .fields({
                        node: true,
                        size: true,
                    })
                    .exec((res) => {
                        setWebArCtr(new WebAr(CONFIG, res[0].node));
                    });
            });
    });
    useEffect(() => {
        Taro.getSetting({
            success: function (res) {
                if (!res.authSetting[`scope.camera`]) {
                    Taro.showToast({
                        title: "请开启相机权限",
                        icon: "error",
                        duration: 3000,
                    });
                    return false;
                }
            },
        });
    }, []);
    useEffect(() => {
        if (webArCtr) {
            console.log("??????????");
            webArFn();
        }
    }, [webArCtr]);
    //识别执行函数
    const beginIdentify = () => {
        Taro.navigateTo({
            url: "/pages/Poster/index",
        });
    };
    //设置识别回调
    const webArFn = () => {
        webArCtr.searchCallback((res) => {
            const istrue = res.result.some((item) => {
                if (item.name == "伊利") return true;
            });
            if (!istrue) return false;
            webArCtr.stopSearch();

            setShowBtn(true);
            Taro.showToast({
                title: "识别成功",
                icon: "success",
                duration: 3000,
            });
        });
        webArCtr.startSearch();
    };

    return (
        <View className="arPage">
            <Camera
                id="camera"
                dframe-size="medium"
                bindinitdone="cameraInitDone"
                mode="normal"
                device-position="back"
                resolution="medium"
                flash="off"
            ></Camera>
            <XrFrame
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
            <View className="arFirstBox">
                <Canvas
                    type="2d"
                    id="canvas"
                    style="width:1px; height: 1px;"
                ></Canvas>
                <View className="arFont"></View>
                <View className="arLogo"></View>
                {showBtn && (
                    <View
                        className="arBtn"
                        onClick={() => {
                            beginIdentify();
                        }}
                    ></View>
                )}
            </View>
        </View>
    );
}
