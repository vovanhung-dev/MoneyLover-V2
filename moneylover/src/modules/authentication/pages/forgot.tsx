import {ForgotImg} from "@/assets";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {authCodeSchema, authForgotSchema} from "@/libs/schema.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {motion as m} from "framer-motion";
import LoadingComponent from "@/components/Loading";
import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {routePath} from "@/utils";
import {useEffect, useState} from "react";
import ForgotForm from "@/modules/authentication/component/Form/forgotForm.tsx";
import EnterCode from "@/modules/authentication/pages/enterCode.tsx";
import Error from "@/modules/authentication/component/Error.tsx";

interface props {
	email: string
	otp?: string
}

interface sessionProps {
	session: string
	account: string
}

const Forgot = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const methodsForgot = useForm({mode: "onChange", resolver: yupResolver(authForgotSchema)})
	const methodsEnter = useForm({mode: "onChange", resolver: yupResolver(authCodeSchema)})
	const [showEnter, setShowEnter] = useState<boolean>(false)
	const [showErr, setShowErr] = useState<boolean>(false)
	const [sessionLocal, setSessionLocal] = useState<sessionProps>()


	const {mutate: forgot} = useRequest({
		mutationFn: (values: props) => {
			return post({
				url: "/auth/forgot",
				data: values,
			});
		},
		onSuccess: (data) => {
			console.log(data)
			const result = data?.data
			if (result?.length > 1) {
				navigate(`/enter?s=${result[1]}&account=${result[0]}`)

			}
		},
	})

	const {mutate: validSession} = useRequest({
		mutationFn: (values: sessionProps) => {
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
			setShowEnter(result)
			setShowErr(!result)
		},
	})

	const {mutate: validOtp} = useRequest({
		mutationFn: (values: props) => {
			return post({
				url: "/auth/submitOtp",
				data: values,
			});
		},
		onSuccess: (data) => {
			console.log(data)
			if (sessionLocal) {
				navigate(routePath.changePass.path + `?s=${sessionLocal?.session}&account=${sessionLocal?.account}`)
			}
		},
	})

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const session = queryParams.get("s")
		const account = queryParams.get("account")
		if (session && account) {
			const data: sessionProps = {
				session,
				account
			}
			validSession(data)
		}
	}, [navigate, location]);

	const handleForgotPassword = (data: any) => {
		forgot(data)
	}

	const handleEnterCode = (data: any) => {
		console.log(data)
		if (sessionLocal) {
			const result = {
				...data,
				account: sessionLocal.account
			}
			validOtp(result)
		}
	}

	return <>
		<div className={`h-screen`}>
			<LoadingComponent/>
			<div className="rounded-sm border border-stroke bg-white shadow-3 pt-[300px]">
				{!showErr ?
					<div className="flex flex-wrap items-center">
						<m.div
							initial={{x: -1000, opacity: 0}}
							animate={{x: 0, opacity: 1}}
							transition={{duration: 1, delay: 0.2, type: "spring", stiffness: 50}}
							className="hidden w-full xl:block xl:w-1/2">
							<div className="px-13 flex-center flex-col text-center">
								<Link to={routePath.login.path}>
									<button className={`border-bodydark2 duration-700 border rounded-md py-2 px-4 hover:scale-110 hover:shadow-3`}>
										Back to login
									</button>
								</Link>
								<span className="mt-15 inline-block">
                              <ForgotImg width={350} height={350}/>
                          	</span>
							</div>
						</m.div>

						{!showEnter ? <ForgotForm handleForgotPassword={handleForgotPassword} methods={methodsForgot}/> :

							<EnterCode methods={methodsEnter} handleEnterCode={handleEnterCode}/>}
					</div> :
					<><Error/></>
				}

			</div>
		</div>
	</>
}

export default Forgot