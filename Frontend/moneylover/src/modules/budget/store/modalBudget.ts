import {create} from "zustand";

interface props {
	isShowBudgetDetail: boolean
	setIsShow: () => void
	cancelIsShow: () => void
}

export const budgetStoreDetail = create<props>((set) => ({
	isShowBudgetDetail: false,
	setIsShow: () => set(() => ({isShowBudgetDetail: true})),
	cancelIsShow: () => set(() => ({isShowBudgetDetail: false})),
}))

