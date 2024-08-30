import {IconProps} from "@/model/interface.ts";
import cn from "@/utils/cn";

const checkIcon: React.FC<IconProps> = ({className, width = 24, height = 24, color = "#ffffff"}) => {
	return (
		<div className={cn(className)}>
			<svg
				width={width}
				height={height}
				viewBox="0 0 32 32"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="checkmark">
					<line
						x1="3"
						x2="12"
						y1="16"
						y2="25"
						stroke={color}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="4"
					/>
					<line
						x1="12"
						x2="29"
						y1="25"
						y2="7"
						stroke={color}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="4"
					/>
				</g>
			</svg>
		</div>
	);
}

export default checkIcon
