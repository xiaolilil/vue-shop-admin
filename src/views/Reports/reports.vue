<template>
 <div class="box">
     <Breadcrumb name="数据统计"/>
     <el-card>
        <div ref="echartsRef" id="main" :style="`height:${$attrs.height || 400}px;width:${$attrs.width + 'px' || '70%'} 800px; `"></div>
     </el-card>
 </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { ref ,onMounted, onBeforeUnmount} from 'vue'
import {_getData} from '@/network/reports.js'
import {debounce} from '@/utils/debounce.js'
import { getCurrentInstance } from 'vue'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart,LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
//    ,
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  LineChart ,
]);

 export default {
     components:{
         Breadcrumb,
     },
     setup(){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
         let echartsRef  = ref();
         let chart = null;
        const getData = async () => {
            const {data:res} = await _getData();
            if(res.meta.status != 200)  proxy.$msg.error(res.meta.msg);
            proxy.$msg.success(res.meta.msg);
            res.data.series.forEach(i => {
                i.areaStyle = {};
            });
            const x = res.data.xAxis[0];
            res.data.xAxis = Object.assign(x, {boundaryGap: false})
            const result = Object.assign(res.data,options);
            chart.setOption(result);
        };
        onMounted(() => {
            chart = echarts.init(echartsRef.value)
            getData();
            //根据浏览器的大小来改变大小
            window.onresize = debounce(() => {
                    chart.resize();
            }, 300)
        })
        // 卸载页面销毁 window.onresize事件
        onBeforeUnmount(() => {
          window.onresize = null;
        })
        // echarts 配置
        const options = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // xAxis: [
        //   {
        //     boundaryGap: false
        //   }
        // ],
        yAxis: [
          {
            type: 'value'
          }
        ]
        }

         return {
            options,
            echartsRef
         }
     }
 }
</script>

<style lang="less" scoped>
.box{
    padding: 20px;
}
</style>