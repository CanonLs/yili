import { View } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect } from "react";
let micContext = Taro.createInnerAudioContext();
micContext.src = "https://huanghe.ronghuiad.com/tempAssets/mic.mp3";
export default function index(props) {
    const [isMicPlay, setIsMicPlay] = useState(true);
    const [tmpUrl, setTmpUrl] = useState(null);
    useEffect(() => {
        audioPlay();
    }, []);
    const [showExplain, setShowExplain] = useState(false);

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

        Taro.navigateToMiniProgram({
            appId: tmpAppID,
            path: tmpPath,

            envVersion: "develop",
            success(res) {
                // 打开成功
            },
        });
    };
    //
    return (
        <View className="topIcon">
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
