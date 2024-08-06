import {useEffect, useState} from "react";
import {ModalPopUp} from "@/commons";
import {FormProvider, useForm} from "react-hook-form";
import RepeatForm from "@/components/Form/RepeatForm.tsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {RecurringSchema} from "@/libs/schema.ts";
import UserLayout from "@/layout/userLayout.tsx";
import {BreakCrumb} from "@/components";
import {Button} from "antd";
import {Plus} from "@/assets";
import {useWallet} from "@/context/WalletContext.tsx";
import {useNavigate} from "react-router-dom";
import {showModalNoWallet} from "@/utils/showModalNoWallet.tsx";
import {useWalletStore} from "@/zustand/budget.ts";
import {FormatValueInput} from "@/utils/Format/fortmat.value.input.ts";
import {recurringRequest} from "@/model/interface.ts";
import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";
import {handleValueRecurring} from "@/utils/handleValueRecurring.ts";
import useDataTransactionRecurring from "@/modules/transaction/function/transactionRecurring.ts";
import TableTransactionRecurring from "@/modules/transaction/component/Table/TransactionRecurring.tsx";

const RecurringTransaction = () => {
	const {wallets} = useWallet()
	const navigate = useNavigate()
	const {walletSelect} = useWalletStore()
	const queryClient = useQueryClient()


	const [isRepeatForm, setIsRepeatForm] = useState<boolean>(false);
	const methods = useForm({
		mode: "onChange",
		defaultValues: {amount: 0},
		resolver: yupResolver(RecurringSchema),
	})

	const amount = methods.watch("amountDisplay")

	const showModal = () => {
		showModalNoWallet(wallets, navigate, setIsRepeatForm)
	};
	const handleCancel = () => {
		setIsRepeatForm(false)
	}

	useEffect(() => {
		FormatValueInput(amount, methods.setValue, walletSelect?.currency)
	}, [amount, methods, walletSelect]);


	const {mutate: transactionRecurrings} = useRequest({
		mutationFn: (values: recurringRequest) => {
			return post({
				url: `transaction/recurring`,
				data: values
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet])
			handleCancel()
			methods.reset({"amount": 0, "amountDisplay": "0"})
		}
	})

	const {transactionData, isFetching} = useDataTransactionRecurring()
	const handleOk = (data: any) => {
		const result = handleValueRecurring(data)
		transactionRecurrings(result)
	}


	return <UserLayout>
		<BreakCrumb pageName={"Recurring transaction"}/>
		<div className={`w-full bg-white container-wrapper h-auto shadow-default pb-20`}>
			<div className={`flex-center pt-20 pb-4 border-b border-b-bodydark2 mx-50`}>
				<Button onClick={showModal}
						className={`lg:col-span-1 text-bodydark2 hover:scale-110 duration-500 flex-center gap-4`}>Add new<img
					src={Plus} alt=""/></Button>
			</div>
			<TableTransactionRecurring data={transactionData} isLoading={isFetching}/>
			<ModalPopUp isModalOpen={isRepeatForm} handleOk={methods.handleSubmit(handleOk)} handleCancel={handleCancel} title={"Add transaction"}>
				<FormProvider {...methods}>
					<RepeatForm/>
				</FormProvider>
			</ModalPopUp>
		</div>
	</UserLayout>

}

export default RecurringTransaction