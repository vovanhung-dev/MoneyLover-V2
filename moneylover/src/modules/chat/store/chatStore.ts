import create from 'zustand';
import {Group, getUserGroups, getLatestMessageForGroup} from "@/modules/chat/function/chats.ts";
import {useUserStore} from "@/modules/authentication/store/user.ts";

interface GroupState {
	groups: Group[];
	fetchGroups: () => Promise<void>;
	isOpenChat: boolean
	setIsOpenChat: (open: boolean) => void
	isChangeNameOpen: boolean
	setIsChangeNameOpen: (open: boolean) => void
	isInformationOpen: boolean
	setIsInformationOpen: (open: boolean) => void
	isMediaOpen: boolean
	setIsMediaOpen: (open: boolean) => void
}


export const useChatStore = create<GroupState>(set => {
	return ({
		groups: [],
		fetchGroups: async () => {
			const {user} = useUserStore.getState().user

			const groups = await getUserGroups(user?.id); // Adjust if needed
			const lastMess = await Promise.all(
				groups?.map(async (e) => {
					const result = await getLatestMessageForGroup(e.id);
					return {...e, result};
				}) ?? []
			);

			const sortedGroups = lastMess?.sort((a, b) => {
				// Sort by latest message timestamp if unread count is the same
				const latestMessageTimeA = a.result?.createdAt || 0;
				const latestMessageTimeB = b.result?.createdAt || 0;

				return +latestMessageTimeB - +latestMessageTimeA;
			});
			set({groups: sortedGroups});
		},
		isOpenChat: false,
		setIsOpenChat: (open: boolean) => {
			set({isOpenChat: open});
		},
		isChangeNameOpen: false,
		setIsChangeNameOpen: (open: boolean) => {
			set({isChangeNameOpen: open});
		},
		isInformationOpen: false,
		setIsInformationOpen: (open: boolean) => {
			set({isInformationOpen: open});
		},
		isMediaOpen: false,
		setIsMediaOpen: (open: boolean) => {
			set({isMediaOpen: open});
		},
	});
});