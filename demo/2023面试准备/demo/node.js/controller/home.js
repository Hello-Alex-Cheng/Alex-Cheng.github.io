const HomeService = require('../service/home')
const Login = require('../models/login')

module.exports = {
  updatePassword: async (ctx, next) => {
    const user = ctx.state.user
    const { newpassword } = ctx.request.body
    const hasUser = await Login.find({
      username: user.username
    })
    
    if (!hasUser.length) return ctx.body = '数据库未查询到当前用户'

    await Login.updateOne(
      { username: user.username },
      {
        $set: {
          password: newpassword
        }
      }
    )

    const currentUser = await Login.find({
      username: user.username
    })
    ctx.body = currentUser
  },
  index: async (ctx, next) => {
    ctx.response.body = `
      <iframe id="temp-iframe" name="temp-iframe" src="" style="display:none;"></iframe>
      <h1>Index</h1>
      <form action='/login' method='post'>
        <p>Name <input name='name' /></p>
        <p>Password <input name='password' type='password' /></p>
        <p><input type='submit' value='提交' /></p>
      </form>

      <h1>文件上传</h1>
      <form action='/upload/img' target="temp-iframe" method='post' enctype='multipart/form-data'>
        <p><input type='file' name='file' multiple /></p>
        <p><input type='submit' value='提交' /></p>
      </form>

      <script>
        var iframe = document.getElementById('temp-iframe');
        iframe.addEventListener('load',function () {
              var result = iframe.contentWindow.document.body.innerText;
              //接口数据转换为 JSON 对象
              if (result) {
                var obj = JSON.parse(result);
                console.log(obj);

                if(obj && obj.file.filepath){
                    alert('上传成功');
                }
              }
        });
      </script>
    `
  },
  home: async (ctx, next) => {

    console.log('accepts==== ', ctx.accepts('json', 'html', 'text/plain'))
    // ctx.status = 404
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
    // ctx.response.body = `
    //   <h1>Home Page</h1>
    //   <p>JSON.stringify(query): ${JSON.stringify(ctx.request.query)}</p>
    //   <p>querystring: ${ctx.request.querystring}</p>
    // `

    ctx.body = {
      query: ctx.request.query,
      querystring: ctx.request.querystring,
      a: {
        name: 1
      }
    }
  },
  homeParams: async (ctx, next) => {
    console.log('home params ', ctx.params)
    const { id, name } = ctx.params
    ctx.response.body = `
      <h1>Home Params Page </h1>
      <p>id: ${id}</p>
      <p>name: ${name}</p>
    `
  },
  login: async (ctx, next) => {
    console.log('post 数据', ctx.request.body)
  
    const name = ctx.request.body.name || ''
    const password = ctx.request.body.password || ''

    const data = await HomeService.login(name, password)
    ctx.body = data
  },
}