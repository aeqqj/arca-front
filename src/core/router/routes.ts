import { LandingPage } from "../../features/landing/landing-page.ts";

export const routes: Record<string, { page: () => void } > = {
    '/': {
        page: LandingPage,
    },
    // 'auth/signup': {
    //     page: 
    // }
    // 404: {
    //     page: ErrorPage,
    // }
}
