import {ResponseFirebase} from "@/model/interface.ts";

export const successResponse = (message: string = "Successfully", data?: any): ResponseFirebase => {
	return {success: true, message, data}
}

export const errorResponse = (message: string = "Failure", data?: any): ResponseFirebase => {
	return {success: false, message, data}
}