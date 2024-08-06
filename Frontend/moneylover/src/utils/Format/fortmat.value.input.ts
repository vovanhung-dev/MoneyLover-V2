import {UseFormSetValue} from "react-hook-form";

export const FormatValueInput = (amount: string | undefined, setValue: UseFormSetValue<any>, currency: string | undefined, name1?: string, name2?: string, name3?: string) => {
	if (amount && amount.trim() !== '') {
		const value = amount.replace(/[.,$ ₫]/g, '')
		if (/^\d+$/.test(value) && !isNaN(parseInt(value))) {
			const locale = currency === 'VND' ? 'vi-VN' : 'en-US';
			const formattedAmount = new Intl.NumberFormat(locale, {
				minimumFractionDigits: 0
			}).format(+value);

			setValue(name1 || 'amount', +value, {shouldValidate: true});
			name3 && setValue(name3 || 'amount', +value, {shouldValidate: true});
			setValue(name2 || 'amountDisplay', formattedAmount, {shouldValidate: true})
		} else {
			setValue(name1 || 'amount', value, {shouldValidate: true});
		}
	} else {
		setValue(name1 || 'amount', null, {shouldValidate: true});
	}
}

