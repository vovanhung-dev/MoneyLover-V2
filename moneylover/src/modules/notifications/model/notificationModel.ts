export interface NotificationProps {
	id: string,
	user: string
	wallet: string
	unread: string
	category: string
	createdDate: string
	type: string
	message: string
}

export enum NotificationType {
	friend = "friend",
	transaction = "transaction",
	budget = "budget",
	budgetCreate = "budgetCreate"
}