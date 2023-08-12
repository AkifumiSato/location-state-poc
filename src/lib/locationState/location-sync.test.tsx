import { useLocationState } from "@/lib/locationState/hooks";
import { LocationStateProvider } from "@/lib/locationState/Provider";
import { renderWithUser } from "@/lib/locationState/test-utils/render";
import { screen } from "@testing-library/react";

function LocationSyncCounter() {
  const [counter, setCounter] = useLocationState({
    name: "counter",
    defaultValue: 0,
    storeName: "session-storage",
  });
  return (
    <div>
      <h1>counter: {counter}</h1>
      <button onClick={() => setCounter(counter + 1)}>increment</button>
    </div>
  );
}

test("`counter` can be updated.", async () => {
  // Arrange
  const { user } = renderWithUser(
    <LocationStateProvider>
      <LocationSyncCounter />
    </LocationStateProvider>,
  );
  // Act
  await user.click(await screen.findByRole("button", { name: "increment" }));
  // Assert
  expect(screen.getByRole("heading")).toHaveTextContent("counter: 1");
});

test.todo("`counter` is reset at navigation.");
