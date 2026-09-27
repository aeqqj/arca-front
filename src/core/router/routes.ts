import { SignInPage } from "../../features/auth/signin-page.ts";
import { SignUpPage } from "../../features/auth/signup-page.ts";
import { HomePage } from "../../features/home/home-page.ts";
import { ProfilePage } from "../../features/profile/profile-page.ts";
import { CreatePostPage } from "../../features/create-post/create-post-page.ts";
import { PostPage } from "../../features/post/post-page.ts";
import { SearchPage } from "../../features/search/search-page.ts";
import { AdminPage } from "../../features/admin/pages/dashboard/admin-page.ts";
import { AdminUsersPage } from "../../features/admin/pages/users/admin-users-page.ts";
import { AdminPostsPage } from "../../features/admin/pages/posts/admin-posts-page.ts";
import { AdminPendingPostsPage } from "../../features/admin/pages/pending-posts/admin-pending-posts-page.ts";
import { AdminCoursesPage } from "../../features/admin/pages/courses/admin-courses-page.ts";

export const routes: Record<string, { page: () => void }> = {
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
	"/post-page": {
		page: PostPage,
	},
	"/search": {
		page: SearchPage,
	},
	"/admin": {
		page: AdminPage,
	},
	"/admin/users": {
		page: AdminUsersPage,
	},
	"/admin/posts": {
		page: AdminPostsPage,
	},
	"/admin/pending-posts": {
		page: AdminPendingPostsPage,
	},
	"/admin/courses": {
		page: AdminCoursesPage,
	},
	// 404: {
	//     page: ErrorPage,
	// }
};
