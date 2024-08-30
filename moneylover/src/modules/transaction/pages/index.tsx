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
import {useWallet} from "@/context/WalletContext.tsx";
import {transactionResponse, typeWallet} from "@/model/interface.ts";
import useDataTransaction from "../function";
import {FilterFormTransaction, FormTransaction, TableTransaction} from "../component";
import FilterDate from "@/modules/transaction/component/FilterDate";
import BalanceInMonth from "@/modules/transaction/function/balanceInMonth.ts";
import {filter} from "@/modules/transaction/model";
import {FormatValueInput} from "@/utils/Format/fortmat.value.input.ts";
import {useWalletStore} from "@/store/WalletStore.ts";
import {showModalNoWallet} from "@/utils/showModalNoWallet.tsx";
import TranDetail from "@/modules/transaction/commons/TranDetail.tsx";
import useMutateTransaction from "@/modules/transaction/function/postMutateTransaction.ts";
import dayjs from "dayjs";


const Transaction = React.memo(() => {
	const {walletSelect} = useWalletStore()

	const navigate = useNavigate()

	const methods = useForm({
		mode: "onChange",
		resolver: yupResolver(transactionSchema),
		defaultValues: {amount: 0}
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


	const amount = methods.watch("amountDisplay")


	useEffect(() => {
		FormatValueInput(amount, methods.setValue, walletSelect?.currency)
	}, [amount, methods, walletSelect]);


	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const {handleOk, deleteTran} = useMutateTransaction({handleCancel, methods, setIsModalDetailOpen, walletId: walletSelect?.id})

	const {endBalance, openBalance} = BalanceInMonth(filter);

	useEffect(() => {
		const subscription = FilterMethods.watch((value) => {
				// @ts-ignore
				setFilter(prev => ({...prev, category: value?.category?.split(".")[0], start: dayjs(value?.date).format("YYYY-MM-DD")}))
			}
		)
		return () => subscription.unsubscribe()
	}, [FilterMethods.watch])


	return <UserLayout>
		<BreakCrumb pageName={"transaction"}/>
		<div className={`container-wrapper-auto relative p-10`}>
			<form className={`px-4 md:px-10 border-b border-b-bodydark2 py-8 mx-40 lg:px-20 md:flex-between flex-center pt-10 gap-6`}>
				<FormProvider {...FilterMethods}>
					<FilterFormTransaction/>
				</FormProvider>
				<Button onClick={showModal}
						className={`lg:col-span-1 text-bodydark2 ring-red-400 ring-1 hover:ring-2 hover:ring-blue-500 hover:scale-110 duration-500 flex-center gap-4`}>Add
					new<Plus/></Button>
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
				<TranDetail tranDetail={transactionDetail} clickDelete={deleteTran}/>
			</ModalPopUp>

		</div>
	</UserLayout>
})

export default Transaction