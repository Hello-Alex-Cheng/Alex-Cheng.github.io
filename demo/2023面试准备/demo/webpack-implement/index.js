// const BabelParser = require('@babel/parser')
const fs = require('fs')
const path = require('path')
const BabelParser = require('@babel/parser')
const Traverse = require('@babel/traverse').default

const text = fs.readFileSync('./src/index.js', {
  encoding: 'utf8'
})

// 将文本转为 AST
const ast = BabelParser.parse(text, {
  sourceType: 'module'
})

// 使用 traverse 可以遍历 AST，然后查找AST 的依赖模块
const dependencies = {}
Traverse(ast, {
  ImportDeclaration({ node }) {
    const relativePath = node.source.value
    const absolutePath = path.resolve(__dirname + '/src', relativePath)

    console.log('???', absolutePath)
  }
})

