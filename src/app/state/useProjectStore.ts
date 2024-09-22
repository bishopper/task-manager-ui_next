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
	updateProject: (
		id: number,
		updatedProject: Partial<Project>
	) => Promise<void>;
	updateTask: (taskId: number, updatedTask: Partial<Task>) => Promise<void>;
	addTask: (newTask: Omit<Task, "id">) => Promise<void>;
	deleteTask: (taskId: number) => Promise<void>;
	addProject: (newProject: Omit<Project, "id" | "tasks">) => Promise<void>; // اضافه کردن این خط
}

export const useProjectStore = create<ProjectStore>((set) => ({
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

	updateProject: async (id: number, updatedProject: Partial<Project>) => {
		try {
			await axios.patch(
				`http://localhost:3000/projects/${id}`,
				updatedProject
			);
			set((state) => ({
				projects: state.projects.map((project) =>
					project.id === id
						? { ...project, ...updatedProject }
						: project
				),
			}));
		} catch (error) {
			console.error("Failed to update project:", error);
		}
	},

	updateTask: async (taskId: number, updatedTask: Partial<Task>) => {
		try {
			await axios.patch(
				`http://localhost:3000/tasks/${taskId}`,
				updatedTask
			);
			set((state: ProjectStore) => ({
				projects: state.projects.map((project: Project) => ({
					...project,
					tasks: project.tasks.map((task: Task) =>
						task.id === taskId ? { ...task, ...updatedTask } : task
					),
				})),
			}));
		} catch (error) {
			console.error("Failed to update task:", error);
		}
	},

	addTask: async (newTask: Omit<Task, "id">) => {
		try {
			const response = await axios.post(
				"http://localhost:3000/tasks",
				newTask
			);
			const createdTask = response.data;

			set((state: ProjectStore) => ({
				projects: state.projects.map((project: Project) =>
					project.id === newTask.projectId
						? { ...project, tasks: [...project.tasks, createdTask] }
						: project
				),
			}));
		} catch (error) {
			console.error("Failed to add task:", error);
		}
	},

	deleteTask: async (taskId: number) => {
		try {
			await axios.delete(`http://localhost:3000/tasks/${taskId}`);
			set((state: ProjectStore) => ({
				projects: state.projects.map((project: Project) => ({
					...project,
					tasks: project.tasks.filter(
						(task: Task) => task.id !== taskId
					),
				})),
			}));
		} catch (error) {
			console.error("Failed to delete task:", error);
		}
	},

	// اضافه کردن متد addProject
	addProject: async (newProject: Omit<Project, "id" | "tasks">) => {
		try {
			const response = await axios.post(
				"http://localhost:3000/projects",
				newProject
			);
			const createdProject = response.data;

			// افزودن پروژه جدید به لیست پروژه‌ها
			set((state: ProjectStore) => ({
				projects: [...state.projects, { ...createdProject, tasks: [] }],
			}));
		} catch (error) {
			console.error("Failed to add project:", error);
		}
	},
}));
