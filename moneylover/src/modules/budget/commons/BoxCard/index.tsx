import {twMerge} from "tailwind-merge";
import {NumberFormatter} from "@/utils/Format";
import {useMemo} from "react";

interface props {
	bottomText: string
	topText?: number | string | undefined
	className?: string
	isDay?: boolean
	endDate?: string | undefined
}

const BoxBottomProcess = ({bottomText, topText, className, isDay, endDate}: props) => {
	const leftDate = useMemo(() => {
		if (endDate) {
			const today = new Date()
			const end = new Date(endDate)
			const oneDay = 24 * 60 * 60 * 1000;

			// @ts-ignore
			return Math.round((end - today) / oneDay);
		}
	}, [endDate])
	return (<div className={twMerge(`text-center px-4 my-1 border-r border-r-bodydark2`, className)}>
		<p className={`text-black-2 text-lg`}>
			{!isDay ? <NumberFormatter number={topText}/> : <>{leftDate} Days</>}
		</p>
		<span className={`text-bodydark2 text-sm text-nowrap`}>{bottomText}</span>
	</div>)
}

export default BoxBottomProcess