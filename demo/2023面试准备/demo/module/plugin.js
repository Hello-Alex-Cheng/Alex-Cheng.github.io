module.exports = function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {

        // console.log('🔥', path.node)
        // console.log('🔥', path.parent)
        path.node.name = 'cat'
      },
      VariableDeclaration(path, state) {

        // console.log('🔥', path.node)
        if (path.node.kind === 'const') {
          path.node.kind = 'let'
        }
      },
      Literal(path, state) {
        console.log('🔥', state.opts)
        path.node.value = 'is caaat...'
      }
    }
  }
}
