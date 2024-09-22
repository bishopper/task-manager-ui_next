"use client";

import { useProjectStore } from "@/app/state/useProjectStore";
import { useEffect } from "react";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";

const ProjectList = () => {
	const { projects, fetchProjects } = useProjectStore();

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4 text-center">
				Projects and Tasks
			</h1>
			{projects.length === 0 ? (
				<p className="text-center">No projects found.</p>
			) : (
				projects.map((project) => {
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
							className="bg-white shadow-lg rounded-lg p-6 mb-6"
						>
							<h2 className="text-2xl font-semibold mb-2">
								{project.name}
							</h2>
							{project.description && (
								<p className="text-gray-600 mb-4">
									{project.description}
								</p>
							)}
							<ProgressBar completed={progress} />
							<div className="mt-4">
								<h3 className="text-xl font-semibold mb-2">
									Tasks:
								</h3>
								{project.tasks.length > 0 ? (
									<ul className="list-disc pl-5">
										{project.tasks.map((task) => (
											<li key={task.id} className="mb-2">
												<span className="font-bold">
													{task.title}
												</span>{" "}
												-{" "}
												<span
													className={`px-2 py-1 rounded ${
														task.status ===
														"Completed"
															? "bg-green-500 text-white"
															: "bg-yellow-300"
													}`}
												>
													{task.status}
												</span>
												{task.description && (
													<p className="text-gray-500 ml-4">
														{task.description}
													</p>
												)}
											</li>
										))}
									</ul>
								) : (
									<p>No tasks found for this project.</p>
								)}
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default ProjectList;
