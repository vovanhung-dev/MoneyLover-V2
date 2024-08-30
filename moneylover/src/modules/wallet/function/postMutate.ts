import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {ResponseData, User} from "@/model/interface.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";
import React from "react";

interface props {
	userId?: string
	walletId?: string
	permission?: string
}

const usePostWalletMutate = (setUserFound?: React.Dispatch<React.SetStateAction<User | undefined>>, setValue?: React.Dispatch<React.SetStateAction<string>>) => {
	const queryClient = useQueryClient()

	const {mutate: getUser} = useRequest({
		mutationFn: (value) => {
			return post({
				url: `user/${value}`,
			})
		},
		showSuccess: false,
		onSuccess: (res: ResponseData) => {
			setUserFound && setUserFound(res?.data)
		}
	})


	const {mutate: addManagerToWallet} = useRequest({
		mutationFn: (value: props) => {
			return post({
				url: `manager/add`,
				data: value
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.wallets])
			setUserFound && setUserFound(undefined)
			setValue && setValue("")
		}
	})

	const {mutate: removeManager} = useRequest({
		mutationFn: (value: props) => {
			return post({
				url: `manager/delete`,
				data: value
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.wallets])
		}
	})

	const {mutate: changeMainWallet} = useRequest({
		mutationFn: (value) => {
			return post({
				url: `wallet/changeMain/${value}`,
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.wallets])
		}
	})


	const {mutate: changePermission} = useRequest({
		mutationFn: (value: props) => {
			return post({
				url: `manager/permission/change`,
				data: value
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.wallets])
		}
	})


	const onChangeWalletMain = (id: string | undefined) => {
		changeMainWallet(id)
	};

	const addManager = async (func: Promise<void>, user: User | undefined, walletID: string) => {
		const param: props = {
			walletId: walletID,
			userId: user?.id
		}
		addManagerToWallet(param)
		setUserFound && setUserFound(undefined)
		await func
	}


	return {getUser, addManager, onChangeWalletMain, changePermission, removeManager}
}

export default usePostWalletMutate