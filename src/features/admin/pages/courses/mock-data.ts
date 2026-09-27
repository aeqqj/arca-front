import type { Course } from "../../components/tables/coursesTable.ts";
import type { DropdownOption } from "../../components/controls/dropdown.ts";

export const mockCourses: Course[] = [
	{
		id: 1,
		name: "BS Computer Science",
		code: "CS",
		department: "DCISM",
		created: "Sep 1, 2026",
	},
	{
		id: 2,
		name: "BS Information Technology",
		code: "IT",
		department: "DCISM",
		created: "Sep 1, 2026",
	},
	{
		id: 3,
		name: "BS Information Management",
		code: "IM",
		department: "DCISM",
		created: "Sep 2, 2026",
	},
	{
		id: 4,
		name: "BS Data Science",
		code: "DS",
		department: "DCISM",
		created: "Sep 3, 2026",
	},
	{
		id: 5,
		name: "BS Software Engineering",
		code: "SE",
		department: "DCISM",
		created: "Sep 5, 2026",
	},
	{
		id: 6,
		name: "BS Cyber Security",
		code: "CSec",
		department: "DCISM",
		created: "Sep 7, 2026",
	},
	{
		id: 7,
		name: "BS Computer Engineering",
		code: "CE",
		department: "DCISM",
		created: "Sep 8, 2026",
	},
	{
		id: 8,
		name: "BS Multimedia Arts",
		code: "MMA",
		department: "DCISM",
		created: "Sep 10, 2026",
	},
	{
		id: 9,
		name: "BS Entertainment and Multimedia Computing",
		code: "EMC",
		department: "DCISM",
		created: "Sep 12, 2026",
	},
	{
		id: 10,
		name: "BS Web Development",
		code: "WD",
		department: "DCISM",
		created: "Sep 15, 2026",
	},
	{
		id: 11,
		name: "BS Network Engineering",
		code: "NE",
		department: "DCISM",
		created: "Sep 15, 2026",
	},
	{
		id: 12,
		name: "BS Artificial Intelligence",
		code: "AI",
		department: "DCISM",
		created: "Sep 18, 2026",
	},
];

export const departmentOptions: DropdownOption[] = [
	{ value: "DCISM", label: "DCISM" },
];
