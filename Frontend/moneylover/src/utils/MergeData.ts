import {transactionResponse, typeCategory} from "@/model/interface.ts";

export const mergeTransaction = (transactions: transactionResponse[]) => {
	return transactions?.reduce((el, obj) => {
		const existInObj = el.find(item => item?.category?.categoryType === obj.category?.categoryType && item.date === obj.date)
		if (existInObj) {
			if (obj?.category?.categoryType === typeCategory.Expense) {
				existInObj.amount += obj?.amount * -1;
			} else {
				existInObj.amount += obj?.amount;
			}
		} else {
			if (obj?.category?.categoryType === typeCategory.Expense) {
				el.push({...obj, amount: -obj?.amount})
			} else {
				el.push({...obj})
			}
		}
		return el
	}, [] as transactionResponse[])
}