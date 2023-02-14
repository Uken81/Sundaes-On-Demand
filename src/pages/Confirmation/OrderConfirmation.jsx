import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useOrderDetails } from "../../contexts/OrderDetails";

export default function OrderConfirmation({ setOrderPhase }) {
  const [orderNumber, setOrderNumber] = useState(null);
  const { resetOrder } = useOrderDetails();
  const [error, setError] = useState(false);

  const handleClick = () => {
    resetOrder();
    setOrderPhase("inProgress");
  };

  useEffect(() => {
    axios
      // in a real app we would get order details from context
      // and send with POST
      .post(`http://localhost:3030/order`)
      .then((response) => {
        setOrderNumber(response.data.orderNumber);
      })
      .catch((error) => {
        setError(true);
      });
  }, []);

  const newOrderButton = (
    <Button onClick={handleClick}>Create new order</Button>
  );

  const AlertBanner = ({ message, variant }) => {
    const alertMessage =
      message || "An unexpected error occurred. Please try again later.";
    const alertVariant = variant || "danger";

    return (
      <Alert variant={alertVariant} style={{ backgroundColor: "red" }}>
        {alertMessage}
      </Alert>
    );
  };

  if (error) {
    return (
      <>
        <AlertBanner message={null} variant={null} />
        {newOrderButton}
      </>
    );
  }
  if (orderNumber) {
    return (
      <div>
        <h1>Thank you!</h1>
        <h2>Your order number is {orderNumber}</h2>
        <Button onClick={handleClick}>Create new order</Button>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}
