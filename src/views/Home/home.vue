<template>
  <el-container class="layout" ref="box">
    <el-header>
      <h1>电商后台管理系统</h1>
      <el-button type="warning" @click="logout">退出</el-button>
    </el-header>
    <el-container class="home">
      <el-aside class="aside" :class="[isCollapse == true ? 'col' : '']" >
        <el-scrollbar>
          <div class="op-cl" @click="zhedie">| | |</div>
          <el-menu
            :unique-opened="true"
            :default-openeds="['0']"
            router=""
            :default-active="activePath"
            :collapse="isCollapse"
            v-for="(v, i) in this.$store.state.menu.menu" :key="v.id"
          >
            <el-sub-menu :index="'i'">
              <template #title>
                <i class="icon" :class="iconsObj[v.id]"></i>
                <span>{{ v.authName }}</span>
              </template>
              <el-menu-item-group v-for="(o, i) in v.children" :key="i">
                <el-menu-item
                  index=""
                  :class="[activeClass == o.path ? 'activeClass' : '']"
                  @click="activeItem('/' + o.path, o.path, $event)"
                  >{{ o.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>

          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script >
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore,  } from 'vuex'
import { ElMessage } from "element-plus";
import { _menu } from "@/network/login.js";
import { removeToken } from "@/utils/setMsg.js";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const logout = () => {
      // 退出登录
      removeToken();
      ElMessage.info("退出登录");
      router.push("/login");
    };

    const welcome = {
      id: 147,
      authName: "欢迎光临",
      path: "welcome",
      children: [
        {
          authName: "Welcome",
          id: 124,
          order: 1,
          path: "welcome",
          children: [],
        },
        {
          authName: "地图",
          id: 123,
          order: 1,
          path: "map",
          children: [],
        },
      ],
      order: 1,
    };

    const iconsObj = {
      // 一级菜单的icon图标
      147: "iconfont icon-huanyingye",
      125: "iconfont icon-jurassic_user",
      103: "iconfont icon-quanxian",
      101: "iconfont icon-dingdan",
      102: "iconfont icon-goods-copy",
      145: "iconfont icon-baobiao-xianxing",
    };
    
    // 获取菜单列表
    const getMenu = async () => {
      const {data:res} = await _menu();
      if(res.meta.status != 200)  ElMessage.error(res.meta.msg);
      if(res.data){
        res.data.unshift(welcome);
      }
      // menus.value = res.data;
      store.commit("menu/getMenu",res.data)
    }
    getMenu()

    // 折叠菜单栏
    let isCollapse = ref(false);
    const zhedie = () => {
      isCollapse.value = !isCollapse.value;
    };

    const activeClass = ref('welcome');
    activeClass.value = window.sessionStorage.getItem("active");
    const activePath = ref('');
    const dom1 = ref(null);
    const activeItem = (i, idx, e) => {
      activeClass.value = idx;
      activePath.value = idx;
      router.push(i);
      window.sessionStorage.setItem("active", activeClass.value);
    }

    return {  logout, 
              welcome, 
              iconsObj, 
              isCollapse, 
              activeClass,
              activePath,
              dom1,
              zhedie, 
              activeItem,
               
          };
  },

};
</script>

<style lang="less" scoped>
@import "../../style/home.less";
</style>