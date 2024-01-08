import { View, Camera, Canvas } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { WebAr } from "../../utils/WebAr";
import "./index.scss";
import BackBtn from "../../components/backBtn/index";
import ShareDeploy from "../../components/shareDeploy/index";

import SfAni from "../../components/sfAni/index";
const sfAniImgInfo = {
    href: "https://huanghe.ronghuiad.com/3d/caisheng/",
    type: "png",
    length: 117,
};
const CONFIG = {
    token: "", // 认证token, 请从开发者中心获取
    endpoint:
        "https://aip.baidubce.com/rest/2.0/image-classify/v2/logo?access_token=",
    quantity: 0.7, // 图片压缩质量, 0~1
    interval: 2000, // 识别间隔(毫秒)
};
export default function Index() {
    const [webArCtr, setWebArCtr] = useState();
    const [showBtn, setShowBtn] = useState(false);
    const [imgArr, setImgArr] = useState([]);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showHand, setShowHand] = useState(false);
    const [resReady, setResReady] = useState(false);

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
                        const webAr = new WebAr(CONFIG, res[0].node);
                        webAr.searchCallback((res) => {
                            const istrue = res.result.some((item) => {
                                if (item.name == "伊利") return true;
                            });
                            if (!istrue) return false;
                            webAr.stopSearch();

                            setShowBtn(true);
                            Taro.showToast({
                                title: "识别成功",
                                icon: "success",
                                duration: 3000,
                            });
                        });
                        setWebArCtr(webAr);
                    });
            });
    }, []);
    useEffect(() => {
        if (webArCtr && resReady) webArCtr.startSearch();
    }, [resReady]);

    //识别执行函数
    const beginIdentify = () => {
        Taro.navigateTo({
            url: "../poster/index",
        });
    };

    //相机调用成功
    const cameraReady = () => {
        console.log("camera ok");
        Taro.showLoading({
            title: "AR识别准备中",
            mask: true,
        });
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
            let url = sfAniImgInfo.href + i + "." + sfAniImgInfo.type;
            posterImgArr.push(url);
        }

        run();

        async function run() {
            let pool = [];
            let allPro = [];
            let arr = [];
            for (let i = 0; i < posterImgArr.length; i++) {
                let promise = new Promise((resolve, reject) => {
                    const img = canvas.createImage();
                    img.src = posterImgArr[i];
                    img.onload = function () {
                        console.log("一张图片加载完成");
                        resolve(img);
                    };
                });
                promise.then((res) => {
                    pool.splice(pool.indexOf(promise), 1);
                });
                pool.push(promise);
                allPro.push(promise);
                //这里是重点，当满了就阻塞
                if (pool.length == 30) {
                    await Promise.race(pool);
                }
            }
            await Promise.all(allPro).then((res) => {
                setImgArr(res);
                wx.hideLoading({
                    success: () => {
                        console.log("资源加载完毕，开始识别");
                        setResReady(true);
                    },
                });
            });
        }
    };
    const showHandState = (e) => {
        setShowHand(true);
    };

    return (
        <View className="arPage">
            <BackBtn></BackBtn>
            <ShareDeploy></ShareDeploy>
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
