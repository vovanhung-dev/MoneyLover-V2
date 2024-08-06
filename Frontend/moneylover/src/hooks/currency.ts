import {useWalletStore} from "@/zustand/budget.ts";

export const useWalletCurrency = () => {
	const {walletSelect} = useWalletStore();
	return walletSelect?.currency;
};