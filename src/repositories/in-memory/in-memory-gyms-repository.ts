import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }
}
