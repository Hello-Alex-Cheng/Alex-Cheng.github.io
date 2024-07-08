


const setLocalStorage = (key, value, type) => {
    if (typeof value === 'string') {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const onBtnClicked = () => {
    const map = new Map()
    const o = {}

    map.set('name', 'alex.cheng')
    map.set(o, {
        age: 18,
        sex: 'man',
    })
    console.log(map.get(o))

    /**
     * @name 将map实例转化成一个数组,然后序列化之后存储,取的时候parse完了之后再传递给Map构造器
     */

    const str = JSON.stringify(Array.from(map.entries()))
    const store = new Map(JSON.parse(str))
    
    console.log(store)
    console.log(store.get('name'))
    console.log(store.get(o)) // 获取不到了

    // setLocalStorage('myInfo', map)
    // setTimeout(() => {
    //     console.log(getLocalStorage('myInfo'))
    // }, 2000);
}

window.onload = () => {
    const app = document.querySelector('#app')
    const button = document.createElement('button')
    button.textContent = '点击'
    button.addEventListener('click', onBtnClicked)
    app.appendChild(button)
}

