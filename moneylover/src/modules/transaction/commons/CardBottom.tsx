import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import React, {useEffect, useState} from "react";
import {debt_loan_type, transactionResponse} from "@/model/interface.ts";
import {parseFullForm} from "@/utils/day.ts";
import {limitNumber} from "@/utils";
import {Card} from "antd";
import CreatorName from "@/modules/transaction/commons/creatorName.tsx";

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
	const [limitGridCol, setLimitGridCol] = useState<number>(1)
	useEffect(() => {
		setLimitGridCol(limitNumber(trans.length, 1, 2))
	}, [trans]);
	return <>
		<div
			className={cn(`grid grid-cols-${limitGridCol} lg:max-w-[700px] w-full mx-auto gap-6 my-3 max-h-0 transition-all duration-300 overflow-y-hidden ease-in-out shadow-default px-4 `,
				{"max-h-[9999px] overflow-y-scroll": isSelect})}>
			{trans?.map((el, i) => {
				const isExpense = el?.category?.categoryType === typeCategory.Expense || el?.category.debt_loan_type === debt_loan_type.loan
				return <div key={i} onClick={() => {
					openDetail(el)
				}}>
					<Card className={cn(`my-2 py-6 h-auto md:py-8 relative shadow-3`, {"w-2/4 mx-auto": limitGridCol === 1})}>
						<div className={`flex-between`}>
							<div className={`flex gap-4 items-center`}>
								<img src={el.category.categoryIcon} alt="" className={`w-10 h-10 rounded-full`}/>
								<div>
									<p className={`text-lg font-bold line-clamp-1`}>
										{el.category.name}
										<div className={`absolute top-1 z-1 left-3`}><CreatorName userCreator={el.user}/></div>
									</p>
									<p className={`text-xs text-bodydark2 line-clamp-2`}>{el?.notes || ""}</p>
									{isRecurring && <span className={`text-xs text-bodydark2 mt-4`}>next {parseFullForm(el?.date).toString()}</span>}
									<span
										className={`text-xs absolute z-1 bottom-2 left-4 text-bodydark2`}>{el.exclude ? "This transaction is exclude from report" : ""}</span>
								</div>
							</div>
							<div className={cn(`text-blue-500 text-sm`, {"text-red-700": isExpense})}>
								{isExpense ? "-" : "+"}<NumberFormatter number={el?.amount}/>
							</div>
						</div>
					</Card>

				</div>
			})}
		</div>

	</>
}

export default CardBottom