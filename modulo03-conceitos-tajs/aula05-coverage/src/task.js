export class Task {
  #tasks = new Set()

  save({ name, dueAt, fn }) {
    console.log(`task [${name}] saved and will be executed at ${dueAt.toISOString()}`)
    this.#tasks.add({ name, dueAt, fn })
  }

  run(everyMs) {
    const intervalId = setInterval(() => {
        if(this.#tasks.size === 0) {
          console.log('Tasks completed')
          clearInterval(intervalId)
          return;
        }
        const now = new Date()
        for(const task of this.#tasks) {
          if(task.dueAt <= now) {
            task.fn()
            console.log(`task [${task.name}] executed at ${task.dueAt}`)
            this.#tasks.delete(task)
          }
        }

    }, everyMs);
  }
}