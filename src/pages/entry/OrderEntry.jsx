import { Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utillities";
import Options from "./Options";

export default function OrderEntry({ setOrderPhase }) {
  const { totals } = useOrderDetails();
  const grandTotal = totals.scoops + totals.toppings;
  const orderEnabled = totals.scoops === 0;

  return (
    <div>
      <Options optionType={"scoops"} />
      <Options optionType={"toppings"} />
      <h2>Grand total: {formatCurrency(grandTotal)}</h2>
      <Button disabled={orderEnabled} onClick={() => setOrderPhase("review")}>
        Order Sundae
      </Button>
    </div>
  );
}
