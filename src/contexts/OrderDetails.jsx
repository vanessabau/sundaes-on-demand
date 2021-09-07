import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { pricePerItem } from "../constants";
import { formatCurrency } from "../utilities";

// @ts-ignore
const OrderDetails = createContext();

// create custom hook to check whether we're inside a provider
export function useOrderDetails() {
  const context = useContext(OrderDetails);
  // If there is no value that means we are not inside a provider and the context is undefined and totally useless to us so we throw an error
  if (!context) {
    throw new Error(
      "useOrderDetails must be used within an OrderDetailsProvider"
    );
  }
  // If we didn't throw an error that means we are wrapped in a provider and we return our context
  return context;
}

function calculateSubtotal(optionType, optionCounts) {
  let optionCount = 0;
  for (const count of optionCounts[optionType].values()) {
    optionCount += count;
  }

  return optionCount * pricePerItem[optionType];
}

// Functional cmp that returns our provider for our context which is a context, pass along any props we happen to receive; Value is getter and a setter
export function OrderDetailsProvider(props) {
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map(),
  });
  const zeroCurrency = formatCurrency(0);
  const [totals, setTotals] = useState({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency,
  });

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal("scoops", optionCounts);
    const toppingsSubtotal = calculateSubtotal("toppings", optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;
    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, optionType) {
      const newOptionCounts = { ...optionCounts };

      // update option count for this item with the new value
      const optionCountsMap = optionCounts[optionType];
      optionCountsMap.set(itemName, parseInt(newItemCount));

      setOptionCounts(newOptionCounts);
    }

    // alternate updateItemCount that DOES NOT mutate state. Reference Q&A:
    // https://www.udemy.com/course/react-testing-library/learn/#questions/14446658/
    // function updateItemCount(itemName, newItemCount, optionType) {
    //   // get option Map and make a copy
    //   const { optionType: optionMap } = optionCounts;
    //   const newOptionMap = new Map(optionMap);

    //   // update the copied Map
    //   newOptionMap.set(itemName, parseInt(newItemCount));

    //   // create new object with the old optionCounts plus new map
    //   const newOptionCounts = { ...optionCounts };
    //   newOptionCounts[optionType] = newOptionMap;

    //   // update state
    //   setOptionCounts(newOptionCounts);
    // }

    function resetOrder() {
      setOptionCounts({
        scoops: new Map(),
        toppings: new Map(),
      });
    }
    // getter: object containing option counts for scoops and toppings, subtotals and totals
    // setter: updateOptionCount
    // The end aray is the dependency
    return [{ ...optionCounts, totals }, updateItemCount, resetOrder];
  }, [optionCounts, totals]);
  return <OrderDetails.Provider value={value} {...props} />;
}
