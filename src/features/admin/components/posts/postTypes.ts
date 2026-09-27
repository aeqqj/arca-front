export interface Post {
	id: number;
	title: string;
	content: string;
	firstName: string;
	lastName: string;
	departmentName: string;
	postTag: string;
	status: string;
	createdAt: string;
	upvoteCount: number;
	downvoteCount: number;
	hasGithub?: boolean;
	hasLink?: boolean;
	attachmentCount?: number;
}
