<template>
    <div class="chat_window">
        <div class="seemore" v-if="!lastSession" @click="selectMessage">查看更多</div>
        <ul class="messages" id="RightCont">

            <li :class="`message ${item.sendPeople === 'me' ? 'right' : 'left'} appeared`" :key="i"
                v-for="(item, i) in messageList">

                <template v-if="item.sendType === 1">
                    <div class="avatar"></div>
                    <div class="text_wrapper">
                        <div class="text">{{ item.message }}</div>
                    </div>
                </template>

                <template v-if="item.sendType === 3">
                    <div class="text_wrapper">
                        <img :src="item.message" />
                    </div>
                </template>


                <template v-if="item.sendType === 4">
                    <div class="seemore">
                        {{ item.message }}
                    </div>
                </template>
            </li>
        </ul>
        <div class="bottom_wrapper clearfix">
            <div class="message_input_wrapper">
                <textarea class="message_input" v-on:focus="EmoteShow = false" id="dope" v-model="sendData" maxlength="50"
                    :placeholder="allowSession ? '请输入会话内容' : '当前客服已离线'" v-on:keyup.enter="enterSend" />
            </div>
            <div class="send_message" v-on:click="allowSession ? sendMessage(sendData, 1) : reload()">
                <div class="icon"></div>
                <div class="text">{{ allowSession ? '发送' : '重找客服' }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2';
import io from "socket.io-client";
import JSEncrypt from 'jsencrypt';
let encryptor = new JSEncrypt();
import axios from "axios"
export default {

    data() {
        return {
            socket:"",
            EmoteShow: false,
            sendData: '',
            allowSession: false,
            message: '',
            user: {},
            messageList: [],
            lastSession: false
        }
    },

    beforeDestroy () {
        socket.close()
    },
    
    mounted() {
        this.socket&&this.socket?.close();
        this.socket =io('http://124.223.116.100:3030'),
        window.socket =  this.socket;
        this.into();
    },
    methods: {

        reload() {
            window.location.reload()
        },

        into() {
            this.initialization();
            //错误通知返回
            this.socket.on("error", (data) => {
                this.$toast(data[0].message);
            });
            //访问注册
            this.socket.on("visitReturn", (data) => {
                this.user = JSON.parse(data[0].data)
            });

            //连接客服成功通知
            this.socket.on("linkServiceSuccess", (data) => {
                this.socketRoom = data[0].data.socketRoom;
                this.$toast(data[0].data.serviceName + "为您服务");
                //数据存储到localStorage
                this.user.socketRoom = this.socketRoom;
                this.user.receiveId = data[0].data.receiveId;

                localStorage.setItem("chatData", JSON.stringify(this.user))
                //通知客服加入
                this.socket.emit('userJoin', this.user);
                this.allowSession = true;
                //查看历史记录
               // this.selectMessage()
            });

            //接收消息
            this.socket.on("reviceMessage", (data) => {
                this.message = data[0].data.message;
                let obj = { sendType: data[0].data.sendType, sendPeople: 'other', message: data[0].data.message }
                this.messageList.push(obj);
                //让聊天窗口回到底部
                this.toBottom(128);
                //客服上线
                this.allowSession = true;
            });

            //错误接收
            this.socket.on("error", (data) => {
                window.location.href ="http://mgdg.shop:3030/public/chat.html#/comment"
                this.$toast(data[0].message);
            });

            //离线处理
            this.socket.on("Offline", (data) => {
                this.$toast(data[0].message);
                this.allowSession = false;
                let obj = { sendType: 4, sendPeople: 'notice', message: data[0].message }
                this.messageList.push(obj)
            });

        },

        selectMessage() {
            let params = {
                sendId: this.user.userId,
                receiveId: this.user.receiveId
            }
            axios({
                method: 'post',
                url: 'http://124.223.116.100:3030/selectMessage',
                data: params
            }).then((response) => {
                if (response.data[0].code) {
                    let message = JSON.parse(response.data[0].data);

                    for (var i = message.length - 1; i >= 0; i--) {
                        if (message[i].sendId == this.user.userId) {
                            let obj = { sendType: message[i].sendType, sendPeople: 'me', message: message[i].sendMessage }
                            this.messageList.unshift(obj)
                        } else {
                            let obj = { sendType: message[i].sendType, sendPeople: 'other', message: message[i].sendMessage }
                            this.messageList.unshift(obj)
                        }
                    }
                    //对已经加载了消息的id记录下来
                    let obj = { receiveId: this.receiveId }
                    this.lastSession = true;

                } else {
                    this.lastSession = false
                    this.$toast(response.data[0].message);
                }
                //让聊天窗口回到底部
                this.toBottom(128)

            })
        },


        initialization() {

            let chatData = localStorage.getItem("chatData") || "{}";

            chatData = JSON.parse(chatData) || {}
            this.user = chatData;
            if (!chatData.userId) {

                //获取浏览器指纹并发送初始数据
                Fingerprint2.get((components) => {
                    const values = components.map(function (component, index) {
                        if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
                            return component.value.replace(/\bNetType\/\w+\b/, '')
                        }
                        return component.value
                    })
                    // 生成最终浏览器指纹
                    const murmur = Fingerprint2.x64hash128(values.join(''), 31);
                    this.user.userId = murmur;
                    this.user.userName = "游客" + murmur.slice(0, 6);
                    this.user.userState = 1;
                    this.socket.emit("visit", this.user);
                    this.socket.emit("toLabor", this.user);
                })
            } else {
                this.user.userState = 1;
                this.socket.emit("visit", this.user);
                this.socket.emit("toLabor", this.user);
            }

            this.socket.emit("getPublicKey");
            //接收公钥
            this.socket.on("returnPublicKey", (data) => {
                let publicKey = JSON.stringify(data[0].data).replace(/\\r\\n/g, '');
                encryptor.setPublicKey(publicKey);
            });
            //设置默认加载信息
            //  this.messageList.push(this.$store.state.robot[0])

        },



        sendMessage(data, sendType) {
            //判断发送类型
            if (sendType === 1 && this.sendData.length <= 0) {
                this.$toast("大哥至少说点什么吧!");
                return;
            }
            if (sendType === 2 && this.$route.path === '/customerChat') {
                this.EmoteShow = !this.EmoteShow;
            }
            //向socket发送数据请求
            this.user.message = data;
            this.user.sendType = sendType;
            this.socket.emit("sendMessage", this.user);
            //将数据存入与这个用户的聊天信息列表
            let obj = {}
            obj.sendType = sendType;
            obj.sendPeople = 'me'
            obj.message = data;
            this.messageList.push(obj)
            //清空输入框
            this.sendData = '';
            //让聊天窗口回到底部
            this.toBottom(128)
        },

        //回到底部
        toBottom(time) {
            setTimeout(() => {
                let RightCont = document.getElementById("RightCont");
                if (RightCont != null) {
                    let scrollHeight2 = RightCont.scrollHeight;
                    RightCont.scrollTop = scrollHeight2;
                }
            }, time);
            clearTimeout();
        },

    }

}






