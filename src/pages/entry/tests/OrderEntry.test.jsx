import { render, screen, waitFor } from "@testing-library/react";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";

test.only("handles error for scoops and toppings routes", async () => {
  // Reset handlers
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  // Render OrderEntry
  render(<OrderEntry />);

  // Wait for our async function
  await waitFor(async () => {
    // Find alerts; we expect to appear async which will happen after promise is rejected
    const alerts = await screen.findAllByRole("alert");

    // We are expecting two alerts
    expect(alerts).toHaveLength(2);
  });
});

// Set up mock service worker to return errors for the scoops and toppings routes
// Steps: import server from mock service file, we listened with the server and reset the handler after each test, then closed the server after all the tests were finished
// We will need to create new handlers to override existing handlers
// import rest
// import server to override its handlers
