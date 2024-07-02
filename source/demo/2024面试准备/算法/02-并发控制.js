

const sleep = (timeout = 1000, name) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(name)
		}, timeout);
	})
}

class ConcurrencyControl {

	constructor(max = 2) {
		this.max = max // 最大并发数量
		this.task = [] // 任务队列
		this.runningCount = 0 // 正在执行的任务
	}

	add(task) {
		return new Promise((resolve, reject) => {
			this.task.push({
				task: task,
				resolve,
				reject,
			})
			this.run()
		})
	}

	run() {
		// 用if 比 while 更好,省内存
		if (this.runningCount < this.max && this.task.length > 0) {
			console.log(' - - ', this.runningCount)
			const { task, resolve, reject } = this.task.shift()
			this.runningCount++
			task()
				.then(resolve, reject)
				.finally(() => {
					this.runningCount--
					this.run()
				})
		}

	}
}
const cc = new ConcurrencyControl()

const addTask = (timeout, name) => {
	cc
		.add(() => sleep(timeout, name))
		.then(res => {
			console.log(`任务 ${res} 完成`)
		})
}

addTask(10000, 1)
addTask(5000, 2)
addTask(3000, 3)
addTask(4000, 4)
addTask(6000, 5)
addTask(2000, 6)
addTask(7000, 7)



