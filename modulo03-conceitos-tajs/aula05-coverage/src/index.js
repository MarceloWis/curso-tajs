import { Task } from "./task.js";

const task = new Task()

const oneSecond = 1000
const runInASec = new Date(Date.now() + oneSecond)
const runInTwoSecs = new Date(Date.now() + oneSecond * 2)
const runInThreeSecs = new Date(Date.now() + oneSecond * 3)

task.save({
  name: 'Task 1',
  dueAt: runInASec,
  fn: () => console.log('task 1 executed')
})
task.save({
  name: 'Task 2',
  dueAt: runInTwoSecs,
  fn: () => console.log('task 2 executed')
})
task.save({
  name: 'Task 3',
  dueAt: runInThreeSecs,
  fn: () => console.log('task 3 executed')
})

task.run(oneSecond)