import {motion as m} from "framer-motion";
import {FormProvider, UseFormReturn} from "react-hook-form";
import {InputAuthentication} from "@/commons";
import {Person} from "@/assets";

interface props {
	methods: UseFormReturn<{ email: string }, any, undefined>
	handleForgotPassword: (data: any) => void
}

const ForgotForm = ({methods, handleForgotPassword}: props) => {
	return <>
		<m.div
			initial={{y: "50%", opacity: 0, scale: 0.5}}
			animate={{y: 0, opacity: 1, scale: 1}}
			exit={{y: "-50%", opacity: 0, scale: 0.5}}
			transition={{duration: 0.4}}
			className="w-full border-stroke xl:w-1/2 xl:border-l-2">
			<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
				<span className={`text-xl text-black-2  font-semibold flex-center mb-4`}>Reset your password</span>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(handleForgotPassword)}>
						<InputAuthentication name={"email"} type={"email"}
											 placeholder={"Enter your email"} icons={<Person/>}
											 label={"Email"}/>

						<div className="mb-5">
							<button
								className="w-full cursor-pointer rounded-lg border bg-black p-4 text-white transition hover:bg-opacity-90">Sign
								in
							</button>
						</div>
					</form>
				</FormProvider>
			</div>
		</m.div>
	</>
}

export default ForgotForm