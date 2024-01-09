import Taro from "@tarojs/taro";

export default function trackingApi(id) {
    console.log(id);
    Taro.request({
        url: `https://huanghe.ronghuiad.com/api/index.php/YiliARApi/setNumber`,
        method: "GET",
        data: {
            id: id,
        },
        success: (res) => {
            console.log("trackingApiOK:" + id);
        },
    });
}
