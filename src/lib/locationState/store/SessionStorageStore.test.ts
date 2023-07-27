import { locationKeyPrefix, SessionStorageStore } from "./SessionStorageStore";

const sessionStorageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

beforeEach(() => {
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
});

test("If Storage is empty, the initial value is null.", () => {
  // Arrange
  const store = new SessionStorageStore();
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBeNull();
});

test("After updating a slice, the updated value can be obtained.", () => {
  // Arrange
  const store = new SessionStorageStore();
  // Act
  store.set("foo", "updated");
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("listener is called when updating slice.", () => {
  // Arrange
  const store = new SessionStorageStore();
  const listener = jest.fn();
  store.subscribe("foo", listener);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener).toBeCalledTimes(1);
});

test("store.get in the listener to get the latest value.", () => {
  // Arrange
  expect.assertions(2);
  const store = new SessionStorageStore();
  const listener = jest.fn(() => {
    expect(store.get("foo")).toBe("updated");
  });
  store.subscribe("foo", listener);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener).toBeCalledTimes(1);
});

test("unsubscribed listeners are not called when updating slices.", () => {
  // Arrange
  const store = new SessionStorageStore();
  const listener = jest.fn();
  const unsubscribe = store.subscribe("foo", listener);
  unsubscribe();
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener).not.toBeCalled();
});

test("On location change events, if the value of the corresponding key is in sessionStorage, then slice is the value in storage.", () => {
  // Arrange
  const navigationKey = "current_location";
  sessionStorageMock.getItem.mockReturnValueOnce(
    JSON.stringify({ foo: "storage value" }),
  );
  const store = new SessionStorageStore();
  // Act
  store.onLocationChange(navigationKey);
  // Assert
  expect(store.get("foo")).toBe("storage value");
  expect(sessionStorageMock.getItem).toHaveBeenCalledTimes(1);
  expect(sessionStorageMock.getItem).toHaveBeenCalledWith(
    `${locationKeyPrefix}${navigationKey}`,
  );
});

test("In the location change event, the state is saved in sessionStorage with the previous Location key.", () => {
  // Arrange
  const currentLocationKey = "current_location";
  const store = new SessionStorageStore();
  store.set("foo", "updated");
  store.onLocationChange(currentLocationKey);
  // Act
  store.onLocationChange("next_location");
  // Assert
  expect(sessionStorageMock.setItem).toHaveBeenCalledTimes(1);
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    `${locationKeyPrefix}${currentLocationKey}`,
    JSON.stringify({ foo: "updated" }),
  );
});
