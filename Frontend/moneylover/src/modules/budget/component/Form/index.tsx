import {Button, DatePicker, Input, Radio, RadioChangeEvent, Select, Switch} from "antd";
import {InputController, SelectInput} from "@/commons";
import {useWallet} from "@/context/WalletContext.tsx";
import {antdOptions, parseNewWallet, parseToNewCate, walletProps} from "@/model/interface.ts";
import {useWalletStore} from "@/zustand/budget.ts";
import {useCategory} from "@/context/CategoryContext.tsx";
import {useEffect, useMemo, useState} from "react";
import {getCurrentOneWeek} from "@/utils/day.ts";
import cn from "@/utils/cn";
import cusDayjs from "@/hooks/cusDayjs.ts";

const optionsTypCate = [
	{label: 'Expense', value: 'Expense'},
	{label: 'Deb', value: 'Debt_Loan'},
];
const BudgetForm = () => {
	const [optionsTimeBudget] = useState<antdOptions[]>(() => getCurrentOneWeek())
	const [typeCate, setTypeCate] = useState<string>("Expense");

	const timeDefault = optionsTimeBudget[0].value
	const [start, setStart] = useState(cusDayjs(optionsTimeBudget[0].value.split("-")[0]))
	const [end, setEnd] = useState(cusDayjs(optionsTimeBudget[0].value.split("-")[1]))
	const [name, setName] = useState<string | null>("This week")
	const [rangeTime, setRangeTime] = useState<string>(timeDefault);
	const [walletShow, setWalletShow] = useState<walletProps>()
	const {wallets} = useWallet()
	const {categories, openModal, changeType} = useCategory()
	const {walletSelect} = useWalletStore()


	const onChange4 = (value: string) => {
		setRangeTime(value);
	};
	const newCategories = useMemo(() => {
		return parseToNewCate(categories)
	}, [categories])

	const newWallets = useMemo(() => {
		return parseNewWallet(wallets)
	}, [wallets])

	const walletNotGoal = useMemo(() => {
		const Wallets = newWallets.filter((el) => el.wallet_type != "goal")
		if (Wallets.find(w => w.id === walletSelect?.id)) {
			setWalletShow(walletSelect)
		} else {
			setWalletShow(wallets.filter((el) => el.type != "goal")[0])
		}
		return Wallets
	}, [wallets])

	const onChangeTypeCate = ({target: {value}}: RadioChangeEvent) => {
		changeType(value)
		setTypeCate(value);
	};
	useEffect(() => {
		if (rangeTime != "1") {
			const date = rangeTime.split("-")
			setStart(cusDayjs(date[0]))
			setEnd(cusDayjs(date[1]))
			setName(date[2])
		} else {
			console.log("heheh")
			// @ts-ignore
			setName(undefined)
			// @ts-ignore
			setStart(null)
			// @ts-ignore
			setEnd(null)
		}
	}, [rangeTime])

	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Wallet`} name={"wallet"} defaultValue={walletShow?.id}
							 render={({field}) => <SelectInput defaultValue={walletShow?.name} field={field} options={walletNotGoal}
															   title={"Select wallet"}/>}/>

			<InputController label={`Category type`} name={""}
							 render={({field}) => <div className={`flex gap-6`}><Radio.Group
								 {...field}
								 options={optionsTypCate}
								 onChange={onChangeTypeCate}
								 value={typeCate}
								 optionType="button"
								 buttonStyle="solid"
							 /><Button onClick={openModal} className={`border-none shadow-none`}>Create new</Button>
							 </div>}/>

			<InputController label={`Category`} name={"category"}
							 render={({field}) => <SelectInput field={field} options={newCategories}
															   title={"Select category"}/>}/>
			<InputController name={""}
							 render={({field}) => <Select
								 {...field}
								 defaultValue={rangeTime}
								 onChange={onChange4}
								 options={optionsTimeBudget}
							 />}/>

			<InputController label={`Amount`} name={"amount"}
							 render={({field}) => <Input hidden defaultValue={0} placeholder="Amount" {...field}/>}/>

			<InputController name={"amountDisplay"} render={({field}) => <Input defaultValue={0} placeholder="Amount" {...field}/>}/>

			<InputController label={`Start date`} isReset={true} className={cn({"hidden": rangeTime != "1"})} value={start}
							 name={"period_start"}
							 render={({field}) => <DatePicker className={cn({"hidden-date-picker": rangeTime != "1"})} hidden  {...field}/>}/>

			<InputController label={`End date`} isReset={true} className={cn({"hidden": rangeTime != "1"})} value={end} name={"period_end"}
							 render={({field}) => <DatePicker className={cn({"hidden-date-picker": rangeTime != "1"})} {...field}/>}/>

			<InputController label={`Repeat the budget`} name={"repeat_bud"} render={({field}) => <Switch className={`w-10`} {...field} />}/>
			<InputController name={"name"} isReset={true} value={name} render={({field}) => <Input hidden placeholder="Amount" {...field}/>}/>

		</form>
	</>
}

export default BudgetForm