import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import OrderEntry from "../OrderEntry";
import userEvent from "@testing-library/user-event";
test("Handles errors for scoops and toppings routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("if order button is disabled if no scoops have been ordered", async () => {
  const user = userEvent.setup();
  render(<OrderEntry />);

  const orderChocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  const orderButton = screen.getByRole("button", { name: "Order Sundae" });

  expect(orderButton).toBeDisabled();

  await user.clear(orderChocolateScoop);
  await user.type(orderChocolateScoop, "1");
  expect(orderButton).toBeEnabled();

  await user.clear(orderChocolateScoop);
  await user.type(orderChocolateScoop, "0");
  expect(orderButton).toBeDisabled();
});