</script>

<style lang="less" scoped>
.chat_window {}

.messages {
    list-style: none;
    padding: 20px 10px 80px 10px;
    margin: 0;
    box-sizing: border-box;
    height: 100vh;
    overflow-y: scroll;
}

.messages .message {
    clear: both;
    overflow: hidden;
    margin-bottom: 20px;
    transition: all 0.5s linear;
    opacity: 0;
}

.messages .message.left .avatar {
    background-color: #ffffff;
    float: left;
    background-image: url('@/assets/images/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.messages .message.left .text_wrapper {
    background-color: #f5eee7;
    margin-left: 20px;
}

.messages .message.left img {
    max-width: 200px;
}

.messages .message.left .text_wrapper::after,
.messages .message.left .text_wrapper::before {
    right: 100%;
    border-right-color: #f5eee7;
}

.messages .message.left .text {
    color: #c48843;
}

.messages .message.right .avatar {
    background-color: #ffffff;
    float: right;
    background-image: url('@/assets/images/avatar_default.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.messages .message.right .text_wrapper {
    background-color: #e5f3fa;
    margin-right: 20px;
    float: right;
}

.messages .message.right .text_wrapper::after,
.messages .message.right .text_wrapper::before {
    left: 100%;
    border-left-color: #e5f3fa;
}

.messages .message.right .text {
    color: #45829b;
}

.messages .message.appeared {
    opacity: 1;
}

.messages .message .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
}

.messages .message .text_wrapper {
    display: inline-block;
    padding: 5px 20px;
    border-radius: 6px;
    max-width: 226px;

    position: relative;
}

.messages .message .text_wrapper::after,
.messages .message .text_wrapper:before {
    top: 10px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.messages .message .text_wrapper::after {
    border-width: 6px;
    margin-top: 0px;
}

.messages .message .text_wrapper::before {
    border-width: 6px;
    margin-top: 0px;
}

.messages .message .text_wrapper .text {
    font-size: 18px;
    font-weight: 300;
}

.bottom_wrapper {

    width: 100%;
    background-color: #fff;
    padding: 3px 20px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bottom_wrapper .message_input_wrapper {

    height: 50px;
    box-sizing: border-box;
    flex: 1;
    margin-right: 20px;
    display: flex;
    align-items: center;
    border: 1px solid #bcbdc0;
    font-size: 12px;
    border-radius: 25px;
    overflow: hidden;
    padding: 0 10px;

}

.bottom_wrapper .message_input_wrapper .message_input {
    border: none;

    padding: 5px 0;
    box-sizing: border-box;
    color: gray;
    width: 100%;



}

.bottom_wrapper .send_message {
    width: 100px;
    height: 50px;
    border-radius: 50px;
    background-color: #a3d063;
    border: 2px solid #a3d063;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
    text-align: center;
    float: right;
}

.bottom_wrapper .send_message:hover {
    color: #a3d063;
    background-color: #fff;
}

.bottom_wrapper .send_message .text {
    font-size: 18px;
    font-weight: 300;
    display: inline-block;
    line-height: 48px;
}

.seemore {
    padding: 5px 0;
    text-align: center;
    font-size: 12px;
    color: #999999;
}
</style>