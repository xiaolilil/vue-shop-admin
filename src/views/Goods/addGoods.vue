<template>
 <div class="addBox">
    <Breadcrumb name="商品管理"/>
    <el-card>
        <el-alert title="添加商品信息" type="info" :closable="false" center show-icon :icon="WarningFilled"/>

          <el-steps :space="200" :active="activeIdx - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
          </el-steps>

        
          <el-form ref="goodsRef"  :model="addForm" :rules="addrules" label-width="100px" label-position="top">
                <el-tabs :tab-position="tabPosition"
                         style="height: 400px"
                         class="demo-tabs"
                         @tab-click="tabClick"
                         :before-leave="backTabs">
                    <el-tab-pane label="基本信息"  name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name" clearable placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price" clearable placeholder="请输入商品价格"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight" clearable placeholder="请输入商品重量"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number" clearable placeholder="请输入商品数量"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="JLprops"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数"  name="1">
                        <el-form-item :label="v.attr_name" v-for="(v,i) in manyData" :key="i">
                            <el-checkbox-group v-model="v.attr_vals">
                                <el-checkbox border :label="vc" v-for="(vc,i) in v.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性"  name="2">
                        <el-form-item :label="v.attr_name" v-for="(v,i) in onlyData.arr" :key="v.attr_id">
                            <el-input v-model="v.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片"  name="3">
                        <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :headers="headersObj"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            multiple
                            :limit="3"
                            list-type="picture"
                        >
                            <el-button type="primary">上传图片</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容"  name="4">
                            <editor v-model="addForm.goods_introduce" :contentHtml="addForm.goods_introduce"
                                    v-on:getWangEditorValue="getWangEditorValue"
                            ></editor>
                            <el-button type="primary" class="AddBtn" @click="addgoods(goodsRef)">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
          </el-form>
    </el-card>
 </div>

   <el-dialog
    v-model="previewDialogVisible"
    title="图片预览"
    width="40%"
  >
    <img :src="previewPath" alt="" class="pic">
  </el-dialog>

</template>
                            
