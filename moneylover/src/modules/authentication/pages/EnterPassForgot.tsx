import LoadingComponent from "@/components/Loading";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {authChangePassSchema} from "@/libs/schema.ts";
import {InputAuthentication} from "@/commons";
import {Lock} from "@/assets";
import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {routePath} from "@/utils";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Error from "@/modules/authentication/component/Error.tsx";

interface sessionProps {
	session: string
	account: string
}

const ChangePasswordForgot = () => {
	const navigate = useNavigate()
	const methods = useForm({mode: "onChange", resolver: yupResolver(authChangePassSchema)})
	const [sessionLocal, setSessionLocal] = useState<sessionProps>()
	const [showErr, setShowErr] = useState<boolean>(false)

	const {mutate: validSession} = useRequest({
		mutationFn: (values) => {
			setSessionLocal(values)
			return post({
				url: "/auth/validate-session",
				data: values,
			});
		},
		showSuccess: false,
		onSuccess: (data) => {
			console.log(data)
			const result = data?.data
			setShowErr(!result)
		},
	})
	const {mutate: changePasswordForgot} = useRequest({
		mutationFn: (values) => {
			return post({
				url: "/auth/changePasswordForgot",
				data: values,
			});
		},
		onSuccess: (data) => {
			console.log(data)
			navigate(routePath.login.path)
		},
	})

	useEffect(() => {
		console.log(showErr)
		const queryParams = new URLSearchParams(location.search);
		const session = queryParams.get("s")
		const account = queryParams.get("account")
		if (session && account) {
			const data = {
				session,
				account
			}
			validSession(data)
		}
	}, [navigate, location]);

	const clickChangePassword = (data: any) => {
		if (sessionLocal) {
			const result = {
				...data,
				account: sessionLocal.account
			}
			changePasswordForgot(result)
		}
	}
	return <>{
		!showErr ?
			<div className={`h-screen`}>
				<LoadingComponent/>
				<div className="rounded-sm border border-stroke bg-white shadow-3 pt-10 mt-[300px]">
					<div className={`w-2/3 mx-auto pb-10`}>
						<span className={`text-xl text-black-2  font-semibold flex-center mb-4`}>Reset your password</span>
						<FormProvider {...methods}>
							<form onSubmit={methods.handleSubmit(clickChangePassword)}>

								<InputAuthentication name={"password"} type={"password"} placeholder={"6+ Characters"} icons={<Lock/>}
													 label={"Password"}/>
								<div className="mb-5">
									<button
										className="w-full cursor-pointer rounded-lg border bg-black p-4 text-white transition hover:bg-opacity-90">Change
									</button>
								</div>
							</form>
						</FormProvider>
					</div>
				</div>
			</div> :
			<>
				<Error/>
			</>
	}
	</>
}
export default ChangePasswordForgot