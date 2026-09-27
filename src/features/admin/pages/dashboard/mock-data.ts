export const mockTags = [
	{ tag: "Algorithms and Complexities", count: 12 },
	{ tag: "Web Development", count: 8 },
	{ tag: "Data Structures and Algorithms", count: 6 },
	{ tag: "Operating Systems", count: 4 },
	{ tag: "Software Engineering", count: 3 },
];

export const recentActivities = [
	{
		icon: "file-text",
		text: '<span>John Doe</span> posted <span class="text-fg-link">"B-trees in Go vs C"</span>',
		time: "2h ago",
	},
	{
		icon: "user-plus",
		text: "<span>Jane Smith</span> joined the platform",
		time: "3h ago",
	},
	{
		icon: "check",
		text: '<span -fg1">Admin</span> approved a post by <span class="text-fg1">Mike Chen</span>',
		time: "5h ago",
	},
	{
		icon: "x",
		text: '<span class="text-fg1">Admin</span> rejected a post by <span class="text-fg1">Anna Reyes</span>',
		time: "1d ago",
	},
	{
		icon: "file-text",
		text: '<span class="text-fg1">Carlos Garcia</span> posted <span class="text-fg-link">"React vs vanilla JS"</span>',
		time: "3d ago",
	},
];

export function getMockPendingPosts() {
	return [
		{
			id: 101,
			title: "google made btrees in golang instead of c and so should you go is good its better than everything",
			firstName: "John",
			lastName: "Doe",
			departmentName: "DCISM",
			postTag: "Algorithms and Complexities",
			createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
		},
		{
			id: 102,
			title: "docker containers are basically just chroot with marketing and everyone acts like its revolutionary",
			firstName: "Jane",
			lastName: "Smith",
			departmentName: "DCISM",
			postTag: "Software Engineering",
			createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
		},
		{
			id: 103,
			title: "arcawerawer waerwarware taewrwaerwar eoirwaorejaorejojwajre  aeworjwaoiejrowaerwiraejr ypescript is just javascript wearing a suit and it still lies to you at runtime sometimes anyway, so do this instead retards",
			firstName: "Mike",
			lastName: "Chen",
			departmentName: "DCISM",
			postTag: "Operating Systems",
			createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
		},
		{
			id: 104,
			title: "SQL query optimization",
			firstName: "Anna",
			lastName: "Reyes",
			departmentName: "DCISM",
			postTag: "Data Structures and Algorithms",
			createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
		},
		{
			id: 105,
			title: "React vs vanilla JS",
			firstName: "Carlos",
			lastName: "Garcia",
			departmentName: "DCISM",
			postTag: "Web Development",
			createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
		},
	];
}
