<template>
  <div>
    <!--  搜索条件 行内表单  -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input v-model="searchMap.supplierName" @click.native="dialogSupplierVisible = true" placeholder="选择供应商" style="width: 200px" readonly></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  表格主体  -->
    <el-table :data="list" border style="width: 100%" height="400">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="purchasePrice" label="零售价"></el-table-column>
      <el-table-column prop="retailPrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column label="操作" width="150">
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--  弹窗-新增按钮  -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="pojoForm" :model="pojo" :rules="rules" label-width="100px" label-position="right"
               style="width: 400px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input readonly @click.native="editSupplierOption"
            v-model="pojo.supplierName" autocomplete="off" placeholder="选择供应商"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ? submitPojo('pojoForm') : updatePojo('pojoForm')">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier :isDialog="true" @supplier-option="getSupplierName"></supplier>
    </el-dialog>
  </div>
</template>

<script>
  import goodsApi from "../api/goods";
  import Supplier from "./Supplier";

  export default {
    components: {
      Supplier
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
          supplierName: ''
        },
        dialogSupplierVisible: false,
        dialogFormVisible: false,
        pojo: {
          id: null,
          name: '',
          code: '',
          spec: '',
          purchasePrice: 0.0,
          retailPrice: 0.0,
          storageNum: 0,
          supplierName: '',
          supplierId: null
        },
        rules: {
          name: [
            {required: true, message: '商品名称不能为空', trigger: 'blur'},
          ],
          code: [
            {required: true, message: '商品编码不能为空', trigger: 'blur'},
          ],
          purchasePrice: [
            {required: true, message: '零售价不能为空', trigger: 'blur'},
          ]
        },
        isEdit: false, // 是否编辑弹窗
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        goodsApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          let resp = response.data
          this.list = resp.data.rows
          this.total = resp.data.total
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
            goodsApi.add(this.pojo).then(response => {
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
            goodsApi.update(this.pojo).then(response => {
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
        goodsApi.getById(id).then(response => {
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
          goodsApi.deleteById(id).then(response => {
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
      getSupplierName(currentRow) {
        console.log('parent', JSON.stringify(currentRow))
        if (this.isEdit) {
          // 编辑弹窗
          this.pojo.supplierId = currentRow.id
          this.pojo.supplierName = currentRow.name
        } else {
          // 商品页面的选择
          this.searchMap.supplierId = currentRow.id
          this.searchMap.supplierName = currentRow.name
        }
        this.isEdit = false // 重置为编辑弹窗
        this.dialogSupplierVisible = false
      },
      editSupplierOption() {
        this.isEdit = true
        this.dialogSupplierVisible = true
      }
    }
  }
</script>

<style scoped>
  .el-pagination {
    margin-top: 15px;
    float: right;
  }
</style>
