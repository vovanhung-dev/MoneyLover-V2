import {Category} from "@/model/interface.ts";

export interface billResponse {
	id: number;

	amount: number;

	notes: string;

	category: Category;

	date: Date;

	from_date: Date;

	frequency: string;

	every: number;

	due_date: Date

	paid: boolean
}
