module.exports = {
  uploadImg: async (ctx, next) => {
    const { file } = ctx.request.files

    // 如果同时上传了多个文件，那么 file 是个数组

    console.log('file', file)

    if (file) {
      ctx.body = {
        code: 0,
        message: '文件上传成功',
        data: file,
        file: {
          filepath: file.filepath
        }
      }
    } else {
      ctx.body = '上传失败或者文件无法解析???'
    }
  }
}
