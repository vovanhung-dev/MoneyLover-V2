import {ResponseData} from "@/model/interface.ts";
import {get} from "@/libs/api.ts";
import {useQuery} from "@tanstack/react-query";
import {BudgetSimilar} from "../interface";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useEffect, useState} from "react";
import {mergeBudgetSimilar} from "@/modules/budget/function/handleBudget.ts";
import {useBudgetStore} from "@/modules/budget/store";

export const fetchBudgets = (key: any): Promise<ResponseData> => {
	return get({url: "budgets", params: {wallet: key.queryKey[1], type: key.queryKey[2]}})
}


interface props {
	budgets: BudgetSimilar[]
}

const useBudget = (walletId: string | undefined): props => {
	const {addBudget} = useBudgetStore()
	const [budget1s, setBudget1s] = useState<BudgetSimilar[]>([])
	const {data} = useQuery({
		queryKey: [nameQueryKey.budgets, walletId], queryFn: fetchBudgets,
		enabled: !!walletId
	})

	useEffect(() => {
		const budgets = data?.data || []
		const budgetsSimilar = mergeBudgetSimilar(budgets)
		addBudget(budgetsSimilar[0])
		setBudget1s(budgetsSimilar)
	}, [data]);
	return {
		budgets: budget1s || []
	}
}

export default useBudget