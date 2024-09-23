"use client";

import { useProjectStore } from "@/app/state/useProjectStore";
import { useEffect, useState } from "react";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";

const ProjectList = () => {
	const {
		projects,
		fetchProjects,
		updateProject,
		updateTask,
		addTask,
		deleteTask,
		addProject,
	} = useProjectStore();

	const [editingProject, setEditingProject] = useState<number | null>(null);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [newProjectName, setNewProjectName] = useState("");
	const [newProjectDescription, setNewProjectDescription] = useState("");
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");
	const [editingTask, setEditingTask] = useState<number | null>(null);
	const [taskData, setTaskData] = useState<{
		[key: number]: { title: string; description: string; status: string };
	}>({});

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	const handleEditProjectClick = (project: any) => {
		setEditingProject(project.id);
		setProjectName(project.name);
		setProjectDescription(project.description || "");
	};

	const handleSaveProject = (projectId: number) => {
		updateProject(projectId, {
			name: projectName,
			description: projectDescription,
		});
		setEditingProject(null);
	};

	const handleEditTaskClick = (task: any) => {
		setEditingTask(task.id);
		setTaskData((prev) => ({
			...prev,
			[task.id]: {
				title: task.title,
				description: task.description || "",
				status: task.status,
			},
		}));
	};

	const handleSaveTask = (taskId: number) => {
		const { title, description, status } = taskData[taskId];
		updateTask(taskId, { title, description, status });
		setEditingTask(null);
	};

	const handleTaskChange = (taskId: number, key: string, value: string) => {
		setTaskData((prev) => ({
			...prev,
			[taskId]: {
				...prev[taskId],
				[key]: value,
			},
		}));
	};

	const handleAddTask = (projectId: number) => {
		if (newTaskTitle.trim() === "") return;
		addTask({
			title: newTaskTitle,
			description: newTaskDescription,
			status: "Incompleted",
			projectId,
		});
		setNewTaskTitle("");
		setNewTaskDescription("");
	};

	const handleDeleteTask = (taskId: number) => {
		deleteTask(taskId);
	};

	const handleAddProject = () => {
		if (newProjectName.trim() === "") return;
		addProject({
			name: newProjectName,
			description: newProjectDescription,
		});
		setNewProjectName("");
		setNewProjectDescription("");
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4 text-center">
				Projects and Tasks
			</h1>

			<div className="bg-white shadow-lg rounded-lg p-6 mb-6">
				<h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
				<input
					type="text"
					value={newProjectName}
					onChange={(e) => setNewProjectName(e.target.value)}
					placeholder="Project Name"
					className="border rounded px-2 py-1 mb-2 w-full"
				/>
				<textarea
					value={newProjectDescription}
					onChange={(e) => setNewProjectDescription(e.target.value)}
					placeholder="Project Description"
					className="border rounded px-2 py-1 mb-2 w-full"
				/>
				<button
					onClick={handleAddProject}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Add Project
				</button>
			</div>

			{projects.length === 0 ? (
				<p className="text-center">No projects found.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{projects.map((project) => {
						const completedTasks = project.tasks.filter(
							(task) => task.status === "Completed"
						).length;
						const totalTasks = project.tasks.length;
						const progress = totalTasks
							? (completedTasks / totalTasks) * 100
							: 0;

						return (
							<div
								key={project.id}
								className="bg-white shadow-lg rounded-lg p-6"
							>
								{editingProject === project.id ? (
									<div>
										<input
											type="text"
											value={projectName}
											onChange={(e) =>
												setProjectName(e.target.value)
											}
											className="border rounded px-2 py-1 mb-2 w-full"
										/>
										<textarea
											value={projectDescription}
											onChange={(e) =>
												setProjectDescription(
													e.target.value
												)
											}
											className="border rounded px-2 py-1 mb-2 w-full"
										/>
										<button
											onClick={() =>
												handleSaveProject(project.id)
											}
											className="bg-blue-500 text-white px-4 py-2 rounded"
										>
											Save
										</button>
									</div>
								) : (
									<div>
										<h2 className="text-2xl font-semibold mb-2">
											{project.name}
											<button
												onClick={() =>
													handleEditProjectClick(
														project
													)
												}
												className="ml-2 text-blue-500"
											>
												✏️
											</button>
										</h2>
										{project.description && (
											<p className="text-gray-600 mb-4">
												{project.description}
											</p>
										)}
									</div>
								)}

								<ProgressBar completed={progress} />

								<div className="mt-4">
									<h3 className="text-xl font-semibold mb-2">
										Tasks:
									</h3>
									{project.tasks.length > 0 ? (
										<ul className="list-disc pl-5">
											{project.tasks.map((task) => (
												<li
													key={task.id}
													className="mb-2"
												>
													{editingTask === task.id ? (
														<div>
															<input
																type="text"
																value={
																	taskData[
																		task.id
																	]?.title ||
																	""
																}
																onChange={(e) =>
																	handleTaskChange(
																		task.id,
																		"title",
																		e.target
																			.value
																	)
																}
																className="border rounded px-2 py-1 mb-2 w-full"
															/>
															<textarea
																value={
																	taskData[
																		task.id
																	]
																		?.description ||
																	""
																}
																onChange={(e) =>
																	handleTaskChange(
																		task.id,
																		"description",
																		e.target
																			.value
																	)
																}
																className="border rounded px-2 py-1 mb-2 w-full"
															/>
															<select
																value={
																	taskData[
																		task.id
																	]?.status ||
																	"Incompleted"
																}
																onChange={(e) =>
																	handleTaskChange(
																		task.id,
																		"status",
																		e.target
																			.value
																	)
																}
																className="border rounded px-2 py-1 mb-2 w-full"
															>
																<option value="InProccess">
																	In Proccess
																</option>
																<option value="Completed">
																	Completed
																</option>
																<option value="Incompleted">
																	Incompleted
																</option>
															</select>
															<button
																onClick={() =>
																	handleSaveTask(
																		task.id
																	)
																}
																className="bg-green-500 text-white px-4 py-2 rounded"
															>
																Save
															</button>
														</div>
													) : (
														<div>
															<span className="font-bold">
																{task.title}
															</span>{" "}
															-{" "}
															<span
																className={`px-2 py-1 rounded ${
																	task.status ===
																	"Completed"
																		? "bg-green-500 text-white"
																		: task.status ===
																		  "Incompleted"
																		? "bg-red-500 text-white"
																		: "bg-yellow-300"
																}`}
															>
																{task.status}
															</span>
															<button
																onClick={() =>
																	handleEditTaskClick(
																		task
																	)
																}
																className="ml-2 text-blue-500"
															>
																✏️
															</button>
															<button
																onClick={() =>
																	handleDeleteTask(
																		task.id
																	)
																}
																className="ml-2 text-red-500"
															>
																🗑️
															</button>
															{task.description && (
																<p className="text-gray-500 ml-4">
																	{
																		task.description
																	}
																</p>
															)}
														</div>
													)}
												</li>
											))}
										</ul>
									) : (
										<p>No tasks found for this project.</p>
									)}

									<div className="mt-4">
										<h3 className="text-lg font-semibold mb-2">
											Add New Task:
										</h3>
										<input
											type="text"
											value={newTaskTitle}
											onChange={(e) =>
												setNewTaskTitle(e.target.value)
											}
											placeholder="Task title"
											className="border rounded px-2 py-1 mb-2 w-full"
										/>
										<textarea
											value={newTaskDescription}
											onChange={(e) =>
												setNewTaskDescription(
													e.target.value
												)
											}
											placeholder="Task description"
											className="border rounded px-2 py-1 mb-2 w-full"
										/>
										<button
											onClick={() =>
												handleAddTask(project.id)
											}
											className="bg-green-500 text-white px-4 py-2 rounded"
										>
											Add Task
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ProjectList;
