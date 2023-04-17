<template>
  <transition name="fade">
    <div v-if="visible" :class="['message', type]">
      <i :class="['icon', 'el-icon-' + type]"></i>
      <span>{{ content }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      content: "",
      type: "",
      duration: 3000,
      isShowing: false, // 添加一个变量来跟踪消息是否正在显示
    };
  },
  methods: {
    /**
     * @description:
     * @param {*} content  内容
     * @param {*} type 类型
     * @param {*} duration 时间
     * @return {*}
     */
    async show(content, type = "info", duration = 2000, callback) {
      if (this.isShowing) return;
      this.content = content;
      this.type = type;
      this.duration = duration;
      this.visible = true;
      this.isShowing = true;
      if (type === "loading" && callback) {
        await callback();
      }
      setTimeout(() => {
        this.visible = false;
        this.isShowing = false;
      }, this.duration);
    },
  },
};
</script>


  
<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  z-index: 9999;
  display: flex;
  align-items: center;
}

.success {
  background-color: #52c41a;
}

.warning {
  background-color: #faad14;
}

.error {
  background-color: #f5222d;
}

.info {
  background-color: #1890ff;
}
.loading {
  background-color: #1890ff;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.icon {
  font-size: 20px;
  color: #fff;
  margin-right: 5px;
  font-style: normal;
}
</style>