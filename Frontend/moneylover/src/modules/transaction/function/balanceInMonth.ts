import {useQuery} from "@tanstack/react-query";
import {get} from "@/libs/api.ts";
import {ResponseData} from "@/model/interface.ts";
import {balanceInMonth, filter} from "@/modules/transaction/model";


const fetchBalanceInMonth = (key: any): Promise<ResponseData> => {
	return get({url: "transaction/balance", params: {...key.queryKey[1]}})
}

const BalanceInMonth = (filter: filter): balanceInMonth => {
	const {data} = useQuery({queryKey: ["transaction", filter], queryFn: fetchBalanceInMonth})
	const result: balanceInMonth = data?.data
	return {
		openBalance: result?.openBalance,
		endBalance: result?.endBalance
	}
}


export default BalanceInMonth