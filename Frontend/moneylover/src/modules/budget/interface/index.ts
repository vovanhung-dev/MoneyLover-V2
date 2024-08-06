import {Category} from "@/model/interface.ts";

interface baseBudget {
	id: string;
	amount: number;
	period_start: Date;

	period_end: Date;

	repeat: boolean;
	wallet: string
	name: string
}

export interface BudgetResponse extends baseBudget {

	category: Category;

}

export interface cateSimilar extends Category {
	idBudget: string
	amountBudget: number
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