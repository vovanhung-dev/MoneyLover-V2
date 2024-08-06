import {pagination, paginationRequest, ResponseData, walletProps} from "@/model/interface.ts";
import {get} from "@/libs/api.ts";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

interface walletProp {
	wallets: walletProps[];
	isFetching: boolean;
	pagination: pagination
	updatePagination: (newParams: Partial<paginationRequest>) => void
}

const fetchWallet = (key: any): Promise<ResponseData> => {
	const params = key.queryKey[1]
	return get({url: "wallets", params});
};
const useWalletManager = (): walletProp => {
	const [walletDatas, setWalletDatas] = useState<walletProps[]>([])
	const [pagination, setPagination] = useState<pagination>({
		content: [],
		isLast: true,
		totalDocument: 0,
		documentsPerPage: 7, totalPage: 0, pageNumber: 0
	})
	const [paginationParam, setPaginationParam] = useState<paginationRequest>({
		field: "name",
		documentsPerPage: 7,
		sort: "asc",
		pageNumber: 0,
	});


	const {data, isFetching} = useQuery({
		queryKey: ["wallets", paginationParam],
		queryFn: fetchWallet,
	});
	const updatePagination = (newParams: Partial<paginationRequest>) => {
		setPaginationParam((prevParams) => ({...prevParams, ...newParams}));
	};


	useEffect(() => {
		const {content, ...res} = data?.data || [];
		const walletData = content ?? [];
		const pagination: pagination = res
		setPagination(pagination)
		setWalletDatas(walletData)
	}, [data]);


	return {
		wallets: walletDatas,
		isFetching: isFetching,
		pagination,
		updatePagination
	}

}

export default useWalletManager