import {InputController} from "@/commons";
import {Input} from "antd";

const ResetPassword = () => {
	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Old password`} name={"oldPass"} render={({field}) => <Input placeholder="Enter old password" {...field}/>}/>

			<InputController name={"newPass"} label={`New password`}
							 render={({field}) => <Input {...field} placeholder={`Enter new password`}/>}/>

			<InputController name={"firmPass"} label={`Confirm password`}
							 render={({field}) => <Input {...field} placeholder={`Confirm password`}/>}/>
		</form>
	</>
}

export default ResetPassword