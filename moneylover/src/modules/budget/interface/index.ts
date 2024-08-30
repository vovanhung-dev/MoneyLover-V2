import {Category, User} from "@/model/interface.ts";

interface baseBudget {
	id: string;
	amount: number;
	period_start: string;
	period_end: string;
	repeat: boolean;
	wallet: string
	name: string
	user: User
}

export interface BudgetResponse extends baseBudget {
	category: Category;
}

export interface cateSimilar extends Category {
	idBudget: string
	amountBudget: number
	user: User
}

export interface BudgetSimilar extends baseBudget {
	category: cateSimilar[];
}

export interface BudgetRequest extends baseBudget {
	category: string;
	repeat: boolean;

	name: string
	isReplace: boolean
	overWrite: boolean
}