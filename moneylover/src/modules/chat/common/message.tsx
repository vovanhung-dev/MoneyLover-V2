import {useCallback, useEffect, useState} from "react";
import {collection, query, orderBy, onSnapshot, limit, getDocs, startAfter, DocumentSnapshot} from 'firebase/firestore';
import {db} from "@/libs/firebase.ts";
import {Message} from "@/modules/chat/function/chats.ts";
import {timeSendMess} from "@/utils/day.ts";

const useMessage = (groupId: string) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true); // Track if there are more messages

	const fetchMessage = useCallback(async () => {
		if (lastVisible) {
			setIsLoading(true)
			const q = query(
				collection(db, `groups/${groupId}/messages`),
				orderBy('createdAt', 'desc'),
				startAfter(lastVisible),
				limit(15)
			);
			const documentSnapshots = await getDocs(q);
			const newMessages: Message[] = documentSnapshots.docs.map(doc => {
				const data = doc.data() as Message;
				const timeSend = timeSendMess(data.createdAt);
				return {
					...data,
					time: timeSend.time,
					timer: timeSend.timer,
					id: doc.id,
					files: data.files || []
				};
			});
			setMessages(prev => [...prev, ...newMessages]);
			setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
			setIsLoading(false)
			setHasMoreMessages(documentSnapshots.docs.length === 10)
		}
	}, [groupId, lastVisible]);

	useEffect(() => {
		if (groupId) {
			const q = query(collection(db, `groups/${groupId}/messages`), orderBy('createdAt', 'desc'), limit(15));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const mess: Message[] = snapshot.docs.map(doc => {
					const data = doc.data() as Message
					const timeSend = timeSendMess(data.createdAt)
					return {
						...data,
						time: timeSend.time,
						timer: timeSend.timer,
						id: doc.id,
						files: data.files || []
					}
				});
				setMessages(mess);
				setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
				setHasMoreMessages(snapshot.docs.length === 10)

			});
			return () => unsubscribe(); // Clean up the subscription on unmount
		}
	}, [groupId]);

	return {messages, fetchMessage, isLoading, hasMoreMessages};
}

export default useMessage