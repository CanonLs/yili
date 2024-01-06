import { View, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";
import TopIcon from "../../components/topIcon/index";
import LoadPre from "../../components/loadPre/index";

import "./index.scss";

const posterBoxImgObj = {
    href: "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/posterBox/",
    type: "jpg",
    length: 10,
};

export default function index() {
    const [posterImg, setPosterImg] = useState([]);
    const [posterImgRe, setPosterImgRe] = useState();
    const [posterImgNum, setPosterImgNum] = useState(0);
    const [showPoster, setShowPoster] = useState(false);
    const [tmpPath, setTmpPath] = useState("");

    useLoad(() => {
        loadPosterImg();
        Taro.getStorage({
            key: "url",
            success: function (res) {
                console.log(res.data);
                setTmpPath(res.data);
            },
        });
    });
    //loading end
    const isLoad = (state) => {
        setShowPoster(state);
    };

    //加载海报图片
    const loadPosterImg = () => {
        const posterImgArr = [];
        for (let i = 0; i < posterBoxImgObj.length; i++) {
            posterImgArr.push(
                posterBoxImgObj.href + i + "." + posterBoxImgObj.type
            );
        }
        const imgArr = posterImgArr.map((tmp) => {
            return new Promise((resolve, reject) => {
                Taro.getImageInfo({
                    src: tmp,
                    success(res) {
                        resolve(res);
                    },
                });
            });
        });
        Promise.all(imgArr).then((res) => {
            console.log(posterImgNum);
            setPosterImg(res);
            setPosterImgRe(res[randomNum()].path);
        });
    };
    //随机数0-9
    const randomNum = () => {
        return Math.floor(Math.random() * 9);
    };
    //随机不重复海报
    const randomImg = () => {
        Taro.showLoading({ mask: true });
        let num = randomNum();
        if (num == posterImgNum) {
            randomImg();
        } else {
            setPosterImgNum(num);
            setPosterImgRe(posterImg[num].path);
            Taro.hideLoading();
        }
    };

    //保存图片
    const saveImg = () => {
        console.log(posterImgRe);
        Taro.getSetting({
            success(res) {
                if (!res.authSetting["scope.record"]) {
                    Taro.authorize({
                        scope: "scope.writePhotosAlbum",
                        success() {
                            Taro.saveImageToPhotosAlbum({
                                filePath: posterImgRe,
                                success(res) {
                                    console.log(res);
                                    Taro.showToast({
                                        title: "保存成功",
                                        icon: "success",
                                        duration: 3000,
                                    });
                                },
                                fail(err) {
                                    console.log(err);
                                },
                            });
                        },
                        fail() {
                            Taro.showToast({
                                title: "请开启相册权限",
                                icon: "error",
                                duration: 3000,
                            });
                        },
                    });
                }
            },
        });
    };
    //去抽奖页面
    const goToLottery = () => {
        Taro.navigateTo({
            url: tmpPath,
        });
    };
    return (
        <View className="posterPage">
            <TopIcon path="poster" />
            <View className={`foreground ${!showPoster ? "isShow" : "isHied"}`}>
                <View className="fFont"></View>
                <View className="lbody"></View>
                <View className="rbody"></View>
                <LoadPre
                    style={{
                        top: "400rpx",
                        width: "284rpx",
                        "margin-left": "-142rpx",
                    }}
                    ingotsLimi={2.84}
                    isLoad={isLoad}
                ></LoadPre>
            </View>
            <View className={`mainBox ${showPoster ? "isShow" : "isHied"}`}>
                <View className="posterImg">
                    <View className="topFont"></View>

                    <Image
                        className="poster"
                        src={posterImgRe}
                        onClick={saveImg}
                    ></Image>
                    <View className="botFont"></View>
                </View>
                <View className="btnBox">
                    <View className="lbtn" onClick={() => goToLottery()}></View>
                    <View className="rbtn" onClick={saveImg}></View>
                </View>
            </View>
        </View>
    );
}
