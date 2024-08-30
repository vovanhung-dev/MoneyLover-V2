import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import React, {useState} from "react";
import {parseFullForm} from "@/utils/day.ts";
import {transactionResponse} from "@/model/interface.ts";
import {Badge, Card} from "antd";
import {ModalPopUp} from "@/commons";
import TransitionChart from "@/modules/transaction/commons/Chart.tsx";

interface props {
	date?: Date | string
	id: number
	isNegative?: boolean,
	amount?: number
	data?: transactionResponse[]
	clickTransaction: (id: number) => void
}

const CardTop: React.FC<props> = ({amount, id, date, isNegative, data, clickTransaction}) => {
	const [isOpenChart, setIsOpenChart] = useState<boolean>(false)
	const handleCancel = () => {
		setIsOpenChart(false)
	}


	return <>
		<Badge count={data?.length} className={`w-full lg:max-w-[700px] mx-auto`}>
			<Card className={`w-full rounded-lg relative shadow-3`}>
				<div className={`flex-between w-[85%] py-6 bg-main p-4 shadow-3 cursor-pointer`} onClick={() =>
					clickTransaction(id)}>
					<div>{parseFullForm(date).toString()}</div>
					<div className={cn(`text-blue-600`, {"text-red-700": isNegative})}><NumberFormatter number={amount || 0}/></div>
				</div>
				<div className={`absolute top-[40%] right-[5px] px-2 cursor-pointer`} onClick={() => setIsOpenChart(true)}>
					<span className={`text-red-800 text-sm`}>See report</span>
				</div>

			</Card>
		</Badge>
		<ModalPopUp isModalOpen={isOpenChart} showCancel={false} handleOk={handleCancel} handleCancel={handleCancel} title={""}>
			<TransitionChart tran={data} type={"date"}/>
		</ModalPopUp>
	</>

}

export default CardTop