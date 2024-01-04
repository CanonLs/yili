import { View, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";
import TopIcon from "../../components/topIcon/index";

import "./index.scss";
const slideBoxImgArr = [
    "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/f1.png",
    "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/f2.png",
    "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/f3.png",
    "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/f4.png",
    "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/f5.png",
];
const posterBoxImgObj = {
    href: "https://huanghe.ronghuiad.com/tempAssets/images/posterPage/posterBox/",
    type: "jpg",
    length: 10,
};

export default function index() {
    const [preNum, setPreNum] = useState(0);
    const [slideImg, setSlideImg] = useState([]);
    const [posterImg, setPosterImg] = useState([]);
    const [posterImgRe, setPosterImgRe] = useState();
    const [posterImgNum, setPosterImgNum] = useState(0);
    const [showImg, setShowImg] = useState({});
    const [beginEff, setBeginEff] = useState(false);
    const [showShareBox, setShowShareBox] = useState(false);
    const [golotteryBox, setGolotteryBox] = useState(false);
    const [showPoster, setShowPoster] = useState(false);
    const [slideChange, setSlideChange] = useState(true);

    useLoad(() => {
        addImageInfo();
        loadPosterImg();
    });
    useEffect(() => {
        loadFn().then(() => {
            console.log("loading---end");
            // setIsload(true);
            setShowPoster(true);
        });
    }, []);
    useEffect(() => {
        if (beginEff) slideImgFn();
    }, [preNum, beginEff]);
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
            }, 5000 / 100);
        });
    };
    //加载所有图片
    const addImageInfo = () => {
        const imgArr = slideBoxImgArr.map((tmp) => {
            return new Promise((resolve, reject) => {
                Taro.getImageInfo({
                    src: tmp,
                    success(res) {
                        resolve(res);
                        setSlideImg((slideImg) => [...slideImg, res]);
                    },
                });
            });
        });
        Promise.all(imgArr).then((res) => {
            setBeginEff(true);
        });
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
            setPosterImgRe(res[posterImgNum].path);
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
    //中间轮播图片
    const slideImgFn = () => {
        switch (parseInt(preNum / 20)) {
            case 0:
                setSlideChange(false);
                setShowImg(slideImg[0]);
                setSlideChange(true);
                break;
            case 1:
                setSlideChange(false);
                setShowImg(slideImg[1]);
                setSlideChange(true);
                break;
            case 2:
                setSlideChange(false);
                setShowImg(slideImg[2]);
                setSlideChange(true);
                break;
            case 3:
                setSlideChange(false);
                setShowImg(slideImg[3]);
                setSlideChange(true);
                break;
            default:
                setSlideChange(false);
                setShowImg(slideImg[4]);
                setSlideChange(true);

                break;
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
    return (
        <View className="posterPage">
            <TopIcon path="poster" />
            <View className={`foreground ${!showPoster ? "isShow" : "isHied"}`}>
                <View className="fFont"></View>
                <View className="slideBox">
                    <Image
                        className={`sbImg ${
                            slideChange ? "isFastShow" : "isFastHied"
                        }`}
                        src={showImg.path}
                        alt=""
                        style={{
                            width: `${showImg.width}rpx`,
                            height: `${showImg.height}rpx`,
                        }}
                    />
                </View>
                <View className="preBox">
                    <View
                        className="Ingots"
                        style={{ left: `${preNum * 3.26}rpx` }}
                    ></View>

                    <View className="prePro">
                        <View
                            className="loadPre"
                            style={{ width: `${preNum}%` }}
                        ></View>
                    </View>
                    <View className="loadFont">{`${preNum}%`}</View>
                </View>
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
                    <View className="lbtn" onClick={() => randomImg()}></View>
                    <View
                        className="rbtn"
                        onClick={() => setShowShareBox(true)}
                    ></View>
                </View>
            </View>
            <View
                className={`shareTipBox ${showShareBox ? "isShow" : "isHied"}`}
                onClick={() => setShowShareBox(false)}
            >
                <View className="shareTip"></View>
            </View>
            <View
                className={`golotteryBox ${golotteryBox ? "isShow" : "isHied"}`}
            >
                <View className="golottery">
                    <View className="golotteryBtn"></View>
                </View>
            </View>
        </View>
    );
}
