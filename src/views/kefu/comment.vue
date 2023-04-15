<template>
    <div class="commentBg">
        <div class="showComment">
            <div class="commentTitle">
                <span v-bind:class="{ messageActive: messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(true)">请您留言</span>
                <span v-bind:class="{ messageActive: !messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(false)">留言记录</span>
            </div>
            <!--提交页面-->
            <div v-show="messageType">
                <div class="messageTip">
                    {{ messageTip }}
                </div>
                <van-rate v-model="rateValue" allow-half class="messageRate"></van-rate>
                <textarea v-model="customerMessage" maxlength="200" id="remark" class="textarea"></textarea>


                <div class="submitDiv" style="margin-top: 10px">
                    <div class="submitBtn" v-on:click="sumbitMessage">
                        提交
                    </div>
                </div>
            </div>
            <!--回复查看页面-->
            <div v-show="!messageType" class="messageRecord">
                <div v-for="(item, index) in messageList" :key="index" class="messageDiv">
                    <div class="messageTime">{{ item.commentTime }}</div>
                    <div class="messageContent">
                        <div class="messageDetail">{{ item.commentContent }}</div>
                        <div class="messageState" v-if="item.commentState == 0">待回复</div>
                        <div class="messageState" v-else-if="item.State == 2" v-on:click="item.State = 1">
                            ∧收起
                        </div>
                        <div class="messageState" v-else v-on:click="seeMessageDetail(item)">
                            查看详情
                        </div>
                    </div>
                    <div v-if="item.State == 2" style="text-align: left">
                        <div>客服：{{ item.commentService }}</div>
                        <div>{{ item.commentReply }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import API_USER from '@/apis/user';
export default {
    name: 'LeaveWord',
    props: {
    },
    data() {
        return {
            messageType: true,
            messageTip: "如需帮助，请留言，我们将尽快联系并解决您的问题",
            rateValue: 10,
            customerMessage: '',
            messageList: []
        }
    },
    methods: {
        //留言与留言记录的切换
        changeMessageType(flat) {
            this.messageType = flat;
            if (!flat) {
                let params = {
                    commentId: JSON.parse(localStorage.getItem('chatData')).userId,
                }
                console.log(params)
                API_USER.commentSelectById( params)
                    .then(({ data, code }) => {
                        if (code === 0) {
                            this.messageList = data;
                        } else {
                            this.$toast("获取失败")
                        }
                    })
            }
        },

        //提交留言
        sumbitMessage() {
            let params = {
                commentId: JSON.parse(localStorage.getItem('chatData')).userId,
                commentContent: this.customerMessage,
                commentGrade: this.rateValue,
                commentTime: this.getNowTime()
            }

            API_USER.commentInsert( params )
                .then(({ data, code }) => {
                    if (code === 0) {
                        this.$toast("提交成功")
                        this.customerMessage = "";
                    } else {
                        this.$toast("提交失败")
                    }
                })
        },

        //获取当前时间
        getNowTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
            return time;
        },
        //小于10的拼接上0字符串
        addZero(s) {
            return s < 10 ? ('0' + s) : s;
        },

        seeMessageDetail(message) {
            message.State = 2;
        },
    }


}
</script>

<style scoped>
.commentBg {
    width: 100%;
    background: #fafafa;
}

.showComment {
    width: 100%;
    background: #fff;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
}

.commentTitle {
    height: 40px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    letter-spacing: 1px;
    display: flex;

}

.messageRate {
    transform: scale(1.5);
    margin-top: 20px;
    margin-bottom: 20px;
}

.messageActive {
    color: #000;
    border-bottom: 3px solid #30bcbc;
}

.messageTopBtn {
    display: inline-block;
    width: 50%;
    color: #ccc;
}

.messageTip {
    width: 100%;
    height: 60px;
    padding: 10px;
    background-color: #F1F3F4;
    font-size: 14px;
    color: #8A9699;
}

.messageSub {
    text-align: center;
    margin-top: 10px;
    padding: 5px 15px;
    line-height: 20px;
    color: #fff;
    border-radius: 15px;
    background: #E4EAF2;
    height: 30px;
}

.textarea {
    padding: 10px;
    font-size: 15px;
    line-height: 18px;
    word-wrap: break-word;
    overflow-y: auto;
    border-radius: 8px;
    width: 90%;
    height: 200px;
    background-color: #fff;
    border: 1px solid #ccc;
    margin: 10px auto;
    FONT-WEIGHT: 500;
    outline: none;
    resize: none;
}

.submitDiv {
    width: 100%;
    padding-bottom: 20px;

}

.submitBtn {
    width: 85%;
    height: 35px;
    color: #fff;

    margin: 0 auto;
    text-align: center;
    line-height: 35px;
    border-radius: 10px;
    background-color: #30bcbc;
}


.messageRecord {
    height: 90%;
    overflow: scroll;
    background: #F8F9FA;
}

.messageDiv {
    background: #fff;
    margin-bottom: 8px;
    padding: 16px 20px 18px 20px;
    border-top: 1px solid #FAF9FA;
    border-bottom: 1px solid #FAF9FA;
}

.messageState {
    padding: 5px 15px;
    line-height: 20px;
    color: #fff;
    border-radius: 15px;
    background: #E4EAF2;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 30px;
}

.messageContent {
    display: flex;
    width: 100%;
    position: relative;
}

.messageDetail {
    font-size: 14px;
    color: #acb5c4;
    margin-right: 10px;
    display: -webkit-box;
    text-align: left;
    margin-top: 10px;
    width: 75%;
}

.messageTime {
    font-size: 16px;
    font-weight: bold;
    color: #515A7C;
    text-align: left;
}

@media screen and (min-width: 650px) {
    .showComment {
        width: 35%;
    }
}
</style>