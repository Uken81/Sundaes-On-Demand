import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("updates scoops subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType={"scoops"} />);

  const scoopSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopSubtotal).toHaveTextContent("0.00");

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopSubtotal).toHaveTextContent("2.00");

  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopSubtotal).toHaveTextContent("6.00");
});

test("updates topping subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType={"toppings"} />);

  const toppingSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingSubtotal).toHaveTextContent("0.00");

  const cherryCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherryCheckbox);
  expect(cherryCheckbox).toBeChecked();
  expect(toppingSubtotal).toHaveTextContent("1.50");

  const hotFudgeCheckbox = screen.getByRole("checkbox", {
    name: "Hot fudge",
  });
  await user.click(hotFudgeCheckbox);
  expect(toppingSubtotal).toHaveTextContent("3.00");

  await user.click(cherryCheckbox);
  expect(toppingSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at zero", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    expect(
      await screen.findByText("Grand total", { exact: false })
    ).toHaveTextContent("0.00");
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<OrderEntry />);

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    const hotFudgeCheckbox = screen.getByRole("checkbox", {
      name: "Hot fudge",
    });
    await user.click(hotFudgeCheckbox);

    expect(
      await screen.findByText("Grand total", { exact: false })
    ).toHaveTextContent("3.50");

    unmount();
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot fudge",
    });
    await user.click(hotFudgeCheckbox);

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(
      await screen.findByText("Grand total", { exact: false })
    ).toHaveTextContent("3.50");
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot fudge",
    });
    await user.click(hotFudgeCheckbox);
    expect(
      await screen.findByText("Grand total", { exact: false })
    ).toHaveTextContent("1.50");

    await user.click(hotFudgeCheckbox);
    expect(
      await screen.findByText("Grand total", { exact: false })
    ).toHaveTextContent("0.00");
  });
});
