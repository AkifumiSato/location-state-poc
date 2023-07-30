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
  expect.assertions(4);
  const store = new SessionStorageStore();
  const listener1 = jest.fn(() => {
    expect(store.get("foo")).toBe("updated");
  });
  const listener2 = jest.fn(() => {
    expect(store.get("foo")).toBe("updated");
  });
  store.subscribe("foo", listener1);
  store.subscribe("foo", listener2);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener1).toBeCalledTimes(1);
  expect(listener2).toBeCalledTimes(1);
});

test("unsubscribed listeners are not called when updating slices.", () => {
  // Arrange
  const store = new SessionStorageStore();
  const listeners = {
    unsubscribeTarget: jest.fn(),
    other: jest.fn(),
  };
  const unsubscribe = store.subscribe("foo", listeners.unsubscribeTarget);
  store.subscribe("foo", listeners.other);
  unsubscribe();
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listeners.unsubscribeTarget).not.toBeCalled();
  expect(listeners.other).toBeCalled();
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
  store.onLocationChange(currentLocationKey);
  store.set("foo", "updated");
  // Act
  store.onLocationChange("next_location");
  // Assert
  expect(sessionStorageMock.setItem).toHaveBeenCalledTimes(1);
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    `${locationKeyPrefix}${currentLocationKey}`,
    JSON.stringify({ foo: "updated" }),
  );
  expect(store.get("foo")).toBeNull();
});
