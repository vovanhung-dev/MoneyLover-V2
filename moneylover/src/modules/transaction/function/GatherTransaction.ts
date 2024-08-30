import {debt_loan_type, transactionResponse} from "@/model/interface.ts";
import dayjs from "dayjs";


enum typeCategory {
	Expense = "Expense",
	Income = "Income"
}

const GatherTransaction = (trans: transactionResponse[]) => {
	return trans?.reduce((result, obj) => {
		const existInObj = result.find(item => item?.date === obj.date)
		const isPlusAmount = obj?.category?.categoryType === typeCategory.Income || obj?.category?.debt_loan_type === debt_loan_type.debt
		const isDivideAmount = obj?.category?.categoryType === typeCategory.Expense || obj?.category?.debt_loan_type === debt_loan_type.loan
		if (existInObj) {
			if (isDivideAmount) {
				existInObj.amount -= obj?.amount;
			} else if (isPlusAmount) {
				existInObj.amount += obj?.amount;
			}
		} else {
			if (isDivideAmount) {
				result.push({...obj, amount: -obj?.amount})
			} else if (isPlusAmount) {
				result.push({...obj})
			}
		}
		return result.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? -1 : 1);
	}, [] as transactionResponse[])
}

export default GatherTransaction