<template>
 <div class="login">
     <div class="box">
         <h3>后台管理系统</h3>
           <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="账号" prop="username">
                <el-input  v-model="form.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码 " prop="password" >
                <el-input  v-model="form.password"  show-password></el-input>
            </el-form-item>
            <el-form-item class="btn" >
                <el-button type="primary" @click="onSubmit(formRef)">登录</el-button>
                <el-button type="info" @click="reset(formRef)">重置</el-button>
            </el-form-item>
        </el-form>
     </div>
 </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive ,ref } from 'vue'
import {_login} from '@/network/login.js'
import { ElMessage } from 'element-plus'
import { useStore,  } from 'vuex'
import { getCurrentInstance } from 'vue'
 export default {
     setup(){
         const store = useStore();
         const formRef = ref(null);
         const router = useRouter();
         const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
         const form = reactive({
             username:'admin',
             password:123456
         })
         // 表单校验规则
         const rules = reactive({
             username:[
                 { required: true,message: '请输入账号',trigger: 'blur'}
             ],
             password:[
                 { required: true,message: '请输入密码',trigger: 'blur'}
             ]
         })
         // 登录
        const onSubmit = (formRef) => {
            formRef.validate(async (valid) => {
                if (valid) {
                    const { data: res } = await _login(form)
                    if (res.meta.status !== 200) ElMessage.error('账号或密码错误')
                    window.sessionStorage.setItem("active", 'welcome');
                    store.commit("user/setToken",res.data)
                    proxy.$msg.success(res.meta.msg)
                    router.push('/home')
                } else {
                    return false
                }
            })
        }
        // 重置表单  vue3里面需要加上 rules 校验规则，重置才生效
        const reset = (formRef) => {
            formRef.resetFields()
        }
         return {form,formRef,rules,onSubmit,reset,}
     }
 }
</script>

<style lang="less" scoped>
.login{
    width: 100%;
    height: 100%;
    background-color: burlywood;
    background: url('../img/back2.jpg') no-repeat;
    background-size: 100% 100%;
    padding-top: 13%;
    box-sizing: border-box;
    .box{
        width: 500px;
        height: 300px;
        background-color: rgba(150, 30, 120, .3);
        box-shadow: 0 0 30px #eee;
        margin: 0 auto;
        border-radius: 20px;
        padding-top: 20px;
        box-sizing: border-box;
        h3{
            text-align: center;
            color: #fff;
            margin-bottom: 70px;
        }
        .el-form{
            padding-left: -10px;
        }
        .el-input{
            width: 220px;
        }
        :deep(.el-form-item){
            justify-content: center;
        }
        :deep(.el-form-item__content) {
            width: 220px ;
            padding: 0;
            flex: .5;
            justify-content: center;
        }
        :deep(.el-form-item__label){
            color:#fff;
        }
    }
}
</style>