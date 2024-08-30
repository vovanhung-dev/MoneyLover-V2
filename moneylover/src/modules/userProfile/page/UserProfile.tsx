import {maskString} from "@/utils";
import {Avatar, ICopy} from "@/assets";
import {Button} from "antd";
import ArrowDown from "@/assets/icons/ArrowDown.tsx";
import ArrowUp from "@/assets/icons/ArrowUp.tsx";
import {motion as m} from "framer-motion";
import {FormProvider, useForm} from "react-hook-form";
import ResetPassword from "@/modules/dashboard/component/form/reset.tsx";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {yupResolver} from "@hookform/resolvers/yup";
import {passwordSchema} from "@/libs/schema.ts";

interface props {
	showChangePassword: boolean
	handleChangePasswordOpen: () => void
	handleOk: (data: any) => void
	savingID: () => void
}

const SettingUser: React.FC<props> = ({handleChangePasswordOpen, showChangePassword, handleOk, savingID}) => {
	const {user} = useUserStore.getState().user
	const method = useForm({mode: "onChange", resolver: yupResolver(passwordSchema)})

	return <>
		<div>
			<div className={`relative mt-15`}>
				<img src={Avatar} alt={""} className={`absolute object-fill size-20 rounded-full bg-black -top-10 right-[50%] translate-x-[50%]`}/>
				<div className={`grid grid-cols-4 shadow-3 px-4 py-14 rounded-lg items-center`}>
					<span className={`col-span-1 font-bold text-lg`}>Username :</span>
					<span className={`col-span-3`}>{user.username}</span>
					<span className={`col-span-1 font-bold text-lg`}>Email :</span>
					<span className={`col-span-3`}>{user.email}</span>
					<span className={`font-bold text-lg col-span-1`}>ID:</span>
					<div className={`flex items-center gap-4 w-full col-span-3`}>
						<span className={`text-sm font-normal font-satoshi `}>{maskString(user?.id)}
						</span>
						<ICopy func={savingID} className={`cursor-pointer hover:scale-110 duration-300`} width={30} height={30}/>
					</div>
				</div>
			</div>
			<Button className={`mt-8 duration-200`} onClick={handleChangePasswordOpen} type={"dashed"}>Change password
				{showChangePassword ? <ArrowDown/> : <ArrowUp/>}
			</Button>
			{
				showChangePassword && <m.div
                    key={"password"}
                    initial={{y: "-10%", opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: "-10%", opacity: 0, scale: 0.5}}
                    transition={{duration: 0.3}}
                >
                    <FormProvider {...method}>
                        <ResetPassword/>
                    </FormProvider>
                    <div className={`flex-center gap-4 mt-8`}>
                        <button onClick={handleChangePasswordOpen}
                                className={`py-2 px-4 rounded-lg bg-Primary text-white hover:scale-105 duration-200`}>Cancel
                        </button>
                        <button onSubmit={method.handleSubmit(handleOk)} type={"submit"}
                                className={`py-2 px-4 rounded-lg bg-primary text-white hover:scale-105 hover:bg-blue-300 duration-200`}>Change
                            password
                        </button>
                    </div>
                </m.div>
			}
		</div>
	</>
}

export default SettingUser