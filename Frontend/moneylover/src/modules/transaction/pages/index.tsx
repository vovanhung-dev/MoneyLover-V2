import UserLayout from "@/layout/userLayout.tsx";
import {BreakCrumb} from "@/components"
import {Plus} from "@/assets";
import React, {useCallback, useEffect, useState} from "react";
import {Button} from "antd";

import {ModalPopUp} from "@/commons";
import {useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";
import {transactionSchema} from "@/libs/schema.ts";
import {yupResolver} from "@hookform/resolvers/yup";
import useRequest from "@/hooks/useRequest.ts";
import {del, post} from "@/libs/api.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useWallet} from "@/context/WalletContext.tsx";
import {transactionRequest, transactionResponse, typeWallet} from "@/model/interface.ts";
import useDataTransaction from "../function";
import {FilterFormTransaction, FormTransaction, TableTransaction} from "../component";
import FilterDate from "@/modules/transaction/component/FilterDate";
import BalanceInMonth from "@/modules/transaction/function/balanceInMonth.ts";
import {filter} from "@/modules/transaction/model";
import {FormatValueInput} from "@/utils/Format/fortmat.value.input.ts";
import {useWalletStore} from "@/zustand/budget.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {showModalNoWallet} from "@/utils/showModalNoWallet.tsx";
import TranDetail from "@/modules/transaction/commons/TranDetail.tsx";
import {convertToCurrentDate} from "@/utils/day.ts";


const Transaction = React.memo(() => {
	const {walletSelect} = useWalletStore()

	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const methods = useForm({
		mode: "onChange",
		resolver: yupResolver(transactionSchema),
	})

	const FilterMethods = useForm({mode: "onChange"})
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);
	const [transactionDetail, setTransactionDetail] = useState<transactionResponse>()

	const {wallets} = useWallet()


	const showModal = () => {
		showModalNoWallet(wallets, navigate, setIsModalOpen)
	};

	const setDefaultFilter = useCallback((): filter => {
		const date = new Date()
		const currentMonth = date.getMonth()
		const currentYear = date.getFullYear()
		const startCurrentMonth = new Date(currentYear, currentMonth, 2).toISOString().split("T")[0]
		const endCurrentMonth = new Date(currentYear, currentMonth + 1, 1).toISOString().split("T")[0]

		return {start: startCurrentMonth, end: endCurrentMonth, category: undefined, wallet: walletSelect?.id}
	}, [walletSelect])


	useEffect(() => {
		setFilter((prev) => ({...prev, wallet: walletSelect?.id}));
	}, [walletSelect]);


	const [filter, setFilter] = useState<filter>(() => setDefaultFilter())

	const {transactionData, isFetching} = useDataTransaction(filter)

	const openTranDetail = (tran: transactionResponse) => {
		setTransactionDetail(tran)
		setIsModalDetailOpen(true)
	}

	const {mutate: createTransaction} = useRequest({
		mutationFn: (values: transactionRequest) => {
			return post({
				url: "transaction/add",
				data: values
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet])
			handleCancel()
			methods.reset({amount: 0, amountDisplay: "0", category: undefined, date: undefined, notes: "", exclude: false})
		}
	})

	const {mutate: deleteTransaction} = useRequest({
		mutationFn: (values: string | undefined) => {
			return del({
				url: `transaction/delete/${values}`,
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet])
			handleCancel()
		}
	})

	const clickDelete = (id: string | undefined) => {
		deleteTransaction(id)
		setIsModalDetailOpen(false)
	}


	const amount = methods.watch("amountDisplay")


	const handleOk = (data: any) => {
		const {category, date} = data
		const type = category.split(".")[1]
		const category_id = category.split(".")[0]
		const result: transactionRequest = {...data, type: type, category: category_id, date: convertToCurrentDate(date)}
		createTransaction(result)
	};

	useEffect(() => {
		FormatValueInput(amount, methods.setValue, walletSelect?.currency)
	}, [amount, methods, walletSelect]);


	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const {endBalance, openBalance} = BalanceInMonth(filter);

	useEffect(() => {
		const subscription = FilterMethods.watch((value) => {
				// @ts-ignore
				setFilter(prev => ({...prev, category: value?.category?.split(".")[0]}))
			}
		)
		return () => subscription.unsubscribe()
	}, [FilterMethods.watch])


	return <UserLayout>
		<BreakCrumb pageName={"transaction"}/>
		<div className={`w-full bg-white h-auto shadow-default pb-20`}>
			<form className={`px-4 md:px-10 lg:px-20 md:flex-between flex-center pt-10 gap-6`}>
				<FormProvider {...FilterMethods}>
					<FilterFormTransaction/>
				</FormProvider>
				<Button onClick={showModal}
						className={`lg:col-span-1 text-bodydark2 hover:scale-110 duration-500 flex-center gap-4`}>Add new<img
					src={Plus} alt=""/></Button>
			</form>
			{walletSelect?.type === typeWallet.Basic && <FilterDate setFilter={setFilter}/>}
			<TableTransaction openDetail={openTranDetail} endBalance={endBalance} openBalance={openBalance} data={transactionData}
							  isLoading={isFetching}/>

			<ModalPopUp isModalOpen={isModalOpen} handleOk={methods.handleSubmit(handleOk)} handleCancel={handleCancel} title={"Add transaction"}>
				<FormProvider {...methods}>
					<FormTransaction/>
				</FormProvider>
			</ModalPopUp>

			<ModalPopUp isModalOpen={isModalDetailOpen} showOke={false} handleCancel={() => setIsModalDetailOpen(false)} title={""}>
				<TranDetail tranDetail={transactionDetail} clickDelete={clickDelete}/>
			</ModalPopUp>

		</div>
	</UserLayout>
})

export default Transaction