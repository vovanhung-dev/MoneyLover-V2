import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {User} from "@/model/interface.ts";

interface UserProps {
	user: User;
	refreshToken: string;
	accessToken: string;
}

interface Props {
	user: UserProps;
	saveUser: (user: UserProps) => void;
	removeUser: () => void;
}

export const useUserStore = create<Props>()(
	devtools(
		persist(
			(set) => ({
				user: {} as UserProps,
				saveUser: (user: UserProps) => set({user}),
				removeUser: () => set({user: {} as UserProps}),
			}),
			{
				name: 'user',
			},
		),
	),
);
