import {IconProps} from "@/model/interface.ts";

const CancelIcon: React.FC<IconProps> = ({className, func, height = 25, width = 25, color = "#000000"}) => {
	return <>
		<div className={className} onClick={func}>
			<svg width={width} height={height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">

				<defs>

					<style>{`.cls-1{fill:none;stroke:${color};stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}`}</style>

				</defs>

				<title/>

				<g id="cross">

					<line className="cls-1" x1="7" x2="25" y1="7" y2="25"/>

					<line className="cls-1" x1="7" x2="25" y1="25" y2="7"/>

				</g>

			</svg>
		</div>
	</>
}

export default CancelIcon
