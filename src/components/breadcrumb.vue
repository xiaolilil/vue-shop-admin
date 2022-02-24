<template>
 <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item class="box" v-for="(v,i) in list" :key="v">
          <span>{{v}}</span>
      </el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{path:'/welcome'}" >{{list[0]}}</el-breadcrumb-item>
      <el-breadcrumb-item  >{{list[1]}}</el-breadcrumb-item>
      <el-breadcrumb-item  >{{list[2]}}</el-breadcrumb-item>
    </el-breadcrumb>
 </div>
</template>

<script>
import { ref,watch, } from 'vue';
import { useRouter } from "vue-router";
 export default {
     props:{
         name:String
     },
     setup(props){
        const router = useRouter();
        const list = ref([]);
        watch(() => router.currentRoute.value, (n,o) => {
            if(n.matched.length && n.matched.length != 1 && n.matched[1].name == 'home'){
                //  n.matched = [{path:'/home', name:'home',meta:{title:"首页"}}]
                 list.value.push('首页')
            }
            if(n.matched.length != 1){
                list.value.push(n.matched[0].meta.title);
            }
            // list.value = n.matched;
            if( list.value.length < 3 && props.name){
                // list.value.splice(1,0,{path:'/welcome',meta:{title:props.name}})
                list.value.splice(1,0,props.name)
                list.value.push(n.matched[1].meta.title);
            }

        },{ immediate: true });

        return {list}
     }
     
 }
</script>

<style lang="less" scoped>
.bread{
    margin-bottom: 20px;
    .box:first-child{
        font-weight: bold;
        color: black;
        cursor: pointer;
    }
}
</style>