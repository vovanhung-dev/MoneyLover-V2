import {IconProps} from "@/model/interface.ts";

const BarsIcon: React.FC<IconProps> = ({height = 25, width = 25, color = "#000000"}) => {
	return <>
		<svg fill={color} width={width} height={height} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<title>bars</title>
			<path
				d="M2 9.249h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0zM30 14.75h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM30 22.75h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>
		</svg>
	</>
}

export default BarsIcon
