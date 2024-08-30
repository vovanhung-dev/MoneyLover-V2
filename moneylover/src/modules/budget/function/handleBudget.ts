import dayjs from "dayjs";
import {swalAlert} from "@/hooks/swalAlert.ts";
import {typeAlert} from "@/utils";
import {BudgetRequest, BudgetResponse, BudgetSimilar} from "@/modules/budget/interface";
import {MutateOptions} from "@tanstack/react-query";
import {User} from "@/model/interface.ts";

export const handleSubmitBudget = (user: User, position: number, setPosition: (e: number) => void, data: any, budgets: BudgetSimilar[], createBudget: (variables: any, options?: (MutateOptions<unknown, unknown, any, unknown> | undefined)) => void) => {
	const start = dayjs(data?.period_start);
	const end = dayjs(data?.period_end);

	if (end.diff(start) < 1) {
		swalAlert({
			message: "End date must be greater than start date!",
			type: typeAlert.error,
		});
		return;
	}

	const {category, wallet} = data;
	const categoryId = category.split(".")[0];

	const existBudget = budgets.find((el) =>
		end.isSame(dayjs(el.period_end)) &&
		start.isSame(dayjs(el.period_start)) &&
		el.category.find((e) => e.id === categoryId && e.user.id === user.id) &&
		el.wallet === wallet
	);

	const request: BudgetRequest = {
		...data,
		category: categoryId,
		id: existBudget?.category.find((e) => e.user.id === user.id)?.idBudget,
		period_start: start.format("YYYY-MM-DD"),
		period_end: end.format("YYYY-MM-DD")
	};

	if (existBudget) {
		swalAlert({
			message: ` budget for this time is already existed. Do you want to overwrite it or add to it?`,
			type: typeAlert.warning,
			btnText: "Overwrite",
			showCancel: true,
			showDeny: true,
			denyBtn: "Add to it ",
			thenFunc: (result) => {
				if (result.isConfirmed) {
					request.overWrite = true;
					createBudget(request);
					setPosition(position)
				} else if (result.isDenied) {
					request.overWrite = false;
					setPosition(position)
					createBudget(request);
				}
			},
		});
	} else {
		setPosition(position)
		createBudget(request);
	}
};


export const mergeBudgetSimilar = (budgets: BudgetResponse[]) => {

	const budetsSimilar = budgets.reduce((result, budget) => {
		// const {category,...res}=budget
		const existBudget = result.find((b) => budget.name === b.name && b.wallet === b.wallet);
		if (!existBudget) {
			result.push({
				...budget,
				name: budget.name,
				category: [{...budget.category, idBudget: budget.id, amountBudget: budget.amount, user: budget.user}],
				amount: budget.amount,
				wallet: budget.wallet,
				period_end: budget.period_end,
				period_start: budget.period_start,
				id: budget.id,
			})
		} else {
			existBudget.amount += budget.amount
			existBudget.category.push({...budget.category, idBudget: budget.id, amountBudget: budget.amount, user: budget.user})
		}
		return result
	}, [] as BudgetSimilar[])

	return budetsSimilar.sort((a, b) => {
		const time1 = dayjs(a.period_end)
		const time2 = dayjs(b.period_end)
		return time1.isBefore(time2) ? -1 : time1.isAfter(time2) ? 1 : 0;
	})
}