const nodelist = {
    val: 1,
    next: {
        val: 2,
        next: {
            val: 3,
            next: {
                val: 4,
                next: {
                    val: 5,
                    next: null
                }
            }
        }
    }
}


const traverseNode = node => {
    if (!node.next) return node

    let prev = next = null
    let curr = node

    while(curr) {
        next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }

    return prev
}


console.log(JSON.stringify(traverseNode(nodelist), null, 2))