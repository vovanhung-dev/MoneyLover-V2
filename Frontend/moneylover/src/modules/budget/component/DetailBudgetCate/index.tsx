import {Button, Progress} from "antd";
import {Category} from "@/model/interface.ts";
import {NumberFormatter} from "@/utils/Format";
import {BudgetSimilar} from "@/modules/budget/interface";
import {formatDate} from "@/utils/Format/formatDate.ts";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import cn from "@/utils/cn";

interface props {
	price: string | number | undefined,
	percent: number | undefined
	category: Category | undefined
	budgetCurrent: BudgetSimilar | undefined
	totalLeft: number | undefined
	isOver: boolean | undefined
	deleteBudget: (id: string | undefined) => void
	id: string | undefined
}

const DetailBudgetCate: React.FC<props> = ({price, id, isOver, deleteBudget, budgetCurrent, totalLeft, percent, category}) => {
	const [dayLeft, setDayLeft] = useState<string | number>("")
	useEffect(() => {
		let diff = dayjs().diff(dayjs(budgetCurrent?.period_end), 'day')
		if (diff < 0) {
			diff = (diff * -1) + 1
			setDayLeft(diff)
		} else {
			setDayLeft(++diff)
		}
	}, [budgetCurrent]);
	return <>
		<div className={`grid grid-cols-12 p-8 `}>
			<div className={`col-span-2 flex flex-col`}>
				<img src={category?.categoryIcon} alt="" className={`w-10 h-10 rounded-full`}/>
			</div>
			<div className={`col-span-10 relative`}>
				<span className={`text-2xl flex-start`}>{category?.name}</span>
				<span className={`text-xl my-2 flex-start`}><NumberFormatter number={price || 0}/></span>
				<div className={`relative`}>
						<span className={`absolute top-0 left-0`}>
							<p className={`text-bodydark2`}>Spent</p>
							<p>{<NumberFormatter number={price || 0}/>}</p>
						</span>
					<span className={`absolute top-0 right-0`}>
							<p className={cn(`text-bodydark2`, {"text-red-700": isOver})}>{!isOver ? "Left" : "OverSpent"}</p>
							<p className={cn(``, {"text-red-700": isOver})}>{<NumberFormatter number={totalLeft || 0}/>}</p>
						</span>
					<Progress percent={percent} size="small" className={`mt-10 mb-2`} format={() => <><span></span></>}/>
				</div>
				<div className={`mt-4`}>
					<span
						className={`text-nowrap flex-start`}>{formatDate(budgetCurrent?.period_start)}-{formatDate(budgetCurrent?.period_end)}</span>
					<p className={`text-xs flex-start`}>{dayLeft} days left</p>
				</div>
			</div>
		</div>
		<Button className={`flex-center mx-auto mt-10 text-red-600 border-inherit `}
				onClick={() => deleteBudget(id)}>Delete
			budget</Button>
	</>
}

export default DetailBudgetCate
