import {useBudgetStore} from "@/modules/budget/store";
import useDataTransaction from "@/modules/transaction/function";
import {useWalletStore} from "@/zustand/budget.ts";
import {useCallback, useMemo} from "react";
import {BudgetResponse, BudgetSimilar} from "@/modules/budget/interface";
import {filter} from "@/modules/transaction/model";
import {transactionResponse, typeCategory} from "@/model/interface.ts";


export const PercentAndTotalAmountTran = (budget?: BudgetSimilar | BudgetResponse) => {
	const {budgetSelect} = useBudgetStore()
	const {walletSelect} = useWalletStore()

	const categories = useMemo(() => {
		if (!budgetSelect?.category) return ""; // Return an empty string if category is not defined or null

		const categoryIds = budgetSelect.category.map(el => el.id);

		return categoryIds.join(",");
	}, [budgetSelect]);

	const filter: filter = {
		category: categories,
		start: budget ? budget?.period_start?.toString() : budgetSelect?.period_start?.toString(),
		end: budget ? budget?.period_end?.toString() : budgetSelect?.period_end?.toString(),
		wallet: walletSelect?.id
	}

	const {transactionData} = useDataTransaction(filter)

	const transactionSimilar = useCallback(() => {
		return transactionData.reduce((result, obj) => {
			const existInObj = result?.find((e) => e.category.id === obj.category.id)
			if (existInObj) {
				if (obj?.category?.categoryType === typeCategory.Expense) {
					existInObj.amount += obj?.amount;
				} else {
					existInObj.amount += obj?.amount;
				}
			} else {
				if (obj?.category?.categoryType === typeCategory.Expense) {
					result.push({...obj, amount: obj?.amount})
				} else {
					result.push({...obj})
				}
			}
			return result
		}, [] as transactionResponse[])
	}, [transactionData]);

	const totalTransactionAmount = useCallback(() => {
		return transactionData.reduce((curr, total) => curr + total.amount, 0);
	}, [transactionData]);

	const percentSpent = useCallback(() => {
		// @ts-ignore
		return totalTransactionAmount() / budgetSelect?.amount * 100
	}, [budgetSelect, totalTransactionAmount]);

	return {totalTranAmount: totalTransactionAmount, percentSpent, transactionSimilar: transactionSimilar()}

}