import {Person} from "@/assets";
import {InputAuthentication} from "@/commons";

const forgot = () => {
	return <>
		<div className={`flex-center p-4 mt-[200px]`}>
			<div className={`h-[50vh] w-1/2`}>
				<form action="">
					<InputAuthentication name={"email"} type={"email"} placeholder={"Enter your email"} icons={<Person/>}
										 label={"Email"}/>
				</form>
			</div>
		</div>
	</>
}

export default forgot