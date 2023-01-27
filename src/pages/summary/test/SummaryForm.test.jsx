import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SummaryForm } from "../SummaryForm.jsx";

test("if initial conditions are correct", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", { name: "Confirm order" });
  expect(confirmButton).toBeDisabled();
});

test("if checkbox enables button first click and disables on second click", async () => {
  render(<SummaryForm />);
  const user = userEvent.setup();

  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  const confirmButton = screen.getByRole("button", { name: "Confirm order" });

  await user.click(checkbox);
  expect(confirmButton).toBeEnabled();

  await user.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
  render(<SummaryForm />);
  const user = userEvent.setup();

  const nullpopover = screen.queryByText(
    "No ice cream will actually be delivered"
  );
  expect(nullpopover).not.toBeInTheDocument();

  const termsAndConditions = screen.getByText("Terms and Conditions");
  await user.hover(termsAndConditions);
  const popover = screen.queryByText("No ice cream will actually be delivered");
  expect(popover).toBeInTheDocument();

  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();
});
