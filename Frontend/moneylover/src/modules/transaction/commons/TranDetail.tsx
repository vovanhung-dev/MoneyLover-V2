import {NumberFormatter} from "@/utils/Format";
import {formatDateDetail} from "@/utils/Format/formatDate.ts";
import {Button} from "antd";
import React from "react";
import {transactionResponse} from "@/model/interface.ts";

interface props {
	tranDetail: transactionResponse | undefined
	clickDelete?: (id?: string) => void
	clickSecond?: (id?: string) => void
}

const TranDetail: React.FC<props> = ({tranDetail, clickDelete, clickSecond}: props) => {
	return <>
		<div className={`flex-center flex-col`}>
			<div className={`flex flex-col gap-3 shadow-default w-full mt-4 px-8 py-6`}>
				<div className={` flex-col border-b border-b-bodydark2 gap-4 py-4`}>
					<div className={`flex-start gap-6 `}>
						<img src={tranDetail?.category?.categoryIcon} className={`w-10 h-10 rounded-full`} alt=""/>
						<span className={`font-bold text-2xl`}>{tranDetail?.category?.name}</span>
					</div>
					<div className={`text-red-600 text-2xl my-2`}>{<NumberFormatter number={tranDetail?.amount}/>}</div>
				</div>
				<div>{formatDateDetail(tranDetail?.date)}</div>
			</div>
			<div className={`flex-col flex-center`}>
				{clickSecond &&
                    <Button onClick={() => clickSecond(tranDetail?.id?.toString())} className={`text-green-700 border-inherit mt-6`}>Add
                        transaction</Button>}

				<Button onClick={() => clickDelete ? clickDelete(tranDetail?.id?.toString()) : null} className={`text-red-600 border-inherit mt-6`}>Delete
					transaction</Button>
			</div>
		</div>
	</>
}

export default TranDetail