<template>
    <div class="chat_window">

        <ul class="messages">
            <li class="message left appeared">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">Hello Philip! :)</div>
                </div>
            </li>
            <li class="message right appeared">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">Hi Sandy! How are you?</div>
                </div>
            </li>
            <li class="message left appeared">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">I'm fine, thank you!</div>
                </div>
            </li>
            <li class="message right appeared">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">nihao</div>
                </div>
            </li>
        </ul>
        <div class="bottom_wrapper clearfix">
            <div class="message_input_wrapper">
                <textarea class="message_input" maxlength="50" placeholder="Type your message here..." />
            </div>
            <div class="send_message">
                <div class="icon"></div>
                <div class="text">Send</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {}
    },

    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll, true);
    },
    methods: {
        handleScroll() {
            window.scroll(0, 0);
        },
    }


}





</script>

<style lang="less" scoped>
.chat_window {}

.messages {
    list-style: none;
    padding: 20px 10px 10px 10px;
    margin: 0;
    box-sizing: border-box;

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
</style>