import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services";
import { ApplicationError } from "@/shared/utils/errors";
import { ok, Result } from "@/shared/application";


export type LoginUserUseCaseResult = Result<User, ApplicationError>;
    export class LoginUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(email: string, password: string): Promise<LoginUserUseCaseResult> {
        const user = await this.authProvider.signInWithEmail(email, password);
        return ok(user);
    }
}