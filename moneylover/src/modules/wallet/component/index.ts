import withSup from "@/HOC/withSup.tsx";
import {lazy} from "react";

export {default as TableWallet} from "./Table/Wallet.tsx";

const WalletForm = withSup(lazy(() => import("./Form/Basic.wallet.tsx")))
const GoalForm = withSup(lazy(() => import("./Form/Goal.wallet.tsx")))

export {WalletForm, GoalForm}