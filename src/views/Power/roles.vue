<template>
 <div class="roles">
     <Breadcrumb name="权限管理"  />

    <el-card>
        <el-button class="btn" type="primary" @click="showAddBox">添加角色</el-button>
        <el-table :data="rolesList" border style="width: 100%">
            <el-table-column type="expand" width="50">
                <template #default="scope">
                    <el-row class="row1" :class="['bdtop',i1 == 0 ? '' : '','vcenter']" v-for="(v,i1) in scope.row.children" :key="v.id">
                        <!-- 一级权限 -->
                        <el-col class="col1" :span="5">
                            <el-tag class="tag1" size="large" closable @close="showDelRigBox(scope.row, v.id)">{{v.authName}}</el-tag>
                            <i class="iconfont icon-sanjiaoright"></i>
                        </el-col>
                        <!-- 二级权限 -->
                        <el-col class="col2" :span="19">
                            <el-row class="row2" v-for="(v2,i2) in v.children" :key="v2.id" :class="[i2 == 0 ? '' : 'bdtop','vcenter']">
                                <el-col class="col3" :span="6">
                                    <el-tag size="large" type="success" closable @close="showDelRigBox(scope.row, v2.id)">{{v2.authName}}</el-tag>
                                    <i class="iconfont icon-sanjiaoright"></i>
                                </el-col>
                                <!-- 三级权限 -->
                                <el-col class="col4" :span="18" >
                                    <el-tag type="warning" class="tag3" size="large" v-for="(v3,i3) in v2.children" :key="v3.id"
                                            closable @close="showDelRigBox(scope.row, v3.id)"
                                            :class="[i3 == 0 ? 'bdbottom' : '']"
                                    >
                                        {{v3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"  />
            <el-table-column prop="roleName" label="角色名称" width="300" />
            <el-table-column prop="roleDesc" label="角色描述" width="300" />
            <el-table-column  label="操作" >
                <template #default="scope">
                     <el-button type="primary" :icon="Edit" @click="showEditBox(scope.row.id)">编辑</el-button>
                     <el-button type="danger" :icon="Delete" @click="deleteRoles(scope.row.id)">删除</el-button>
                     <el-button type="warning" :icon="Setting" @click="showAllotBox(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
        v-model="showAdd"
        title="添加角色"
        width="40%"
    >
        <el-form ref="addFormRef" :model="addInfo"  :rules="rules" label-width="120px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addInfo.roleDesc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="showAdd = false">取消</el-button>
                <el-button type="primary" @click="addRoles(addFormRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog
        v-model="showEdit"
        title="编辑角色"
        width="40%"
    >
        <el-form ref="editRef" :model="roleInfo"  :rules="rules" label-width="120px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="roleInfo.roleDesc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="editRoles(editRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>


    <!-- 分配权限 -->
    <el-dialog
        v-model="showTree"
        title="分配权限"
        width="40%"
    >
        <el-tree
            :data="allotList.arr"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="defkeys"
            :props="defaultProps"
            ref="treeRef"
        />
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="closeTreeBox">取消</el-button>
            <el-button type="primary" @click="allotRights">确定</el-button>
        </span>
        </template>
    </el-dialog>

    <!--  删除子权限 -->
    <el-dialog
        v-model="deleteRightsBox"
        title="删除权限"
        width="40%"
        top="18%"
    >
         <p class="Tips"><i class="iconfont icon-gantanhao"></i> 此操作将永久删除该权限,是否继续?</p>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="closeDelRigBox">取消</el-button>
            <el-button type="primary" @click="deleteRight">确定</el-button>
        </span>
        </template>
    </el-dialog>

 </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb.vue';
import { ElMessageBox} from "element-plus";
import { ref ,reactive, } from 'vue';
import {_roles,_addRoles,_editRoles,_getRoles,_deleteRoles,_tree,_allotRights,_deleteRights1} from '@/network/roles.js'
import { Edit, Delete, Setting, Close   } from '@element-plus/icons-vue';
import { getCurrentInstance } from 'vue'

 export default {
     components:{
        Breadcrumb
     },
     setup(){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
        const rolesList = ref([]);
        const getRolesList = async () => {
            const {data:res} = await _roles();
            if(res.meta.status != 200) proxy.$msg.error('获取角色列表失败');
            rolesList.value = res.data;
        }
        getRolesList();
        // 添加角色
        const addInfo = reactive({roleName:'',roleDesc:''});
        const showAdd = ref(false);
        const addFormRef = ref(null);
        const rules = reactive({
             roleName:[
                 { required: true,message: '请输入账号',trigger: 'blur'}
             ],
             roleDesc:[
                 { required: true,message: '请输入密码',trigger: 'blur'}
             ]
         });
        const showAddBox = () => {
            showAdd.value = true;
        };
        const addRoles =  (addFormRef) => {
            addFormRef.validate(async (valid) => {
                if(valid){
                    const {data:adRes} = await _addRoles(addInfo);
                    if(adRes.meta.status != 200) proxy.$msg.error('添加角色列表失败');
                    proxy.$msg.success(adRes.meta.msg);
                    showAdd.value = false;
                    getRolesList();
                }else{
                    return false
                }
            })
        };
        // 编辑角色
        const rolesId = ref(0);
        const showEdit = ref(false);
        const editRef = ref(null);
        const roleInfo = ref({});
        const showEditBox = async (v) => {
            const {data:info} = await _getRoles(v);
            if(info.meta.status != 200)  proxy.$msg.error('获取角色列表失败');
            roleInfo.value = info.data;
            showEdit.value = true;
            rolesId.value = v;
        };
        const editRoles = (editRef) => {
            editRef.validate(async (valid) => {
                if(valid){
                    const {data:edRes} = await _editRoles(rolesId.value,addInfo);
                    if(edRes.meta.status != 200) proxy.$msg.error('编辑角色列表失败');
                    proxy.$msg.success(edRes.meta.msg);
                    showEdit.value = false;
                    getRolesList();
                }else{
                    return false;
                }
            })
        }
        // 删除角色
        const deleteRoles = async (id) => {
            ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '删除分类',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            },)
            .then(async () => {
                const {data:deRes} = await _deleteRoles(id);
                if(deRes.meta.status != 200) proxy.$msg.error('删除角色列表失败');
                proxy.$msg.success(deRes.meta.msg);
                getRolesList();
            })
            .catch(() => {
                // catch error
                return proxy.$msg.info('已取消删除操作!')
            })
        };

        // 分配权限
        let defkeys = ref([]);
        // let allotList = ref([]);        写法 1  用ref   .value 
        // let allotList = reactive([]);   写法 2  allotList.push(xxx)
        let allotList = reactive({    //   写法 3  用对象写法，键值对    allotList.arr = xxx;
            arr:[]
        } );
        const treeRef = ref(null);
        const roleId = ref(null);
        const showTree = ref(false);
        const showAllotBox = (role) => {
            roleId.value = role.id;
            showTree.value = true;
            getTreeData(role);
        };
        // 获取树形列表数据
        const getTreeData = async (role) => {
            const {data:tree} = await _tree();
            if(tree.meta.status != 200)  proxy.$msg.error('获取树形列表数据失败');
            allotList.arr = tree.data;
            getTressKeys(role, defkeys.value);
        };
        // 通过递归的形式获取角色下所有的三级权限id,保存到数组中
        const  getTressKeys = (node, arr) => {
            // 如果当前node节点下不包含children就是三级节点，就push到arr数组中
            if(!node.children){ // 出口
                return arr.push(node.id)
            }
            node.children.forEach( item => getTressKeys(item, arr) );
        };
        const defaultProps = {
            children: 'children',
            label: 'authName',
        };
        const closeTreeBox = () => {
             showTree.value = false;
             defkeys.value = [];
        };
        const allotRights = async () => {
            // 获取树形组件的 选中值，
            // setup 里面， ref元素 直接 .value 使用对应的方法，
            const keys = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()];
            const idStr = keys.join(',');
            const {data:allotRes} = await _allotRights(roleId.value,idStr)
            if(allotRes.meta.status != 200) proxy.$msg.error('分配权限失败');
            proxy.$msg.success(allotRes.meta.msg);
            showTree.value = false;
            getRolesList();
        }
        // 列表展开行
        const deleteRightsBox = ref(false);
        const rightsV = reactive({children:null,roleId:null,rightId:null});
        const showDelRigBox = (v,i) => {
            deleteRightsBox.value = true;
            rightsV.children = v;
            rightsV.roleId = v.id;
            rightsV.rightId = i;
        }
        const closeDelRigBox = () => {
            deleteRightsBox.value = false;
            proxy.$msg.info('已取消删除该权限');
        }
        const deleteRight = async() => {
            const {data:res} = await _deleteRights1(rightsV.roleId,rightsV.rightId)
            if(res.meta.status != 200) proxy.$msg.error('删除权限失败');
            proxy.$msg.success(res.meta.msg);
            rightsV.children = res.data
            deleteRightsBox.value = false;
            getRolesList();
        };

         return {
             Edit,
             Delete,
             Setting,
             Close,
             
             rolesList,
             addInfo,
             rules,
             showAdd,
             addFormRef,
             rolesId,
             showEdit,
             editRef,
             roleInfo,

             showTree,
             defaultProps,
             allotList,
             defkeys,
             treeRef,
             deleteRightsBox,
             rightsV,

             addRoles,
             showAddBox,
             getRolesList,
             showEditBox,
             editRoles,
             deleteRoles,
             showAllotBox,
             closeTreeBox,
             allotRights,
             getTreeData,
             getTressKeys,
             deleteRight,
             showDelRigBox,
             closeDelRigBox,

         }
     }
 }
</script>

<style lang="less" scoped>
  @import '../../style/mixins.less';
    .roles{
        padding: 20px;
        .btn{
            margin-bottom: 20px;
        }
    }
    :deep(.el-dialog__body){
        padding: 10px 50px !important;
    }
    .col1{
        display: flex;
        align-items: center;
    }
    .tag1{
        margin-left: 50px;
    }
    .iconfont{
        margin-left: 10px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
    .row1:last-child{
        border-bottom: 1px solid #eee;
    }

    .Tips{
        font-size: 17px;
    }
    .icon-gantanhao{
        font-size: 20px;
        color: orange;
    }
    :deep(.el-dialog__body){
        padding: 0 50px 10px  !important;
    }
    :deep(.el-dialog__footer){
        padding-bottom: 16px;
    }

    .col2:last-child{
        border: none !important;
    }

    .tag3{
        margin: 6px;
    }

</style>