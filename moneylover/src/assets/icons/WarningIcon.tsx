import {IconProps} from "@/model/interface.ts";

const WaringIcon: React.FC<IconProps> = ({width = 25, height = 25, color = "#d1ec04"}) => {
	return <>
		<svg width={width} height={height} viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"
			 transform="matrix(-1, 0, 0, 1, 0, 0)">

			<g id="SVGRepo_bgCarrier" strokeWidth="0"/>

			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

			<g id="SVGRepo_iconCarrier">
				<path opacity="0.15"
					  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					  fill={color}/>
				<path
					d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke={color} strokeWidth="2.064" strokeLinecap="round" strokeLinejoin="round"/>
			</g>

		</svg>
	</>
}

export default WaringIcon
