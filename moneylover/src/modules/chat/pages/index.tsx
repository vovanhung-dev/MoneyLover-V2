import NavLeft from "@/modules/chat/component/navleft.tsx";
import Header from "@/modules/chat/component/header.tsx";
import Main from "@/modules/chat/component/main.tsx";
import {useEffect, useState} from "react";
import {Group} from "@/modules/chat/function/chats.ts";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import InformationRight from "@/modules/chat/component/informationRight.tsx";
import Media from "@/modules/chat/component/Media.tsx";
import {AnimatePresence} from "framer-motion";


const Chat = () => {
	const [group, setGroup] = useState<Group>();
	const [id, setId] = useState<string>("")
	const {groups, isInformationOpen, isMediaOpen} = useChatStore()
	useEffect(() => {
		const result = groups.find((el) => el.id === id);
		if (result) {
			setGroup(result);
			setId(result.id);
		} else if (groups.length > 0) {
			const firstGroup = groups[0];
			setGroup(firstGroup);
			setId(firstGroup.id);
		}
	}, [id, groups]);


	return <>
		<div className={`h-[90vh] rounded-lg mt-10 w-[80%] left-[50%] z-99 translate-x-[-50%] absolute bg-white flex`}>
			<NavLeft groups={groups} setId={setId} id={id}/>
			<div className={`flex flex-col w-full relative`}>
				{group && <Header name={group?.name}/>}
				{group ? <Main group={group}/> : <span className={`text-center mt-20 text-2xl text-bodydark2`}>No groups chat available</span>}
			</div>
			<AnimatePresence>
				{isInformationOpen && <InformationRight group={group}/>}
				{isMediaOpen && group && <Media group={group}/>}
			</AnimatePresence>
		</div>
	</>
}

export default Chat