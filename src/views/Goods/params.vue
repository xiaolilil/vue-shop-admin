<template>
  <div class="params">
    <Breadcrumb name="商品管理" />
    <el-card>
      <el-alert
        title="注意,只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
        :icon="WarningFilled"
      />

      <div class="cascader">
        <span>选择商品分类: </span>
        <el-cascader
          v-model="selectValue"
          :options="cateList"
          :props="JLprops"
          @change="handleChange"
        ></el-cascader>
      </div>

      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            class="btn"
            type="primary"
            :disabled="flag"
            @click="addVisible = true"
            >添加参数</el-button
          >
          <el-table ref="tableRef" :data="manyData" border style="width: 100%">
            <el-table-column class="el-item" type="expand" width="50">
              <template #default="scope">
                <p class="p"></p>
                <el-tag
                  v-for="(v, i) in scope.row.attr_vals"
                  :key="v.attr_id"
                  closable
                  @close="deleteTag(scope.row, i)"
                  size="large"
                  @click="toggleRowExpansion(true)"
                  >{{ v }}</el-tag
                >
                <div class="input">
                  <el-input
                    v-if="inputVisible"
                    v-model="newTag"
                    ref="inputRef"
                    @blur="handleInputConfirm(scope.row)"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button class="btn2" v-else @click="inputFocus"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  :icon="Edit"
                  @click="showEditBox(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            class="btn"
            type="primary"
            :disabled="flag"
            @click="addVisible = true"
            >添加属性</el-button
          >
          <el-table
            :data="onlyData"
            border
            style="width: 100%"
            ref="tableRef"
            @row-click="handleRowClick"
          >
            <el-table-column class="el-item" type="expand" width="50">
              <template #default="scope">
                <p class="p"></p>
                <el-tag
                  v-for="(v, i) in scope.row.attr_vals"
                  :key="v.attr_id"
                  closable
                  @close="deleteTag(scope.row, i)"
                  size="large"
                  >{{ v }}</el-tag
                >
                {{ scope.row.inputVisible }}
                <div class="input">
                  <el-input
                    v-if="inputVisible"
                    v-model="newTag"
                    ref="inputRef"
                    @blur="handleInputConfirm(scope.row)"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    >{{ scope.row.inputVisible }}</el-input
                  >
                  <el-button class="btn2" v-else @click="inputFocus"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  :icon="Edit"
                  @click="showEditBox(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>


    </el-card>
  </div>

  <!-- 添加参数 -->
  <el-dialog v-model="addVisible" :title="'添加' + editText" width="35%">
    <el-form ref="addRef" :model="addForm" :rules="rules" label-width="90px">
      <el-form-item :label="editText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item class="editBottom">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addAttrs(addRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 编辑参数 -->
  <el-dialog v-model="editVisible" :title="'编辑' + editText" width="35%">
    <el-form ref="editRef" :model="editForm" :rules="rules" label-width="90px">
      <el-form-item :label="editText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item class="editBottom">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editAttrs(editRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
 
<script>
import Breadcrumb from "@/components/breadcrumb.vue";
import { WarningFilled, Edit, Delete } from "@element-plus/icons-vue";
import {  ElMessageBox } from "element-plus";
import { ref, reactive,  computed, nextTick } from "vue";
import { getCurrentInstance } from 'vue'
import {
  _getCateList,
  _getCateManyParams,
  _getCateOnlyParams,
} from "@/network/goods.js";
import {
  _editAttrs,
  _getAttrs,
  _addAttrs,
  _deleteAttrs,
  _addNewAttrs,
} from "@/network/cateList.js";

