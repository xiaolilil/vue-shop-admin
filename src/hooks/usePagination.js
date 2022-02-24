
import { ref ,reactive} from 'vue'

// 默认暴露
export default function (){

        // 每页显示多少条
        const handleSizeChange = (val) => {
            queryInfo.pagesize = val;
            getUserList();
        }
        // 跳到第几页
        const handleCurrentChange = (val) => {
            queryInfo.pagenum = val;
            getUserList();
        };


    return 
}