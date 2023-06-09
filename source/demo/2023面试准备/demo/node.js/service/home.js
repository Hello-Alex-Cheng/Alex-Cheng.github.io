const jwt = require('jsonwebtoken')
const Login = require('../models/login')

module.exports = {
  login: async (name,password ) => {
    // 聚合查询
    // const pipeline = [
    //   {
    //     $match: {
    //       size: 'medium'
    //     }
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       quantity: 1,
    //       price: 1,
    //       totalPrice: {
    //         $multiply: ["$quantity", "$price"]
    //       }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: '$name',
    //       totalPrice: {
    //         $sum: '$totalPrice',
    //       },
    //       totalQuantity: {
    //         $sum: '$quantity'
    //       },
    //     }
    //   },
    //   {
    //     $sort: {
    //       totalQuantity: -1
    //     }
    //   }
    // ]
    // const result = await Login.aggregate(pipeline)
    // console.log(result)

    let responseData = ''
    if (name === 'alex.cheng' && password === '123456') {
      const query = await Login.find({
        username: 'alex.cheng'
      })




      if (query.length) {
        // 查询到了用户，我们通过 JWT 来生成签名（token）
        const userInfo = query[0]

        const token = jwt.sign({
          id: userInfo.id,
          username: userInfo.username,
          isAdmin: userInfo.isAdmin,
          password: userInfo.password
        }, 'shhhh', {
          expiresIn: '1h'
        })

        
        jwt.verify(token, 'shhhh', (err, decoded) => {
          if (err) throw new Error('verify token error')
          console.log('decoded token', decoded)
        })


        responseData = `
          <h1>Login success!</h1>
          <p>username: ${query[0].username}; password: ${query[0].password}</p>
          <p>jwt token: ${token}</p>
        `
      } else {
        responseData = '未查到对应用户，请先注册!'
      }
    } else {
      responseData = 'Some Error!'
    }

    return responseData
  }
}