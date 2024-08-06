import {Progress} from "antd";
import cn from "@/utils/cn";
import {NumberFormatter} from "@/utils/Format";
import BoxBottomProcess from "../../commons/BoxCard";
import {CheckSpentOver} from "@/modules/budget/function/checkSpentOver.ts";
import {useWindowWidth} from "@/utils/checkWidthScreen";
import {useBudgetStore} from "@/modules/budget/store";
import {PercentAndTotalAmountTran} from "@/modules/budget/function/percentAndTotalAmountTran.ts";

const TopProcess = () => {
	const {budgetSelect} = useBudgetStore()
	const {percentSpent, totalTranAmount} = PercentAndTotalAmountTran()
	const windowWidth = useWindowWidth();

	const {spentOver, isOver} = CheckSpentOver(totalTranAmount(), budgetSelect?.amount)
	return <>
		<Progress type="dashboard" percent={percentSpent()} size={windowWidth > 689 ? 350 : 250} gapDegree={150} format={() => <>
			<p className={`text-xs font-satoshi text-bodydark2 mt-[-20px]`}>{isOver ? "OverSpent" : "Amount you can spend"}</p>
			<span className={cn(`text-2xl font-satoshi text-black-2`, {
				"text-red-700": isOver
			})}>{<NumberFormatter
				number={isOver ? spentOver : budgetSelect?.amount}/>}</span>
		</>}/>
		<div className={`flex-center w-[calc(100%+40px)] md:w-2/3 gap-4 md:shadow-3 md:p-4 rounded-lg`}>
			<BoxBottomProcess bottomText={'Total budgets'} topText={budgetSelect?.amount}/>
			<BoxBottomProcess bottomText={'Total spent'} topText={totalTranAmount()}/>
			<BoxBottomProcess bottomText={'Day left'} endDate={budgetSelect?.period_end} isDay={true} className={`border-none`}/>
		</div>
	</>
}

export default TopProcess