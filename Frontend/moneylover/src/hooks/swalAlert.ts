import {typeAlert} from "@/utils";
import Swal, {SweetAlertOptions, SweetAlertResult} from "sweetalert2";


interface swalAlertProps {
	type: typeAlert,
	message: string
	btnText?: string
	btnCancelText?: string
	thenFunc?: (result: SweetAlertResult<any>) => void
	showCancel?: boolean
	catchFunc?: (result: SweetAlertResult<any>) => void
	optional?: SweetAlertOptions
	title?: string
	denyBtn?: string
	showDeny?: boolean
}

export const swalAlert = (props: swalAlertProps) => {
	const {type, btnCancelText, showDeny, denyBtn, catchFunc, title, message, btnText, showCancel, thenFunc, optional} = props
	const options: SweetAlertOptions = {
		text: message,
		showCancelButton: showCancel,
		cancelButtonColor: "#d33",
		denyButtonColor: "#ae6d6d",
		cancelButtonText: btnCancelText || "Cancel",
		confirmButtonColor: "#3085d6",
		confirmButtonText: btnText ?? "OK",
		denyButtonText: denyBtn,
		showDenyButton: showDeny,
		showClass: {
			popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
		},
		hideClass: {
			popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
		},
		...optional
	}


	switch (type) {
		case typeAlert.success:
			return Swal.fire({...options, icon: "success", title: `${title || "Success"}`}).then(thenFunc).catch(catchFunc)

		case typeAlert.error:
			return Swal.fire({...options, icon: "error", title: `${title || "Error!"}`}).then(thenFunc).catch(catchFunc)

		case typeAlert.info:
			return Swal.fire({...options, icon: "info", title: `${title || "Info"}`}).then(thenFunc).catch(catchFunc)
		case typeAlert.warning:
			return Swal.fire({...options, icon: "warning", title: `${title || "Warning"}`}).then(thenFunc).catch(catchFunc)
	}
}