
const arr = [3, 2, [66, 32, [1, 2, 4]], 7, [9]]


const flattenArray = list => {
    const res = []
    
    for (let i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) {
            res.push(...flattenArray(list[i]))
        } else {
            res.push(list[i])
        }
    }

    return res
}


console.log(flattenArray(arr))
