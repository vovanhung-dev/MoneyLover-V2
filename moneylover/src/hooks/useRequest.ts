import type {UseMutationOptions} from "@tanstack/react-query";
import {useMutation} from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';
import {toastAlert} from "./toastAlert.ts";
import {typeAlert} from "@/utils";
import {swalAlert} from "./swalAlert.ts";
import {useLoading} from "@/context/LoadingContext.tsx";

interface Props extends UseMutationOptions<any, any, any, any> {
	errorToast?: string | null;
	showSuccess?: boolean
	showSwal?: boolean
}

const useRequest = ({onSuccess, onError, showSuccess = true, showSwal = false, ...props}: Props) => {
	const {setIsLoading} = useLoading();
	const mutate = useMutation<unknown, unknown, any, unknown>({
		...props,
		onMutate: () => {
			showSuccess && setIsLoading(true);
		},
		onSettled: () => {
			showSuccess && setIsLoading(false);
		},
		onSuccess(res, variables: void, context: unknown) {
			onSuccess?.(res, variables, context);
			showSwal ? swalAlert({
					message: (res as any)?.message,
					type: (res as any)?.success ? typeAlert.success : typeAlert.error,
				}) :
				showSuccess && toastAlert({
					type: (res as any)?.success ? typeAlert.success : typeAlert.error,
					message: (res as any)?.message
				})
		},
		onError(err: any, variables: void, context: unknown) {
			onError?.(err, variables, context);
			if (err && err.message) {
				swalAlert({
					message: err?.message,
					type: typeAlert.error
				})
			}
		},
	});
	return mutate
};

export default useRequest