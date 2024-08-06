import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Lock, Logo, Person} from "@/assets";
import {InputAuthentication} from "@/commons";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {authSchema} from "@/libs/schema.ts";
import {motion as m} from "framer-motion";
import {routePath} from "@/utils";
import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {saveRefreshToken, saveToken, saveUser} from "@/utils/jwt.ts";
import LoadingComponent from "@/components/Loading";

interface account {
	email: string
	password: string
}

const Login: React.FC = () => {
	const navigate = useNavigate()
	const methods = useForm({mode: "onChange", resolver: yupResolver(authSchema)})

	const {mutate: login} = useRequest({
		mutationFn: (values: account) => {
			return post({
				url: "/auth/login",
				data: values,
			});
		},
		onSuccess: (data) => {
			if (data && data.success) {
				saveToken(data?.data?.access_token)
				saveRefreshToken(data?.data?.refresh_token)
				saveUser(JSON.stringify(data?.data?.user))
				navigate(routePath.dashboard.path)
			}
		},
	})

	const handleOnSubmit = async (data: any) => {
		login(data)
	}

	return (
		<>
			<LoadingComponent/>

			<div className="rounded-sm border border-stroke bg-white shadow-default mt-[200px]">
				<div className="flex flex-wrap items-center">
					<m.div
						initial={{x: -1000, opacity: 0}}
						animate={{x: 0, opacity: 1}}
						transition={{duration: 1, delay: 0.2, type: "spring", stiffness: 50}}
						className="hidden w-full xl:block xl:w-1/2">
						<div className="py-17.5 px-26 flex-center flex-col text-center">
							<Link to={routePath.register.path}>
								<button className={`border-bodydark2 duration-700 border rounded-md py-2 px-4 hover:scale-110 hover:shadow-3`}>
									Sign up
								</button>
							</Link>
							<span className="mt-15 inline-block">
                              <Logo/>
                          	</span>
						</div>
					</m.div>
					<m.div
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						transition={{duration: 3}}
						className="w-full border-stroke xl:w-1/2 xl:border-l-2">
						<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
							<h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
								Login
							</h2>
							<FormProvider {...methods}>
								<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
									<InputAuthentication name={"email"} type={"email"} placeholder={"Enter your email"} icons={<Person/>}
														 label={"Email"}/>

									<InputAuthentication name={"password"} type={"password"} placeholder={"6+ Characters"} icons={<Lock/>}
														 label={"Password"}/>

									<div className="mb-5">
										<button
											className="w-full cursor-pointer rounded-lg border bg-black p-4 text-white transition hover:bg-opacity-90">Sign
											in
										</button>
									</div>
									<div className="mt-6 text-center">
										<p>
											Don’t Remember password click here?{" "}
											<Link to={routePath.forgot.path} className="text-primary">
												Forgot
											</Link>
										</p>
									</div>
								</form>
							</FormProvider>
						</div>
					</m.div>
				</div>
			</div>
		</>
	);
};

export default Login;
