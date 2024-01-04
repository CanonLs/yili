import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";
import TopIcon from "../../components/topIcon/index";

let animation = Taro.createAnimation({
    transformOrigin: "50% 50%",
    duration: 5000,
    timingFunction: "linear",
    delay: 0,
});

export default function Index() {
    const [isload, setIsload] = useState(false);
    const [preNum, setPreNum] = useState(0);
    const [hideGroup, setHideGroup] = useState(false);

    useLoad(() => {
        console.log("Page loaded");
    });
    useEffect(() => {
        loadFn().then(() => {
            console.log("loading---end");
            setIsload(true);
        });
    }, []);
    const getTopIconProp = (val) => {
        setHideGroup(val);
    };

    //loading进度条
    const loadFn = () => {
        return new Promise((rev) => {
            let num = 0;
            let timer = setInterval(() => {
                if (num > 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        rev();
                    }, 2000);
                    return false;
                }
                setPreNum(num);
                num++;
            }, 3000 / 100);
        });
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
            <View className={`loadBox ${!isload ? "isShow" : "isHied"}`}>
                <View className="loadPreB">
                    <View
                        className="loadPre"
                        style={{ width: `${preNum}%` }}
                    ></View>
                </View>
                <View className="loadFont">{`${preNum}%`}</View>
            </View>
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
                <View className="cloud3"></View>
                <View className="cloud1"></View>
                <View className="cloud2"></View>
            </View>
        </View>
    );
}
