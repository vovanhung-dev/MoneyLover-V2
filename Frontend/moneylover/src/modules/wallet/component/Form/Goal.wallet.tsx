import {InputController, SelectInput} from "@/commons";
import {DatePicker, Input} from "antd";

const currency = [
	{label: "VND", value: "VND"},
	{label: "USD", value: "USD"},
]


const WalletForm = () => {
	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Name wallet`} name={"name"} render={({field}) => <Input  {...field} placeholder={"Enter name wallet"}/>}/>

			<InputController defaultValue={"goal"} name={"type"} render={({field}) => <Input hidden {...field}/>}/>

			<InputController label={`Currency`} name={"currency"}
							 render={({field}) => <SelectInput field={field} options={currency} title={"Select currency"}/>}/>


			<InputController name={"balance"} defaultValue={0}
							 render={({field}) => <Input hidden {...field} />}/>
			<InputController label={`Start amount`} name={"start"} defaultValue={0}
							 render={({field}) => <Input hidden {...field}/>}/>
			<InputController name={"startDisplay"} defaultValue={0}
							 render={({field}) => <Input defaultValue={0} {...field} placeholder={"Enter starting amount"}/>}/>

			<InputController label={`Goal amount`} name={"target"} defaultValue={0}
							 render={({field}) => <Input defaultValue={0} hidden {...field} placeholder={"Enter goal amount"}/>}/>
			<InputController name={"targetDisplay"} defaultValue={0}
							 render={({field}) => <Input defaultValue={0} {...field} placeholder={"Enter goal amount"}/>}/>

			<InputController name={"end_date"} render={({field}) => <DatePicker placeholder={`Ending date`} {...field}/>}/>

		</form>
	</>
}

export default WalletForm