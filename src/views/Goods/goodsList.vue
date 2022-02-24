<template>
    <div class="list">
        <Breadcrumb name="商品管理"/>
        <el-card>
            <el-row :gutter="20" class="row1">
                <el-col :span="8">
                    <el-input
                        v-model="queryInfo.query"
                        placeholder="请输入内容"
                        class="input-with-select"
                        clearable
                        @clear="getGoodsList"
                    >
                        <template #append>
                            <el-button :icon="Search" @click="getGoodsList"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary" @click="toAdd">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table :data="goodsList.arr" stripe border style="width: 100%">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column prop="goods_name" label="商品名称" />
                <el-table-column prop="goods_price" label="价格(元)" width="80" />
                <el-table-column prop="goods_weight" label="商品重量" width="90"/>
                <el-table-column prop="add_time" label="创建时间" width="200">
                    <template #default="scope">
                        {{formatDate(scope.row.add_time) }}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="130">
                    <template #default="scope">
                        <el-button @click="showEditBox(scope.row)" type="primary" size="default" :icon="Edit"></el-button>
                        <el-button @click="deleteGoods(scope.row.goods_id)" type="danger" size="default" :icon="Delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>


        <AsyncPage 
            :queryInfo="queryInfo" 
            :total="total"  
            :numList="[4,6,7,8]"
            @changeNum="changeNum" 
            @changeSize="changeSize" />
        </el-card>
    </div>

    <!-- 编辑商品 -->
    <el-dialog
        v-model="editBox"
        title="编辑商品"
        width="60%"
    >
        <el-form ref="editRef" :model="goodsInfo"  :rules="rules" label-width="120px">
            <el-form-item label="商品名称" prop="goodsName">
                <el-input v-model="goodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model="goodsInfo.goods_price"   ></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
                <el-input v-model="goodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="weight">
                <el-input v-model="goodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="介绍" >
                <el-input ></el-input>
            </el-form-item>
            <el-form-item label="img-tem-path" >
                <el-input ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="editBox = false">取消</el-button>
                <el-button type="primary" @click="editGoods(editRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>


</template>

<script>
import {ref,reactive,defineAsyncComponent} from 'vue';
import Breadcrumb from '@/components/breadcrumb.vue';
import { Search,Edit, Delete   } from '@element-plus/icons-vue';
import { ElMessageBox} from "element-plus";
import {_getGoodsList,_addGoods,_deleteGoods,_editGoods,_searchGoods} from '@/network/goods.js'
import { useRouter } from "vue-router";
import { getCurrentInstance } from 'vue'
import  formatDate  from '@/utils/dataFliter.js'
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
         // 获取商品列表
        const queryInfo = reactive({
                query: '',
                pagenum: 1,
                pagesize: 6
        })
        const total = ref(0)
        const goodsList = reactive({
            arr:[]
        })
        const getGoodsList = async () => {
            const {data:res} = await _getGoodsList(queryInfo);
            if(res.meta.status != 200) proxy.$msg.error('获取商品列表失败');
            goodsList.arr = res.data.goods;
            total.value = res.data.total;
        }
        getGoodsList()

        const router = useRouter();
        const toAdd = () => {
            router.push('/addgoods')
        }
        // 编辑商品
        const editBox = ref(false);
        const goods_id = ref('');
        let goodsInfo = ref({});
        const editRef = ref(null);
        const rules = reactive({
             goodsName:[
                 { required: true,message: '请输入商品名称',trigger: 'blur'}
             ],
             price:[
                 { required: true,type:'number',message: '请输入价格',trigger: 'blur'},
                 { pattern: /^-?\d+\.?\d*$/, message: '请输入正确数据', trigger: 'blur' }
             ],
             num:[
                 { required: true,type:'number',message: '请输入数量',trigger: 'blur'}
             ],
             weight:[
                 { required: true,type:'number',message: '请输入重量',trigger: 'blur'}
             ],
         });
        const showEditBox = async (v) => {
            editBox.value = true;
            goods_id.value = v.goods_id;
            const {data:res} = await _searchGoods(v.goods_id);
            if(res.meta.status != 200) proxy.$msg.error('获取商品信息失败');
            goodsInfo.value = res.data;
        }
        const editGoods =  async () => {
            const {data:res} = await _editGoods(goods_id.value,goodsInfo.value)
            if(res.meta.status != 200) proxy.$msg.error('修改商品信息失败');
            proxy.$msg.success('修改商品信息成功');
            editBox.value = false;
            getGoodsList()
        }
        // 删除商品
        const deleteGoods = async (id) => {
            ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '删除分类',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            },)
            .then(async () => {
                const {data:res} = await _deleteGoods(id)
                if(res.meta.status != 200) proxy.$msg.error('删除商品失败');
                proxy.$msg.success(res.meta.msg);
                getGoodsList();
            })
            .catch(() => {
                // catch error
                return proxy.$msg.info('已取消删除操作!')
            })
        }

        // 分页
        const changeNum = (v) => {
            queryInfo.pagenum = v;
            getGoodsList();
        }
        const changeSize = (v) => {
            queryInfo.pagesize = v;
            getGoodsList();
        }
        
         return {
             Search,
             Edit,
             Delete,
             queryInfo,
             goodsList,
             total,
             formatDate,
             editBox,
             goodsInfo,
             rules,
             editRef,
             goods_id,
             toAdd,
             getGoodsList,
             deleteGoods,
             editGoods,
             showEditBox,
             changeNum,
             changeSize
         }
     }
 }
</script>

<style lang="less" scoped>
    .list{
        padding: 20px;

    }
    .row1{
        margin-bottom: 30px;
    }

    :deep(.el-dialog){
        --el-dialog-padding-primary:10px;
    }
   .el-dialog :deep(.el-dialog__body){
        padding: 10px 50px   !important;
    }
    :deep(.el-dialog__footer){
        padding-bottom: 16px;
    }
    .el-pagination{
        margin-top: 20px;
    }
</style>