<template>
  <div class="login-container">
    <van-nav-bar :title="routeTitle" class="page-nav-bar" />
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="time" format="ss s" @finish="finish"></van-count-down>
          <van-button native-type="button" v-else size="small" type="default" round class="my-button"  @click="onSendSms"
            >获取验证码</van-button
          >
          
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login ,sendsms} from "@/api/user";
export default {
  // 组件名称
  name: "",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      time: 1000 * 5,
      isCountDownShow:false,
      routeTitle: this.$route.meta.title,
      user: {
        mobile: "",
        code: "",
      },
      userFormRules: {
        mobile: [
          {
            require: true,
            message: "请输入手机号",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            require: true,
            message: "请输入验证码",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.title;
    },
  },
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async onSubmit() {
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });

      const user = this.user;
      try {
        const {data} = await login(user);
        this.$store.commit('setUser',data.data)
        this.$toast.success("登录成功");
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          return this.$toast.fail("手机号或验证码错误");
        } else {
          return this.$toast.fail("登录失败，请稍后重试");
        }
      }
    },
    finish(){
      this.isCountDownShow=false
    },
    async onSendSms(){
      const number = this.user.mobile
      //验证手机号
      try{
        await this.$refs.loginForm.validate('mobile')
      }catch(err){
        return console.log('验证失败', err)
      }

      this.isCountDownShow=true

      try{
       const send =  await sendsms(number)
       console.log('send',send)
         this.$toast('发送成功')
      }catch(err){
        this.isCountDownShow=false
        if(err.response.status === 429){
          this.$toast('发送太频繁了，请稍后重试')
        }else{
          this.$toast('发送失败，请稍后重试')
        }
      }
     
      
    }
  },
};
</script>

<style scoped lang="less">
.iconfont {
  font-size: 37px;
}
.my-button {
  background-color: #ededed;
}
</style>
