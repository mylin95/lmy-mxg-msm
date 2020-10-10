<template>
  <div>
    <!--  搜索条件 行内表单  -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  表格主体  -->
    <!--  highlight-current-row 激活单选行
          @current-change 当点击某一行后，会出发这个事件，从而调用对应的事件 handleRowCurrentChange
          handleRowCurrentChange函数会接受两个参数： currentRow, oldCurrentRow
          注：highlight-current-row属性 和 @current-change事件，没有关联关系（与梦学谷日、官方文档内容相悖）
    -->
    <el-table :highlightCurrentRow="isDialog"
              @current-change="handleRowCurrentChange"
              ref="singleTable" :data="list" border style="width: 100%" height="400">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页插件  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      :total="total">
    </el-pagination>

    <!--  弹窗-新增按钮  -->
    <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" v-if="!isDialog" width="500px">
      <el-form ref="pojoForm" :model="pojo" :rules="rules" label-width="100px" label-position="right"
               style="width: 400px">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ? submitPojo('pojoForm') : updatePojo('pojoForm')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "../api/supplier";
import memberApi from "../api/member";

export default {
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: '',
        linkman: '',
        mobile: ''
      },
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: '',
        linkman: '',
        mobile: '',
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '供应商名称不能为空', trigger: 'blur'},
        ],
        linkman: [
          {required: true, message: '联系人不能为空', trigger: 'blur'},
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      supplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        let resp = response.data
        this.list = resp.data.rows
        this.total = resp.data.total
        // this.total = resp.
        console.log('resp', resp)
      })
    },
    /**
     * ele重置表单
     *  1.el-form-item prop属性赋值
     *  2.data数据中 初始化表单值
     *  3.this.$refs[formName].resetFields()
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitPojo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data
            if (resp.flag) {
              // 1.关闭弹窗 2.弹窗提示更新成功 3.刷新列表
              this.dialogFormVisible = false
              this.$message.success(resp.message)
              this.fetchData()
            } else {
              this.$message.warn(resp.message)
            }
          })
        } else {
          return false
        }
      })
    },
    updatePojo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data
            if (resp.flag) {
              // 1.关闭弹窗 2.弹窗提示更新成功 3.刷新列表
              this.dialogFormVisible = false
              this.$message.success(resp.message)
              this.fetchData()
            } else {
              this.$message.warn(resp.message)
            }
          })
        } else {
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    /**
     * 新增的弹窗事件
     *  表单字段重置、清除校验
     */
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs['pojoForm'].resetFields()
      })
    },
    /**
     * 编辑前 回显行记录
     * @param id
     */
    handleEdit(id) {
      this.handleAdd()
      supplierApi.getById(id).then(response => {
        const resp = response.data
        if (resp.flag) {
          this.pojo = resp.data
        } else {
          this.$message.warning('不存在这个信息')
        }
      })
    },
    /**
     * 根据id删除行记录
     *  判断是否删除
     * @param id
     */
    handleDelete(id) {
      this.$confirm('你确定要删除这条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        supplierApi.deleteById(id).then(response => {
          const resp = response.data
          this.$message({
            message: resp.message,
            type: resp.flag ? 'success' : 'warning'
          })
          if (resp.flag) {
            // 删除成功，刷新列表数据
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    handleRowCurrentChange(currentRow, oldCurrentRow) {
      console.log('sun-currentRow', currentRow)
      console.log('sun-oldCurrentRow', oldCurrentRow)
      this.$emit('supplier-option', currentRow)
    }
  }
}
</script>

<style scoped>
</style>
