import {transactionRequest} from "@/model/interface.ts";
import dayjs from "dayjs";
import useRequest from "@/hooks/useRequest.ts";
import {del, post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";

interface props {
	handleCancel: () => void
	methods: any
	setIsModalDetailOpen: (a: boolean) => void
	walletId: string | undefined
}


const useMutateTransaction = ({handleCancel, methods, setIsModalDetailOpen, walletId}: props) => {
	const queryClient = useQueryClient()

	const handleOk = (data: any) => {
		const {category, date} = data
		const type = category.split(".")[1]
		const category_id = category.split(".")[0]
		const result: transactionRequest = {...data, type: type, category: category_id, date: dayjs(date).format("YYYY-MM-DD")}
		createTransaction(result)
	};

	const {mutate: createTransaction} = useRequest({
		mutationFn: (values: transactionRequest) => {
			return post({
				url: "transaction/add",
				data: values
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet, nameQueryKey.wallets])
			handleCancel()
			methods.reset({amount: 0, amountDisplay: "0", category: undefined, date: undefined, notes: "", exclude: false})
		}
	})

	const {mutate: deleteTransaction} = useRequest({
		mutationFn: (values: string | undefined) => {
			return del({
				url: `transaction/delete/${values}`,
				data: walletId
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet, nameQueryKey.wallets])
			setIsModalDetailOpen(false)
			handleCancel()
		}
	})
	const deleteTran = (id: string | undefined) => {
		deleteTransaction(id)
	}

	return {
		handleOk,
		deleteTran
	}
}

export default useMutateTransaction

