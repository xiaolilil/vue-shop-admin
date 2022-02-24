<template>
        <el-pagination
            background 
            v-model:currentPage="queryInfo.pagenum"
            :page-sizes="[numList[0], numList[1], numList[2], numList[3]]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
</template>

<script>
import { reactive} from 'vue'

 export default {
     props:{
         queryInfo:Object,
         total:Number,
         numList:Array
     },
     setup(props, {emit}){
        const queryInfo = reactive({
            query:props.queryInfo.query || '',
            pagenum:props.queryInfo.pagenum,
            pagesize:props.queryInfo.pagesize
        });
        // 每页显示多少条
        const handleSizeChange = (val) => {
            emit('changeSize', val)
        }
        // 跳到第几页
        const handleCurrentChange = (val) => {
            emit('changeNum', val)
        };
        return {
                queryInfo,
                handleSizeChange,
                handleCurrentChange 
        }
     }
 }
</script>

<style scoped>
.el-pagination{
    margin-top: 20px;
}
</style>