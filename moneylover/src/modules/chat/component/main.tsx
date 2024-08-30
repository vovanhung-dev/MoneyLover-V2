import {useEffect, useRef, useState} from "react";
import useMessage from "@/modules/chat/common/message.tsx";
import {Group, MergeMessage, sendMessageToGroup} from "@/modules/chat/function/chats.ts";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import Search from "@/modules/chat/common/search.tsx";
import ChangeNameGroup from "@/modules/chat/common/changeNameGroup.tsx";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import {similarTime} from "@/utils/day.ts";
import ShowChat from "@/modules/chat/common/showChat.tsx";

interface props {
	group: Group
}

const Main = ({group}: props) => {
	const [newMessage, setNewMessage] = useState<string>('');
	const [sortMessages, setSortMessages] = useState<MergeMessage[]>([])
	const {messages, isLoading, fetchMessage} = useMessage(group.id);
	const {user} = useUserStore.getState().user;
	const {fetchGroups, isChangeNameOpen, setIsChangeNameOpen, setIsMediaOpen, setIsInformationOpen} = useChatStore()
	const messageContainerRef = useRef<HTMLDivElement>(null);

	const handleScroll = async () => {
		if (messageContainerRef.current) {
			const {scrollTop} = messageContainerRef.current;
			if (scrollTop === 0 && group && messages.length > 0) {  // User has scrolled to the top
				await fetchMessage();  // Fetch more messages
			}
		}
	};

	useEffect(() => {

		const container = messageContainerRef.current;
		container?.addEventListener('scroll', handleScroll);

		return () => {
			container?.removeEventListener('scroll', handleScroll);
		};
	}, [fetchMessage]);

	useEffect(() => {
		console.log(isLoading)

		const sortedMessages = messages?.sort((a, b) => {
			// Sort by latest message timestamp if unread count is the same
			const latestMessageTimeA = a?.createdAt || 0;
			const latestMessageTimeB = b?.createdAt || 0;

			return +latestMessageTimeA - +latestMessageTimeB;
		});
		const mergeMessSameTime = sortedMessages?.reduce((mess, curr) => {
			const existObj = mess.find((e: MergeMessage) => similarTime(e.timer, curr.timer) && e.sender.id === curr.sender.id)
			if (existObj) {
				existObj.message.push(curr)
			} else {
				mess.push({
					message: [{...curr}],
					time: curr.time,
					timer: curr.timer,
					sender: curr.sender
				})
			}
			return mess
		}, [] as MergeMessage[])
		setSortMessages(mergeMessSameTime)
	}, [messages]);

	const handleSendMessage = async (file: File[]) => {
		await sendMessageToGroup(group.id, user, newMessage, file);
		await fetchGroups()
		setNewMessage(''); // Clear input after sending
	};

	const handleClickCloseRight = () => {
		setIsMediaOpen(false)
		setIsInformationOpen(false)
	}

	return <>
		<div onClick={handleClickCloseRight} className={`h-full relative`}>
			<div className={`h-full`}>
				<ShowChat messageContainerRef={messageContainerRef} sortMessages={sortMessages} isLoading={isLoading}/>
				<Search handleSendMessage={handleSendMessage} setNewMessage={setNewMessage} message={newMessage}/>
			</div>
		</div>
		{isChangeNameOpen && <>
            <div
                onClick={() => setIsChangeNameOpen(!isChangeNameOpen)}
                className="fixed left-0 top-0 z-999 h-full w-full bg-black opacity-60"
            ></div>
            <ChangeNameGroup nameGroup={group?.name} cancel={() => setIsChangeNameOpen(!isChangeNameOpen)}
                             groupId={group.id}/>
        </>}
	</>
}

export default Main