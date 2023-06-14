<template>
  <div>
    <el-container>
      <div v-show="isShow" id="message-list">
        <el-menu
          :default-active="activeIndex"
          class="el-menu"
          @select="handleSelect"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message" />
              <span style="margin-left:3px">联系人</span>
            </template>
            <el-menu-item
              v-for="contact in contacts"
              :key="contact.id"
              :index="contact.id.toString()"
              class="menu-item"
            >
              <el-avatar :src="contact.avatar" size="small" />
              <span style="margin-left:10px">{{ contact.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <div v-show="!isShow" id="message-icon">
        <i class="el-icon-message" />
      </div>

      <el-header>
        <h2 style="text-align: center">即时通讯</h2>
      </el-header>
      <el-main id="main" style="overflow-y: scroll; margin-bottom: 40px">
        <el-card
          v-for="message in messages"
          :key="message.id"
          :class="{ self: message.self, other: !message.self }"
        >
          <div>{{ message.text }}</div>
        </el-card>
      </el-main>
      <footer style="position: fixed; bottom: 20px; left: 260px; right: 50px">
        <el-input
          v-model="message"
          :disabled="disabled"
          placeholder="Type your message here"
          @keyup.enter.native="sendMessage"
        />
      </footer>
    </el-container>
  </div>
</template>

<script>
import { getContacts } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { getChatHistory } from "@/api/im/chatHistory";
export default {
  data() {
    return {
      disabled: true,
      messages: [],
      message: "",
      contacts: [],
      activeIndex: "0",
      ws: null,
      // 重试定时器
      retry: "",
      // 心跳定时器
      heartBeat: "",
      isShow: false,
    };
  },
  created() {
    this.getUsers();
    this.connectWebSocket();
    this.getHistory();
  },
  mounted() {
    let icon = document.getElementById("message-icon");
    icon.addEventListener("mouseenter", () => {
      this.isShow = true;
    });
    let list = document.getElementById("message-list");
    list.addEventListener("mouseleave", () => {
      this.isShow = false;
    });
  },
  methods: {
    connectWebSocket() {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const url =
        `${protocol}://43.139.27.107:1540/ws?token=` +
        getToken().replace("Bearer ", "");
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        clearInterval(this.retry);
        this.heartBeat = setInterval(() => {
          const message = {
            type: 1001,
          };
          this.ws.send(JSON.stringify(message));
        }, 60000);
      };
      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.$message.error("连接已断开");
        this.disabled = true;
        this.retry = setTimeout(() => this.connectWebSocket(), 60000);
      };
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      this.ws.onmessage = (event) => {
        console.log(event);
        const data = JSON.parse(event.data);
        // 单聊消息
        if (data.type === 2000 && data.fromUid == this.activeIndex) {
          const message = {
            id: this.messages.length + 1,
            text: data.content,
            self: false,
          };
          this.messages.push(message);
        }
      };
    },
    sendMessage() {
      if (!this.message) return;
      const message = {
        type: 2000,
        toUid: this.activeIndex,
        content: this.message,
      };
      this.ws.send(JSON.stringify(message));
      this.messages.push({
        id: this.messages.length + 1,
        text: this.message,
        self: true,
      });
      this.message = "";
    },
    handleSelect(index) {
      this.activeIndex = index;
      // load messages with the selected contact
      this.messages = [];
      if (this.activeIndex > 0) {
        this.disabled = false;
      }
      this.getHistory();
    },
    getUsers() {
      getContacts().then((response) => {
        const userList = response.data.data;
        userList.forEach((user) => {
          const contact = {
            id: user.userId,
            name: user.nickName,
            avatar: user.avatar
          };
          this.contacts.push(contact);
        });
      });
    },
    getHistory() {
      getChatHistory(this.activeIndex).then((response) => {
        if (response.data.code == 200) {
          const dataList = response.data.data;
          dataList.forEach((data) => {
            const message = {
              id: this.messages.length + 1,
              text: data.content,
              self: data.toUid == this.activeIndex,
            };
            this.messages.push(message);
          });
        } else {
          this.$message.error("获取历史消息失败");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
#message-list {
  position: absolute;
  width: 200px;
  transition: all 2000 ease;
}
#message-icon {
  position: absolute;
  padding: 22px;
  transition: all 2000 ease;
}
.menu-item{
  display: flex;
  // justify-content: center;
  align-items: center;
}
.self {
  background-color: #e6f7ff;
  margin-left: auto;
  width: 400px;
  margin-bottom: 10px;
  border-radius: 20px;
}

.other {
  background-color: #f2f2f2;
  width: 400px;
  margin-bottom: 10px;
  border-radius: 20px;
}
</style>
