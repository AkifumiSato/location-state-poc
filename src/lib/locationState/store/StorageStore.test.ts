import { locationKeyPrefix, StorageStore } from "./StorageStore";

const storageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
};

beforeEach(() => {
  storageMock.getItem.mockClear();
  storageMock.setItem.mockClear();
});

// partial mock storage to be Storage type
const storage = storageMock as unknown as Storage;

test("If Storage is empty, the initial value is null.", () => {
  // Arrange
  const store = new StorageStore(storage);
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBeUndefined();
});

test("After updating a slice, the updated value can be obtained.", () => {
  // Arrange
  const store = new StorageStore(storage);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("listener is called when updating slice.", () => {
  // Arrange
  const store = new StorageStore(storage);
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
  const store = new StorageStore(storage);
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

test("The listener is unsubscribed by the returned callback, it will no longer be called when the slice is updated.", () => {
  // Arrange
  const store = new StorageStore(storage);
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

test("The listener is unsubscribed by the `unsubscribed`, it will no longer be called when the slice is updated.", () => {
  // Arrange
  const store = new StorageStore(storage);
  const listeners = {
    unsubscribeTarget: jest.fn(),
    other: jest.fn(),
  };
  store.subscribe("foo", listeners.unsubscribeTarget);
  store.subscribe("foo", listeners.other);
  store.unsubscribe("foo", listeners.unsubscribeTarget);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listeners.unsubscribeTarget).not.toBeCalled();
  expect(listeners.other).toBeCalled();
});

test("On location change events, if the value of the corresponding key is in Storage, then slice is the value in storage.", () => {
  // Arrange
  const navigationKey = "current_location";
  storageMock.getItem.mockReturnValueOnce(
    JSON.stringify({ foo: "storage value" }),
  );
  const store = new StorageStore(storage);
  // Act
  store.onLocationChange(navigationKey);
  // Assert
  expect(store.get("foo")).toBe("storage value");
  expect(storageMock.getItem).toHaveBeenCalledTimes(1);
  expect(storageMock.getItem).toHaveBeenCalledWith(
    `${locationKeyPrefix}${navigationKey}`,
  );
});

test("In the location change event, the state is saved in Storage with the previous Location key.", () => {
  // Arrange
  const currentLocationKey = "current_location";
  const store = new StorageStore(storage);
  store.onLocationChange(currentLocationKey);
  store.set("foo", "updated");
  // Act
  store.onLocationChange("next_location");
  // Assert
  expect(storageMock.setItem).toHaveBeenCalledTimes(1);
  expect(storageMock.setItem).toHaveBeenCalledWith(
    `${locationKeyPrefix}${currentLocationKey}`,
    JSON.stringify({ foo: "updated" }),
  );
  expect(store.get("foo")).toBeUndefined();
});
