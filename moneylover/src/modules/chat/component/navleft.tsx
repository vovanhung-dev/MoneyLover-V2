import BoxChat from "@/modules/chat/common/boxChat.tsx";
import {Group, markMessagesAsRead} from "@/modules/chat/function/chats.ts";
import React, {useEffect, useState} from "react";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import {useDebounce} from "@/hooks/useDebounce.tsx";

interface props {
	groups: Group[]
	setId: React.Dispatch<React.SetStateAction<string>>
	id: string
}

const NavLeft = ({groups, setId, id}: props) => {
	const {user} = useUserStore.getState().user
	const {fetchGroups, setIsMediaOpen, setIsInformationOpen} = useChatStore()
	const [groupss, setGroupss] = useState<Group[]>([])
	const [valueSearch, setValueSearch] = useState<string>("")
	const valueDebounce = useDebounce(valueSearch, 300)

	useEffect(() => {
		if (valueDebounce) {
			searchGroup(valueDebounce)
		}
	}, [valueDebounce]);
	useEffect(() => {
		setGroupss(groups)
	}, [groups]);

	const clickDetailMess = async (el: Group) => {
		if (el.unreadCount[user.id] > 0) {
			await markMessagesAsRead(el.id, user?.id)
			await fetchGroups()
		}

		if (valueSearch?.trim()) {
			setValueSearch("")
		}
		setId(el.id)
		setIsInformationOpen(false)
		setIsMediaOpen(false)
	}

	const searchGroup = (e: string) => {
		setValueSearch(e)
		const result = groups.filter((el) => (el.name.includes(e)))
		setGroupss(result)
	}


	return <>
		<div className={` w-40 lg:w-2/5 pl-4  bg-nav flex flex-col gap-4 pr-2`}>
			<span className={` pt-8 pb-4 font-bold text-sm md:text-2xl`}>Chats</span>
			<input type="search"
				   value={valueSearch}
				   onChange={(e) => setValueSearch(e.target.value)}
				   className="block w-full py-4 ps-4 text-sm text-gray-900 border rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 border-blue-200"
				   placeholder="Searching.." required/>
			<span className={`text-lg text-bodydark`}>All chat</span>
			{
				groupss?.map((el) => (
					<div key={el.id} onClick={() => clickDetailMess(el)}>
						<BoxChat isSelect={id === el.id} group={el}/>
					</div>
				))
			}
		</div>
	</>
}

export default NavLeft