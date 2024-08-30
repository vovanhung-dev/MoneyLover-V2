import cn from "@/utils/cn";
import React, {ReactNode} from "react";

interface Props {
	showCollapse: () => void;
	clickCollapse: boolean;
	children: ReactNode;
	label: string
}

const CollapseInforChat: React.FC<Props> = ({label, showCollapse, children, clickCollapse}) => {
	return (
		<div className="w-full">
			<div
				onClick={showCollapse}
				className="rounded-lg px-2 py-4 font-bold cursor-pointer hover:bg-gray-300"
			>
				{label}
			</div>
			<div
				className={cn(
					`max-h-0 duration-300 overflow-y-hidden ease-in-out flex-col gap-1`,
					{"max-h-[9999px] overflow-y-scroll": clickCollapse}
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default CollapseInforChat;
