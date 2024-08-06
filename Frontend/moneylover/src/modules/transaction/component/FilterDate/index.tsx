import {monthDates} from "@/modules/transaction/model";
import React, {useEffect, useRef, useState} from "react";
import cn from "@/utils/cn";
import dayjs from "dayjs";

interface props {
	setFilter: (data: any) => void
}

const FilterDate: React.FC<props> = ({setFilter}) => {
	const [isFuture, setIsFuture] = useState<boolean>(false)
	const [currentSelectDateFilter, setCurrentSelectDateFilter] = useState<string>(
		`${new Date().getMonth() + 1}-${new Date().getFullYear()}`
	)

	const selectDate = (month: number, year: number, start: string, end: string) => {
		setCurrentSelectDateFilter(month + "-" + year)
		setFilter((prev: any) => ({...prev, start, end}))
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
		<div className={`flex-center sticky top-0`}>
			<div ref={containerRef} className={`w-2/3 flex-center gap-2 my-10 overflow-x-scroll  border-x-bodydark border-x px-2`}>
				{monthDates?.map((el) => {
					const timeTran = `${el.month}-${el.year}`
					const isSelected = currentSelectDateFilter === timeTran;
					return <div key={el?.index} onClick={() => {
						setIsFuture(false)
						selectDate(el.month, el.year, el.start, el.end)
					}
					} ref={isSelected ? selectedRef : null}
								className={`py-2 text-nowrap px-4 cursor-pointer 
						${isSelected && !isFuture ? " border-b border-b-bodydark2" : ""}`}>
						{checkMonth(el.month, el.year) === 1 ? "THIS MONTH" : checkMonth(el.month, el.year) === 2 ? "LAST MONTH" : `${el?.month}/${el?.year}`}
					</div>
				})}
				<div onClick={() => {
					setIsFuture(true)
					setCurrentSelectDateFilter(`${new Date().getMonth() + 2}-${new Date().getFullYear()}`)
					setFilter((prev: any) => ({...prev, start: dayjs().add(1, "day").toISOString().split('T')[0], end: undefined}))
				}}
					 className={cn(`py-2 text-nowrap px-4 cursor-pointer `, {" border-b border-b-bodydark2": isFuture})}>
					FUTURE
				</div>
			</div>
		</div>
	</>
}

export default FilterDate