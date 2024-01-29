import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-in-errors'
import { MaxDistanceError } from './errors/max-distance-errors'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-01',
      description: null,
      title: 'JavaScript Gym',
      phone: null,
      latitude: -18.9384705,
      longitude: -48.3090628,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9384705,
      userLongitude: -48.3090628,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9384705,
      userLongitude: -48.3090628,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -18.9384705,
        userLongitude: -48.3090628,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9384705,
      userLongitude: -48.3090628,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9384705,
      userLongitude: -48.3090628,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      description: null,
      title: 'JavaScript Gym',
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
