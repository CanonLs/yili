import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
const backStyle = {
    width: "30px",
    height: "30px",
    position: "fixed",
    top: `${statusBarHeight + 6}px`,
    left: "10px",
    zIndex: "999",
    backgroundColor: "rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

export default function index() {
    return (
        <View style={backStyle} onClick={() => Taro.navigateBack()}>
            <image
                style={{ width: "18px", height: "18px" }}
                src="https://huanghe.ronghuiad.com/tempAssets/images/back.png"
            ></image>
        </View>
    );
}
