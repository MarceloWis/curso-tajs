import { describe, it, expect, jest } from '@jest/globals'
import Person from '../src/person'

describe('#Person Suite', function() {
    describe('#validate', () => {
      it('should throw if name is not present', () => {
        const mockInvalidPerson = { name: '', cpf: '123.456.789-00' }
        expect(() => Person.validade(mockInvalidPerson)).toThrow('name is required')
      })
      it('should throw if cpf is not present', () => {
        const mockInvalidPerson = { name: 'Zezin', cpf: ''}
        expect(() => Person.validade(mockInvalidPerson)).toThrow('cpf is required')
      })
      it('should not throw if person is valid', () => {
        const mockInvalidPerson = { name: 'Zezin', cpf: '123.456.789-00'}
        expect(() => Person.validade(mockInvalidPerson)).not.toThrow()
      })
    })

    describe('#format', () => {
      it('should format the person name and cpf', () => {
        // AAA
        // Arrage
        const mockValidPerson = {
          name: 'Zezin da Silva',
          cpf: '123.456.789-00'
        }

        //Act
        const result = Person.format(mockValidPerson)
        // Assert
        const expected = {
          name: 'Zezin',
          lastName: 'da Silva',
          cpf: '12345678900'
        }
        expect(result).toStrictEqual(expected)
      })
    })

    describe('#save', () => {
      it('shold throw and error if cpf is not present', () => {
        const mockInvalidPerson = {
          name: 'Zezin',
          lastName: 'da Silva',
          cpf: ''
        }
        expect(() => Person.save(mockInvalidPerson)).toThrow(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`)
      })
      it('shold throw and error if name is not present', () => {
        const mockInvalidPerson = {
          name: '',
          lastName: 'da Silva',
          cpf: '12345678900'
        }
        expect(() => Person.save(mockInvalidPerson)).toThrow(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`)
      })
      it('shold throw and error if lastName is not present', () => {
        const mockInvalidPerson = {
          name: 'Zezin',
          lastName: '',
          cpf: '12345678900'
        }
        expect(() => Person.save(mockInvalidPerson)).toThrow(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`)
      })
    })
    
    describe('#process', () => {
      it('should process a valid person', () => {
        const mockValidPerson = {
          cpf: '123.456.789-00',
          name: 'Zezin da Silva'
        }
        const mockResult = {
          cpf: '12345678900',
          name: 'Zezin',
          lastName: 'da Silva'
        }
        jest.spyOn(
          Person,
          Person.validade.name
        ).mockReturnValue()

        jest.spyOn(
          Person,
          Person.format.name,
        ).mockReturnValue(mockResult)

        const result = Person.process(mockValidPerson)
        const expected = 'ok'
        expect(result).toStrictEqual(expected)
      })
    })
})