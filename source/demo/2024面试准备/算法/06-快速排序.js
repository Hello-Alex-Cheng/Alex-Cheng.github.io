

const arr = [3, 1, 5, 11, 99, 4, 6, 1, 10]


const quickSort = (list) => {

    if (list.length <= 1) return list;

    const clones = [...list]
    const base = clones.shift()
    const mins = []
    const maxs = []

    for (let i = 0; i < clones.length; i++) {
        if (clones[i] <= base) {
            mins.push(clones[i])
        } else {
            maxs.push(clones[i])
        }
    }

    return [...quickSort(mins), base, ...quickSort(maxs)]
}


const res = quickSort(arr)

console.log(res)
