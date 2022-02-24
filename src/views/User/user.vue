<template>
 <div class="user">
     <Breadcrumb name="用户管理" />
     <el-card>
         <el-row :gutter="20" class="card">
             <el-col :span="8">
                <el-input
                    v-model="queryInfo.query"
                    placeholder="请输入内容"
                    class="input-with-select"
                    clearable
                    @clear="getUserList"
                >
                    <template #append>
                        <el-button :icon="Search" @click="getUserList"></el-button>
                    </template>
                </el-input>
             </el-col>
             <el-col :span="4">
                     <el-button type="primary" @click="showAddBox">添加用户</el-button>
             </el-col>
         </el-row>

        <el-table
            :data="userList"
            style="width: 100%"
            border
        >
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="username" label="姓名" width="140" />
            <el-table-column prop="email" label="邮箱" width="220" />
            <el-table-column prop="mobile" label="电话" width="200" />
            <el-table-column prop="role_name" label="角色" width="220" />
            <el-table-column prop="mg_state" label="状态" width="150" >
                <template #default="scope">
                    <el-switch 
                        inline-prompt
                        :active-icon="Check"
                        :inactive-icon="Close"
                        v-model="scope.row.mg_state"
                        @change="stateChange(scope.row)"
                     />
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" >
                <template #default="scope">
                     <el-button type="primary" :icon="Edit" @click="showEditBox(scope.row.id)"></el-button>
                     <el-button type="danger" :icon="Delete" @click="deleteUser(scope.row.id)"></el-button>
                     <el-button type="warning" :icon="Setting" @click="showAllotBox(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>


        <AsyncPage 
            :queryInfo="queryInfo" 
            :total="total"  
            :numList="[1,2,3,4]"
            @changeNum="changeNum" 
            @changeSize="changeSize" />
        
     </el-card>

    <!-- 添加用户 -->
    <el-dialog
        v-model="addShow"
        title="添加用户"
        width="40%"
    >
        <el-form ref="addFormRef" :model="addInfo"  :rules="rules" label-width="90px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addInfo.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addInfo.mobile"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button  @click="addShow = false">取消</el-button>
                <el-button type="primary" @click="addUser(addFormRef)">确认</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
        v-model="showEdit"
        title="编辑用户"
        width="40%"
    >
        <el-form ref="editformRef" :model="editForm" :rules="rules" label-width="120px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button @click="showEdit = false">取消</el-button>
            <el-button type="primary" @click="editUser(editformRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
        v-model="showAllot"
        title="分配角色"
        width="40%"
    >
        <div class="allot">
            <p>当前的用户: {{userInfo.username}}</p>
            <p>当前的角色: {{userInfo.role_name}}</p>
            <el-select v-model="selectRole" class="m-2" placeholder="请选择" size="large">
                <el-option
                    v-for="v in rolesList"
                    :key="v.id"
                    :label="v.roleName"
                    :value="v.id">
                </el-option>
            </el-select>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="showAllot = false">取消</el-button>
            <el-button type="primary" @click="allotUser">确定</el-button>
        </span>
        </template>
    </el-dialog>
 </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { getCurrentInstance } from 'vue'
