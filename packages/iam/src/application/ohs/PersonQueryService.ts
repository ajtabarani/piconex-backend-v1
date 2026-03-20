// import { PersonId } from "../../domain";
// import { PersonAuthorizationSnapshot } from "../policies";
// import {
//   PersonDTO,
//   AdminProfileDTO,
//   FacultyProfileDTO,
//   StudentProfileDTO,
// } from "../queries";

// export interface PersonQueryService {
//   getPersonById(
//     actor: PersonAuthorizationSnapshot,
//     personId: PersonId,
//   ): Promise<PersonDTO | null>;

//   getPersonByExternalAuthId(
//     actor: PersonAuthorizationSnapshot,
//     externalAuthId: string,
//   ): Promise<PersonDTO | null>;

//   getAdminProfile(
//     actor: PersonAuthorizationSnapshot,
//     personId: PersonId,
//   ): Promise<AdminProfileDTO | null>;

//   getFacultyProfile(
//     actor: PersonAuthorizationSnapshot,
//     personId: PersonId,
//   ): Promise<FacultyProfileDTO | null>;

//   getStudentProfile(
//     actor: PersonAuthorizationSnapshot,
//     personId: PersonId,
//   ): Promise<StudentProfileDTO | null>;

//   getSuperAdmin(actor: PersonAuthorizationSnapshot): Promise<PersonDTO | null>;
// }
