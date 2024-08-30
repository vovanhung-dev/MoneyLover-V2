import {InputController} from "@/commons";
import {Input} from "antd";

const ResetPassword = () => {
	return <>
		<form className={`flex flex-col gap-4 mt-5`}>
			<InputController label={`Old password`} name={"oldPassword"}
							 render={({field}) => <Input type="password" placeholder="Enter old password" {...field}/>}/>

			<InputController name={"newPassword"} label={`New password`}
							 render={({field}) => <Input {...field} type="password" placeholder={`Enter new password`}/>}/>

			<InputController name={"confirmPassword"} label={`Confirm password`}
							 render={({field}) => <Input {...field} type="password" placeholder={`Confirm password`}/>}/>
		</form>
	</>
}

export default ResetPassword