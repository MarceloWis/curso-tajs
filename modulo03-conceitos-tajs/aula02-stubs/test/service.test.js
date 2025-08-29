import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import Service from '../src/service'

describe('Service Suite', () => {
  let _service
const filename = 'testfile.ndjson'
  beforeEach(() => {
    _service = new Service({ filename })
    jest.resetAllMocks()
  })

  describe('#create', () => {
 
  })
  describe('#read', ()=> {
    it('should return an  empty array if the file is empty', async () => {
      jest
      .spyOn(fs, fs.readFile.name)
      .mockReturnValue('')

      const result = await _service.read()
      expect(result).toEqual([])
    })
    it('should return users without password if file contains users', async () => {
      const dbData = [
        {
          username: 'user1',
          password: 'pass1',
          createdAt: new Date().toISOString()
        },
                {
          username: 'user2',
          password: 'pass2',
          createdAt: new Date().toISOString()
        },
      ]

      const fileContent = dbData
      .map(item => JSON.stringify(item).concat('\n')).join('')

      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue()

      jest
      .spyOn(fs, 'readFile')
      .mockResolvedValue(fileContent)

      const result = await _service.read()

      const expected = dbData.map(({ password, ...rest }) => ({...rest}))
      expect(result).toStrictEqual(expected)
    })
    it('should return an empty array if the file not exists', async () => {

      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockReturnValue(false)
      

      const result = await _service.read()
      const expected = []
      expect(result).toEqual(expected)
    })
  })
})