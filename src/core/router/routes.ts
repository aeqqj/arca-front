import { SignInPage } from "../../features/auth/signin-page.ts";
import { SignUpPage } from "../../features/auth/signup-page.ts";
import { HomePage } from "../../features/home/home-page.ts";

export const routes: Record<string, { page: () => void } > = {
    '/': {
        page: HomePage,
    },
    '/auth/signin': {
        page: SignInPage,
    },
    '/auth/signup': {
        page: SignUpPage,
    },
    // 404: {
    //     page: ErrorPage,
    // }
}
