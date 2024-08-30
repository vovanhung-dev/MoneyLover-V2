import {IconProps} from "@/model/interface.ts";

const PrevIcon: React.FC<IconProps> = ({className, func, width = 25, height = 25, color = "#000000"}) => {
	return <div className={className} onClick={func}>
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5 12H19M5 12L11 6M5 12L11 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	</div>
}

export default PrevIcon
