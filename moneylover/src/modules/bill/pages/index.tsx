import UserLayout from "@/layout/userLayout.tsx";
import {BreakCrumb} from "@/components";
import {Button} from "antd";
import {ModalPopUp} from "@/commons";
import {FormProvider, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import RepeatForm from "@/components/Form/RepeatForm.tsx";
import {yupResolver} from "@hookform/resolvers/yup";
import {RecurringSchema} from "@/libs/schema.ts";
import {handleValueRecurring} from "@/utils/handleValueRecurring.ts";
import {FormatValueInput} from "@/utils/Format/fortmat.value.input.ts";
import {useWalletStore} from "@/store/WalletStore.ts";
import useRequest from "@/hooks/useRequest.ts";
import {recurringRequest} from "@/model/interface.ts";
import {post} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";
import TableBill from "@/modules/bill/Component/Table";

const Bill = () => {

	const {walletSelect} = useWalletStore()
	const queryClient = useQueryClient()

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const methods = useForm({mode: "onChange", resolver: yupResolver(RecurringSchema)})


	const {mutate: billRecurring} = useRequest({
		mutationFn: (values: recurringRequest) => {
			return post({
				url: `bill/add`,
				data: values
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.transactions, nameQueryKey.wallet])
			setIsModalOpen(false)
			methods.reset({"amount": 0, "amountDisplay": "0"})
		}
	})
	const amount = methods.watch("amountDisplay")

	useEffect(() => {
		FormatValueInput(amount, methods.setValue, walletSelect?.currency)
	}, [amount, methods, walletSelect]);

	const handleOk = (data: any) => {
		const result = handleValueRecurring(data)
		billRecurring(result)
	}

	return <UserLayout>
		<BreakCrumb pageName={"Bill"}/>
		<div className={"container-wrapper relative p-10"}>
			<div className={`flex-center border-b-2 mt-20 md:mt-0 translate-x-[10px] pb-5 mb-10 md:mx-50`}>
				<Button onClick={() => setIsModalOpen(true)} size={`large`}>Add bills</Button>
			</div>
			<div className={`mt-8`}></div>
			<TableBill/>
		</div>
		<ModalPopUp isModalOpen={isModalOpen} handleOk={methods.handleSubmit(handleOk)} handleCancel={() => setIsModalOpen(false)}
					title={"Add budget"}>
			<FormProvider {...methods}>
				<RepeatForm/>
			</FormProvider>
		</ModalPopUp>

	</UserLayout>
}

export default Bill