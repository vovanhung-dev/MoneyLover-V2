import {createContext, useContext, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {get} from "@/libs/api.ts";
import {ResponseData, walletProps} from "@/model/interface.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";


interface walletProp {
	wallets: walletProps[];
	isFetching: boolean;
}


interface propsChild {
	children: React.ReactNode
}

const walletContext = createContext<walletProp | undefined>(undefined);


export const WalletProvider: React.FC<propsChild> = ({children}) => {

	const fetchWallets = (): Promise<ResponseData> => {
		return get({url: "wallet/all"});
	};

	const {data, isFetching} = useQuery({
		queryKey: [nameQueryKey.wallet],
		queryFn: fetchWallets,
	});


	const walletData: walletProps[] = data?.data ?? [];
	const value = useMemo(() => ({
		wallets: walletData,
		isFetching,
	}), [isFetching]);

	return (
		<walletContext.Provider value={value}>
			{children}
		</walletContext.Provider>
	);
};

export const useWallet = (): walletProp => {
	const context = useContext(walletContext);
	if (context === undefined) {
		throw new Error("useWallet must be used within a WalletProvider");
	}
	return context;
};