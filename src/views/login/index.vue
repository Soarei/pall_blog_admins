<template>
  <div class="login-container">
    <!-- 左侧背景区域 -->
    <div class="login-banner">
      <div class="banner-content">
        <div class="brand">
          <div class="brand-logo">
            <a-icon type="shop" theme="filled" />
          </div>
          <div class="brand-info">
            <h2>PALL后台管理系统</h2>
            <p>Food Review Management System</p>
          </div>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">
              <a-icon type="bar-chart" />
            </div>
            <div class="feature-text">
              <h3>安全可靠</h3>
              <p>采用多重加密技术，保障数据安全</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <a-icon type="bar-chart" />
            </div>
            <div class="feature-text">
              <h3>实时同步</h3>
              <p>数据实时更新，多端同步展示</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <a-icon type="bar-chart" />
            </div>
            <div class="feature-text">
              <h3>数据分析</h3>
              <p>专业的数据分析，助力业务增长</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 背景装饰 -->
      <div class="banner-bg">
        <div class="circle-group">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
        <div class="wave-group">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="login-form">
      <div class="form-container">
        <div class="form-header">
          <div class="logo">
            <a-icon type="shop" theme="filled" />
          </div>
          <h3>欢迎回来</h3>
          <p>请使用您的账号密码登录系统</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <div class="input-wrapper">
              <a-icon type="user" />
              <input
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                v-model="loginForm.user_account"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <div class="input-wrapper">
              <a-icon type="lock" />
              <input
                type="password"
                class="form-input"
                placeholder="请输入密码"
                v-model="loginForm.password"
                required
              />
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <a-checkbox v-model="loginForm.remember">记住密码</a-checkbox>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <button type="submit" class="login-btn">
            <span>登 录</span>
            <a-icon type="arrow-right" />
          </button>

          <div class="other-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-login">
              <a-tooltip title="微信登录">
                <a-icon type="wechat" class="social-icon" />
              </a-tooltip>
              <a-tooltip title="QQ登录">
                <a-icon type="qq" class="social-icon" />
              </a-tooltip>
              <a-tooltip title="微博登录">
                <a-icon type="weibo" class="social-icon" />
              </a-tooltip>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        user_account: "admin",
        password: "admin123",
      },
      loginRules: {
        user_account: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      checked: false,
      elItem: 1,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    loadmore() {
      console.log(111);
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleSubmit() {
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    // 去注册
    goRegister() {
      this.$router.push({ path: "/register" });
    },
  },
};
</script>
<style scoped>
.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #fff;
}

/* 左侧背景区域 */
.login-banner {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1890ff 0%, #1677ff 100%);
  padding: 60px;
  padding-top: 40px;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
}

.banner-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 560px;
  margin-top: 40px;
}

/* 品牌区域 */
.brand {
  margin-bottom: 32px;
}

.brand-logo {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.brand-logo .anticon,
.logo .anticon {
  font-size: 32px;
  color: #fff;
}

.brand-info h2 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 8px;
  font-weight: 600;
}

.brand-info p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}

/* 特性列表 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon .anticon {
  font-size: 20px;
  color: #fff;
}

.feature-text h3 {
  font-size: 16px;
  color: #fff;
  margin-bottom: 4px;
}

.feature-text p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

/* 背景装饰 */
.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle-group {
  position: absolute;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: -100px;
  animation: float 12s ease-in-out infinite;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  right: 30%;
  animation: float 10s ease-in-out infinite;
}

.wave-group {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform-origin: center bottom;
}

.wave-1 {
  animation: wave 12s linear infinite;
}

.wave-2 {
  animation: wave 8s linear infinite;
  opacity: 0.5;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes wave {
  0% {
    transform: translateX(0) scaleY(0.1);
  }
  50% {
    transform: translateX(-50%) scaleY(0.2);
  }
  100% {
    transform: translateX(-100%) scaleY(0.1);
  }
}

/* 响应式处理 */
@media (max-width: 1200px) {
  .login-banner {
    padding: 30px;
    padding-top: 20px;
  }

  .banner-content {
    margin-top: 20px;
  }

  .feature-item {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .login-banner {
    display: none;
  }
}

/* 右侧登录区域样式优化 */
.login-form {
  width: 500px;
  background: #fff;
  display: flex;
  align-items: flex-start;
  padding: 60px 40px;
  position: relative;
  padding-top: 40px;
}

.login-form::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 70%;
  background: linear-gradient(to bottom, transparent, #f0f0f0, transparent);
}

.form-container {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  margin-top: 40px;
}

.form-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1890ff, #1677ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.2);
}

.logo i {
  font-size: 32px;
  color: #fff;
}

.form-header h3 {
  font-size: 28px;
  color: #1f2329;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-header p {
  color: #86909c;
  font-size: 14px;
}

.input-group {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .anticon {
  position: absolute;
  left: 16px;
  color: #86909c;
  font-size: 16px;
  transition: all 0.3s;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 44px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2329;
  background: #f2f3f5;
  transition: all 0.3s;
}

.form-input:focus {
  background: #fff;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input:focus + .anticon {
  color: #1890ff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  color: #4e5969;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-link:hover {
  color: #40a9ff;
}

.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #1677ff);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #40a9ff, #4096ff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.login-btn .anticon {
  font-size: 14px;
  transition: transform 0.3s;
}

.login-btn:hover .anticon {
  transform: translateX(4px);
}

.other-login {
  margin-top: 40px;
}

.divider {
  display: flex;
  align-items: center;
  color: #86909c;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e6eb;
}

.divider span {
  padding: 0 16px;
  font-size: 14px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.social-icon {
  font-size: 24px;
  color: #86909c;
  cursor: pointer;
  transition: all 0.3s;
}

.social-icon:hover {
  color: #1890ff;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .login-form {
    width: 100%;
    padding: 40px 20px;
  }

  .login-form::before {
    display: none;
  }
}
</style>
