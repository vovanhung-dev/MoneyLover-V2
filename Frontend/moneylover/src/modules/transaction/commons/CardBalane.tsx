import {NumberFormatter} from "@/utils/Format";


interface props {
	openBalance: number
	endBalance: number
}

const CardBalance = ({openBalance, endBalance}: props) => {
	return <>
		<p className={`flex-between`}>
			<span className={`text-sm text-bodydark2`}>Opening balance</span>
			<span><NumberFormatter number={openBalance}/></span>
		</p>
		<p className={`flex-between my-4`}>
			<span className={`text-sm text-bodydark2`}>Ending balance</span>
			<span><NumberFormatter number={endBalance}/></span>
		</p></>
}

export default CardBalance