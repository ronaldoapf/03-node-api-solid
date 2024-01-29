import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchMemberCheckInsRequest {
  userId: string
  page: number
}

interface FetchMemberCheckInsResponse {
  checkIns: CheckIn[]
}

export class FetchMemberCheckIns {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchMemberCheckInsRequest): Promise<FetchMemberCheckInsResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )
    return { checkIns }
  }
}
