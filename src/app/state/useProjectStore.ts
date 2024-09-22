import axios from "axios";
import { create } from "zustand";

interface Task {
	id: number;
	title: string;
	description?: string;
	status: string;
	projectId: number;
}

interface Project {
	id: number;
	name: string;
	description?: string;
	tasks: Task[];
}

interface ProjectStore {
	projects: Project[];
	fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set: any) => ({
	projects: [],

	fetchProjects: async () => {
		try {
			const projectsResponse = await axios.get(
				"http://localhost:3000/projects"
			);
			const tasksResponse = await axios.get(
				"http://localhost:3000/tasks"
			);

			const projects = projectsResponse.data.map((project: Project) => ({
				...project,
				tasks: tasksResponse.data.filter(
					(task: Task) => task.projectId === project.id
				),
			}));

			set({ projects });
		} catch (error) {
			console.error("Failed to fetch projects or tasks:", error);
		}
	},
}));
