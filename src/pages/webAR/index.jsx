import { View, Camera, Canvas } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { WebAr } from "../../utils/WebAr";
import "./index.scss";
import ShareCon from "../shareCon/index";

import SfAni from "../../components/sfAni/index";
const sfAniImgInfo = {
    href: "https://huanghe.ronghuiad.com/3d/caisheng/",
    type: "png",
    length: 117,
};
export default function Index() {
    const [webArCtr, setWebArCtr] = useState();
    const [showBtn, setShowBtn] = useState(false);
    const [imgArr, setImgArr] = useState([]);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showHand, setShowHand] = useState(false);

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
    useReady(() => {
        console.log("Page Ready");
        // getTempCas();
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
        ////--------------------------
        webArCtr.startSearch();
    };
    //相机调用成功
    const cameraReady = () => {
        console.log("camera ok");
        getTempCas();
    };
    const getTempCas = () => {
        const offCanvas = Taro.createOffscreenCanvas({
            type: "2d",
            width: 1,
            height: 1,
        });

        loadPosterImg(offCanvas);
    };

    const loadPosterImg = (canvas) => {
        const posterImgArr = [];
        for (let i = 1; i < sfAniImgInfo.length; i++) {
            posterImgArr.push(sfAniImgInfo.href + i + "." + sfAniImgInfo.type);
        }

        const imgArr = posterImgArr.map(async (tmp) => {
            return await new Promise((resolve, reject) => {
                let img = canvas.createImage();

                img.src = tmp;

                img.onload = () => {
                    resolve(img);
                };
            });
        });
        Promise.all(imgArr).then((res) => {
            console.log(res);
            setImgArr(res);
        });
    };
    const showHandState = (e) => {
        setShowHand(true);
    };

    return (
        <View className="arPage">
            <ShareCon></ShareCon>
            {showCanvas && (
                <SfAni imgArr={imgArr} showHandState={showHandState}></SfAni>
            )}
            <Camera
                id="camera"
                dframe-size="medium"
                onInitDone={cameraReady}
                mode="normal"
                device-position="back"
                resolution="medium"
                flash="off"
            ></Camera>

            <View
                className={`arFirstBox ${
                    !showCanvas ? "isFastShow" : "isFastHied"
                }`}
            >
                <Canvas
                    type="2d"
                    id="canvas"
                    style="width:1px; height: 1px;"
                ></Canvas>
                <View className="arLogo">
                    <View className="arFont"></View>
                    <View
                        className={`arBtn ${showBtn ? "isShow" : "isHied"}`}
                        onClick={() => {
                            // beginIdentify();
                            setShowCanvas(true);
                        }}
                    ></View>
                </View>
            </View>

            <View
                className={`clickHand ${
                    showHand ? "isFastShow" : "isFastHied"
                }`}
                onClick={() => {
                    beginIdentify();
                }}
            ></View>
        </View>
    );
}
