import {Bill, Budget, Forgot, HomeUser, Login, RecurringTran, Register, Transaction, Wallet} from "@/modules";
import {IBudget, IDashBoard, ITransaction, IWallet} from "../assets";
import dayjs from "dayjs";

export function capitalizeFirstLetter(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export const enum typeAlert {
	success = "success",
	error = "error",
	info = "info",
	warning = "warning"
}


export interface route {
	path: string,
	name: string,
	element: () => JSX.Element
	icons: string
}

export const routePath = {
	login: {
		path: "/login",
		name: "Login",
		element: Login,
		icons: ""
	}, forgot: {
		path: "/forgot",
		name: "Forgot",
		element: Forgot,
		icons: ""
	},
	register: {
		path: "/register",
		name: "Register",
		element: Register,
		icons: ""
	}
	, dashboard: {
		path: "/dashboard",
		name: "Dashboard",
		element: HomeUser,
		icons: IDashBoard
	},
	transaction: {
		path: "/transaction",
		name: "Transaction",
		element: Transaction,
		icons: ITransaction
	}

	, budget: {
		path: "/budget",
		name: "Budget",
		element: Budget,
		icons: IBudget
	}
	, wallet: {
		path: "/wallet",
		name: "Wallet",
		element: Wallet,
		icons: IWallet
	}, bill: {
		path: "/bill",
		name: "Bill",
		element: Bill,
		icons: IWallet
	},
	recurring: {
		path: "/recurring",
		name: "Recurring",
		element: RecurringTran,
		icons: ITransaction
	}
}

export const routePathArray = () => {

	const result: route[] = []
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {login, register, forgot, ...route} = routePath
	Object.entries(route).map(([, value]) => {
		result.push(value)
	})
	return result
}


export const filterOptionSelect = (input: string, option?: { label: string; value: string }) =>
	(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const dateFormat = 'DD/MM/YYYY';


export const getCurrentWeek = () => {
	const now = dayjs();
	const currentMonth = now.month(); // Tháng bắt đầu từ 0 (tháng 1 là 0)
	const currentYear = now.year();

	const firstDayOfMonth = dayjs(new Date(currentYear, currentMonth, 1));
	const daysOfWeekInMonth: string[] = [];
	let currentDay = firstDayOfMonth;
	let firstDayOfWeek = currentDay.date();
	while (currentDay.isBefore(now) || currentDay.isSame(now, 'day')) {
		const dayOfWeekIndex = currentDay.date();
		const dayOfWeekIndex2 = currentDay.day();
		if (dayOfWeekIndex2 === 0) {
			daysOfWeekInMonth.push(`${firstDayOfWeek},${dayOfWeekIndex}`)
			firstDayOfWeek = dayOfWeekIndex + 1
		}
		if (currentDay.isSame(now, "day")) {
			daysOfWeekInMonth.push(`${firstDayOfWeek},${dayOfWeekIndex}`)
		}

		currentDay = currentDay.add(1, 'day');
	}
	return daysOfWeekInMonth
}
