import { useLocationState } from "@/lib/locationState/hooks";
import { LocationStateProvider } from "@/lib/locationState/Provider";
import { createNavigationMock } from "@/lib/locationState/test-utils/navigation.mock";
import { renderWithUser } from "@/lib/locationState/test-utils/render";
import { screen, waitFor } from "@testing-library/react";

function LocationSyncCounter() {
  const [counter, setCounter] = useLocationState({
    name: "counter",
    defaultValue: 0,
    storeName: "session",
  });
  return (
    <div>
      <h1>counter: {counter}</h1>
      <button onClick={() => setCounter(counter + 1)}>increment</button>
    </div>
  );
}

function LocationSyncCounterPage() {
  return (
    <LocationStateProvider>
      <LocationSyncCounter />
    </LocationStateProvider>
  );
}

const mockNavigation = createNavigationMock("/");
// @ts-ignore
globalThis.navigation = mockNavigation;

beforeEach(() => {
  mockNavigation.navigate("/");
  sessionStorage.clear();
});

test("`counter` can be updated.", async () => {
  // Arrange
  mockNavigation.navigate("/counter-update");
  const { user } = renderWithUser(<LocationSyncCounterPage />);
  // Act
  await user.click(await screen.findByRole("button", { name: "increment" }));
  // Assert
  expect(screen.getByRole("heading")).toHaveTextContent("counter: 1");
});

test("`counter` is reset at navigation.", async () => {
  // Arrange
  mockNavigation.navigate("/counter-reset");
  const { user } = renderWithUser(<LocationSyncCounterPage />);
  await user.click(await screen.findByRole("button", { name: "increment" }));
  // Act
  mockNavigation.navigate("/anywhere");
  // Assert
  await waitFor(() =>
    expect(screen.getByRole("heading")).toHaveTextContent("counter: 0"),
  );
});
