import {BudgetSimilar} from "../interface";
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

interface props {
	budgetSelect: BudgetSimilar | undefined
	addBudget: (budget: BudgetSimilar) => void
}

export const useBudgetStore = create<props>()(
	devtools(
		persist(
			(set) => ({
				budgetSelect: undefined,
				addBudget: (wallet) => set(() => ({budgetSelect: wallet})),
			}),
			{
				name: 'budget',
			},
		),
	),
)