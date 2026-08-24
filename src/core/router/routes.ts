import { LoginPage } from "../../features/auth/login-page.ts";
import { RegisterPage } from "../../features/auth/register-page.ts";
import { HomePage } from "../../features/home/home-page.ts";

export const routes: Record<string, { page: () => void } > = {
    '/': {
        page: HomePage,
    },
    '/auth/login': {
        page: LoginPage,
    },
    '/auth/register': {
        page: RegisterPage,
    },
    // 404: {
    //     page: ErrorPage,
    // }
}
