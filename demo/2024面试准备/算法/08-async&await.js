
const onBtnClicked = () => {

    const fn = async () => {
        const count = 100
        return await count
    }

    fn().then(res => {
        console.log(res)
    })
}


window.onload = () => {
    const app = document.querySelector('#app')
    const button = document.createElement('button')
    button.textContent = '点击'
    button.addEventListener('click', onBtnClicked)
    app.appendChild(button)
}

