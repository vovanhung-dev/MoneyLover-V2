import {ResponseData, transactionResponse} from "@/model/interface.ts";
import {get} from "@/libs/api.ts";
import {useQuery} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";

const fetchTransactionRecurring = (): Promise<ResponseData> => {
	return get({url: "transactions/recurring"})
}

const useDataTransactionRecurring = () => {
	const {data, isFetching} = useQuery({queryKey: [nameQueryKey.tranRecurring], queryFn: fetchTransactionRecurring})

	if (data) {
		const transactionData: transactionResponse[] = data?.data || []
		return {transactionData, isFetching}
	}
	return {
		transactionData: [],
		isFetching: false
	}
}

export default useDataTransactionRecurring