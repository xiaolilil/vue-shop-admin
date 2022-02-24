<template>
 <div class="order">
     <Breadcrumb name="订单管理" />

    <el-card>
         <el-row :gutter="20" class="card">
             <el-col :span="8">
                <el-input
                    v-model="queryInfo.query"
                    placeholder="请输入内容"
                    class="input-with-select"
                    clearable
                    @clear="getOrderList">
                    <template #append>
                        <el-button :icon="Search" @click="getOrderList"></el-button>
                    </template>
                </el-input>
             </el-col>
         </el-row>

            <el-table :data="orderList" border style="width: 100%">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column prop="order_number" label="订单编号"  />
                <el-table-column prop="order_price" label="订单价格" width="180" />
                <el-table-column prop="order_pay" label="是否支付" width="180" >
                    <template #default="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                        <el-tag type="success" v-else-if="scope.row.order_pay === '1'">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="180" >
                    <template #default="scope">
                        <el-tag type="danger" v-if="scope.row.is_send === '否'">否</el-tag>
                        <el-tag type="success" v-else-if="scope.row.is_send === '是'">是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="180" >
                    <template #default="scope">
                        {{formatDate(scope.row.create_time)}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" >
                    <template #default="scope">
                        <el-button @click="showEditBox(scope.row)" type="primary" size="default" :icon="Edit"></el-button>
                        <el-button @click="showWuli(scope.row)" type="success" size="default" :icon="Position"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <AsyncPage 
                :queryInfo="queryInfo" 
                :total="total"  
                :numList="[2,4,6,8]"
                @changeNum="changeNum" 
                @changeSize="changeSize" />

     </el-card>
 </div>

  <el-dialog
    v-model="editVisible"
    title="修改地址"
    width="30%"
  >
    <el-form class="form"  ref="editRef" :model="addresForm"  :rules="rules" label-width="100px">
        <el-form-item label="省市区/县" prop="addres1">
            <el-cascader
            v-model="addresForm.addres1"
            :options="data"
            :props="props"
            @change="handleChange"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addres2">
            <el-input v-model="addresForm.addres2"></el-input>
        </el-form-item>
        <el-form-item class="bb">
            <el-button @click="editVisible = false">取消</el-button>
            <el-button type="primary" @click="editAddress(editRef)">确定</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog     
        v-model="timeBox"
        title="物流进度"
        width="40%">
    <el-timeline >
        <el-timeline-item
        v-for="(v, i) in timeData"
        :key="i"
        :timestamp="v.time"
        >
        {{ v.context }}
        </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { Search,Edit ,Position  } from '@element-plus/icons-vue';
import { ref ,reactive,defineAsyncComponent} from 'vue'
import {_getOrderList,_getWuli} from '@/network/order.js'
import cityData from "./citydata.js";
import { getCurrentInstance } from 'vue'
import formatDate  from '@/utils/dataFliter.js'

// 异步组件
const AsyncPage = defineAsyncComponent({
    loader:() =>import('@/components/pagination.vue'), // 指定注册的组件
    delay: 200,
})
 export default {
     components:{
         Breadcrumb,
         AsyncPage
     },
     setup(){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
        const queryInfo = reactive({
            query:"",
            pagenum:1,
            pagesize:4
        });
        const total = ref(0);
        const orderList = ref([]);
        const getOrderList = async () => {
            const {data:res} = await _getOrderList(queryInfo);
            if(res.meta.status != 200)  proxy.$msg.error('获取订单列表失败')
            orderList.value = res.data.goods;
            total.value = res.data.total;
        }
        getOrderList();

        const changeNum = (v) => {
            queryInfo.pagenum = v;
            getOrderList();
        }
        const changeSize = (v) => {
            queryInfo.pagesize = v;
            getOrderList();
        }

        // const dataFliter = computed(() => {
        //         return (v) => {
        //             const dt = new Date(v)
        //             const y = dt.getFullYear()
        //             const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        //             const d = (dt.getDate() + '').padStart(2, '0')

        //             const hh = (dt.getHours() + '').padStart(2, '0')
        //             const mm = (dt.getMinutes() + '').padStart(2, '0')
        //             const ss = (dt.getSeconds() + '').padStart(2, '0')
        //             // yyyy-mm-dd hh:mm:ss
        //             return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        //         }
        // })


        const editVisible = ref(false);
        const addresForm = reactive({addres1:[],addres2:''});
        const rules = {
            addres1:[{ required: true,message: '请选择省市区/县',trigger: 'blur'}],
            addres2:[{ required: true,message: '请输入详细地址',trigger: 'blur'}],
        }
        let data = cityData;
        const props = {
            expandTrigger: 'hover',
        }
        const handleChange = (value) => {
            console.log(value)
        }
        const editRef = ref(null);
        const showEditBox = () => {
            editVisible.value = true;
        }
        const editAddress = (editRef) => {
            // editRef.validate( async (valid) => {
            //     if (valid) {
            //         const {data:res} = await _getWuli(addresForm)
            //         if(res.meta.status != 201)  proxy.$msg.error(res.meta.msg)
            //         getOrderList();
            //         editVisible.value = false;
            //     } else {
            //         return false
            //     }
            // })
        }

        const timeBox = ref(false);
        const timeData = ref([]);
        const showWuli = async () => {
            const {data:res} = await _getWuli()
            if(res.meta.status != 200){
                proxy.$msg.error(res.meta.msg)}else{
                    timeBox.value = true;
                    timeData.value = res.data;
            }
        }



         return {
             queryInfo,
             total,
             orderList,
             formatDate,
             editVisible,
             addresForm,
             rules,
             props,
             data,
             editRef,
             timeBox,
             timeData,
             handleChange,
             Search,
             Edit ,Position,
             getOrderList,
             showEditBox,
             editAddress,
             showWuli,
             changeNum,
             changeSize
         }
     }


 }
</script>

<style lang="less" scoped>
.order{
    padding: 20px;
}
.el-table{
    margin: 20px 0;
}
.bb{
    margin-left: 30%;
}
.form{
:deep(.el-input__inner){
    width: 320px;
    // width: 100%;
}
}

</style>