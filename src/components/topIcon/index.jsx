import { View } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect } from "react";
import trackingApi from "../../utils/trackingApi";
let micContext = Taro.createInnerAudioContext();
micContext.src = "https://huanghe.ronghuiad.com/tempAssets/mic.mp3";
export default function index(props) {
    const [isMicPlay, setIsMicPlay] = useState(true);
    const [tmpUrl, setTmpUrl] = useState(null);
    useEffect(() => {
        audioPlay();
    }, []);
    const [showExplain, setShowExplain] = useState(false);
    const [navHeight, setNavHeight] = useState(null);
    useReady(() => {
        const sysinfo = Taro.getSystemInfoSync();
        const h = sysinfo.statusBarHeight + 44;
        console.log(h);
    });
    useEffect(() => {
        if (isMicPlay) {
            micContext.play();
        } else {
            micContext.pause();
        }
    }, [isMicPlay]);
    //音频播放
    const audioPlay = () => {
        console.log(micContext);
        micContext.loop = true;
        micContext.play();
    };
    //更新按钮状态
    useEffect(() => {
        if (props.path == "index") props.getTopIconProp(showExplain);
    }, [showExplain]);
    //跳转到我的奖品
    const goMyPrize = () => {
        const { tmpPath, tmpAppID } = props;
        console.log(tmpPath, tmpAppID);
        trackingApi(3);
        Taro.navigateTo({
            url: tmpPath,
        });
    };
    //
    return (
        <View className="topIcon" style={{}}>
            <image
                className="logo"
                src="https://huanghe.ronghuiad.com/tempAssets/images/logo.png"
            />

            <View
                className="mic"
                style={{
                    backgroundImage: `url(${
                        isMicPlay
                            ? "https://huanghe.ronghuiad.com/tempAssets/images/mic.png"
                            : "https://huanghe.ronghuiad.com/tempAssets/images/momic.png"
                    })`,
                }}
                onClick={() => setIsMicPlay((isMicPlay) => !isMicPlay)}
            ></View>
            <View className={`firstPageBtn`}>
                <View
                    className="lbtn"
                    onClick={() => {
                        trackingApi(2);
                        if (props.path == "index") {
                            if (props.isload) {
                                setShowExplain((showExplain) => !showExplain);
                            }
                        } else {
                            setShowExplain((showExplain) => !showExplain);
                        }
                    }}
                ></View>
                <View
                    className="rbtn"
                    onClick={() => {
                        goMyPrize();
                    }}
                ></View>
            </View>
            <View
                className={`blackShadow ${showExplain ? "isShow" : "isHied"}`}
            ></View>
            <View
                className={`explainBox ${!showExplain ? "explainBoxTop" : ""}`}
            >
                <View className="explain"></View>
                <View
                    className="exBtn"
                    onClick={() => {
                        if (props.path == "index") {
                            if (props.isload) {
                                setShowExplain((showExplain) => !showExplain);
                            }
                        } else {
                            setShowExplain((showExplain) => !showExplain);
                        }
                    }}
                ></View>
            </View>
        </View>
    );
}
