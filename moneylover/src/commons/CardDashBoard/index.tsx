import React from "react";
import {Button} from "antd";
import {Link} from "react-router-dom";
import {NumberFormatter} from "@/utils/Format";

interface props {
	img: React.ReactElement,
	label: string
	total: number,
	amount: number
	link: string
}

const CardDashBoard: React.FC<props> = ({amount, total, img, label, link}) => {
	return <>
		<div className={` p-5 flex flex-col justify-around h-full`}>
			<div className={`flex justify-between items-center `}>
				<div className={` rounded-full`}>
					{img}
				</div>
				<Link to={link}><Button type="text" className={`text-bodydark2 hover:scale-105`}>Detail</Button></Link>
			</div>
			<div className={`flex flex-col justify-start`}>
				<p className={`text-xl font-bold`}>{label}</p>
				<p className={`text-bodydark2 py-2`}>Total : {total}</p>
				<p className={`text-xl text-body`}>Amount:<span
					className={` line-clamp-1`}> {<NumberFormatter number={amount}/>}</span></p>
			</div>

		</div>
	</>
}

export default CardDashBoard