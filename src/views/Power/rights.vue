<template>
 <div class="rights">
     <Breadcrumb name="权限管理" />

     <el-card>
        <el-table :data="rightsList" border style="width: 95%">
            <el-table-column type="index" label="#" width="50"  />
            <el-table-column prop="authName" label="权限名称" />
            <el-table-column prop="path" label="路径"  />
            <el-table-column prop="level" label="权限等级" >
                <template #default="scope">
                    <el-tag :type="getType(scope.row.level)">
                        {{scope.row.level == 0 ? '一级' : (scope.row.level == 1 ? '二级' : '三级') }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>



     </el-card>
 </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { ref } from 'vue';
import {_getRightsList} from '@/network/roles.js'
import { getCurrentInstance } from 'vue'

 export default {
     components:{
         Breadcrumb,
     },
     setup(){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
         let rightsList = ref([]);
         const getRights = async () => {
             const {data:res} = await _getRightsList();
             if(res.meta.status != 200) proxy.$msg.error('获取权限列表失败');
             rightsList.value = res.data.slice(0,12);
            //  rightsList.value = res.data;
         }
         getRights();

        const getType = (idx) => {
            let arr = ["", "success", "danger"];
            return arr[idx];
        }

         return{
             rightsList,
             getRights,
             getType,
         }
     },
 }
</script>

<style lang="less" scoped>
  @import '../../style/mixins.less';

.rights{
    padding: 20px;
    .el-table{
        margin: 0 auto;
    }
    .el-card{
        box-sizing: border-box;
    }
}








.swiper-wrapper {
    width: 600px;
    height: 1000px;
    border: solid 1px red;
    // 默认是隐藏超出
    overflow: hidden;

    // 鼠标移入可滚动列表
    &:hover {
        overflow-y: scroll;
    }

    &::-webkit-scrollbar {
        width: 10px;
        height: 1px;
        display: none;
    }

    // 滚动条上的滚动滑块
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
    }

    // 滚动条背景轨道
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ededed;
    }

    // 内容超出展示
    .content-container {
        overflow: visible;
        height: 100%;
        width: 100%;
        border: solid 1px red;
        transition: all 0.5s linear;

        .item-style {
            width: 100%;
            height: 100px;
            line-height: 40px;
            color: white;
            border: solid 1px red;
        }
    }
}










</style>