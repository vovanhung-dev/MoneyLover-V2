import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {walletProps} from "../model/interface.ts";

interface WalletState {
	walletSelect: walletProps | undefined
	addWallet: (budget: walletProps) => void
}

export const useWalletStore = create<WalletState>()(
	devtools(
		persist(
			(set) => ({
				walletSelect: undefined,
				addWallet: (wallet) => set(() => ({walletSelect: wallet})),
			}),
			{
				name: 'wallets',
			},
		),
	),
)