<script>
import {ref,reactive,computed} from 'vue';
import { useRouter } from "vue-router";
import Breadcrumb from '@/components/breadcrumb.vue';
import { WarningFilled  } from '@element-plus/icons-vue';
import {_getCateList,_getCateManyParams,_getCateOnlyParams,_addShop,_upload} from '@/network/goods.js'
import editor from '@/components/fwb/index.vue'
import {deepClone} from '@/utils/deepClone.js'
import { getCurrentInstance } from 'vue'

 export default {
     components:{
         Breadcrumb,
         editor
     },
     setup(props,context){
        const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
        const router = useRouter();
         // 级联选择器 数据格式 
        const JLprops = {
            expandTrigger: 'hover',
            label: "cat_name",
            value: "cat_id",
            children: "children",
        }
        const activeIdx = ref('0');
        const tabPosition = 'left';
        const addForm = reactive({
            goods_name: "",
            goods_price: 0,
            goods_weight: 0,
            goods_number: 0,
            //商品所属的分类数组
            goods_cat: [],
            // 图片的数组
            pics: [],
            // 商品的详情描述
            goods_introduce: "",
            attrs: [],
        });
        const addrules = {
            goods_name:[
                { required: true, message: "请输入商品名称", trigger: "blur" },
            ],
            goods_price:[
                { required: true, message: "请输入商品价格", trigger: "blur" },
                { required: true, type:'number', message: "只能输入数字", trigger: "change" }
            ],
            goods_weight:[
                { required: true, message: "请输入商品重量", trigger: "blur" },
                { required: true, type:'number', message: "只能输入数字", trigger: "change" }
            ],
            goods_number:[
                { required: true, message: "请输入商品数量", trigger: "blur" },
                { required: true, type:'number', message: "只能输入数字", trigger: "change" }
            ],
            goods_cat:[
                { required: true, message: "请选择商品分类", trigger: "blur" },
            ],

        };
        const value = ref([]);
        // 级联选择器 商品分类列表
        const cateList = ref([]);
        const getCateList = async () => {
            const {data:res} = await _getCateList();
            if(res.meta.status != 200) proxy.$msg.error('获取商品列表失败');
            cateList.value = res.data;
        }
        getCateList();
        const flag = ref(true);
        // 切换标签之前的函数，返回 false  或  reject  阻止切换标签页
        const backTabs = (activeName, oldActiveName) => {
            // 如果没有选择商品分类，阻止切换到下一个标签
            if (oldActiveName === '0' && addForm.goods_cat.length == "0") {
                proxy.$msg.error('请先选择商品分类');
                flag.value = false;
                return false;
            }
        }
        // const manyData = reactive({arr:[]});
        const manyData = ref([]);
        const onlyData = reactive({arr:[]});
        // 切换标签页   tab,点击的标签页信息
        const tabClick = async (tab,e) => {
            if(flag.value){
                activeIdx.value = tab.props.name
                switch (tab.props.name){
                    case '1':
                        const {data: res} = await _getCateManyParams(getCateId.value);
                        if(res.meta.status != 200)proxy.$msg.error('获取商品分类参数失败');
                        res.data.forEach(i => {
                            i.attr_vals = i.attr_vals.length === 0 ? [] : i.attr_vals.split(" ");
                        })
                        manyData.value = res.data;
                        break;
                    case '2':
                        const {data: res2} = await _getCateOnlyParams(getCateId.value);
                        if(res2.meta.status != 200)proxy.$msg.error('获取商品分类属性失败');
                        onlyData.arr = res2.data;
                        break;
                }
            }

        }
        // 返回商品分类第三层的id
        const getCateId = computed(() => {
            if (addForm.goods_cat.length === 3) {
                return addForm.goods_cat[2];
            }
            return null;
        })
        // 如果没有选择三级分类，数组置为空
        const handleChange = () => {
            if (addForm.goods_cat.length !== 3) {
                addForm.goods_cat = [];
            }
        }

        // 上传图片
        const uploadUrl = "http://127.0.0.1:8888/api/private/v1/upload";
        const headersObj = {Authorization: window.sessionStorage.getItem('token')};
        const previewPath = ref(''); // 预览路径
        const previewDialogVisible = ref(false);
        const handleSuccess = (res,file) => {
            addForm.pics.push({pic:res.data.tmp_path});
        }
        // 删除上传图片
        const handleRemove = (file) => {
            // 1. 获取被删除的那张图片
            const imgPath = file.response.data.tmp_path;
            // 2. 用 findIndex 从 addForm.pics 中判断，是否有相同的图片，
            const items = addForm.pics.findIndex(i => {
                i.pic === imgPath
            })
            // 3. 用 splice 从 addForm.pics 中移除这张图片
            addForm.pics.splice(items,1);
        }
        // 图片预览
        const handlePreview = (file) => {
            previewPath.value = file.response.data.url;
            previewDialogVisible.value = true;
        }

        // 富文本
        const getWangEditorValue = (str) => {
            addForm.goods_introduce = str;
        };
        // 添加商品
        const goodsRef = ref(null);
        const addgoods = (goodsRef) => {
            // 将表单数据进行深克隆
            const form = deepClone(addForm);
            form.goods_cat = form.goods_cat.join(',');
            // 处理动态参数
            manyData.value.forEach(item => {
                const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals };
                form.attrs.push(newInfo)
            })
            // 处理静态参数
            onlyData.arr.forEach(item => {
                const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
                form.attrs.push(newInfo)
            })
            goodsRef.validate( async (valid) => {
                if (valid) {
                    const {data:res} = await _addShop(form)
                    if(res.meta.status != 201 ) return proxy.$msg.error(res.meta.msg); 
                    proxy.$msg.success(res.meta.msg);
                    router.push('/goods');
                } else {
                    proxy.$msg.error('请先填写完必填项再进行添加!')
                    return false
                }
            })
        }

         return{
             activeIdx,
             tabPosition,
             addForm,
             addrules,
             value,
             JLprops,
             cateList,
             manyData,
             onlyData,
             flag,
             uploadUrl,
             headersObj,
             getCateId,
             previewPath,
             previewDialogVisible,
             goodsRef,
             WarningFilled,
             handleChange,
             tabClick,
             backTabs,
             getCateList,
             handleSuccess,
             handleRemove,
             handlePreview,
             addgoods,
             getWangEditorValue,
         }
     },
 }
</script>

<style lang="less" scoped>
 .addBox{
     padding: 20px;
 }
 .el-alert{
     margin-bottom: 30px;
 }
 .el-steps{
     margin-bottom: 30px;
 }
 :deep(.el-input__inner){
     width: 1000px;
 }
 :deep(.el-cascader .el-input .el-input__inner){
     width: 300px;
 }
 :deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after){
     height: 200px;
 }
 .AddBtn{
     float: right;
     margin-right: 115px;
     margin-top: 10px;
 }
 .pic{
     width: 100%;
 }
</style>