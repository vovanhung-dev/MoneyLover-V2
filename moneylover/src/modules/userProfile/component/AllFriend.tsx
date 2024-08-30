import LoadingSpin from "@/components/Loading/loading.tsx";
import {Avatar} from "@/assets";
import {Empty} from "antd";
import {useQuery} from "@tanstack/react-query";
import {get} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {FriendProps, User, walletProps} from "@/model/interface.ts";
import {motion as m} from "framer-motion"
import {useEffect, useRef, useState} from "react";
import cn from "@/utils/cn";
import {FilterWallet, ModalPopUp} from "@/commons";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {useWallet} from "@/context/WalletContext.tsx";
import {createGroupChat} from "@/modules/chat/function/chats.ts";
import usePostWalletMutate from "@/modules/wallet/function/postMutate.ts";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import usePostFriend from "@/modules/userProfile/function/postMutateFriend.ts";
import {typeAlert} from "@/utils";
import {toastAlert} from "@/hooks/toastAlert.ts";

const AllFriend = () => {
	const {user} = useUserStore.getState().user
	const [showOptional, setShowOptional] = useState<{ [key: string]: boolean }>({})
	const optionalRef = useRef<HTMLDivElement | null>(null);
	const [openWalletSelect, setOpenWalletSelect] = useState<boolean>(false)
	const {wallets} = useWallet()
	const [selectWallet, setSelectWallet] = useState<string>("")
	const [userFound, setUserFound] = useState<User>()
	const {addManager} = usePostWalletMutate()
	const {fetchGroups} = useChatStore()


	const handleClickOutside = (event: MouseEvent) => {
		if (optionalRef.current && !optionalRef.current.contains(event.target as Node)) {
			setShowOptional({["none"]: true})
		}
	};

	const handleShowWallet = () => {
		setOpenWalletSelect(!openWalletSelect)
	}


	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Gỡ bỏ sự kiện khi component unmount
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const {removeFriend} = usePostFriend()

	const getAllFriend = () => {
		return get({url: `friends-request`, params: {type: "accepted"}})
	}

	const {data, isLoading} = useQuery({
		queryKey: [nameQueryKey.friendsSearch,],
		queryFn: getAllFriend,
	})

	const handleAddManager = async () => {

		if (selectWallet && userFound) {
			const memberName: string[] = [`${user?.username}`, `${userFound?.username}`]
			const users: User[] = [user, userFound]
			const wallet = wallets.find((e) => e.id === selectWallet)
			if (wallet) {
				await addManager(createGroupChat(wallet.id, memberName.join(","), users), userFound, wallet.id)
				await fetchGroups()
				handleShowWallet()
			}
		} else {
			toastAlert({
				type: typeAlert.warning,
				message: "Select one wallet to share"
			})
		}
	}

	const result: FriendProps[] = data?.data || []

	const detailWallet = (e: walletProps): React.ReactNode | undefined => {
		if (e.main && e.user.id === user.id) {
			return <span className={`text-lg text-red-400`}>Main</span>
		}

		if (e.user.id != user.id) {
			return <p>Share by <p className={`font-bold text-lg`}>{e.user.username}</p></p>
		}

		return undefined
	}

	return <>
		<div>
			<m.div
				initial={{x: "50%", opacity: 0}}
				animate={{x: 0, opacity: 1}}
				exit={{x: "50%", opacity: 0}}
				className={`mt-8 grid grid-cols-2 gap-6`}>
				{isLoading ? <LoadingSpin/> :
					result.length > 0 ? result?.map((e) => (
						<div
							key={e.user.id}
							className={`p-4 relative mx-6 group shadow-3 flex-between rounded-lg border-bodydark border`}>
							<div className={`flex items-center gap-4`}>
								<img src={Avatar} alt={""} className={`size-10 rounded-full`}/>
								<div className={`flex flex-col justify-start`}>
									<span className={`font-bold text-lg`}>{e?.user?.username || "hehehe"}</span>
									<span className={`py-4 font-normal text-sm`}>{e?.user?.email || "hidden"}</span>
								</div>
							</div>
							<div ref={optionalRef} onClick={() => {
								setUserFound(e.user)
								setShowOptional({[e.user.id]: true})
							}}
								 className={cn(`text-2xl relative cursor-pointer hidden group-hover:flex duration-400 size-10 rounded-full p-1 bg-gray-400 opacity-80 font-bold items-center`
									 , {"flex": showOptional[e.user.id]})}>
								<span className={`absolute -top-0 right-[18%]`}>. . .</span>
							</div>
							<div ref={optionalRef} className={cn(`hidden absolute p-2 w-3/5 h-3/4 flex-col top-[75%] -right-[10%] bg-black`,
								{"flex": showOptional[e.user.id]})}>
								<div className={`flex flex-col`}>
									<button onClick={handleShowWallet}
											className={`border-b border-b-white text-white line-clamp-1 text-sm p-2 rounded-sm hover:bg-gray-400`}>Add
										friend to wallet
									</button>
									<button onClick={() => removeFriend(e.id)}
											className={`text-white text-sm p-2 rounded-sm  hover:bg-gray-400`}>Remove friend
									</button>
								</div>
							</div>
						</div>
					)) : <>
						{<Empty className={`col-span-2`}/>}
					</>
				}
			</m.div>
		</div>

		<ModalPopUp isModalOpen={openWalletSelect} handleOk={handleAddManager} title={"Select wallet"} handleCancel={handleShowWallet}>
			<FilterWallet chooseWallet={setSelectWallet} detailWallet={detailWallet} walletCurrent={selectWallet}/>
		</ModalPopUp>
	</>
}

export default AllFriend