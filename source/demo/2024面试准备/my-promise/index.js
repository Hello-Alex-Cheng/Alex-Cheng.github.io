const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';


class MyPromise {
    #state = 'pending'
    #result = null

    constructor(executor){
        const resolve = (data) => {
            this.#changeState(FULLFILLED, data)
        }

        const reject = (reason) => {
            this.#changeState(REJECTED, reason)
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    #changeState(state, result) {
        if (this.#state !== PENDING) return
        this.#state = state
        this.#result = result

    }

    then(onFulfilled, onRejected) {
        return
    }
}


const m = new MyPromise((resolve, reject) => {
    throw 123
})

console.log(m)

