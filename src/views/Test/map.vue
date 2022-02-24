<template>
 <div class="map" onload="initMap()">
     <Breadcrumb name="欢迎光临"/>
     <el-card>
     </el-card>
 </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { ref ,reactive,  } from 'vue'

 export default {
     components:{
         Breadcrumb,
     },

     setup(){

        // if(null){
        //     console.log(1)
        // }
        return {
            
        }
     }
 }
</script>

<style scoped>
.map{
    padding: 20px;
}
   #container{
        /*地图(容器)显示大小*/
        width:1200px;
        height:400px;
    }
    #container{
    /*地图(容器)显示大小*/ /*设置为全屏，位于最下层*/
        width:100%;
        height:100%;
        position: absolute;
        top: 0px;  
        bottom: 0px;
        left: 0px;
        right: 0px;
        z-index: -1;
}
    .map{
        width: 1000px;
        height: 500px;
    }
</style>