import {useWallet} from "@/context/WalletContext.tsx";
import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import React from "react";
import {User, walletProps} from "@/model/interface.ts";
import Check from "@/assets/icons/check.tsx";
import {Button, Empty} from "antd";
import {routePath} from "@/utils";
import {useNavigate} from "react-router-dom";

interface props {
	chooseWallet: (id: string) => void;
	walletCurrent?: string
	showMoney?: boolean
	detailWallet?: (e: walletProps) => React.ReactNode
	userFound?: User
}

const FilterWallet: React.FC<props> = ({userFound, chooseWallet, walletCurrent, showMoney, detailWallet}) => {
	const navigate = useNavigate()
	const {wallets} = useWallet();

	return (
		<>
			<div
				className={cn(`h-[calc(100%*3)] gap-4 grid grid-cols-2 overflow-y-scroll rounded-lg w-[60%] p-4 shadow-3 z-1 absolute top-[90%] left-[20px] bg-white`
					, {
						"h-full w-full relative top-0 left-0": !showMoney,
						"grid-cols-1": wallets.length === 0
					})}
			>
				{wallets.length > 0 ? wallets.map((el) => (
						<div key={el.id} onClick={() => chooseWallet(el.id)}
							 className={`relative shadow-3 rounded-lg border border-bodydark p-4 flex-between cursor-pointer`}>
							<div className={`flex gap-4`}>
								<div className={cn(``, {"animate-click-effect": !showMoney && walletCurrent === el.id})}>
									<img src="https://img.icons8.com/?size=100&id=13016&format=png&color=000000" alt=""
										 className={`w-10 h-10 rounded-full bg-black`}/>
									<span className={`mt-2 line-clamp-1`}>{el.name}</span>
								</div>
								{detailWallet && detailWallet(el)}
							</div>
							{showMoney &&
                                <NumberFormatter number={el.balance} type={el.currency}/>
							}
							{userFound && <div
                                className={`absolute z-1  text-bodydark2 text-sm bottom-1 right-1`}>{el.managers.find((m) => m.user.id === userFound.id) ? "Shared" : ""}</div>}
							{walletCurrent === el.id && <Check className={`font-bold`} color={`red`}/>}
						</div>
					)) :
					<div className={`flex-center mx-auto w-full flex-col`}>
						<Empty description={`No wallet`}/>
						<Button className={`mt-4`} onClick={() => navigate(routePath.wallet.path, {state: {isModalOpen: true}})} type={"link"}>Click
							here to create new
							wallet</Button>
					</div>
				}
			</div>
		</>
	);
};

export default FilterWallet;
