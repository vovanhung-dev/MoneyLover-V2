import useBillData from "@/modules/bill/function";
import {LoadingOutlined} from "@ant-design/icons";
import {Empty, Spin} from "antd";
import dayjs from "dayjs";
import {NumberFormatter} from "@/utils/Format";
import React, {useCallback} from "react";
import CardToDay from "@/modules/bill/Common/CardToDay.tsx";
import ClassifyBills from "@/modules/bill/function/ClassifyBills.ts";
import cn from "@/utils/cn";

const TableBill = React.memo(() => {
	const {result, isFetching} = useBillData()

	const bills = useCallback(() => {
		return ClassifyBills(result?.bills)
	}, [result?.bills])


	return <div className={cn(`container-wrapper`, {"h-auto": true})}>
		{result?.bills?.length > 0 && <div className={`md:mx-40 p-4 shadow-3 mb-4`}>
            <p className={`text-xl font-bold`}>Remaining bills</p>
            <p className={`flex-between`}>
                <span className={`text-xs text-bodydark2`}>Overdue</span>
                <span className={`text-lg font-bold`}><NumberFormatter number={result?.due_amount}/></span>
            </p>
            <p className={`flex-between`}>
                <span className={`text-xs text-bodydark2`}>For today</span>
                <span className={`text-lg font-bold`}><NumberFormatter number={result?.today_amount}/></span>
            </p>
            <p className={`flex-between`}>
                <span className={`text-xs text-bodydark2`}>This period</span>
                <span className={`text-lg font-bold`}><NumberFormatter number={result?.period_amount}/></span>
            </p>
        </div>}

		{isFetching ? <Spin className={`flex justify-center mt-5`} indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/> :
			result?.bills?.length === 0 ? <Empty className={`mt-20`}/> :
				<div className={`relative w-full grid md:grid-cols-4 md:grid-rows-2 px-10 gap-8 pb-40`}>
					{Object.entries(bills()).map(([key, data]) => {
						if (data.length > 0) {
							return (
								<div key={key} className={`md:col-span-2`}>
									<h3 className="text-3xl text-bodydark2 uppercase">{key}</h3>
									{data.map((el) => {
										const dueDay = dayjs(el.from_date).diff(el.date, "day");
										return (
											<div key={el.id} className={`cursor-pointer`}>
												<CardToDay key={el.id} bills={el} nextBill={dueDay} isPaid={el.paid} dueDate={!!el.due_date}/>
											</div>
										);
									})}
								</div>
							);
						}
						return null;
					})}
				</div>
		}

	</div>
})

export default TableBill