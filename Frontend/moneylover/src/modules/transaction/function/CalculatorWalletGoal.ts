import {walletProps} from "@/model/interface.ts";
import dayjs from "dayjs";

interface props {
	totalLeft: number
	timeLeft: number
	percent: number
	isMonth: number
}

const CalculatorWalletGoal = (wallet: walletProps | undefined): props => {
	if (wallet) {

		const totalLeft = wallet.target - wallet.balance;
		const timeLeft = dayjs(wallet.end_date).diff(dayjs(), "days")
		const dayInMonth = dayjs().daysInMonth()
		const isMonth = timeLeft > dayInMonth ? Math.floor(timeLeft / dayjs().daysInMonth()) : 0
		const percent = 100 - (totalLeft / wallet.target * 100)
		return {
			percent, timeLeft: timeLeft - (dayInMonth * isMonth), totalLeft, isMonth
		}
	}

	return {
		percent: 0, timeLeft: 0, totalLeft: 0, isMonth: 0
	}
}

export default CalculatorWalletGoal
