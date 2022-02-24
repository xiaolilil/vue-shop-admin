<template>
 <div class="category">
     <Breadcrumb name="商品管理" />
     <el-card>
            <el-button class="btn" type="primary" >添加分类</el-button>

            <vxe-toolbar>
            <template #buttons>
                <vxe-button @click="getTreeExpansionEvent">获取已展开</vxe-button>
                <vxe-button @click="$refs.xTree.setAllTreeExpand(true)">展开所有</vxe-button>
                <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
            </template>
            </vxe-toolbar>

            <vxe-table
            resizable
            border="full"
            ref="xTree"
            :tree-config="{ rowField: 'children', parentField: 'cat_id'}"
            :data="cateList"
            @toggle-tree-expand="toggleExpandChangeEvent">
                <vxe-column field="cat_name" title="分类名称" tree-node></vxe-column>
                <vxe-column field="cat_deleted" title="是否有效">
                        <template #default="scope">
                            <el-switch v-model="scope.row.cat_deleted"
                                disabled
                                :active-icon="Check"
                            :inactive-icon="Close"
                                class="ml-2" />
                        </template>
                </vxe-column>
                <vxe-column field="cat_level" title="排序">
                            <template #default="scope">
                                <el-tag :type="getType(scope.row.cat_level)">
                                    {{scope.row.cat_level == 0 ? '一级' : (scope.row.cat_level == 1 ? '二级' : '三级') }}
                                </el-tag>
                            </template>
                </vxe-column>
                <vxe-column  title="操作">
                        <template #default="scope">
                            <el-button @click="showEditBox(scope.row)" type="primary" size="default" :icon="Edit">编辑</el-button>
                            <el-button @click="deleteCate(scope.row)" type="danger" size="default" :icon="Delete">删除</el-button>
                        </template>
                </vxe-column>
            </vxe-table>

        <!-- <el-pagination
            background 
            v-model:currentPage="queryInfo.pagenum"
            :page-sizes="[ 6, 7, 8]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
        </el-pagination> -->
        <AsyncPage 
            :queryInfo="queryInfo" 
            :total="total"  
            :numList="[3,4,5,6]"
            @changeNum="changeNum" 
            @changeSize="changeSize" />
     </el-card>
 </div>
    <!-- 修改分类 -->
    <el-dialog
        v-model="editBox"
        title="修改分类"
        width="30%"
    >
        <el-form ref="editRef" :model="editCateInfo"  :rules="rules" label-width="90px">
            <el-form-item label="商品名称" prop="cat_name" >
                <el-input v-model="editCateInfo.cat_name"></el-input>
            </el-form-item>

            <el-form-item class="editBottom">
                <el-button @click="editBox = false">取消</el-button>
                <el-button type="primary" @click="editCategory(editRef)">确定</el-button>
            </el-form-item>
          </el-form> 
    </el-dialog>



</template>

<script lang="ts">
import {ref,reactive,defineComponent,defineAsyncComponent} from 'vue';
import Breadcrumb from '@/components/breadcrumb.vue';
import { Edit, Delete ,Check,Close  } from '@element-plus/icons-vue';
import { ElMessageBox  } from "element-plus";
import {_getCateList,_getCateInfo,_editCate,_deleteCate} from '@/network/cateList.js'
import { VXETable, VxeTableInstance } from 'vxe-table'
import { getCurrentInstance } from 'vue'

// 异步组件
const AsyncPage = defineAsyncComponent({
    loader:() =>import('@/components/pagination.vue'), // 指定注册的组件
    delay: 200,
})
 export default defineComponent({
     components:{
         Breadcrumb,
         AsyncPage
     },
     setup(){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
        const queryInfo = reactive({
            type: 3,
            pagenum: 1,
            pagesize: 5
        })
        const total = ref(0);
        const cateList = ref([]);
        const getCateList = async () => {
            const {data:res} = await _getCateList(queryInfo);
            if(res.meta.status != 200) proxy.$msg.error(res.meta.msg);
            cateList.value = res.data.result;
            total.value = res.data.total;
        }
        getCateList();
        const getType = (idx) => {
            let arr = ["", "success", "danger"];
            return arr[idx];
        }
        const columns = [
                {label:'分类名称',prop:'cat_name'},
                {label:'是否有效',type:'template',template:'isok'}
            ]
        // 修改分类
        const editBox = ref(false);
        const editCateInfo = reactive({cat_name:'',id:0});
        const rules = {cat_name:[ { required: true,message: '请填写完整分类',trigger: 'blur'}]};
        const showEditBox = async (v) => {
            editBox.value = true;
            const {data:res} = await _getCateInfo(v.cat_id);
            if(res.meta.status != 200) proxy.$msg.error(res.meta.msg);
            editCateInfo.cat_name = res.data.cat_name;
            editCateInfo.id = res.data.cat_id;
        }
        const editRef = ref(null);  // 使用 DOM 元素的  ref  需要先定义 再使用
        const editCategory =  (editRef) => {
            editRef.validate( async (valid) => {
                if (valid) {
                    const {data:res} = await _editCate(editCateInfo);
                    if(res.meta.status != 200) proxy.$msg.error(res.meta.msg);
                    proxy.$msg.success(res.meta.msg);
                    editBox.value = false;
                    getCateList();
                } else {
                    return false
                }
            })
        }
        // 删除分类
        const deleteCate =   (v) => {
            ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '删除分类',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            },)
            .then(async () => {
                const {data:res} = await _deleteCate(v.cat_id);
                if(res.meta.status != 200) proxy.$msg.error(res.meta.msg);
                proxy.$msg.success(res.meta.msg);
                getCateList();
            })
            .catch(() => {
            // catch error
                return proxy.$msg.info('已取消删除操作!')
            })

        }

        /*  树形表格  vxe-table
          rowField ： 树节点的字段名
          transform ： 自动将列表转为树结构
          parentField ： 树父节点的字段名

          toggle-tree-expand ： 当树节点展开或收起时会触发该事件
        */
        const xTree = ref({} as VxeTableInstance);
        const toggleExpandChangeEvent = (params) => {
            const $table = xTree.value;
            const { row, expanded } = params;
            console.log(params);
            console.log('节点展开事件', expanded, '获取父节点: ', $table.getParentRow(row))
        }
        // 获取已展开
        const getTreeExpansionEvent = () => {
            const $table = xTree.value
            const treeExpandRecords = $table.getTreeExpandRecords()
            VXETable.modal.alert(treeExpandRecords.length)
        }

        // 分页
        const changeNum = (v) => {
            queryInfo.pagenum = v;
            getCateList();
        }
        const changeSize = (v) => {
            queryInfo.pagesize = v;
            getCateList();
        }


        return {
             queryInfo,
             cateList,
             total,
             columns,
             xTree,
             editBox,
             editCateInfo,
             rules,
             editRef,
             Check,Close,
             Edit, Delete,
             showEditBox,
             deleteCate,
             getCateList, 
             getType,
             editCategory,
             toggleExpandChangeEvent,
             getTreeExpansionEvent,
             changeNum,
             changeSize,
        }
     }
 })
</script>

<style lang="less" scoped>
.category{
    padding: 20px;
}
.btn{
    margin-bottom: 15px;
}
.el-pagination{
    margin-top: 20px;
}
.editBottom{
    // width: 220px;
    text-align: right;
    margin-bottom: 0;
    margin-left: 35%;
    // float: right;
}
// .el-form-item--default .el-form-item__content{
//     width: 200px;
// }
</style>