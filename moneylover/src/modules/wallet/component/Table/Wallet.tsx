import {Button, Empty, Spin, Switch} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import cn from "@/utils/cn";
import React, {useState} from "react";
import {NumberFormatter} from "@/utils/Format";
import {walletProps} from "@/model/interface.ts";
import {ModalPopUp} from "@/commons";
import usePostWalletMutate from "@/modules/wallet/function/postMutate.ts";
import {useUserStore} from "@/modules/authentication/store/user.ts";
import ListManager from "@/modules/wallet/component/Table/ListManager.tsx";

interface props {
	wallets: walletProps[],
	isFetching: boolean
	handleClick: (data: any) => void
}

const TableWallet: React.FC<props> = ({handleClick, wallets, isFetching}) => {

	const [wallet, setWallet] = useState<walletProps>()
	const {user} = useUserStore.getState().user
	const {onChangeWalletMain} = usePostWalletMutate()
	const [manager, setManager] = useState<boolean>(false)

	const handleOpenManager = () => {
		setManager(!manager)
	}


	const handleOkManager = (wallet: walletProps) => {
		setManager(!manager)
		setWallet(wallet)
	}


	const isOwnerWallet = (wallet: walletProps) => {
		const isManager = wallet.managers.filter((e) => e.user.id === user.id)
		if (isManager.length === 0) {
			return <Switch className={`w-1/2`} disabled={wallet?.main} checkedChildren={`Main wallet`}
						   onClick={() => onChangeWalletMain(wallet.id)}
						   checked={wallet?.main}
						   unCheckedChildren=""/>
		} else {
			return <span className={`font-bold text-sm`}></span>
		}
	}

	const showManagerLength = (e: walletProps) => {
		if (e.user.id != user.id) {
			return `Share by ${e.user.username}`
		}
	}


	return <>
		<div className={`text-center`}>
			<p className={`my-5 text-2xl font-bold  text-nowrap`}>List wallet</p>
			<div className={`grid pb-5 grid-cols-12 border-b-bodydark2 border-b text-center`}>
				<div className={`col-span-4 text-sm text-bodydark2`}>Name</div>
				<div className={`col-span-1 text-sm text-bodydark2`}>Type</div>
				<div className={`col-span-3 text-sm text-bodydark2`}>Balance</div>
				<div className={`col-span-2 text-sm text-bodydark2`}>Total manager</div>
				<div className={`col-span-1 text-sm text-bodydark2`}>Switch main</div>
				<div className={`col-span-1 text-sm text-bodydark2`}>Community</div>
			</div>
			{isFetching ?
				<Spin className={`flex justify-center mt-5`}
					  indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/> : wallets?.length === 0 ? (
					<Empty className={`mt-20`}/>
				) : (
					<>
						{wallets?.map((el, i) => (
							<div key={el.id} className={cn(`grid mt-2 grid-cols-12`, {"bg-blue-50": i % 2 === 0})}>
								<div onClick={() => handleClick(el)}
									 className={cn(`grid grid-cols-10 col-span-10 hover:scale-y-110 hover:font-semibold text-center duration-500 cursor-pointer py-4`)}>
									<span className={`col-span-4`}>{el.name}</span>
									<span className={`col-span-1`}>{el.type}</span>
									<span className={`col-span-3`}>{<NumberFormatter number={el.balance} type={el?.currency}/>}</span>
									<span className={`col-span-2`}>{showManagerLength(el)} ({el.managers.length})</span>
								</div>
								<span className={cn(`col-span-1 flex-center `)}>{
									isOwnerWallet(el)}</span>
								<div onClick={() => handleOkManager(el)} className={`col-span-1 items-center text-center flex `}>
									<Button>Manager</Button>
								</div>
							</div>
						))}

					</>
				)}
		</div>
		<ModalPopUp width={900} isModalOpen={manager} showOke={false} showCancel={false} handleCancel={handleOpenManager}
					title={`List manager`}>
			<>{wallet &&
                <ListManager wallets={wallets} wallet={wallet}
                />
			}
			</>
		</ModalPopUp>
	</>
}

export default TableWallet