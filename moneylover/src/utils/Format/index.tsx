import {useWalletStore} from "@/store/WalletStore.ts";
import {useWalletCurrency} from "@/hooks/currency.ts";
import {useEffect, useState} from "react";

interface props {
	number: string | number
	type?: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const convertMoney = async (amountInVND: number | string, typeCurrent: string | undefined, type?: string | null) => {
	if (type != typeCurrent && typeCurrent) {
		const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${typeCurrent}`);
		const data = await response.json();

		const rate = typeCurrent === "VND" ? data?.rates?.USD : data?.rates?.VND;
		return +amountInVND * rate;
	} else {
		return +amountInVND
	}
}

export const NumberFormatter = ({number, type}: props) => {
	const {walletSelect} = useWalletStore();
	const currency = useWalletCurrency();
	const [formattedNumber, setFormattedNumber] = useState<number>(0);

	// Function to format the number
	const formatNumber = (num: number | string | undefined) => {
		const options = {
			style: 'currency',
			currency: walletSelect?.currency || "VND",
			minimumFractionDigits: 2,
		};
		const locales = walletSelect?.currency === "USD" ? "en-US" : "vi-VN";
		// @ts-ignore
		const formatter = new Intl.NumberFormat(locales, options);
		return formatter.format(num as number);
	};

	useEffect(() => {
		const fetchAndFormatNumber = async () => {
			if (number) {
				const numberWithCurrency = await convertMoney(number, type, currency);
				setFormattedNumber(numberWithCurrency);
			}
		};
		fetchAndFormatNumber();
	}, [number, walletSelect?.currency, currency]);

	return <>{formatNumber(formattedNumber)}</>;
};

