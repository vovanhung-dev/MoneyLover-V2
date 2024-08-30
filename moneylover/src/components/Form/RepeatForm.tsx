import {DatePicker, DatePickerProps, Input, Radio, RadioChangeEvent, Select, SelectProps, Switch} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {useCallback, useEffect, useState} from "react";
import {InputController, SelectInput} from "@/commons";
import {useWallet} from "@/context/WalletContext.tsx";
import {useCategoryFetch} from "@/context/CategoryContext.tsx";
import {parseNewWallet, parseToNewCate} from "@/model/interface.ts";
import {useWalletStore} from "@/store/WalletStore.ts";
import {dayInWeek, getDayAndPositionOfWeek} from "@/utils/day.ts";
import dayjs from "dayjs";
import {dateFormat} from "@/utils";
import cn from "@/utils/cn";

const optionsWithDisabled = [
	{label: 'Expense', value: 'Expense'},
	{label: 'Income', value: 'Income'},
	{label: 'Deb', value: 'Deb'},
];


enum optionTime {
	Forever = "Forever",
	Until = "Until",
	For = "For"
}

const optionsTime = [
	{label: optionTime.Forever, value: optionTime.Forever},
	{label: optionTime.Until, value: optionTime.Until},
	{label: optionTime.For, value: optionTime.For},
];

enum Efrequency {
	Day = "days",
	Week = "weeks",
	Month = "months",
	Year = "years"
}

const optionsFrequency = [
	{label: "Repeat daily", value: Efrequency.Day},
	{label: "Repeat week", value: Efrequency.Week},
	{label: "Repeat month", value: Efrequency.Month},
	{label: "Repeat year", value: Efrequency.Year}
];
const positionWeek = {
	1: "first",
	2: "second",
	3: "third",
	4: "fourth",
	5: "fifth"
}


