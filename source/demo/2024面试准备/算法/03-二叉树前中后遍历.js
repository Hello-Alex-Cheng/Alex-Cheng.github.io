const tree = {
    val: 'f',
    left: {
        val: 'd',
        left: {
            val: "b",
            left: {
                val: 'a'
            },
            right: {
                val: 'c'
            }
        },
        right: {
            val: 'e'
        }
    },
    right: {
        val: 'g',
        left: null,
        right: {
            val: 'i',
            left: {
                val: 'h'
            },
            right: {
                val: 'j'
            }
        }
    }
}


/** @name 先中后指的是`根`节点 */
// https://www.bilibili.com/video/BV1tW4y1M7FC/?spm_id_from=333.788.top_right_bar_window_history.content.click&vd_source=a9f38e58a519cc0570c2dacd34ad7ebe

/** 先序: 根 左 右 */
/** 中序: 左 根 右 */
/** 后序: 左 右 根 */


/** @name 先序遍历 */
const pre = (node) => {
    if (node?.val) {
        console.log(node.val)
    }

    if (node?.left) {
        pre(node.left)
    }

    if (node?.right) {
        pre(node.right)
    }
}
// pre(tree)



/** @name 中序遍历 */
const middle = (node) => {
    if (node?.left) {
        middle(node.left)
    }

    if (node?.val) {
        console.log(node.val)
    }

    if (node?.right) {
        middle(node.right)
    }
}
// middle(tree)

// d f g
// b d e f g
// a b c d e f g
// a b c  d e f g h i j


/** @name 后序遍历 */
const back = (node) => {
    if (node?.left) {
        back(node.left)
    }

    if (node?.right) {
        back(node.right)
    }

    if (node?.val) {
        console.log(node.val)
    }
}
back(tree)

// d g f
// b e d g f
// a c b e d g f
// a c b e d i g f
// a c b e d h j i g f



