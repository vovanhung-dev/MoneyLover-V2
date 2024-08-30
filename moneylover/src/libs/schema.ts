import * as yup from "yup"
import dayjs from "dayjs";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const PATTERN_VALID_EMAIL = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const transactionSchema = yup.object().shape({
	wallet: yup.string().required('Select one wallet'),
	category: yup.string().required('Select one category'),
	date: yup.date().required("date is required"),
	amount: yup.number().nullable().required('Amount is required').typeError('Amount must be a number'),
	amountDisplay: yup.string(),
	notes: yup.string(),
	remind: yup.date(),
	exclude: yup.boolean()
})

export const walletSchema = yup.object().shape({
	name: yup.string().required("Enter name wallet"),
	type: yup.string().required("Select one type first"),
	balance: yup.number().nullable().required('balance is required').typeError('balance must be a number'),
	amountDisplay: yup.string(),
	currency: yup.string().required('Select one currency')
})

export const goalSchema = yup.object().shape({
	name: yup.string().required("Enter name wallet"),
	type: yup.string().required("Select one type first"),
	end_date: yup.date().required("End day is required").min(today, "End day must be later than today"),
	balance: yup.number().nullable().required('Amount is required').typeError('Amount must be a number'),
	start: yup.number()
		.nullable()
		.required('Start amount is required')
		.typeError('Field must be a number'),
	target: yup.number()
		.nullable()
		.required('Goal value is required')
		.typeError('Field must be a number').test('is-greater-than-start', 'Target must be greater than start amount', function (value) {
			const {start} = this.parent;
			return value > start;
		}),
	startDisplay: yup.string(),
	targetDisplay: yup.string(),
	currency: yup.string().required('Select one currency'),
});
export const authSchema = yup.object().shape({
	email: yup
		.string()
		.required('Email is required')
		.min(6, 'Email must be at least 6 characters')
		.max(60, 'Email must not exceed 60 characters')
		.matches(PATTERN_VALID_EMAIL, 'Email is not valid! ex:xxxxx@xxxx.xxx'),
	password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters")
})

export const authForgotSchema = yup.object().shape({
	email: yup
		.string()
		.required('Email is required')
		.min(6, 'Email must be at least 6 characters')
		.max(60, 'Email must not exceed 60 characters')
		.matches(PATTERN_VALID_EMAIL, 'Email is not valid! ex:xxxxx@xxxx.xxx'),
})

export const authCodeSchema = yup.object().shape({
	otp: yup.string().required("Otp is required").min(8, "Otp must be at least 6 characters"),
})

export const authChangePassSchema = yup.object().shape({
	password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})

export const authRegisterSchema = yup.object().shape({
	email: yup
		.string()
		.required('Email is required')
		.min(6, 'Email must be at least 6 characters')
		.max(60, 'Email must not exceed 60 characters')
		.matches(PATTERN_VALID_EMAIL, 'Email is not valid! ex:xxxxx@xxxx.xxx'),
	password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
	username: yup.string().required("Username is required")
})

export const budgetSchema = yup.object().shape({
	wallet: yup.string().required("Wallet is required"),
	category: yup.string().required('Select one category'),
	amount: yup.number().nullable().required('Amount is required').typeError('Amount must be a number'),
	amountDisplay: yup.string(),
	name: yup.string(),
	period_start: yup.date().required("date is required"),
	period_end: yup.date().required("End date is required")
		.when("period_start", (period_start, schema) => {
			return schema.test({
				name: 'is-greater-than-start',
				exclusive: false,
				message: 'End date cannot be before start date',
				params: {},
				test: function (value) {
					// @ts-ignore
					return value && period_start ? dayjs(value) >= dayjs(period_start) : true;
				}
			});
		})
		.min(dayjs().startOf('day').toDate(), "End date must be after today"),
	repeat_bud: yup.boolean()
})


export const passwordSchema = yup.object().shape({
	oldPassword: yup.string().required("Old password is required").min(6, 'Password must be at least 6 characters'),
	newPassword: yup.string().required("New password is required").min(6, 'Password must be at least 6 characters'),
	confirmPassword: yup.string().required("Confirm password is required").min(6, 'Password must be at least 6 characters')
})


export const RecurringSchema = yup.object().shape({
	wallet: yup.string().required('Select one wallet'),
	category: yup.string().required('Select one category'),
	amount: yup.number().nullable().required('Amount is required').typeError('Amount must be a number'),
	amountDisplay: yup.string(),
	notes: yup.string(),
	from_date: yup.date(),
	to_date: yup.date().when("from_date", (period_start, schema) => {
		return schema.test({
			name: 'is-greater-than-start',
			exclusive: false,
			message: 'End date cannot be before start date',
			params: {},
			test: function (value) {
				// @ts-ignore
				return value && period_start ? dayjs(value) >= dayjs(period_start) : true;
			}
		});
	}),
	frequency: yup.string(),
	every: yup.string(),
	for_time: yup.number().typeError('Field must be a number'),
})

export const categorySchema = yup.object().shape({
	type: yup.string().required('Select one type'),
	icon: yup.string().required('Select one icon'),
	name: yup.string().required('Name is required'),
})