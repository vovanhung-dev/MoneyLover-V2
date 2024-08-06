import {useQuery} from "@tanstack/react-query";
import {BudgetResponse} from "@/modules/budget/interface";
import {Empty} from "antd";
import {get} from "@/libs/api.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useBudgetStore} from "@/modules/budget/store";
import {Category, transactionResponse} from "@/model/interface.ts";
import CardCategory from "@/modules/budget/commons/CardCategory";
import {CheckSpentOver} from "@/modules/budget/function/checkSpentOver.ts";
import {filter} from "@/modules/transaction/model";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {mergeBudgetSimilar} from "@/modules/budget/function/handleBudget.ts";
import {useWalletStore} from "@/zustand/budget.ts";
import {fetchBudgets} from "@/modules/budget/function";
import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import {formatDate} from "@/utils/Format/formatDate.ts";

interface props {
	isFetch: boolean
}

interface budgetLoop {
	id: string
	start: Date
	end: Date
	category: Category[]
	amount: number
	percent: number
	total: number
	budgetName: string
}

const BudgetHistory: React.FC<props> = ({isFetch}) => {
	const [budgetHistory, setBudgetHistory] = useState<budgetLoop[]>()
	const {budgetSelect} = useBudgetStore()
	const {walletSelect} = useWalletStore()
	const {data} = useQuery({
		queryKey: [nameQueryKey.budget_history, walletSelect?.id, "history"],
		queryFn: fetchBudgets,
		enabled: isFetch
	})


	const budgets: BudgetResponse[] = useMemo(() => {
		return data?.data || []
	}, [data]);

	const budgetSimilar = useCallback(() => {
		return mergeBudgetSimilar(budgets)
	}, [budgets]);

	const categories = useMemo(() => {
		const budgetSimi = budgetSimilar()
		if (!budgetSimi) return ""; // Return an empty string if category is not defined or null

		const categoryIds = budgetSimi.map(el => el.id);

		return categoryIds.join(",");
	}, [budgetSimilar]);
	useEffect(() => {
		if (!data) return;
		const fetchTransactions = async () => {
			const requests = budgetSimilar().map(async (budget) => {
				const filter: filter = {
					category: categories,
					start: budget?.period_start?.toString() || budgetSelect?.period_start?.toString(),
					end: budget?.period_end?.toString() || budgetSelect?.period_end?.toString(),
					wallet: walletSelect?.id
				};
				const res = await get({url: "transactions", params: {...filter, pageNumber: 1}});
				const transactionData: transactionResponse[] = res?.data?.content || [];
				const totalTransactionAmount = () => {
					return transactionData.reduce((curr, total) => curr + total.amount, 0);
				};
				const percentSpent = () => {
					return (totalTransactionAmount() / budget.amount) * 100;
				};
				const category: Category[] = []
				budget.category.map((e) => {
					category.push(e)
				})
				return {
					end: budget?.period_end,
					amount: budget?.amount,
					category: category,
					percent: percentSpent(),
					start: budget?.period_start,
					id: budget?.id,
					total: totalTransactionAmount(),
					budgetName: budget.name
				};
			});

			try {
				const responses = await Promise.all(requests);
				setBudgetHistory(responses);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			}
		};

		fetchTransactions();
	}, [data, budgetSelect, walletSelect]);


	return <>
		{budgetHistory?.length === 0 ? <Empty className={`mt-20`}/> : budgetHistory?.map((budget) => {
			const {spentOver, isOver} = CheckSpentOver(budget.total, budgetSelect?.amount)
			const totalLeft = budgetSelect ? budgetSelect.amount - budget.total : 0
			const isNegative = budget?.amount < 0
			return <div key={budget?.id} className={`w-full relative cursor-pointer shadow-3 p-4`}>
				<div className={`flex-between py-6 md:p-4 md:shadow-3`}>
					<div>{`${formatDate(budget.start).toString()}-${formatDate(budget.end).toString()}`}</div>
					<div className={cn(`text-blue-600`, {"text-red-700": isNegative})}><NumberFormatter number={budget.amount}/></div>
				</div>
				{budget.category.map((e) => (
					<CardCategory
						key={budget.id}
						className="w-full"
						start={budget.start}
						end={budget.end}
						showDate={true}
						img={e.categoryIcon}
						name={e.name}
						amount={budget.amount}
						percent={budget.percent}
						isOver={isOver}
						spentOver={spentOver}
						totalLeft={totalLeft}
					/>
				))}
			</div>
		})}
	</>
}

export default BudgetHistory