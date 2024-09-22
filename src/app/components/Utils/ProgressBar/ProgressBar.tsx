// src/components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
	completed: number; // درصد تکمیل
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed }) => {
	const getColor = () => {
		if (completed < 50) return "bg-red-500";
		if (completed < 100) return "bg-yellow-500";
		return "bg-green-500";
	};

	return (
		<div className="w-full bg-gray-300 rounded-full h-4">
			<div
				className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
				style={{ width: `${completed}%` }}
			/>
		</div>
	);
};

export default ProgressBar;
