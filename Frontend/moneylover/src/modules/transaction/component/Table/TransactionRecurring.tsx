import {Empty, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {transactionResponse} from "@/model/interface.ts";
import React, {useCallback, useState} from "react";
import {ModalPopUp} from "@/commons";
import TranDetail from "@/modules/transaction/commons/TranDetail.tsx";
import useRequest from "@/hooks/useRequest.ts";
import {del, post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";
import GatherTransaction from "@/modules/transaction/function/GatherTransaction.ts";
import CardTop from "@/modules/transaction/commons/CardTop.tsx";
import CardBottom from "@/modules/transaction/commons/CardBottom.tsx";

interface props {
	isLoading: boolean
	data: transactionResponse[]
}

const TableTransactionRecurring: React.FC<props> = ({isLoading, data}) => {
	const queryClient = useQueryClient()

	const [isSelect, setIsSelect] = useState<number[]>([])

	const clickTransaction = (id: number) => {
		if (isSelect.includes(id)) {
			const result = isSelect.filter(el => el != id)
			setIsSelect(result)
		} else {
			setIsSelect(prev => ([...prev, id]))
		}
	}

	const [isOpenChart, setIsOpenChart] = useState<boolean>(false)
	const [recurringSelect, setRecurringSelect] = useState<transactionResponse>()

	const clickTran = (e: transactionResponse) => {
		setIsOpenChart(true)
		setRecurringSelect(e)
	}
	const handleMutateSuccess = () => {
		// @ts-ignore
		queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet]);
		setIsOpenChart(false);
	};

	const {mutate: deleteTransaction} = useRequest({
		mutationFn: (values: string | undefined) => {
			return del({
				url: `transaction/delete/${values}`,
			})
		},

		onSuccess: () => handleMutateSuccess()

	})

	const {mutate: addTransaction} = useRequest({
		mutationFn: (values: string | undefined) => {
			return post({
				url: `transactions/recurring/add/${values}`,
			})
		},

		onSuccess: () => handleMutateSuccess()
	})

	const deleteTranRecurring = (id?: string) => {
		deleteTransaction(id)
		setIsOpenChart(false)
	}


	const addTranRecurring = (id?: string) => {
		addTransaction(id)
		setIsOpenChart(false)
	}

	const resultData = useCallback(() => GatherTransaction(data), [data])


	return <>
		<div className={`mt-10 px-4 md:px-20 font-satoshi `}>
			<div className={``}>
				{isLoading ? <Spin className={`flex justify-center mt-5`} indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/> :
					data?.length === 0 ? <Empty className={`mt-20`}/> :
						<>
							{resultData()?.map((header, i) => {
								const isNegative = header?.amount < 0
								const category = data?.filter(el => el.date === header?.date)
								return <div className={`flex relative w-full  flex-wrap gap-x-3`} key={i}>
									<CardTop date={header?.date} isNegative={isNegative} amount={header?.amount}
											 clickTransaction={clickTransaction} id={header.id} data={category}/>

									<CardBottom isSelect={isSelect.includes(header?.id)} openDetail={clickTran} trans={category} isRecurring={true}/>
								</div>
							})}
						</>
				}
			</div>
		</div>
		<ModalPopUp isModalOpen={isOpenChart} showOke={false} showCancel={false} handleCancel={() => setIsOpenChart(false)}>
			<TranDetail tranDetail={recurringSelect} clickDelete={deleteTranRecurring} clickSecond={addTranRecurring}/>
		</ModalPopUp>
	</>
}

export default TableTransactionRecurring