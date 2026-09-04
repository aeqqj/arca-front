import { SignInPage } from "../../features/auth/signin-page.ts";
import { SignUpPage } from "../../features/auth/signup-page.ts";
import { HomePage } from "../../features/home/home-page.ts";
import { ProfilePage } from "../../features/profile/profile-page.ts";
import { CreatePostPage } from "../../features/create-post/create-post-page.ts";
import { PostPage } from "../../features/post/post-page.ts";

export const routes: Record<string, { page: () => void | Promise<void> }> = {
	"/": {
		page: HomePage,
	},
	"/profile": {
		page: ProfilePage,
	},
	"/auth/signin": {
		page: SignInPage,
	},
	"/auth/signup": {
		page: SignUpPage,
	},
	"/create-post": {
		page: CreatePostPage,
	},
	"/post": {
		page: PostPage,
	},
};

// Routes reachable without an access token.
export const publicRoutes = new Set(["/auth/signin", "/auth/signup"]);
