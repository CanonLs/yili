import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";

export default function index(props) {
    const [isload, setIsload] = useState(false);
    const [preNum, setPreNum] = useState(0);
    const { style, ingotsLimi, isLoad } = props;
    const path = Taro.getLaunchOptionsSync();
    useEffect(() => {
        loadFn().then(() => {
            console.log("loading---end");
            isLoad(true);
            setIsload(true);
        });
    }, []);
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

    return (
        <View
            className={`loadBox ${!isload ? "isShow" : "isHied"}`}
            style={style ? { ...style } : ""}
        >
            <View
                className="ingots"
                style={{ left: `${preNum * ingotsLimi}rpx` }}
            ></View>
            <View className="loadPreB">
                <View
                    className="loadPre"
                    style={{ width: `${preNum}%` }}
                ></View>
            </View>
            <View className="loadFont">{`${preNum}%`}</View>
        </View>
    );
}
