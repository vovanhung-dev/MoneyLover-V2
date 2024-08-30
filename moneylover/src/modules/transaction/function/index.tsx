import {get} from "@/libs/api.ts";
import {useQuery} from "@tanstack/react-query";
import {ResponseData, transactionResponse} from "@/model/interface.ts";
import {filter} from "@/modules/transaction/model";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";


export const fetchTransaction = (key: any): Promise<ResponseData> => {

	const filters: filter = key.queryKey[1]
	const {category} = filters;

	const categoryParams = category?.split(",")
	const param: filter = {
		...filters,
		start: filters?.start,
		end: filters?.end,
		category: categoryParams?.length === 1 ? categoryParams[0] : category?.split(".")[0]
	};


	return get({url: "transactions", params: {...param}})
}


const useDataTransaction = (filter: filter) => {
	const {data, isFetching} = useQuery({
		queryKey: [nameQueryKey.transactions, filter],
		queryFn: fetchTransaction,
		enabled: !!filter.wallet,
	})

	if (data) {
		const transactionData: transactionResponse[] = data?.data || []
		return {transactionData, isFetching}
	}
	return {
		transactionData: [],
		isFetching: false
	}
}

export default useDataTransaction