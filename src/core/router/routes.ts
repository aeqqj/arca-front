import { LandingPage } from "../../features/landing/landing-page.ts";
import { LoginPage } from "../../features/auth/login-page.ts";
import { RegisterPage } from "../../features/auth/register-page.ts";

export const routes: Record<string, { page: () => void } > = {
    '/': {
        page: LandingPage,
    },
    '/auth/login': {
        page: LoginPage,
    },
    '/auth/register': {
        page: RegisterPage,
    }
    // 404: {
    //     page: ErrorPage,
    // }
}
