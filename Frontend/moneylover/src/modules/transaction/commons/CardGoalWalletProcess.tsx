import {NumberFormatter} from "@/utils/Format";
import {Progress} from "antd";
import {useWalletStore} from "@/zustand/budget.ts";
import CalculatorWalletGoal from "@/modules/transaction/function/CalculatorWalletGoal.ts";
import {useCallback} from "react";

const CardGoalWalletProcess = () => {
	const {walletSelect} = useWalletStore()


	const goalWalletProcess = useCallback(() => {
		return CalculatorWalletGoal(walletSelect)
	}, [walletSelect])
	return <>
		<div className={`text-center flex flex-col gap-6 p-4`}>
			<h2 className={`text-3xl font-bold`}><NumberFormatter number={goalWalletProcess().totalLeft}/></h2>
			<p className={`text-2xl font-bold`}>{goalWalletProcess().isMonth > 0 ? `${goalWalletProcess().isMonth} month   ` : ""} {goalWalletProcess().timeLeft} days</p>
			<Progress percent={goalWalletProcess().percent} size="small" format={() => <><span></span></>}/>
			<span className={`bg-amber-100 py-1 px-4`}>You should save <NumberFormatter number={goalWalletProcess().totalLeft}/> more</span>
		</div>
	</>
}

export default CardGoalWalletProcess