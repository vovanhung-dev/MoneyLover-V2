import useBudget from "@/modules/budget/function";
import {formatDate} from "@/utils/Format/formatDate.ts";
import {Tabs} from "antd";
import {useWalletStore} from "@/zustand/budget.ts";
import {useBudgetStore} from "@/modules/budget/store";
import {currentPositionStore} from "@/modules/budget/store/currentPositionSlider.ts";

const SliderBudget = () => {
	const {walletSelect} = useWalletStore()
	const {addBudget} = useBudgetStore()


	const {position, setPosition} = currentPositionStore()
	const {budgets} = useBudget(walletSelect?.id)

	const handleChange = (e: number) => {
		setPosition(e)
		addBudget(budgets[e])
	}


	return <>
		<div className={`flex-center gap-5`}>
			<div className={`items-center gap-4 md:mx-10 overflow-x-hidden`}>
				<Tabs
					type={'card'}
					onChange={(e) => handleChange(+e)}
					className={`w-full`}
					defaultActiveKey={position.toString()}
					items={budgets.map((_, i) => {
						const time = `${formatDate(_.period_start).toString()}-${formatDate(_.period_end).toString()}`
						return {
							label: `${!_.name ? `${time}` : `${_.name}`}`,
							key: (i).toString(),
						};
					})}
				/>

			</div>
		</div>
	</>
}

export default SliderBudget