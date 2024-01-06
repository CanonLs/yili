import { View, Canvas } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { JSONStringify } from "../../utils/jsonCtrl";
import "./index.scss";
import LoadPre from "../../components/loadPre/index";
import TopIcon from "../../components/topIcon/index";

let animation = Taro.createAnimation({
    transformOrigin: "50% 50%",
    duration: 5000,
    timingFunction: "linear",
    delay: 0,
});

export default function Index() {
    const [isload, setIsload] = useState(false);
    const [hideGroup, setHideGroup] = useState(false);
    const [tmpPath, setTmpPath] = useState(null);

    useLoad(() => {
        console.log("Page loaded");
    });
    useReady(() => {
        console.log("Page Ready");
        Taro.request({
            url: `https://huanghe.ronghuiad.com/api/index.php/YiliARApi/showLotteryButton`,
            method: "POST",
            success: (res) => {
                const { url, lottery_url } = res.data;
                setTmpPath(lottery_url);
                Taro.setStorageSync("url", url);
            },
        });
    });
    const getTopIconProp = (val) => {
        setHideGroup(val);
    };
    //LoadPre组件回调
    const loadFn = (state) => {
        setIsload(state);
    };
    //跳转到AR识别页面
    const goAR = () => {
        Taro.navigateTo({
            url: "/pages/webAR/index",
        });
    };

    return (
        <View className="page">
            <TopIcon
                getTopIconProp={getTopIconProp}
                isload={isload}
                path={"index"}
                tmpPath={tmpPath}
            ></TopIcon>

            <View className={`bigTitleBox ${!hideGroup ? "isShow" : "isHied"}`}>
                <View className="bigTitle"></View>
                <View className="fireworks1"></View>
                <View className="fireworks2">
                    <View className="firework2Line"></View>
                    <View className="firework2Fire"></View>
                </View>
                <View className={`font ${isload ? "isShow" : "isHied"}`}></View>
            </View>
            <LoadPre isLoad={loadFn} ingotsLimi={3.24}></LoadPre>
            <View
                className={`beginBtn ${
                    isload && !hideGroup ? "isShow" : "isHied"
                }`}
                onClick={goAR}
            ></View>
            <View className="bottomBox">
                <View className="bodyBox">
                    <View className="body1 body1Ani"></View>
                    <View className="body2 body2Ani"></View>
                    <View className="body3 body3Ani"></View>
                    <View className="body4 body4Ani"></View>
                    <View className="body5 body5Ani"></View>
                </View>
                <View className="cloud"></View>
                {/* <View className="cloud3"></View> */}
                {/* <View className="cloud1"></View> */}
                {/* <View className="cloud2"></View> */}
            </View>
        </View>
    );
}
