import withSup from "../HOC/withSup.tsx";
import {lazy} from "react";


const Home = withSup(lazy(() => import("./visiter")))
const Login = withSup(lazy(() => import("./authentication/pages/login.tsx")))
const Forgot = withSup(lazy(() => import("./authentication/pages/forgot.tsx")))
const Register = withSup(lazy(() => import("./authentication/pages/register.tsx")))
const HomeUser = withSup(lazy(() => import("./dashboard/pages")))
const Budget = withSup(lazy(() => import("./budget/pages")))
const Transaction = withSup(lazy(() => import("./transaction/pages/index.tsx")))
export const RecurringTran = withSup(lazy(() => import("./transaction/pages/RecurringTransaction.tsx")))
const Wallet = withSup(lazy(() => import("./wallet/pages")))
const PageNotFound = withSup(lazy(() => import("./404")))
const Bill = withSup(lazy(() => import("./bill/pages")))

export {Home, HomeUser, Login, Bill, Wallet, PageNotFound, Register, Transaction, Budget, Forgot}
