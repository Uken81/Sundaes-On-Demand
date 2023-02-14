import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utillities";
import { SummaryForm } from "./SummaryForm";

export default function OrderSummary({ setOrderPhase }) {
  const { totals, optionCounts } = useOrderDetails();
  const grandTotal = totals.scoops + totals.toppings;

  const scoopArray = Object.entries(optionCounts.scoops);
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key} title={key} value={value}>
      {value} {key}
    </li>
  ));

  const hasToppings = totals.toppings > 0;
  let toppingsComponent = null;

  const toppingsDisplay = () => {
    const toppingArray = Object.entries(optionCounts.toppings);
    const toppingList = toppingArray.map(([key, value]) => (
      <li key={key} title={key} value={value}>
        {key}
      </li>
    ));

    if (hasToppings) {
      toppingsComponent = (
        <>
          <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
          <ul>{toppingList}</ul>
        </>
      );
    } else {
      toppingsComponent = null;
    }
  };
  toppingsDisplay();
  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      <ul>{scoopList}</ul>
      {toppingsComponent}
      <h2>Total {formatCurrency(grandTotal)}</h2>
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  );
}
