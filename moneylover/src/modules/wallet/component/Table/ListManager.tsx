import {Manager, User, walletProps} from "@/model/interface.ts";
import {Empty, Input} from "antd";
import CardFound from "@/modules/wallet/common/cardFound.tsx";
import CardManager from "@/modules/wallet/common/cardManager.tsx";
import React, {useEffect, useState} from "react";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {useDebounce} from "@/hooks/useDebounce.tsx";
import usePostWalletMutate from "@/modules/wallet/function/postMutate.ts";
import {createGroupChat} from "@/modules/chat/function/chats.ts";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";

interface props {
	wallet: walletProps
	wallets: walletProps[]
}

const ListManager: React.FC<props> = ({wallet, wallets}) => {
	const {user} = useUserStore.getState().user
	const [managers, setManagers] = useState<Manager[]>([])
	const [value, setValue] = useState<string>("")
	const valueDebounce = useDebounce(value, 300)
	const [userFound, setUserFound] = useState<User>()
	const {getUser, addManager} = usePostWalletMutate(setUserFound)
	const {fetchGroups} = useChatStore()

	useEffect(() => {
		if (valueDebounce) {
			getUser(valueDebounce)
		}
	}, [valueDebounce]);

	const handleAddManager = async () => {
		const memberName: string[] = [`${user?.username}`, `${userFound?.username}`]
		if (userFound) {
			const users: User[] = [user, userFound]
			if (wallet) {
				await addManager(createGroupChat(wallet.id, memberName.join(","), users), userFound, wallet.id)
				await fetchGroups()
				setUserFound(undefined)
				setValue("")
			}
		}
	}

	useEffect(() => {
		const result = wallets.find((e) => e.id === wallet.id)
		if (result) {
			setManagers(result.managers)
		}
	}, [wallets]);

	const isOwner = () => {
		return wallet?.managers.filter((e) => e.user.id === user.id)
	}
	return <>
		<div className={`flex items-center gap-6 relative`}>
			<strong className={`py-2 px-4 text-lg border border-bodydark2 bg-bodydark2 text-white rounded-lg`}>Total manager: <span
				className={`text-sm font-thin`}>{wallet?.managers.length}</span></strong>
			<Input value={value} onChange={(e) => setValue(e.target.value)} className={`w-2/3`} type={`text`}
				   placeholder={"Enter code or email to add manager"}/>
			{userFound ?
				<CardFound addManager={handleAddManager} userFound={userFound}/>
				:
				value &&
                <>
                    <div
                        className={`absolute card_show shadow-card-2 flex gap-8 top-14 bg-gray-500 text-white rounded-xl rounded-tl-none right-[23%] w-1/2 p-4`}>

                        <Empty className={`text-white mx-auto`} description={"User not found"}/>
                    </div>
                </>
			}
		</div>
		{managers?.map((el) =>
			<CardManager key={el?.user?.id} manager={el} wallet={wallet} isOwner={isOwner()?.length == 0}/>
		)}
	</>
}

export default ListManager