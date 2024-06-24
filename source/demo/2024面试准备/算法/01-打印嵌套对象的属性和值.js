

const input = {
    a: 1,
    b: [1, 2, { c: true, f: [99, {ff: 999}]}, [3]],
    d: { e: 2, f: 3 },
    g: null
}


const fomatter = (obj, k = '') => {
    if (obj === null) return null
    let res = {}

    for (const key in obj) {
        const fattenKey = k+(Array.isArray(obj)? `[${key}]`: `${k? '.': ''}${key}`);
        if (obj[key] !== null) {
            if (typeof obj[key] === 'object') {
                Object.assign(res, fomatter(obj[key], key))
            } else {
                if (k) {
                    res[fattenKey] = obj[key]
                } else {
                    res[fattenKey] = obj[key]
                }
            }
        }
    }

    return res
}

// function fatten(obj, o = {} ,preKey = "") {
//     this.o = o;
//     for(key in obj){
//         const fattenKey = preKey+(Array.isArray(obj)? `[${key}]`: `${preKey? '.': ''}${key}`);
//         if(typeof obj[key] !== 'object'){
//             this.o[fattenKey] = obj[key];
//         }else{
//             fatten(obj[key], this.o, fattenKey);
//         }
//     }
//     return this.o;
// }


const result = fomatter(input)

console.log(result)





const arr = [3,4,5,6,7,8]

const asyncSum = () => {
    const val = 0
}


