
import { School, SchoolForDetail, SchoolForPolicy } from "../../infrastructure/queries";

export interface SchoolReadRepository {
  getSchoolsByName(name: string): Promise<School[]>;
  getSchool(schoolId: string): Promise<School | null>;
  getSchoolDetail(schoolId: string): Promise<SchoolForDetail | null>;
  getSchoolPolicy(schoolId: string): Promise<SchoolForPolicy | null>;

  getSchools(): Promise<School[]>;
  getSchoolsDetail(): Promise<SchoolForDetail[]>;
  getPolicySchools(): Promise<SchoolForPolicy[]>;

  getSchoolsByUserId(userId: string): Promise<School[]>;
  getDetailedSchoolsByUserId(userId: string): Promise<SchoolForDetail[]>;
}
