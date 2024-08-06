import {useQuery} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {get} from "@/libs/api.ts";
import {ResponseData} from "@/model/interface.ts";
import {billResponse} from "@/modules/bill/model";

interface props {
	bills: billResponse[]
	due_amount: number;
	period_amount: number
	today_amount: number
}

const fetchBill = (): Promise<ResponseData> => {
	return get({url: "bills"});
}

const useBillData = () => {

	const {data, isFetching} = useQuery({queryKey: [nameQueryKey.bills,], queryFn: fetchBill})

	const result: props = data?.data
	return {
		result: result,
		isFetching
	}

}

export default useBillData