export default {
  components: {
    Breadcrumb,
  },

  setup() {
    const { proxy } = getCurrentInstance();// ctx中有问题，建议使用proxy中获取 
    const cateList = ref([]);
    // 获取表格数据
    const getCateList = async () => {
      const { data: res } = await _getCateList();
      if (res.meta.status != 200) proxy.$msg.error("获取商品列表失败");
      cateList.value = res.data;
    };
    getCateList();

    const selectValue = ref([]);
    const JLprops = {
      expandTrigger: "hover",
      label: "cat_name",
      value: "cat_id",
      children: "children",
    };
    const flag = ref(true);
    const handleChange = (v) => {
      if (v.length !== 3) {
        selectValue.value = [];
        flag.value = true;
      } else {
        flag.value = false;
        selectValue.value = v;
        getCateDate(getCateId.value);
      }
    };
    const manyData = ref([]);
    const onlyData = ref([]);
    // 获取展开行的数据参数
    const getCateDate = async (v) => {
      if (selectValue.value.length != 0) {
        if (activeName.value == "many") {
          const { data: res } = await _getCateManyParams(v);
          if (res.meta.status != 200) proxy.$msg.error("获取动态参数失败");
          res.data.forEach((i) => {
            // i.attr_vals = i.attr_vals ? i.attr_vals.split(",") : [];
            i.attr_vals = i.attr_vals ? i.attr_vals.split(" ") : [];
          });
          manyData.value = res.data;
        } else {
          const { data: res } = await _getCateOnlyParams(v);
          if (res.meta.status != 200) proxy.$msg.error("获取静态属性失败");
          res.data.forEach((i) => {
            // i.attr_vals = i.attr_vals ? i.attr_vals.split(",") : [];
            i.attr_vals = i.attr_vals ? i.attr_vals.split(" ") : [];
          });
          onlyData.value = res.data;
        }
      } else {
        proxy.$msg.info("请先选择商品分类");
      }
    };
    // 获取 选中 级联选择器的 ID
    const getCateId = computed(() => {
      if (selectValue.value.length === 3) {
        return selectValue.value[2];
      }
      return null;
    });

    const activeName = ref("many");
    const editText = ref("动态参数");
    const handleClick = (tab) => {
      activeName.value = tab.props.name;
      getCateDate(getCateId.value);
      if (tab.props.name == "only") {
        editText.value = "静态属性";
      } else {
        editText.value = "动态参数";
      }
    };
    // 编辑参数
    const editVisible = ref(false);
    let editForm = ref({});
    const showEditBox = async (id) => {
      editVisible.value = true;
      const { data: res } = await _getAttrs(getCateId.value, id, {
        attr_sel: activeName.value,
      });
      if (res.meta.status != 200) proxy.$msg.error(res.meta.msg);
      editForm.value = res.data;
    };
    const editRef = ref(null);
    const rules = {
      attr_name: [
        { required: true, message: "请填写动态参数", trigger: "blur" },
      ],
    };
    const editAttrs = (editRef) => {
      editRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await _editAttrs(
            getCateId.value,
            editForm.value,
            activeName.value
          );
          if (res.meta.status != 200) proxy.$msg.error(res.meta.msg);
          proxy.$msg.success(res.meta.msg);
          editVisible.value = false;
          getCateDate(getCateId.value);
        } else {
          return false;
        }
      });
    };
    // 添加参数
    const addVisible = ref(false);
    const addRef = ref(null);
    const addForm = reactive({ attr_name: "" });
    const addAttrs = (addRef) => {
      addRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await _addAttrs(
            getCateId.value,
            addForm,
            activeName.value
          );
          if (res.meta.status != 200) proxy.$msg.error(res.meta.msg);
          proxy.$msg.success(res.meta.msg);
          addVisible.value = false;
          getCateDate(getCateId.value);
          addForm.attr_name = "";
        } else {
          return false;
        }
      });
    };
    // 删除属性
    const deleteParams = (id) => {
      ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "删除分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await _deleteAttrs(getCateId.value, id);
          if (res.meta.status != 200) proxy.$msg.error(res.meta.msg);
          proxy.$msg.success(res.meta.msg);
          getCateDate(getCateId.value);
        })
        .catch(() => {
          // catch error
          return ElMessage.info("已取消删除操作!");
        });
    };

    // 添加展开行参数
    const tableRef = ref(null);
    const inputVisible = ref(false);
    const inputRef = ref(null);
    const newTag = ref("");
    // 输入框自动聚焦
    const inputFocus = () => {
      inputVisible.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };
    const handleInputConfirm = (v) => {
      inputVisible.value = false;
      if (newTag.value.length != 0) {
        v.attr_vals.push(newTag.value);
        addTag(v);
        newTag.value = "";
      }
      tableRef.value.toggleRowExpansion();
    };
    const addTag = async (v) => {
      const { data: res } = await _addNewAttrs(getCateId.value, v);
      if (res.meta.status != 200) proxy.$msg.error(res.meta.msg);
      proxy.$msg.success("编辑参数操作成功");
    };
    // 删除展开行的参数
    const deleteTag = (v, i) => {
      v.attr_vals.splice(i, 1);
      addTag(v);
      newTag.value = '';
      handleRowClick(rows.value)
    };
    let rows = ref(null);
    const handleRowClick = (row) => {
      tableRef.value.toggleRowExpansion(row);
      console.log(row);
      rows.value = row;
    };


    const tableData = ref([]);



    return {
      selectValue,
      JLprops,
      cateList,
      tableData,
      activeName,
      flag,
      manyData,
      onlyData,
      getCateId,
      editVisible,
      rules,
      editRef,
      editText,
      editForm,
      addVisible,
      addRef,
      addForm,
      inputVisible,
      inputRef,
      newTag,
      tableRef,
      rows,
      addAttrs,
      inputFocus,
      handleInputConfirm,
      handleRowClick,
      handleClick,
      handleChange,
      WarningFilled,
      Edit,
      Delete,
      getCateList,
      getCateDate,
      showEditBox,
      editAttrs,
      deleteParams,
      addTag,
      deleteTag,
    };
  },
};
</script>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

table {
  border-collapse: collapse;
  td {
    padding: 4px 10px;
  }
  .ooooo {
    position: relative;
    height: 100px;
    width: 500px;
    overflow: hidden;
  }
  .aaaaa {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: all 0.4s;
  }
}
.params {
  padding: 20px;
}
.cascader {
  // margin-top: 30px;
  margin: 30px 0;
  span {
    margin-right: 10px;
  }
}
:deep(.el-cascader .el-input .el-input__inner) {
  width: 280px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.editBottom {
  // width: 220px;
  text-align: right;
  margin-bottom: 0;
  margin-left: 35%;
}
.btn {
  margin-bottom: 15px;
}

.demo-tabs {
  :deep(.el-input__inner),
  .el-input {
    width: 100px;
  }
}
.input {
  display: inline-block;
}
.el-tag {
  margin-right: 10px;
}
.p {
  width: 50px;
  height: 1px;
  display: inline-block;
}
</style>