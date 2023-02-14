import { useState } from "react";
import { Form, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { useOrderDetails } from "../../contexts/OrderDetails";

export default function ScoopOptions({ name, imagePath }) {
  const { updateItemCount } = useOrderDetails();
  const [isFormValidated, setIsFormValidated] = useState(true);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const currentValueFloat = parseFloat(inputValue);

    const valueIsValid =
      currentValueFloat >= 0 &&
      currentValueFloat <= 10 &&
      Math.floor(currentValueFloat) === currentValueFloat;

    setIsFormValidated(valueIsValid);

    const newValue = valueIsValid ? parseInt(currentValueFloat) : 0;
    updateItemCount(name, newValue, "scoops");
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
      <img
        style={{ width: "75%" }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} scoop`}
      />
      <Form.Group
        controlId={`${name}-count`}
        as={Row}
        style={{ marginTop: "10px" }}
      >
        <Form.Label column xs="6" style={{ textalign: "right" }}>
          {name}
        </Form.Label>
        <Col xs="5" style={{ textAlign: "left" }}>
          <Form.Control
            type="number"
            defaultValue={0}
            onChange={handleChange}
            isInvalid={!isFormValidated}
          ></Form.Control>
        </Col>
      </Form.Group>
    </Col>
  );
}
