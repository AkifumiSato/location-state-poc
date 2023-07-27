import { SessionStorageStore } from "./SessionStorageStore";

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

beforeEach(() => {
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
});

test("When not updated, the value specified in the initial value is obtained.", () => {
  // Arrange
  const store = new SessionStorageStore({
    foo: "bar",
    baz: "qux",
  });
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBe("bar");
});

test("After updating a slice, the updated value can be obtained.", () => {
  // Arrange
  const store = new SessionStorageStore({
    foo: "bar",
    baz: "qux",
  });
  store.set("foo", "updated");
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBe("updated");
});

test("listener is called when updating slice", () => {
  // Arrange
  const store = new SessionStorageStore({
    foo: "bar",
    baz: "qux",
  });
  const listener = jest.fn();
  store.subscribe("foo", listener);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener).toBeCalledTimes(1);
});

test("On navigation events, if the value of the corresponding key is in sessionStorage, then slice is the value in storage.", () => {
  // Arrange
  const navigationKey = "__n";
  sessionStorageMock.getItem.mockReturnValueOnce(
    JSON.stringify({ foo: "storage value" }),
  );
  const store = new SessionStorageStore({
    foo: "bar",
    baz: "qux",
  });
  // Act
  store.navigationListener(navigationKey);
  // Assert
  expect(store.get("foo")).toBe("storage value");
  expect(sessionStorageMock.getItem).toHaveBeenCalledTimes(1);
  expect(sessionStorageMock.getItem).toHaveBeenCalledWith(
    `__location_state_${navigationKey}`,
  );
});
