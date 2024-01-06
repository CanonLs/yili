import { View, Canvas } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import { useState, useEffect, useRef } from "react";

export default function index(props) {
    const { imgArr, showHandState } = props;
    const [data, setData] = useState(imgArr);

    const canvas = useRef(null);
    useEffect(() => {
        getCanvas();
    }, []);
    const getCanvas = () => {
        Taro.createSelectorQuery()
            .select("#myCanvas") // 在 WXML 中填入的 id
            .fields({ node: true, size: true })
            .exec((res) => {
                // Canvas 对象
                const width = res[0].width;
                const height = res[0].height;
                const canvas = res[0].node;
                console.log(width, height);
                // 渲染上下文
                const ctx = canvas.getContext("2d");

                const dpr = Taro.getSystemInfoSync().devicePixelRatio;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
                drawImgFn(ctx, width, height);
            });
    };
    const drawImgFn = (ctx, w, h) => {
        let num = 0;
        let str = null;
        console.log(data);

        str = setInterval(() => {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(
                data[num],
                0,
                0,
                data[num].width,
                data[num].height,
                0,
                0,
                w,
                h
            );
            num++;
            console.log(num);
            if (num >= data.length) {
                clearInterval(str);
                showHandState(true);
            }
        }, 1000 / 24);
    };
    return (
        <Canvas
            ref={canvas}
            type="2d"
            id="myCanvas"
            canvas-id="myCanvas"
            style={{
                zIndex: "20",
            }}
        ></Canvas>
    );
}
