import {NumberFormatter} from "@/utils/Format";
import cn from "@/utils/cn";
import {Progress} from "antd";
import {twMerge} from "tailwind-merge";
import {formatDate} from "@/utils/Format/formatDate.ts";

interface props {
	img: string | undefined
	name: string | undefined,
	amount: string | number | undefined
	start?: Date | undefined
	end?: Date | undefined
	percent: number | undefined
	isOver: boolean
	showDate?: boolean
	spentOver: number | undefined
	totalLeft: number | undefined
	className?: string
}

const CardCategory: React.FC<props> = ({name, className, spentOver, totalLeft, showDate, isOver, start, percent, end, amount, img}) => {

	return <>
		<div className={twMerge(`mt-4 w-2/4 border-bodydark2 shadow-3 p-4`, className)}>
			{showDate && <div className={`pb-2 mb-4 border-b-bodydark2 border-b`}>
				{formatDate(start)?.toString()}-{formatDate(end)?.toString()}
            </div>}
			<div className={`items-center flex gap-8`}>
				<div className={`flex items-center gap-4 pr-2 border-r border-r-bodydark2`}>
					<img src={img} alt="" className={`w-12 h-12 rounded-full `}/>
				</div>
				<div className={`w-full`}>
					<div className={`flex-between`}>
						<span>{name}</span>
						<p><NumberFormatter number={amount}/></p>
					</div>
					<p className={cn(`text-right text-red-700 text-xs`, {"text-body": !isOver})}>
						{isOver ? <span>Overspent <NumberFormatter number={spentOver}/></span> :
							<span>Left <NumberFormatter number={totalLeft}/></span>}
					</p>
					<Progress percent={percent} size="small" format={() => <><span></span></>}/>
				</div>
			</div>
		</div>
	</>
}


export default CardCategory