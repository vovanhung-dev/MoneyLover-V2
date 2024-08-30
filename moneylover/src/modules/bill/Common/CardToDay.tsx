import {NumberFormatter} from "@/utils/Format";
import {formatDate} from "@/utils/Format/formatDate.ts";
import {Button} from "antd";
import {billResponse} from "@/modules/bill/model";

interface props {
	bills: billResponse
	nextBill?: number
	isPaid?: boolean
	dueDate?: boolean

}

const CardToDay = ({bills, nextBill, isPaid, dueDate}: props) => {
	return <>
		<div key={bills.id} className={`flex gap-10 shadow-3 p-4 mt-4`}>
			<img src={bills.category.categoryIcon} alt="" className={`w-12 h-12 rounded-full`}/>
			<div className={`flex gap-4 flex-col`}>
				<span className={`font-bold text-xl`}>{bills.category.name}</span>
				{isPaid ? <span className={`text-bodydark2 text-3xl uppercase rounded-lg shadow-3 py-2 px-4`}>Paid</span> :
					dueDate ? <div className={`text-sm text-bodydark2`}>overdue in {formatDate(bills?.due_date).toString()}</div> :
						<>
							<span className={`text-xs text-bodydark2`}>Next bill is {formatDate(bills.from_date).toString()}</span>
							<span className={`font-light text-lg`}>Due in {nextBill} days</span>
							<Button type={`primary`} className={`gap-1 flex`}><span>Pay</span> <NumberFormatter number={bills.amount}/></Button>
						</>}

			</div>
		</div>
	</>
}

export default CardToDay