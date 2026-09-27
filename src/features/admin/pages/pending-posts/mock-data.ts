import type { Post } from "../../components/posts/postTypes.ts";

export const mockPosts: Post[] = [
	{
		id: 2,
		title: "docker containers are basically just chroot with marketing",
		content:
			"Everyone acts like Docker is revolutionary but it's literally just chroot on steroids. The real innovation is the ecosystem and tooling, not the technology itself.",
		firstName: "Jane",
		lastName: "Smith",
		departmentName: "DCISM",
		postTag: "Software Engineering",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
		upvoteCount: 15,
		downvoteCount: 8,
	},
	{
		id: 6,
		title: "How I built a real-time chat app with WebSockets",
		content:
			"Step by step guide to building a real-time chat application using Node.js and WebSockets. Includes handling reconnections, message queuing, and room management.",
		firstName: "Maria",
		lastName: "Santos",
		departmentName: "DCISM",
		postTag: "Web Development",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
		upvoteCount: 7,
		downvoteCount: 1,
		hasGithub: true,
	},
	{
		id: 8,
		title: "Linux terminal commands cheat sheet for CS students",
		content:
			"A comprehensive cheat sheet covering file operations, process management, networking, and text processing commands you'll actually use in your courses.",
		firstName: "Lisa",
		lastName: "Tan",
		departmentName: "DCISM",
		postTag: "Operating Systems",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
		upvoteCount: 12,
		downvoteCount: 0,
	},
];
