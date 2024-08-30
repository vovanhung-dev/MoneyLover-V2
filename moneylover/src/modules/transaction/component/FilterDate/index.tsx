import {monthDates} from "@/modules/transaction/model";
import React, {useCallback, useEffect, useRef, useState} from "react";
import cn from "@/utils/cn";
import dayjs from "dayjs";
import useHomePage from "@/modules/dashboard/function";
import {Badge} from "antd";

interface props {
	setFilter: (data: any) => void
}

const FilterDate: React.FC<props> = ({setFilter}) => {
	const [isFuture, setIsFuture] = useState<boolean>(false)
	const [currentSelectDateFilter, setCurrentSelectDateFilter] = useState<string>(
		`${new Date().getMonth() + 1}-${new Date().getFullYear()}`
	)
	const {transactions} = useHomePage(true)

	const countTranOfMonth = useCallback((currentTime: { month: number; year: number } | null) => {
		return transactions.filter((el) => {
			const dateToCheck = dayjs(el.date)
			const currentDate = dayjs()
			if (!currentTime && dateToCheck.isAfter(currentDate)) {
				return el;
			}

			if (dateToCheck.year() === currentTime?.year) {
				if (dateToCheck.month() === +currentTime?.month - 1 && dateToCheck.isBefore(currentDate)) {
					return el
				}
			}
		})
	}, [transactions])

	const selectDate = (month: number, year: number, start: string, end: string | undefined) => {
		setCurrentSelectDateFilter(month + "-" + year)
		setFilter((prev: any) => ({...prev, start, end}))
	}

	const clickChangeTime = (isFuture: boolean, month: number, year: number, start: string, end: string | undefined) => {
		sessionStorage.setItem("currentMonth", month.toString())
		sessionStorage.setItem("currentYear", year.toString())
		setIsFuture(isFuture)
		selectDate(month, year, start, end)
	}
	const containerRef = useRef(null);
	const selectedRef = useRef(null);

	useEffect(() => {
		if (selectedRef.current) {
			// @ts-ignore
			selectedRef?.current?.scrollIntoView({inline: 'center', behavior: 'smooth'});
		}
	}, []);
	const checkMonth = (month: number, year: number) => {
		const currentMonth = new Date().getMonth()
		const currentYear = new Date().getFullYear()
		if (currentMonth + 1 === month && currentYear === year) {
			return 1
		} else if (currentMonth + 1 - month === 1 && currentYear === year) {
			return 2
		} else {
			return 3
		}
	}

	return <>
		<div className={`flex-center sticky top-0 `}>
			<div ref={containerRef}
				 className={`w-2/3 flex-center gap-2 my-10 py-8 overflow-x-scroll  border-x-bodydark border-x p-3`}>
				{monthDates?.map((el) => {
					const timeTran = `${el.month}-${el.year}`
					const isSelected = currentSelectDateFilter === timeTran;
					return <Badge key={el?.index} count={countTranOfMonth(el).length}>
						<div onClick={() =>
							clickChangeTime(false, el.month, el.year, el.start, el.end)
						} ref={isSelected ? selectedRef : null}
							 className={`py-2 text-nowrap px-4 cursor-pointer mx-2
						${isSelected && !isFuture ? " border-b-2 bg-gray-200 py-2 px-4 rounded-lg border-b-bodydark2" : ""}`}>
							{checkMonth(el.month, el.year) === 1 ? "THIS MONTH" : checkMonth(el.month, el.year) === 2 ? "LAST MONTH" : `${el?.month}/${el?.year}`}
						</div>
					</Badge>
				})}
				<Badge count={countTranOfMonth(null).length}>
					<div onClick={() =>
						clickChangeTime(true, new Date().getMonth() + 1, new Date().getFullYear(), dayjs().add(1, 'day').toISOString().split('T')[0], undefined)
					}
						 className={cn(`py-2 text-nowrap px-4 cursor-pointer `, {" border-b bg-gray-200 py-2 px-4 rounded-lg border-b-bodydark2": isFuture})}>
						FUTURE
					</div>
				</Badge>
			</div>
		</div>
	</>
}

export default FilterDate