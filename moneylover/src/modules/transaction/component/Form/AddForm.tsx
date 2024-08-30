import {Button, DatePicker, Input, Radio, RadioChangeEvent, Switch} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, {useState} from "react";
import {InputController, SelectInput} from "@/commons";
import {useWallet} from "@/context/WalletContext.tsx";
import {useCategoryFetch} from "@/context/CategoryContext.tsx";
import {parseNewWallet, parseToNewCate, typeCategory, typeWallet} from "@/model/interface.ts";
import {useWalletStore} from "@/store/WalletStore.ts";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {dateFormat} from "@/utils";
import {openCategoryForm} from "@/store/CategoryStore.ts";

dayjs.extend(customParseFormat);

const optionsTypCateGoal = [
	{label: 'Expense', value: 'Expense'},
	{label: 'Income', value: 'Income'},
]
const optionsTypCate = [
	{label: 'Expense', value: 'Expense'},
	{label: 'Income', value: 'Income'},
	{label: 'Deb', value: 'Debt_Loan'},
];

const AddFormTransaction = React.memo(() => {

	const [valueCategory, setValueCategory] = useState<string>("Expense");

	const [resetValue, setResetValue] = useState<string | undefined>(undefined)

	const [exclude, setExclude] = useState<boolean>(false)

	const {wallets} = useWallet()

	const {categories, changeType} = useCategoryFetch()
	const {setOpenModal} = openCategoryForm()

	const newWallets = parseNewWallet(wallets)

	const newCate = parseToNewCate(categories)

	const {walletSelect} = useWalletStore()

	const onChangeCategory = ({target: {value}}: RadioChangeEvent) => {
		setResetValue(undefined)
		changeType(value)
		setValueCategory(value);
		setExclude(value === typeCategory.Deb)
	};


	const onChaneValueCate = (value: string) => {
		setResetValue(value)
	}

	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Wallet`} name={"wallet"} defaultValue={walletSelect?.id} value={walletSelect?.id}
							 render={({field}) => <SelectInput defaultValue={walletSelect?.name} field={field} options={newWallets}
															   title={"Select wallet"}/>}/>

			<InputController label={`Category type`} name={""}
							 render={({field}) => <div className={`flex items-center gap-6`}>
								 <Radio.Group
									 {...field}
									 defaultValue={"Expense"}
									 options={walletSelect?.type === typeWallet.Goal ? optionsTypCateGoal : optionsTypCate}
									 onChange={onChangeCategory}
									 value={valueCategory}
									 optionType="button"
									 buttonStyle="solid"
								 />
								 <Button className={`border-b-2 shadow-none`} onClick={() => setOpenModal(true)}>Create new category</Button>
							 </div>
							 }/>

			<InputController label={`Category`} name={"category"} defaultValue={undefined} value={resetValue}
							 render={({field}) => <SelectInput onChange={onChaneValueCate} defaultValue={resetValue} field={field} options={newCate}
															   title={"Select categories"}/>}/>

			<InputController label={`Date`} defaultValue={dayjs(dayjs(), dateFormat)} name={"date"}
							 render={({field}) => <DatePicker {...field}/>}/>

			<InputController label={"Amount"} name={"amount"}
							 defaultValue={0}
							 render={({field}) => <Input hidden defaultValue={0} placeholder="Amount" {...field}/>}/>

			<InputController name={"amountDisplay"}
							 defaultValue={0}
							 render={({field}) => <Input defaultValue={0} placeholder="Amount" {...field}/>}/>


			<InputController label={`Note`} defaultValue={''} name={"notes"} render={({field}) => <TextArea placeholder="Note" {...field}/>}/>

			<InputController label={`Exclude to report`} name={"exclude"} defaultValue={false}
							 render={({field}) => <Switch onClick={() => setExclude(!exclude)} checked={exclude}
														  className={`w-10`} {...field} />}/>

		</form>
	</>
})

export default AddFormTransaction