const RepeatForm = React.memo(() => {

	const [value4, setValue4] = useState<string>("Expense");
	const [value, setValue] = useState<string>("Forever");
	const [options, setOptions] = useState<SelectProps['options']>([]);
	const [frequency, setFrequency] = useState<string>("days");
	const [selectedValue, setSelectedValue] = useState(`1`);
	const [checkedValues, setCheckedValues] = useState<number>();
	const [setFormDate, setSetFormDate] = useState(dayjs(dayjs(), dateFormat))
	const [valueOfMonth, setValueOfMonth] = useState<string | number>(setFormDate.date())
	const {wallets} = useWallet()

	const {categories, changeType} = useCategoryFetch()

	const newWallets = parseNewWallet(wallets)

	const newCate = parseToNewCate(categories)

	const {walletSelect} = useWalletStore()

	const onChange4 = ({target: {value}}: RadioChangeEvent) => {
		changeType(value)
		setValue4(value);
	};

	const [isRepeat, setIsRepeat] = useState<boolean>(false)


	const onChangeCheckBox = (checkedValues: any) => {
		setCheckedValues(checkedValues)
	};

	const onChangeTypeRepeat = ({target: {value}}: RadioChangeEvent) => {
		setValue(value);
	};

	const changeValueOfMonth = ({target: {value}}: RadioChangeEvent) => {
		console.log(value)
		setValueOfMonth(value)
	}

	const handleValueFrequency = (value: string) => {


		const result = getDayAndPositionOfWeek(setFormDate)
		const optionsMonth = [
			{
				label: `on every ${positionWeek[result.week as keyof typeof positionWeek]} ${result.dayName} of month`,
				value: `${result.day},${result.week}`
			},
			{
				label: `on the same each day of month (${setFormDate.date()})`,
				value: setFormDate.date()
			}
		]
		if (value === Efrequency.Week) {
			return <>
				<InputController name={"date_of_week"}
								 render={({field}) => (
									 <>
										 <Radio.Group className={`flex flex-col`} value={checkedValues} options={dayInWeek()}
													  onClick={onChangeCheckBox} {...field}
										 ></Radio.Group>
									 </>
								 )}
				/>
			</>
		} else {
			return <>
				<InputController name={"day_of_month"}
								 defaultValue={valueOfMonth}
								 render={({field}) => (
									 <Radio.Group
										 {...field}
										 defaultValue={valueOfMonth}
										 value={valueOfMonth}
										 onChange={changeValueOfMonth}
										 options={optionsMonth}
										 optionType="button"
										 buttonStyle="solid"
										 className={`w-full`}
									 />
								 )}
				/>
			</>
		}
	}

	const optionsEvery = useCallback(() => {
		const newOptions = [];
		for (let i = 1; i <= 50; i++) {
			newOptions.push({
				value: i,
				label: i + " " + frequency,
			});
		}
		setOptions(newOptions);
	}, [frequency]);


	useEffect(() => {
		optionsEvery();
	}, [optionsEvery]);

	const handleChangeEvery = (value: string) => {
		setSelectedValue(value);
	};

	const handleChangeFrequency = (value: string) => {
		setFrequency(value);
	};


	const handleSwitch = (checked: boolean) => {
		setIsRepeat(checked)
	};


	const handleFormDate: DatePickerProps['onChange'] = (date) => {
		setSetFormDate(dayjs(date, dateFormat))
	};

	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Wallet`} name={"wallet"} defaultValue={walletSelect?.id}
							 render={({field}) => <SelectInput defaultValue={walletSelect?.name} field={field} options={newWallets}
															   title={"Select wallet"}/>}/>


			<InputController label={`Category type`} name={""}
							 render={({field}) => <Radio.Group
								 {...field}
								 options={optionsWithDisabled}
								 onChange={onChange4}
								 value={value4}
								 optionType="button"
								 buttonStyle="solid"
							 />}/>

			<InputController label={`Category`} name={"category"}
							 render={({field}) => <SelectInput field={field} options={newCate} title={"Select categories"}/>}/>

			<InputController label={"Amount"} name={"amount"}
							 render={({field}) => <Input hidden defaultValue={0} placeholder="Amount" {...field}/>}/>

			<InputController name={"amountDisplay"}
							 render={({field}) => <Input defaultValue={0} placeholder="Amount" {...field}/>}/>


			<InputController label={`Note`} name={"notes"} render={({field}) => <TextArea placeholder="Note" {...field}/>}/>


			<InputController label={`Options repeat`} name={"sw"}
							 render={({field}) => <Switch {...field} className={`w-1/5`} onChange={handleSwitch}/>}/>


			<div className={cn({"hidden": !isRepeat, "block": isRepeat})}>
				<div className={`flex flex-col gap-4 w-full border-b-bodydark2 shadow-3 p-8`}>
					<InputController label={`Frequency`} name={"frequency"}
									 defaultValue={frequency}
									 render={({field}) => (
										 <Select
											 {...field}
											 defaultValue={"days"}
											 onChange={handleChangeFrequency}
											 options={optionsFrequency}
											 className={`w-full`}
										 />
									 )}
					/>

					<InputController label={`Every`} name={"every"}
									 defaultValue={selectedValue}
									 render={({field}) => <Select {...field} value={`${selectedValue} ${frequency}`} options={options}
																  onChange={handleChangeEvery}/>}/>


					<div className={`hidden`}>
						<InputController label={`Date`} defaultValue={setFormDate} name={"from_date"}
										 render={({field}) => <DatePicker className={`w-full`}
																		  minDate={dayjs(dayjs(), dateFormat)}
																		  onChange={handleFormDate} {...field}/>}/>
					</div>
					<label className={cn("mb-[-10px] block font-medium text-black")}>
						Date
					</label>
					<DatePicker className={`w-full`} defaultValue={setFormDate}
								minDate={dayjs(dayjs(), dateFormat)} onChange={handleFormDate}/>

				</div>

				{(frequency === "weeks" || frequency === "months") && <div className={`my-4 flex flex-col gap-4 p-8 shadow-3`}>
					{handleValueFrequency(frequency)}
                </div>}

				<div className={`flex flex-col gap-4 shadow-3 p-8`}>
					<InputController name={"tra"}
									 render={({field}) => (
										 <Radio.Group
											 {...field}
											 options={optionsTime}
											 onChange={onChangeTypeRepeat}
											 value={value}
											 optionType="button"
											 buttonStyle="solid"
											 className={`w-full`}
										 />
									 )}
					/>

					{value === optionTime.Until && (
						<InputController label={`Date`} defaultValue={dayjs(dayjs(), dateFormat)} name={"to_date"}
										 render={({field}) => <DatePicker className={`w-full`}
																		  minDate={dayjs(dayjs(), dateFormat)} {...field}/>}/>
					)}

					{value === optionTime.For && (
						<InputController name={"for_time"}
										 label={"Times"}
										 defaultValue={1}
										 render={({field}) => <Input defaultValue={1} {...field} />}
						/>
					)}
				</div>
			</div>
		</form>
	</>
})

export default RepeatForm