import {countTotal} from "@/modules/dashboard/interface";

export interface IconProps {
	width?: string | number;
	height?: string | number;
	color?: string;
	className?: string
	func?: () => void
}

export interface FriendProps {
	createdAt: Date
	user: User
	id: string
}

export interface changePassword {
	email: string
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

export interface User {
	id: string,
	username: string
	email: string
	_enable: boolean
}

export interface Category {
	id: string,

	name: string;

	categoryIcon: string;

	categoryType: string;

	debt_loan_type: number;
}

export enum typeWallet {
	Goal = "goal",
	Basic = "basic"
}

export interface Categoryoptions {
	label: string,
	title: string,
	options: CategoryNew[]
}

export interface CategoryNew extends antdOptions {

	emoji: string;

	type: string;
}

export enum typeCategory {
	Expense = "Expense",
	Income = "Income",
	Deb = "Debt_Loan"
}

interface baseTran {
	amount: number;
	notes: string;
	date: string;

}

export interface transactionResponse extends baseTran {
	remind: boolean;
	exclude: boolean;
	id: number,
	category: Category
	done: boolean
	user: User
}

export interface recurringRequest extends baseTran {
	wallet: string;
	category: string;
	forever: boolean
	date_of_week: number;
	from_date: Date;
	to_date: Date;
	frequency: string
	every: string
	for_time: number
	occurrence_in_month: number
}

export interface transactionRequest extends baseTran {
	wallet: string;
	remind: Date;
	exclude: boolean;
	category: string;
	type: string;
}

export interface ResponseData {
	message: string
	data: any | pagination | countTotal
	error: string
	success: boolean
}

export interface ResponseFirebase {
	message: string,
	data: any
	success: boolean
}

export enum debt_loan_type {
	debt = 1,
	loan = 2
}

export interface pagination {
	content: never[]
	totalPage: number,
	documentsPerPage: number,
	pageNumber: number,
	totalDocument: number,
	isLast: boolean
}

export interface Manager {
	id: string
	user: User
	permission: string
	totalAmount: number | string
	totalTransaction: number | string
}

export const parseToNewCate = (categories: Category[]) => {
	const newCate: CategoryNew[] = categories.map((e) => ({
		value: `${e.id}.${e.categoryType}`,
		label: (e.name),
		emoji: e.categoryIcon,
		type: e.categoryType,
	}))
	return newCate
}

export const parseToAllCate = (categories: Category[]) => {
	return categories.reduce((result, cate) => {
		const exitCateType = result.find((c) => c.title === cate.categoryType)

		if (!exitCateType) {
			result.push({
				title: cate.categoryType,
				label: cate.categoryType,
				options: [{value: `${cate.id}.${cate.categoryType}`, label: cate.name, emoji: cate.categoryIcon, type: cate.categoryType}]
			})
		} else {
			exitCateType.options.push(
				{value: `${cate.id}.${cate.categoryType}`, label: cate.name, emoji: cate.categoryIcon, type: cate.categoryType}
			)
		}

		return result
	}, [] as Categoryoptions[])
}


export interface paginationRequest {
	pageNumber: number,
	documentsPerPage: number
	sort: string,
	field: string
}

export interface antdOptions {
	label: string
	value: string
}

export interface walletProps {
	id: string;
	name: string;
	type: string;
	balance: number;
	currency: string;
	start: number
	target: number
	main: boolean
	managers: Manager[]
	end_date: Date
	user: User
}


export enum Permission {
	Read = "Read",
	Write = "Write",
	Delete = "Delete",
	All = "All",
}


export function getPermissionOptions() {
	return Object.values(Permission).map(permission => ({
		value: permission,
		label: permission
	}));
}

interface RenamedWalletProps extends antdOptions {
	id: string
	wallet_type: string;
	balance: number;
}


export const parseNewWallet = (wallets: walletProps[]) => {
	const newWallets: RenamedWalletProps[] = wallets.map((el) => ({
		id: el.id,
		label: el.name,
		value: el.id,
		wallet_type: el.type,
		balance: el.balance
	}));
	return newWallets
}
