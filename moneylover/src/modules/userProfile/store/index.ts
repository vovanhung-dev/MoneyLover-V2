import {create} from "zustand";

interface props {
	typeFriend: btnSelect,
	setTypeFriend: (e: btnSelect) => void,
	setFriendOpen: (open: boolean) => void,
	friendOpen: boolean,
	profileOpen: boolean,
	setProfileOpen: (open: boolean) => void,
	typeFriendRequest: friendRequest,
	setTypeFriendRequest: (e: friendRequest) => void,
}

type friendRequest = "pending" | "accepted" | string;

type btnSelect = "All" | "Request" | "Add" | string;

export const useProfileStore = create<props>((set) => ({
	typeFriend: "All",
	setTypeFriend: (e: btnSelect) => set(() => ({typeFriend: e})),
	typeFriendRequest: "none",
	setTypeFriendRequest: (e: friendRequest) => set(() => ({typeFriendRequest: e})),
	friendOpen: false,
	setFriendOpen: (e: boolean) => set(() => ({friendOpen: e})),
	profileOpen: false,
	setProfileOpen: (e: boolean) => set(() => ({profileOpen: e})),
}))

