import {useWalletStore} from "@/store/WalletStore.ts";

export const useWalletCurrency = () => {
	const {walletSelect} = useWalletStore();
	return walletSelect?.currency;
};