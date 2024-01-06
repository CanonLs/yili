Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {},
    lifetimes: {
        attached: function () {
            var that = this;
            // 在组件实例进入页面节点树时执行
            console.log("!1111");
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
            console.log("!2222");
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleReady: () => {
            console.log("33333333");
        },
    },
});
