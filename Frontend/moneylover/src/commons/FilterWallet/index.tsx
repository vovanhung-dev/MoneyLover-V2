import { useWallet } from "@/context/WalletContext.tsx";
import cn from "@/utils/cn";
import { convertMoney, NumberFormatter } from "@/utils/Format";
import { useWalletCurrency } from "@/hooks/currency.ts";
import { useEffect, useState } from "react";

interface props {
  chooseWallet: (wallet: any) => void;
}

const FilterWallet: React.FC<props> = ({ chooseWallet }) => {
  const currency = useWalletCurrency();
  const { wallets } = useWallet();
  const [convertedBalances, setConvertedBalances] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchConvertedBalances = async () => {
      const newConvertedBalances: { [key: string]: number } = {};
      for (const wallet of wallets) {
        newConvertedBalances[wallet.id] = await convertMoney(
          wallet.balance,
          wallet.currency,
          currency
        );
      }
      setConvertedBalances(newConvertedBalances);
    };

    fetchConvertedBalances();
  }, [wallets, currency]);
  return (
    <>
      <div
        className={` h-[calc(100%*2)] overflow-y-scroll rounded-lg w-[40%] p-4 shadow-3 z-10 absolute top-[90%] left-[20px] bg-white`}
      >
        {wallets.map((el, i) => (
          <div
            key={el.id}
            onClick={() => chooseWallet(el)}
            className={cn(`cursor-pointer flex-between px-2 gap04 p-4`, {
              "border-b-bodydark2 border-b": i != wallets.length,
            })}
          >
            <span className={`font-bold text-2xl font-satoshi`}>{el.name}</span>
            <span>
              {convertedBalances[el.id] !== undefined ? (
                <NumberFormatter number={convertedBalances[el.id]} />
              ) : (
                "Loading..."
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FilterWallet;
