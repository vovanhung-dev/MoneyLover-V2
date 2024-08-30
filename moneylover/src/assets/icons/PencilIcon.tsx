import {IconProps} from "@/model/interface.ts";

const pencilIcon: React.FC<IconProps> = ({className, func, width = 25, height = 25, color = "#000000"}) => {
	return (
		<div className={className} onClick={func}>
			<svg fill={color} width={width}
				 height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M20.7,5.2a1.024,1.024,0,0,1,0,1.448L18.074,9.276l-3.35-3.35L17.35,3.3a1.024,1.024,0,0,1,1.448,0Zm-4.166,5.614-3.35-3.35L4.675,15.975,3,21l5.025-1.675Z"/>
			</svg>
		</div>
	)
}

export default pencilIcon
