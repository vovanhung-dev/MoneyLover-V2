import {InputController, SelectInput} from "@/commons";
import {Input} from "antd";

const currency = [
	{label: "VND", value: "VND"},
	{label: "USD", value: "USD"},
]


const WalletForm = () => {
	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController name={"name"} render={({field}) => <Input  {...field} placeholder={"Enter name wallet"}/>}/>


			<InputController name={"balance"} render={({field}) => <Input hidden defaultValue={0} placeholder="Amount" {...field}/>}/>
			<InputController name={"amountDisplay"} render={({field}) => <Input defaultValue={0} placeholder="Amount" {...field}/>}/>

			<InputController name={"currency"} render={({field}) => <SelectInput field={field} options={currency} title={"Select currency"}/>}/>

			<InputController defaultValue={"basic"} name={"type"} render={({field}) => <Input hidden {...field}/>}/>
		</form>
	</>
}

export default WalletForm