import { Search,Edit, Delete, Setting,Check, Close   } from '@element-plus/icons-vue';
import { ElMessageBox} from "element-plus";
import { ref ,reactive, defineAsyncComponent } from 'vue'
import {_users, _roles,_state,_userInfo,_addUser,_editUser,_deleteUser,_serachUser,_allotUser} from '@/network/user.js'
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
        const queryInfo = reactive({
            query:"",
            pagenum:1,
            pagesize:2
        });
        const total = ref(0);
        const state = ref('');
        const userList = ref([]);
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
        // 获取用户列表信息
        const getUserList = async () => {
            const res = await  _users(queryInfo);
            userList.value = res.data.data.users;
            state.value = res.data.data.users.mg_state;
            total.value = res.data.data.total;
        }
        getUserList();

        const changeNum = (v) => {
            queryInfo.pagenum = v;
            getUserList();
        }
        const changeSize = (v) => {
            queryInfo.pagesize = v;
            getUserList();
        }

        // 添加用户
        const addFormRef = ref(null);
        const checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                return cb();
            }
            cb(new Error("请输入合法的邮箱"));
        }
        const checkMobile = (rule, value, cb) => {
            const regMobile =
                /^([0|86|17951])?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (regMobile.test(value)) {
                return cb();
            }
            cb(new Error("请输入合法的手机号"));
        };
        const rules = reactive({
             username:[
                 { required: true,message: '请输入账号',trigger: 'blur'}
             ],
             password:[
                 { required: true,message: '请输入密码',trigger: 'blur'}
             ],
             email:[
                 { required: true,message: '请输入邮箱',trigger: 'blur'},
                 {validator: checkEmail,trigger: "blur",},
             ],
             mobile:[
                 { required: true,message: '请输入手机号',trigger: 'blur'},
                 {validator: checkMobile,trigger: "blur",},
             ]
         });
        const addInfo = reactive({
            username: "admin",
            password: "123456",
            email: "1234@qq.com",
            mobile: "13556776543",
        })
        let addShow = ref(false);
        const showAddBox = () => {
            addShow.value = true;
        };
        const addUser =  (addFormRef) => {
            addFormRef.validate( async (valid) => {
                if (valid) {
                    const {data:addRes} = await _addUser(addInfo)
                    if(addRes.meta.status != 201)  proxy.$msg.error('添加用户失败')
                    proxy.$msg.success(addRes.meta.msg)
                    getUserList();
                    addShow.value = false;
                    addInfo.username = 'admin';
                } else {
                    return false
                }
            })
        };
        // 切换用户状态
        const stateChange = async (v) => {
            const {data: StateRes} = await _state(v.id, v.mg_state);
            if (StateRes.meta.status !== 200) {
                userList.mg_state = !userList.mg_state;
                proxy.$msg.error('修改状态失败');
            }
            proxy.$msg.success(StateRes.meta.msg);
        };
        // 编辑用户
        const showEdit = ref(false);
        let editForm = ref({});
        const editformRef = ref(null);
        const showEditBox = async (v) => {
            showEdit.value = true;
            const {data:userRes} = await _userInfo(v);
            editForm.value = userRes.data;
        };
        const editUser =  (editformRef) => {
            editformRef.validate(async (valid) => {
                if(valid){
                    const {data:edRes} = await _editUser(editForm.value);
                    if(edRes.meta.status != 200) proxy.$msg.error('编辑用户失败');
                    proxy.$msg.success(edRes.meta.msg);
                    showEdit.value = false;
                    getUserList();
                }else{
                    return false;
                }
            })
        };
        // 删除用户
        const deleteUser = async(id) => {
            ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '删除分类',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            },)
            .then(async () => {
                const {data:deRes} = await _deleteUser(id);
                if(deRes.meta.status != 200) proxy.$msg.error('删除角色失败')
                getUserList();
                proxy.$msg.success(deRes.meta.msg)
            })
            .catch(() => {
                // catch error
                return proxy.$msg.info('已取消删除操作!')
            })

        };

        // 分配角色
        const showAllot = ref(false);
        let userInfo = reactive({id:0,username:'',role_name:''});
        const selectRole = ref('');
        const rolesList = ref([]);
        const showAllotBox = async(v) => {
            userInfo.username = v.username;
            userInfo.role_name = v.role_name;
            userInfo.id = v.id;
            const {data:roRes} = await _roles();
            if(roRes.meta.status != 200)  proxy.$msg.error('获取角色失败');
            rolesList.value = roRes.data;
            showAllot.value = true;
        };
        const allotUser = async() => {
            if(selectRole.value == "")proxy.$msg.warning('请先选择要分配的角色');
            const {data:allRes} = await _allotUser(userInfo.id,selectRole.value);
            if(allRes.meta.status != 200) proxy.$msg.error('分配角色失败');
            proxy.$msg.success(allRes.meta.msg);
            showAllot.value = false;
            getUserList();
        };
            
         return {
             Search,
             Edit,
             Delete,
             Setting,
             Check,
             Close,
             changeNum,
             changeSize,
             addFormRef,
             addShow,
             rules,
             addInfo,
             queryInfo,
             userList,
             state,
             total,
             showAllot,
             userInfo,
             selectRole,
             rolesList,
             showEdit,
             editForm,
             editformRef,
             getUserList,
             stateChange,
             editUser,
             showAllotBox,
             deleteUser,
             addUser,
             showAddBox,
             allotUser,
             showEditBox,
         }
     }
 }
</script>

<style lang="less" scoped>
  @import '../../style/mixins.less';

  .user{
      padding: 20px;
      .el-card{
          padding: 20px;
      }
      .card{
          margin-bottom: 30px;
      }
      .el-card__body{
          padding: 0;
      }
      .el-pagination{
          margin-top: 30px;
      }
      .allot{
          p{
              margin: 10px;
          }
      }
  }
    :deep(.el-dialog__body){
        padding: 10px 50px !important;
    }

</style>
