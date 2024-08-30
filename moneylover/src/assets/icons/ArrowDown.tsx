import {IconProps} from "@/model/interface.ts";

const ArrowDown: React.FC<IconProps> = ({height = 20, width = 20, color = "#000000"}) => {
	return <>
		<svg fill={color} width={width} height={height} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M0.256 8.606c0-0.269 0.106-0.544 0.313-0.75 0.412-0.412 1.087-0.412 1.5 0l14.119 14.119 13.913-13.912c0.413-0.412 1.087-0.412 1.5 0s0.413 1.088 0 1.5l-14.663 14.669c-0.413 0.413-1.088 0.413-1.5 0l-14.869-14.869c-0.213-0.213-0.313-0.481-0.313-0.756z"></path>
		</svg>
	</>
}

export default ArrowDown
