Component({
    properties: {
        authState: Object, //父组件传来的对象（不支持直接传function）
    },
    data: {
        // 这里是一些组件内部数据
        someData: {},
    },
    ready: function () {
        console.log("授权加载成功");
        console.log(this.data);
        this.handleAuth();
    },
    methods: {
        // 这里是一个自定义方法
        handleAuth: async function () {
            console.log("授权方法");

            try {
                const res = await this.selectComponent("#auth").auth();
                console.log(res);
                wx.showToast({
                    title: "授权成功！",
                });
                this.data.authState.authState(true);
            } catch (error) {
                // 用户拒绝授权，或者注册登录失败
                this.data.authState.authState(false);
            }
        },
    },
});
