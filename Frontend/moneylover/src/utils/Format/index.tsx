import {useWalletCurrency} from "@/hooks/currency.ts";

interface props {
	number: string | number | undefined
}

// eslint-disable-next-line react-refresh/only-export-components
export const convertMoney = async (amountInVND: number | string, typeCurrent: string | undefined, type?: string | null) => {
	if (type != typeCurrent) {
		const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${typeCurrent}`);
		const data = await response.json();

		const rate = typeCurrent === "VND" ? data?.rates?.USD : data?.rates?.VND;
		return +amountInVND * rate;
	} else {
		return +amountInVND
	}
}

export const NumberFormatter = ({number}: props) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const currency = useWalletCurrency()
	const formatNumber = (number: number | undefined | string) => {
		const options = {
			style: 'currency',
			currency: currency || "VND",
			minimumFractionDigits: 2,
		};
		const locales = currency === "USD" ? "en-US" : "vi-VN";
		const formatter = new Intl.NumberFormat(locales, options);
		return formatter.format(number as number);
	};

	return (
		<>{formatNumber(number)}</>
	);
}

