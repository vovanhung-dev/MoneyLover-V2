import {Empty, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {transactionResponse, typeWallet} from "@/model/interface.ts";
import React, {useCallback, useState} from "react";
import CardBottom from "@/modules/transaction/commons/CardBottom.tsx";
import CardTop from "@/modules/transaction/commons/CardTop.tsx";
import {ModalPopUp} from "@/commons";
import TransitionChart from "@/modules/transaction/commons/Chart.tsx";
import CardBalance from "@/modules/transaction/commons/CardBalane.tsx";
import {useWalletStore} from "@/store/WalletStore.ts";
import CardGoalWalletProcess from "@/modules/transaction/commons/CardGoalWalletProcess.tsx";
import cn from "@/utils/cn";
import GatherTransaction from "@/modules/transaction/function/GatherTransaction.ts";

interface props {
	isLoading: boolean
	data: transactionResponse[]
	openBalance: number
	endBalance: number
	openDetail: (tran: transactionResponse) => void
}


const TableTransaction: React.FC<props> = ({isLoading, openDetail, data, endBalance, openBalance}) => {


	const {walletSelect} = useWalletStore()

	const [isSelect, setIsSelect] = useState<number[]>([])
	const [isOpenChart, setIsOpenChart] = useState<boolean>(false)

	const clickTransaction = (id: number) => {
		if (isSelect.includes(id)) {
			const result = isSelect.filter(el => el != id)
			setIsSelect(result)
		} else {
			setIsSelect(prev => ([...prev, id]))
		}
	}

	const handleCancel = () => {
		setIsOpenChart(false)
	}

	const resultData = useCallback(() => GatherTransaction(data), [data])

	return <>
		{walletSelect && <div className={cn(`py-4 px-6 shadow-3 md:w-2/5 mx-auto `,
			{"mt-10": walletSelect?.type === typeWallet.Goal, "hidden": walletSelect?.type === typeWallet.Basic && data.length === 0})}>
			{walletSelect?.type != typeWallet.Goal ? <CardBalance endBalance={endBalance} openBalance={openBalance}/> : <CardGoalWalletProcess/>}

            <span className={`flex-center text-sm text-green-600 cursor-pointer`} onClick={() => setIsOpenChart(!isOpenChart)}>View report for this period</span>
        </div>}

		<div className={`mt-10 px-4 md:px-20 font-satoshi md:w-5/5 lg:w-3/3 mx-auto`}>
			<div className={``}>
				{isLoading ? <Spin className={`flex justify-center mt-5`} indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/> :
					data.length === 0 ? <Empty className={`mt-20`}/> :
						<>
							{resultData()?.map((header, i) => {
								const isNegative = header?.amount < 0
								const category = data?.filter(el => el.date === header?.date)
								return <div className={`flex relative w-full flex-wrap gap-x-3`} key={i}>
									<CardTop date={header?.date} isNegative={isNegative} amount={header?.amount}
											 clickTransaction={clickTransaction} id={header.id} data={category}/>
									<CardBottom isSelect={isSelect.includes(header?.id)} openDetail={openDetail} trans={category}/>
								</div>
							})}
						</>}
			</div>
		</div>
		<ModalPopUp isModalOpen={isOpenChart} handleOk={handleCancel} handleCancel={handleCancel} title={""}>
			<TransitionChart tran={data}/>
		</ModalPopUp>
	</>
}

export default TableTransaction