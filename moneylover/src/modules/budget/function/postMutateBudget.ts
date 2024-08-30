import useRequest from "@/hooks/useRequest.ts";
import {BudgetRequest} from "@/modules/budget/interface";
import {post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {UseFormReturn} from "react-hook-form";
import {useQueryClient} from "@tanstack/react-query";

interface props {
	handleCancel: () => void
	methods: UseFormReturn<{
		name?: string | undefined,
		amountDisplay?: string | undefined,
		repeat_bud?: boolean | undefined,
		wallet: string,
		amount: number,
		category: string,
		period_start: Date,
		period_end: Date
	}, any, undefined>
}

const useBudgetPost = ({handleCancel, methods}: props) => {
	const queryClient = useQueryClient()

	const {mutate: createBudget} = useRequest({
		mutationFn: (values: BudgetRequest) => {
			return post({
				url: "budget/add",
				data: values
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.budgets])
			handleCancel()
			methods.reset()
		}
	})

	return {createBudget}
}

export default useBudgetPost