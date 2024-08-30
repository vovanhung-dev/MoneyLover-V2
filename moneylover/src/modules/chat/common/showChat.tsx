import LoadingSpin from "@/components/Loading/loading.tsx";
import dayjs from "dayjs";
import cn from "@/utils/cn";
import MsgBox from "@/modules/chat/common/msg.tsx";
import {MergeMessage} from "@/modules/chat/function/chats.ts";
import React, {useEffect, useRef} from "react";
import {useUserStore} from "@/modules/authentication/store/user.ts";

interface props {
	isLoading: boolean
	sortMessages: MergeMessage[]
	messageContainerRef: React.RefObject<HTMLDivElement>
}

const ShowChat: React.FC<props> = ({isLoading, sortMessages, messageContainerRef}) => {
	const {user} = useUserStore.getState().user;
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({
				behavior: 'auto',
				block: 'end',
				inline: 'nearest'
			});
		}
	}, [sortMessages]);
	return <>
		<div ref={messageContainerRef}
			 className={`flex flex-col justify-end px-4 relative bg-main overflow-y-auto h-full max-h-[76vh] scrollbar-chat scroll-smooth`}>
			{sortMessages.length === 0 &&
                <span className={`mt-20 flex-center text-lg text-bodydark2`}>Send a new message in a group to everyone</span>}
			{isLoading && <LoadingSpin/>}
			<div className={`h-full flex flex-col gap-6`}>
				{sortMessages.map((msg, i) => {
					const isYour = msg?.sender?.id === user?.id
					return <div key={i} className={`pb-8`}>
						<span className={`w-full flex-center my-8 text-bodydark2`}>{dayjs(msg.timer).format("D MM, YYYY, h:mm A")}</span>
						<span className={cn(`text-bodydark2 ml-8`, {"hidden": isYour})}>{msg.sender.username}</span>
						{msg.message.map((item, index) => {
							const lastMessPerson = msg.message.length - 1 === index
							const firstMessPerson = index === 0
							return <div ref={i === sortMessages.length - 1 ? lastMessageRef : null} className={`pb-1`}>
								<MsgBox lengthMsg={msg.message.length} key={item.id} msg={item} isYour={isYour}
										lastMessagePerson={lastMessPerson}
										firstMessPerson={firstMessPerson}/>
							</div>
						})}
					</div>
				})}
			</div>
		</div>
	</>
}

export default ShowChat