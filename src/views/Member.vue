<template>
  <div>
    <!--  搜索条件 行内表单  -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名字" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px">
          <el-option v-for="pay in payTypeOptions" :key="pay.type" :label="pay.name" :value="pay.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker v-model="searchMap.birthday" type="date" style="width: 200px" value-format="yyyy-MM-dd"
                        placeholder="出生日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  表格主体  -->
    <el-table :data="list" border style="width: 100%" height="400">
      <el-table-column type="index" label="序号" width="60">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>Id: {{ scope.row.id }}</p>
            <div slot="reference" class="name-wrapper">{{ scope.$index + 1}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
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
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="pojoForm" :model="pojo" :rules="rules" label-width="80px" label-position="right"
               style="width: 400px">
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker v-model="pojo.birthday" type="date" value-format="yyyy-MM-dd"
                          placeholder="会员生日"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option v-for="pay in payTypeOptions" :key="pay.type" :label="pay.name" :value="pay.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address" autocomplete="off"></el-input>
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
  import memberApi from "../api/member";

  // 支付类型
  const payTypeOptions = [
    {type: '1', name: '现金'},
    {type: '2', name: '微信'},
    {type: '3', name: '支付宝'},
    {type: '4', name: '银行卡'},
  ]

  export default {
    data() {
      return {
        list: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        searchMap: {
          cardNum: '',
          name: '',
          payType: '',
          birthday: ''
        },
        payTypeOptions, // payTypeOptions: payTypeOptions
        dialogFormVisible: false,
        pojo: {
          id: null,
          cardNum: '',
          name: '',
          birthday: '',
          phone: '',
          integral: 0,
          money: 0,
          payType: '',
          address: ''
        },
        rules: {
          cardNum: [
            {required: true, message: '会员卡号不能为空', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '会员名称不能为空', trigger: 'blur'},
          ],
          payType: [
            {required: true, message: '支付类型不能为空', trigger: 'change'},
          ],
        }
      }
    },
    filters: {
      payTypeFilter(type) {
        // 在过滤器中 不能引用当前实例 this   this.payTypeOptions 直接报错
        const payObj = payTypeOptions.find(item => item.type === type)
        return payObj ? payObj.name : null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        // memberApi.getList().then(response => {
        //   let resp = response.data
        //   console.log('resp', resp)
        //   this.list = resp.data
        //   console.log('list', this.list)
        // })

        // 通过分页查询
        memberApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          const resp = response.data
          this.list = resp.data.rows
          this.total = resp.data.total
          console.log('list total', this.list, this.total)
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
            memberApi.add(this.pojo).then(response => {
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
            memberApi.update(this.pojo).then(response => {
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
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      /**
       * 编辑前 回显行记录
       * @param id
       */
      handleEdit(id) {
        this.handleAdd()
        memberApi.getById(id).then(response => {
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
          memberApi.deleteById(id).then(response => {
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
