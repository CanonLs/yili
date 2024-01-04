import { View, XrSence, XrMesh, XrCamera } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState, useEffect } from "react";

export default function index(props) {
    return (
        <XrSence
            onReady={() => {
                console.log("xrSence onReady");
            }}
            style={{ width: "100%", height: "100%" }}
        >
            <XrMesh node-id="cube" geometry="cube" />
            <XrCamera
                clear-color="0.4 0.8 0.6 1"
                position="0 1 4"
                target="cube"
                camera-orbit-control
            />
        </XrSence>
    );
}
