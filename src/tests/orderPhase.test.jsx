import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  //add ice cream scoops and toppings
  const vannilaSpinbutton = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  const chocalateSpinbutton = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  const hotFudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  await user.clear(vannilaSpinbutton);
  await user.type(vannilaSpinbutton, "1");

  await user.clear(chocalateSpinbutton);
  await user.type(chocalateSpinbutton, "1");
  await user.click(hotFudgeCheckbox);
  //find and click order button
  const orderButton = screen.getByRole("button", { name: "Order Sundae" });
  await user.click(orderButton);
  //check summary info based on order
  expect(
    await screen.findByRole("heading", { name: "Scoops: $4.00" })
  ).toBeInTheDocument();
  expect(screen.getByRole("listitem", { name: "Vanilla" })).toHaveValue(1);
  expect(screen.getByRole("listitem", { name: "Chocolate" })).toHaveValue(1);

  expect(
    screen.getByRole("heading", { name: "Toppings: $1.50" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("listitem", { name: "Hot fudge" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: "Total $5.50" })
  ).toBeInTheDocument();

  //accept terms and conditions and click button to confirm order
  await user.click(screen.getByLabelText("I agree to Terms and Conditions"));
  const confirmButton = screen.getByRole("button", {
    name: "Confirm order",
  });
  await user.click(confirmButton);
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();
  //confirm ordr number on confirmation page
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();
  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();
  expect(
    await screen.findByRole("heading", {
      name: "Your order number is 123455676",
    })
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Create new order" }));

  //check that scoops and toppings subtotals have been reset
  expect(await screen.findByText("Scoops total: $0.00")).toBeInTheDocument();
  expect(await screen.findByText("Toppings total: $0.00")).toBeInTheDocument();

  unmount();
});

test("if no toppings are ordered the toppings header should not appear", async () => {
  const user = userEvent.setup();
  render(<App />);

  const vannilaSpinbutton = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  const orderButton = screen.getByRole("button", {
    name: "Order Sundae",
  });

  await user.clear(vannilaSpinbutton);
  await user.type(vannilaSpinbutton, "1");
  await user.click(orderButton);

  const toppingsHeader = screen.queryByRole("heading", {
    name: /toppings/i,
  });
  expect(toppingsHeader).not.toBeInTheDocument();
  console.log("test", toppingsHeader);
});
