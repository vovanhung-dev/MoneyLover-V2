import {swalAlert} from "@/hooks/swalAlert.ts";
import {routePath, typeAlert} from "@/utils/index.ts";
import {walletProps} from "@/model/interface.ts";
import {NavigateFunction} from "react-router-dom";

export const showModalNoWallet = (wallets: walletProps[], navigate: NavigateFunction, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
	if (wallets?.length === 0) {
		swalAlert({
			message: "You don't have wallet, do you want create a new wallet??",
			btnText: "Yes, i want",
			type: typeAlert.error,
			showCancel: true,
			thenFunc: (result) => {
				if (result.isConfirmed) {
					navigate(routePath.wallet.path, {state: {isModalOpen: true}})
				}
			}
		})
	} else {
		setIsModalOpen(true);
	}
};