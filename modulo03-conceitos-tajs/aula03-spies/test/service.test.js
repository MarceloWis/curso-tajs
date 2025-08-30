import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import crypto from 'node:crypto';
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import Service from '../src/service'

describe('Service Suite', () => {
  let _service
  const filename = 'testfile.ndjson'
  const MOCKED_HASH_PWD = 'hashedpassword'
  beforeEach(() => {
    _service = new Service({ filename })
  })

  describe('#create - spies', () => {
    beforeEach(() => {
      jest.spyOn(crypto, 'createHash')
      .mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
      })

      jest.spyOn(fs, 'appendFile')
      .mockResolvedValue()

      _service = new Service({ filename })
    })


    it('should call appendFile with right params', async () => {
      const expectedCreatedAt = new Date().toISOString()
      const input = {
        username: 'user1',
        password: 'pass1'
      }
      jest.spyOn(Date.prototype, Date.prototype.toISOString.name)
        .mockReturnValue(expectedCreatedAt)

        await _service.create(input)

        expect(crypto.createHash).toHaveBeenNthCalledWith(1, 'sha256')

        const hash = crypto.createHash('sha256')
        expect(hash.update).toHaveBeenCalledWith(input.password)
        expect(hash.digest).toHaveBeenCalledWith('hex')

        const expected = JSON.stringify({
          ...input,
          password: MOCKED_HASH_PWD,
          createdAt: expectedCreatedAt
        }).concat('\n')
        
        expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
    })

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