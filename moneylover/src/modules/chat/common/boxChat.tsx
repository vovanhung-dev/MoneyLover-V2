import cn from "@/utils/cn";
import {Group, Message} from "@/modules/chat/function/chats.ts";
import {useCallback, useEffect, useState} from "react";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "@/libs/firebase.ts";
import {calculateElapsedTime} from "@/utils/day.ts";
import {useUserStore} from "@/modules/authentication/store/user.ts";

interface detailMess extends Message {
	time: string
}

interface props {
	isSelect: boolean
	group: Group
}


const BoxChat: React.FC<props> = ({isSelect, group}) => {
	const [messageLast, setMessageLast] = useState<detailMess>()
	const [timeCreateGroup, setTimeCreateGroup] = useState<string>("")
	const {user} = useUserStore.getState().user
	useEffect(() => {
		setTimeCreateGroup(calculateElapsedTime(group.createdAt))
		const q = query(collection(db, `groups/${group?.id}/messages`), orderBy('createdAt', 'asc'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const mess: detailMess[] = snapshot.docs.map(doc => {
				const data = doc.data() as detailMess
				const elapsedTime = calculateElapsedTime(data.createdAt);
				return {
					...data,
					time: elapsedTime
				}
			});
			const mes = mess.pop()
			setMessageLast(mes)
		});
		return () => unsubscribe()
	}, []);

	const classNameNoneMess = messageLast?.text ? "" : "py-2";

	const showMessageLast = useCallback(() => {

		if (messageLast?.sender?.id != user?.id) {
			if (!messageLast?.text && messageLast?.files) {
				return `${messageLast?.sender.username} send a photo`
			} else if (messageLast?.text) {
				return `${messageLast?.sender.username} : ${messageLast?.text}`
			} else {
				return "Say hello in a new group"
			}
		} else {
			if (!messageLast?.text && messageLast?.files) {
				return `You send a photo`
			} else if (messageLast?.text) {
				return messageLast?.text
			} else {
				return "Say hello in a new group"
			}
		}
	}, [messageLast])

	return <>
		<div
			className={cn(`items-center hover:scale-95  cursor-pointer duration-300 ${classNameNoneMess} flex rounded-3xl px-4 hover:border-gray-400`, {
				"bg-blue-200 hover:": isSelect,
				"hover:bg-gray-300": !isSelect
			})}>
			<img src="#" alt="" className={`size-10 rounded-full bg-black m-2`}/>
			<div className={` flex-col py-4 px-2 w-full hidden lg:flex`}>
				<div className={cn(`flex-between text-black items-start`)}>
					<span className={cn(`text-2xl font-bold line-clamp-1`)}>{group?.name}</span>
					<p className={cn(`text-sm font-thin relative`)}>{messageLast?.time || timeCreateGroup}
					</p>
				</div>
				<div className={cn(`text-bodydark2 text-sm flex-between gap-1 my-1`)}>
					<div className={`flex gap-2`}>
						<span
							className={`line-clamp-1`}>{showMessageLast()}
						</span>
					</div>
					{group.unreadCount[user?.id] > 0 &&
                        <div className={cn(`text-sm bg-red-400 text-white rounded-full size-5 items-center`, {"bg-blue-400": !isSelect})}>
                            <span className={`flex-center`}>{group.unreadCount[user?.id]}</span>
                        </div>}
				</div>
			</div>
		</div>
	</>
}

export default BoxChat