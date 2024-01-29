import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      description: null,
      title: 'JavaScript Gym',
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
