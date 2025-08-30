import {describe, it, expect, beforeEach, jest} from '@jest/globals';
import { Task } from '../src/task';
import { setTimeout } from 'node:timers/promises'

describe('Task Test Suite', () => {
  let _logmock;
  let _task
  beforeEach(() => {
    jest.spyOn(console, console.log.name).mockImplementation()
    _task = new Task()
  })

    it('should only run tasks that are due with fake timers', async () => {
      jest.useFakeTimers()

    const tasks = [
      { name: 'Task-Will-Run-In-5-Secs', dueAt: new Date(Date.now() + 5_000), fn:  jest.fn() },
      { name: 'Task-Will-Run-In-10-Secs', dueAt: new Date(Date.now() + 10_000), fn:  jest.fn() },
    ]

    // Act
    _task.save(tasks.at(0))
    _task.save(tasks.at(1))

    // 2 = 2
    _task.run(200)
    jest.advanceTimersByTime(4000)
    expect(tasks.at(0).fn).not.toHaveBeenCalled()
    expect(tasks.at(1).fn).not.toHaveBeenCalled()

    // 4 + 2 = 6
    jest.advanceTimersByTime(2000)
    expect(tasks.at(0).fn).toHaveBeenCalled()
    expect(tasks.at(1).fn).not.toHaveBeenCalled()

    // 4 + 2 + 4 = 10
    jest.advanceTimersByTime(4000)
    expect(tasks.at(1).fn).toHaveBeenCalled()
    jest.useRealTimers()
  })
})