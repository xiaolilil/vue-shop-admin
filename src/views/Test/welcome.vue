<template>
    <div class="content">
        <Breadcrumb name="欢迎光临" />
        <el-card>
            <div class="weather">
                <div class="weather-top">
                    <h2>{{weatherData.city}}  </h2>
                    <ul v-for="v in first" :key="v.air">
                        <h4>{{v.day}} {{v.week}} {{v.wea}}</h4>
                        <li><strong>{{v.tem1}}</strong> ~ <strong>{{v.tem2}}</strong></li>
                        <li class="info">{{v.air_tips}}</li>
                        <i :class="['iconfont ','icon1',getIcon(v.wea)]"></i>
                    </ul>
                    <hr />
                    <div class="weather-bottom">
                        <ul v-for="v in weatherData.data" :key="v.day">
                            <li>
                                <span>{{v.day}}</span>
                                <span>{{v.week}}</span>
                                <i :class="['iconfont ','icon2',getIcon(v.wea)]"></i>
                                <span>{{v.tem1}} ~ {{v.tem2}}</span> 
                            </li>
                        </ul>

                    </div>
                </div>
            </div>



            <!-- <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="v in imgs" :key="v">
                <img :src="v.imgUrl" alt="">
                </el-carousel-item>
            </el-carousel>-->

             <div class="box">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
                <img class="img" src="https://img2.baidu.com/it/u=2881626344,3036352747&fm=253&fmt=auto&app=120&f=JPEG?w=499&h=375" alt="">
            </div> 
        </el-card>

    </div>
</template>

<script>
import axios from 'axios';
import {ref,computed} from 'vue';
import Breadcrumb from '@/components/breadcrumb.vue';
import { ElMessage } from 'element-plus'

export default {
     components:{
         Breadcrumb,
     },
    setup() {
        const imgs = ref([
            {imgUrl:"https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00496-1657.jpg",},
            {imgUrl:"https://img1.baidu.com/it/u=3124844213,86404024&fm=253&fmt=auto&app=138&f=JPEG?w=780&h=488",},
            {imgUrl:"https://img0.baidu.com/it/u=1109767828,1128519388&fm=253&fmt=auto&app=138&f=JPEG?w=990&h=450"},
            {imgUrl:"https://img0.baidu.com/it/u=1055437995,1883507791&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=300"},
            {imgUrl:"https://img1.baidu.com/it/u=1254680469,2491344781&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281"},
        ]);
        const weatherData = ref([]);
        const first = ref({});
        const getWeather = async () => {
        //    const {data:res} = await axios.get('http://wthrcdn.etouch.cn/weather_mini?city=成都');
           const res = await axios.get('http://www.tianqiapi.com/api?version=v1&appid=23035354&appsecret=8YvlPNrz');
           if(res.data.city != "成都")ElMessage.error('获取天气信息失败');
           res.data.data.forEach(i => {
               i.day = i.day.split('（')[0];
           })
           first.value = res.data.data.slice(0,1);
           res.data.data = res.data.data.slice(1,7);
           weatherData.value = res.data;
        //    console.log(weatherData.value);
        }
        getWeather();

        const icons = ['icon-duoyun','icon-31qing','icon-xiaoyu','icon-yin'];
        const getIcon = (v) => {
            let icon;
            if( v.indexOf('多云') != -1){
                icon = icons[0]
            }else if(v.indexOf('雨') != -1){
                icon = icons[2]
            }else if(v.indexOf('晴') != -1){
                icon = icons[1]
            }else if(v.indexOf('阴') != -1){
                icon = icons[3]
            }
            return icon
        }

        const getOne = computed(() => {
            if(weatherData.value){
                // let a = weatherData.value.data.slice(0,1)
                // debugger
                // return a
            }
                
        })


        return {imgs,weatherData,first,getIcon}
    },
}
</script>


<style lang="less" scoped>
.content{
    padding: 20px;
}

.el-carousel{
    width: 80%;
    margin: 0 auto;
    margin-top: 30px;
    img{
        width: 534px;
        height: 200px;
    }
}

ul,li{
    list-style: none;
}


.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}


        .box {
            position: relative;
            width: 300px;
            height: 200px;
            margin: 60px auto 0;
            perspective: 27000px;
            transform-style: preserve-3d;
            animation: rotate 10s linear infinite;
            // background-image: url(https://img2.baidu.com/it/u=2161071795,3577630275&fm=26&fmt=auto);
            background-size: 100% 100%;
        }
        
        .box:hover {
            animation-play-state: paused;
        }
        
        .img {
            position: absolute;
            left: 0;
            top: 0;
            width: 300px;
            height: 200px;
            background: url('./tiger.jpg');
        }
        
        .box .img:nth-child(1) {
            transform: rotateY(0) translateZ(300px);
            background-color: darkorchid;
        }
        
        .box .img:nth-child(2) {
            transform: rotateY(60deg) translateZ(300px);
            background-color: darkgoldenrod;
        }
        
        .box .img:nth-child(3) {
            transform: rotateY(120deg) translateZ(300px);
            background-color: salmon;
        }
        
        .box .img:nth-child(4) {
            transform: rotateY(180deg) translateZ(300px);
            background-color: blue;
        }
        
        .box .img:nth-child(5) {
            transform: rotateY(240deg) translateZ(300px);
            background-color: rosybrown;
        }
        
        .box .img:nth-child(6) {
            transform: rotateY(300deg) translateZ(300px);
            background-color: burlywood;
        }
        
        @keyframes rotate {
            0% {
                transform: rotateY(0);
            }
            100% {
                transform: rotateY(360deg);
            }
        }

        .weather{
            width:600px;
            height:320px;
            margin: 0 auto;
            padding:20px;
            border: 3px solid blueviolet;
            box-shadow: 0 0 30px #ccc;
            border-radius: 10px;
        }
        .weather-top{
            position: relative;
        }
        .info{
            width: 350px;
        }
        .icon1{
            position: absolute;
            top: 6px;
            right: 20px;
            font-size: 80px !important;
        }
        hr{
            margin: 20px 0 40px;
        }
        .weather-bottom {
            display: flex;
            
        }
        .weather-bottom ul{
            width: 100px;

        }
        .weather-bottom ul li{
            display: flex;
            flex-direction: column;
            text-align: center;
        }
        .weather-bottom ul li span:nth-child(2){
            margin: 10px 0;
        }
        .weather-bottom ul li i{
            margin-bottom: 10px ;
        }
        .iconfont{
            font-size: 40px;
        }

</style>
