import {IconProps} from "@/model/interface.ts";

const InformationIcon: React.FC<IconProps> = ({func, className, width = 25, height = 25, color = "#000000"}) => {
	return <div onClick={func} className={className}>
		<svg fill={color} width={width} height={height} viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg">
			<path
				d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zM9.64 5.78a1.136 1.136 0 1 0-1.136 1.135A1.136 1.136 0 0 0 9.64 5.781zm-.344 2.884a.792.792 0 1 0-1.583 0v5.203a.792.792 0 0 0 1.583 0z"/>
		</svg>
	</div>
}

export default InformationIcon
