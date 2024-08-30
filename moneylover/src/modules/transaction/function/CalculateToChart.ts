import dayjs from "dayjs";
import {debt_loan_type, transactionResponse, typeCategory} from "@/model/interface.ts";

interface BarChartState {
	series: {
		name: string;
		data: number[];
	}[];
}

export const TranIncomePie = (categories: string[], tran: transactionResponse[] | undefined) => {
	const total: { [key: string]: number } = {};
	categories.forEach((categoryRange) => {
		total[categoryRange] = 0;
	});
	tran?.forEach(obj => {
		if (obj.category.categoryType === typeCategory.Income && !obj.exclude) {
			const categoryName = obj.category.name;
			if (total[categoryName] !== undefined) {
				total[categoryName] += obj.amount;
			}
		}
	});
	return categories.map(categoryRange => total[categoryRange] || 0);
}

export const TranChartPeriod = (categories: string[], tran: transactionResponse[] | undefined, result1: BarChartState) => {
	const monthStorage = sessionStorage.getItem("currentMonth")
	const yearStorage = sessionStorage.getItem("currentYear")
	const now = dayjs();
	const currentMonth = !monthStorage ? now.month() : parseInt(monthStorage) - 1; // Tháng bắt đầu từ 0 (tháng 1 là 0)
	const currentYear = !yearStorage ? now.year() : parseInt(yearStorage);

	categories.forEach((categoryRange, i) => {
		const [start, end] = categoryRange.split(",").map(Number);
		const startWeek = dayjs(new Date(currentYear, currentMonth, start));
		const endWeek = dayjs(new Date(currentYear, currentMonth, end));
		tran?.forEach(obj => {
			const objDate = dayjs(obj.date);
			if (objDate.isAfter(startWeek) && objDate.isBefore(endWeek) || objDate.isSame(endWeek) || objDate.isSame(startWeek)) {
				const amount = obj.amount;
				const categoryType = obj.category.categoryType;
				if (!obj.exclude) {
					if (categoryType === typeCategory.Expense) {
						result1.series[0].data[i] -= amount;
					} else if (categoryType === typeCategory.Income) {
						result1.series[1].data[i] += amount;
					} else if (categoryType === typeCategory.Deb && obj.category.debt_loan_type === debt_loan_type.debt) {
						result1.series[2].data[i] += amount
					} else {
						result1.series[2].data[i] -= amount
					}
				}
			}
		});
	});
}

export const CalculateCategoriesChart = (tran: transactionResponse[] | undefined) => {
	const firstCate: string[] = []
	tran?.map((el) => {
		if (!firstCate.includes(el.category.name) && !el.exclude) {
			firstCate.push(el.category.name)
		}
		return firstCate
	})
	return firstCate
}

export const TranChartDate = (categories: string[], tran: transactionResponse[] | undefined, result1: BarChartState) => {
	categories.forEach((categoryRange, i) => {
		tran?.forEach(obj => {
			if (categoryRange === obj.category.name) {
				const amount = obj.amount;
				const categoryType = obj.category.categoryType;
				if (!obj.exclude) {
					if (categoryType === typeCategory.Expense) {
						result1.series[0].data[i] -= amount;
					} else if (categoryType === typeCategory.Income) {
						result1.series[1].data[i] += amount;
					} else if (categoryType === typeCategory.Deb && obj.category.debt_loan_type === debt_loan_type.debt) {
						result1.series[2].data[i] += amount
					} else {
						result1.series[2].data[i] -= amount
					}
				}
			}
		});
	});
}