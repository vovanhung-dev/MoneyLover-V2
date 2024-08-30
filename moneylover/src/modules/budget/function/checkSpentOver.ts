interface response {
	spentOver: number;
	isOver: boolean
	totalLeft: number
	percent: number
}

export const CheckSpentOver = (totalSpent: number | undefined
	, totalBudgets: number | undefined): response => {
	if (totalSpent && totalBudgets) {
		return {
			spentOver: totalSpent > 0 ? totalSpent - totalBudgets : totalBudgets,
			isOver: totalSpent > totalBudgets,
			totalLeft: totalBudgets - totalSpent,
			percent: totalSpent / totalBudgets * 100
		}
	}
	return {
		spentOver: 0,
		isOver: false,
		totalLeft: totalBudgets || 0,
		percent: 0
	}
}