import {useEffect, useState} from "react";
import {FilterWallet, ModalPopUp, Notifications} from "@/commons";
import {Calender, IBell, IUser} from "@/assets";
import {useNavigate} from "react-router-dom";
import {useWallet} from "@/context/WalletContext.tsx";
import {useWalletStore} from "@/store/WalletStore.ts";
import {NumberFormatter} from "@/utils/Format";
import {useQueryClient} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {typeAlert} from "@/utils";
import {motion as m} from "framer-motion";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {toastAlert} from "@/hooks/toastAlert.ts";
import {Badge} from "antd";
import SettingUser from "@/modules/userProfile/page/UserProfile.tsx";
import Friends from "@/modules/userProfile/page/Friends.tsx";
import useNotifications from "@/modules/notifications/function";
import {useProfileStore} from "@/modules/userProfile/store";
import {useHeaderStore} from "@/store/HeaderStore.ts";
import useProfileFunction from "@/modules/userProfile/function";
import {walletProps} from "@/model/interface.ts";


enum statusNoti {
	All = "All",
	Unread = "Unread"
}

interface UserProfile {
	title: string
	func: () => void

}

const HeaderUser = () => {
	const navigate = useNavigate()
	const [currentDay, setCurrentDay] = useState<number>(0)
	const [btnType, setBtnType] = useState<string>(statusNoti.All)
	const {user} = useUserStore.getState().user
	const {removeUser} = useUserStore()
	const [showChangePassword, setShowChangePassword] = useState<boolean>(false)
	const queryClient = useQueryClient()
	const {isNotificationOpen, isWalletOpen, toggleName, changeStatusBtn, setFalseAll} = useHeaderStore()
	const {friendOpen, setFriendOpen, setProfileOpen, profileOpen} = useProfileStore()
	const {transactions, budgets, transaction, transaction_month, transaction_all} = nameQueryKey

	const {wallets} = useWallet()

	const {walletSelect, addWallet} = useWalletStore()

	const handleChangeStatusBtnNotification = (status: string) => {
		setBtnType(status)
	}

	const {notifications} = useNotifications(btnType)


	const handleCancel = () => {
		setProfileOpen(false)
		setFriendOpen(false)
	}

	const logout = (path: string = "/") => {
		removeUser()
		navigate(path)
	}

	const {handleOk} = useProfileFunction(logout)

	const today = () => {
		const date: Date = new Date()
		return date.getDate();
	}

	const jumpToDay = () => {
		console.log(new Date())
	}

	const chooseWallet = (id: string) => {
		const wallet = wallets.find(el => el.id === id)
		console.log(wallet)
		if (wallet) {
			addWallet(wallet)
		}
		// @ts-ignore
		queryClient.invalidateQueries([transactions, budgets, transaction, transaction_all, transaction_month])
		setFalseAll()
	}

	useEffect(() => {
		const walletMain = wallets.find(el => el.main && el.user.id === user.id)
		// Reset walletSelect khi phát hiện tài khoản mới
		const isManager = walletSelect?.managers.find((e) => e.user.id === user?.id);

		const updateWalletSelect = wallets.find(el => el.id === walletSelect?.id)
		if (!walletSelect || (walletSelect?.user?.id !== user.id) && !isManager) {
			addWallet(walletMain);
			return;
		}

		if (wallets.length === 0) {
			addWallet(undefined);
			return;
		}

		if (isManager) {
			addWallet(walletSelect);
			return;
		}

		if (!isManager && walletMain?.id !== walletSelect?.id && walletSelect?.user?.id !== user?.id) {
			addWallet(walletMain);
			return
		}

		if (updateWalletSelect) {
			addWallet(updateWalletSelect)
			return
		}

		addWallet(walletMain);
	}, [wallets, user?.id]);

	const handleChangePasswordOpen = () => {
		setShowChangePassword(!showChangePassword)
	}

	useEffect(() => {
		setCurrentDay(today())
	}, [user]);

	const savingID = () => {
		navigator.clipboard.writeText(user?.id).then(() =>
			toastAlert({type: typeAlert.success, message: "Copy successfully!"})
		)
	}

	const userProfile: UserProfile[] = [
		{
			title: "Setting",
			func: () => setProfileOpen(!profileOpen)
		},
		{
			title: "Friend",
			func: () => setFriendOpen(!friendOpen)
		},
		{
			title: "Logout",
			func: () => logout()
		}
	]

	const detailWallet = (e: walletProps): React.ReactNode | undefined => {
		if (e.main && e.user.id === user.id) {
			return <span className={`text-lg text-red-400`}>Main</span>
		}

		if (e.user.id != user.id) {
			return <p className={`font-bold text-lg`}>{e.user.username}</p>
		}

		return undefined
	}

	return <>
		<m.div
			className={`flex justify-between sticky top-0 z-1 right-0 bg-white mx-4 rounded-2xl items-center p-6 shadow-3 mt-4`}>
			<div className={`flex gap-4 cursor-pointer`} onClick={() => {
				changeStatusBtn("Wallet")
			}}>
				<img src="https://img.icons8.com/?size=100&id=13016&format=png&color=000000" alt="" className={`w-10 h-10 rounded-full bg-black`}/>
				<p>
					{wallets.length === 0 && <p>No wallet</p>}
					{wallets.length > 0 &&
                        <p className={`text-lg font-bold`}>{walletSelect?.name} <span
                            className={`text-sm font-normal`}>{walletSelect?.user?.id != user?.id && `Share by ${walletSelect?.user?.username}`}</span>
                        </p>}
					<span className={`font-bold font-satoshi`}>{<NumberFormatter
						number={walletSelect?.balance || 0}/>}</span>
				</p>
			</div>
			{isWalletOpen &&
                <FilterWallet detailWallet={detailWallet} chooseWallet={chooseWallet} walletCurrent={walletSelect?.id} showMoney={true}/>}
			{isNotificationOpen && <Notifications setBtnType={handleChangeStatusBtnNotification} btnType={btnType} notifications={notifications}/>}
			<div className={`flex gap-4 items-center relative`}>
				<div className={`cursor-pointer`} onClick={() => jumpToDay()}>
					<img src={Calender} alt=""/>
					<span className={`absolute bottom-0 left-[5%]`}>{currentDay}</span>
				</div>
				<Badge count={notifications.filter((e) => e.unread).length}>
					<m.div
						initial={{transform: "rotate(-9deg)"}}
						animate={{transform: "rotate(0)"}}
						transition={{duration: 0.4}}
						className={`cursor-pointer hover:animate-wiggle`} onClick={() => {
						changeStatusBtn("Notification")
					}}>
						<IBell/>
					</m.div>
				</Badge>
				<p onClick={() => {
					changeStatusBtn("Name")
				}} className={`cursor-pointer font-satoshi text-xl font-medium flex-between gap-2`}>
					<IUser/><span>{user?.username ?? "No name"}</span>
				</p>
			</div>
			{toggleName &&
                <>
                    <div className={`absolute top-[80px] bg-white p-8 shadow-3 right-0`}>
                        <ul className={`font-bold text-2xl`}>
							{userProfile.map((e) => (

								<li onClick={e.func}
									className={`cursor-pointer px-4 rounded-md hover:bg-gray-300 mx-2 mb-4 py-4 border-b-bodydark2 border-b`}>{e.title}
								</li>
							))}
                        </ul>
                    </div>
                </>
			}
		</m.div>
		<ModalPopUp isModalOpen={profileOpen} showOke={false} showCancel={false} handleCancel={handleCancel}
					title={`Change password`}>
			<SettingUser showChangePassword={showChangePassword} handleChangePasswordOpen={handleChangePasswordOpen} handleOk={handleOk}
						 savingID={savingID}/>
		</ModalPopUp>

		<ModalPopUp width={900} isModalOpen={friendOpen} showOke={false} showCancel={false} handleCancel={handleCancel}
					title={`Friends`}>
			<Friends/>
		</ModalPopUp>
	</>
}
export default HeaderUser