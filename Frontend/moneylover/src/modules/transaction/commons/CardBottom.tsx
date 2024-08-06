import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import React from "react";
import {debt_loan_type, transactionResponse} from "@/model/interface.ts";
import {parseFullForm} from "@/utils/day.ts";

interface props {
	openDetail: (el: any) => void
	trans: transactionResponse[]
	isSelect: boolean
	isRecurring?: boolean
}

enum typeCategory {
	Expense = "Expense",
	Income = "Income",
	Deb = "Debt_Loan"
}

const CardBottom: React.FC<props> = ({trans, isRecurring, isSelect, openDetail}) => {
	return <>
		<div
			className={cn(`flex flex-col w-full gap-6 my-3 max-h-0 transition-all duration-300 overflow-y-hidden ease-in-out shadow-default px-4 `,
				{"max-h-[9999px] overflow-y-scroll": isSelect})}>
			{trans?.map((el, i) => {
				const isExpense = el?.category?.categoryType === typeCategory.Expense || el?.category.debt_loan_type === debt_loan_type.loan
				return <div key={i} onClick={() => {
					openDetail(el)
				}}>
					<div className={`flex-between  py-4 border-t-bodydark2 border-t cursor-pointer`}>
						<div className={`flex gap-4 items-center`}>
							<img src={el.category.categoryIcon} alt="" className={`w-10 h-10 rounded-full`}/>
							<div>
								<p>
									{el.category.name}
								</p>
								<p className={`text-xs text-bodydark2`}>{el?.notes}</p>
								{isRecurring && <span className={`text-xs text-bodydark2 mt-4`}>next {parseFullForm(el?.date).toString()}</span>}
								<span
									className={`text-xs text-bodydark2`}>{el.exclude ? "     This transaction is exclude from report" : ""}</span>
							</div>
						</div>
						<div className={cn(`text-black text-sm`, {"text-red-700": isExpense})}>
							<NumberFormatter number={el?.amount}/>
						</div>
					</div>

				</div>
			})}
		</div>

	</>
}

export default CardBottom