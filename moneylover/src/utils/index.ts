import {Bill, Budget, ChangePasswordForgot, Forgot, HomeUser, Login, RecurringTran, Register, Transaction, Wallet} from "@/modules";
import {IBudget, IDashBoard, ITransaction, IWallet} from "../assets";
import {IconProps} from "@/model/interface.ts";

export function capitalizeFirstLetter(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export const enum typeAlert {
	success = "success",
	error = "error",
	info = "info",
	warning = "warning"
}

export const colorsProgress = {
	green: "#87d068",
	red: "#ef1702"
}


export interface route {
	path: string,
	name: string,
	element: () => JSX.Element
	icons: React.FC<IconProps>
}

export const routePath = {
	login: {
		path: "/login",
		name: "Login",
		element: Login,
		icons: null
	}, forgot: {
		path: "/forgot",
		name: "Forgot",
		element: Forgot,
		icons: null
	},
	enterCode: {
		path: "/enter",
		name: "Enter",
		element: Forgot,
		icons: null
	},
	changePass: {
		path: "/change-password",
		name: "ChangePassword",
		element: ChangePasswordForgot,
		icons: null
	},
	register: {
		path: "/register",
		name: "Register",
		element: Register,
		icons: null
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

export const filterRoutes = (excludeKeys: string[]) => {
	const result: route[] = []
	const route = {...routePath}

	excludeKeys.forEach((key) => {
		// @ts-ignore
		delete route[key]
	})

	Object.entries(route).map(([, value]) => {
		result.push(<route>value)
	})

	return result
}

export const routePrivate = () => filterRoutes(['login', 'bill', 'register', 'forgot', "enterCode", "changePass", 'recurring'])

// Sử dụng cho public routes
export const routePublic = () => filterRoutes(['bill', 'budget', 'dashboard', 'wallet', 'transaction'])


export const filterOptionSelect = (input: string, option?: { label: string; value: string }) =>
	(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const dateFormat = 'DD/MM/YYYY';


export const limitNumber = (value: number, min: number, max: number) => {
	return Math.max(min, Math.min(max, value))
}

export const maskEmail = (email: string) => {
	// Split the email into two parts: the local part and the domain part
	const [localPart, domain] = email.split('@');

	// Mask the local part except for the first and last characters
	const maskedLocalPart = localPart[0] + '*'.repeat(localPart.length - 10) + localPart[localPart.length - 1];

	// Return the masked email
	return `${maskedLocalPart}@${domain}`;
};

export const maskString = (text: string) => {
	// Check if the string is long enough to mask
	if (text.length <= 10) {
		return text; // If the string is too short, return it unchanged
	}

	// Show the first 5 characters, then mask the middle part, and finally show the last 5 characters
	const firstPart = text.slice(0, 6); // First 5 characters
	const lastPart = text.slice(-5); // Last 5 characters

	const maskedPart = '*'.repeat(text.length - 10); // Mask the middle part

	return `${firstPart}${maskedPart.slice(0, 6)}${lastPart}`;
};


