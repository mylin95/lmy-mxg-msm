<template>
  <div class="fileUpload">
    <input type="file" id="fileInput" name="fileName" />
    <el-button @click="submitFile">文件上传</el-button> <br />
    <img id="image1" />
    <hr />

    <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
    <el-upload
      class="avatar-uploader"
      action="http://127.0.0.1:8888/file/fileUpLoadString"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>


  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "Home",
  data() {
    return {
      imageUrl: "",
    };
  },
  methods: {
    /**
     * Base64Url 转H5的 Blob对象
     * @param urlData
     * @returns {Blob}
     */
    convertBase64UrlToBlob(urlData) {
      //去掉url的头，并转换为byte
      var bytes = window.atob(urlData.split(",")[1]);
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
    /**
     * blob对象转DataURL 转 Base64
     * @param blob
     * @param cb
     */
    blobToDataURL(blob, cb) {
      let reader = new FileReader();
      reader.onload = function (evt) {
        var base64 = evt.target.result;
        cb(base64);
      };
      reader.readAsDataURL(blob);
    },
    submitFile() {
      let fileInput = document.getElementById("fileInput");
      // let forms = new FormData();
      // console.log('url', fileInput.src)
      // console.log(this.convertBase64UrlToBlob(fileInput.url))
      let img = fileInput.files[0];
      // let url = URL.createObjectURL(img);
      let base64 = this.blobToDataURL(img, function (base64) {
        let image1 = document.getElementById("image1");
        image1.src = base64;

        const params = {
          file: base64,
          // 'file': base64.split(',')[1],
          fileName: "xxx",
          serialNumber: "xxx",
        };
        axios
          .post("http://127.0.0.1:8888/file/fileUpLoadString", params)
          .then((res) => {
            console.log(res, "res");
          })
          .catch((error) => {});
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>