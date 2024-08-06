import {toast, ToastOptions} from "react-toastify";
import {typeAlert} from "@/utils";


interface alertProps {
	type: typeAlert
	message: string
}


export const toastAlert = (props: alertProps) => {
	const {message, type} = props

	const options: ToastOptions = {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	}

	switch (type) {
		case typeAlert.success:
			return toast.success(message, options);
		case typeAlert.error:
			return toast.error(message, options);
		case typeAlert.info:
			return toast.info(message, options);
	}
}