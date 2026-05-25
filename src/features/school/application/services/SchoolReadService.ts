import { ApplicationError } from "@/shared/utils/errors";
import { Result, ok } from "@/shared/application";
import { SchoolReadRepository } from "../../domain/repositories";
import { School, SchoolForDetail, SchoolForPolicy } from "@/features/school/infrastructure/queries";

export class SchoolReadService {
  constructor(private readonly schoolReadRepository: SchoolReadRepository) {}

  async getSchoolById(schoolId: string): Promise<Result<School | null, ApplicationError>> {
    const school = await this.schoolReadRepository.getSchool(schoolId);
    return ok(school);
  }

  async getSchoolDetail(schoolId: string): Promise<Result<SchoolForDetail | null, ApplicationError>> {
    const school = await this.schoolReadRepository.getSchoolDetail(schoolId);
    return ok(school);
  }

  async getSchoolPolicy(schoolId: string): Promise<Result<SchoolForPolicy | null, ApplicationError>> {
    const school = await this.schoolReadRepository.getSchoolPolicy(schoolId);
    return ok(school);
  }

  async getSchools(): Promise<Result<School[], ApplicationError>> {
    const schools = await this.schoolReadRepository.getSchools();
    return ok(schools);
  }

  async getDetailedSchools(): Promise<Result<SchoolForDetail[], ApplicationError>> {
    const schools = await this.schoolReadRepository.getSchoolsDetail();
    return ok(schools);
  }

  async getPolicySchools(): Promise<Result<SchoolForPolicy[], ApplicationError>> {
    const schools = await this.schoolReadRepository.getPolicySchools();
    return ok(schools);
  }

  async getSchoolsByUserId(userId: string): Promise<Result<School[], ApplicationError>> {
    const schools = await this.schoolReadRepository.getSchoolsByUserId(userId);
    return ok(schools);
  }

  async getDetailedSchoolsByUserId(userId: string): Promise<Result<SchoolForDetail[], ApplicationError>> {
    const schools = await this.schoolReadRepository.getDetailedSchoolsByUserId(userId);
    return ok(schools);
  }
}
