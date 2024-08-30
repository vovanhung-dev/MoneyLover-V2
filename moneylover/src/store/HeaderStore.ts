import create from "zustand";

type typeSetFalse = "Notification" | "Wallet" | "Name" | string;

interface HeaderStore {
	isNotificationOpen: boolean
	isWalletOpen: boolean
	toggleName: boolean
	setFalseAll: () => void
	changeStatusBtn: (type: typeSetFalse) => void
}

const typeTurnOff = {
	Notification: {
		isNotificationOpen: true,
		toggleName: false,
		isWalletOpen: false
	},
	Wallet: {
		toggleName: false,
		isWalletOpen: true,
		isNotificationOpen: false
	},
	Name: {
		toggleName: true,
		isWalletOpen: false,
		isNotificationOpen: false
	}
}


export const useHeaderStore = create<HeaderStore>(set => ({
	isNotificationOpen: false,
	isWalletOpen: false,
	toggleName: false,
	setFalseAll: () => {
		set({toggleName: false, isWalletOpen: false, isNotificationOpen: false});
	},
	changeStatusBtn: (type: string) => {
		// @ts-ignore
		const result = typeTurnOff[type]
		set({...result})
	},
}));