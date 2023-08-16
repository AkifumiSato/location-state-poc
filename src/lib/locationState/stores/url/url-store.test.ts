import { URLStore } from "./url-store";

function prepareLocation({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}) {
  Object.defineProperty(window, "location", {
    value: {
      pathname,
      search,
    },
    writable: true,
  });
}

beforeEach(() => {
  prepareLocation({
    pathname: "/",
    search: "",
  });
});

test("If params is empty, the initial value is undefined.", () => {
  // Arrange
  const store = new URLStore({
    key: "store-key",
  });
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBeUndefined();
});

test("On `set` called, store's values are updated and reflected in the URL", () => {
  // Arrange
  const replaceSpy = jest
    .spyOn(history, "replaceState")
    .mockImplementation(() => {
      /* noop */
    });
  const store = new URLStore({
    key: "store-key",
  });
  // Act
  store.set("foo", "updated");
  // Assert
  expect(store.get("foo")).toBe("updated");
  expect(replaceSpy).toHaveBeenCalledTimes(1);
  expect(replaceSpy).toHaveBeenCalledWith(
    null,
    "",
    "/?store-key=%7B%22foo%22%3A%22updated%22%7D",
  );
  replaceSpy.mockRestore();
});

test("listener is called when updating slice.", () => {
  // Arrange
  const store = new URLStore({
    key: "store-key",
  });
  const listener = jest.fn();
  store.subscribe("foo", listener);
  // Act
  store.set("foo", "updated");
  // Assert
  expect(listener).toBeCalledTimes(1);
});

test("listener is called even if updated with undefined.", () => {
  // Arrange
  const store = new URLStore({
    key: "store-key",
  });
  store.set("foo", "updated");
  const listener = jest.fn();
  store.subscribe("foo", listener);
  // Act
  store.set("foo", undefined);
  // Assert
  expect(listener).toBeCalledTimes(1);
});

test("store.get in the listener to get the latest value.", () => {
  // Arrange
  expect.assertions(4);
  const store = new URLStore({
    key: "store-key",
  });
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
  const store = new URLStore({
    key: "store-key",
  });
  const listeners = {
    unsubscribeTarget: jest.fn(),
    other: jest.fn(),
  };
  const unsubscribe = store.subscribe("foo", listeners.unsubscribeTarget);
  store.subscribe("foo", listeners.other);
  // Act
  unsubscribe();
  store.set("foo", "updated");
  // Assert
  expect(listeners.unsubscribeTarget).not.toBeCalled();
  expect(listeners.other).toBeCalled();
});

test("On `load` called, the state is loaded from url.", () => {
  // Arrange
  prepareLocation({
    pathname: "/",
    search: "?store-key=%7B%22foo%22%3A%22updated%22%7D",
  });
  const store = new URLStore({
    key: "store-key",
  });
  // Act
  store.load();
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("On `load` called, all listener notified.", async () => {
  // Arrange
  const store = new URLStore({
    key: "store-key",
  });
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  store.subscribe("foo", listener1);
  store.subscribe("bar", listener2);
  // Act
  store.load();
  // Generate and execute microtasks with Promise to wait for listener execution.
  await Promise.resolve();
  // Assert
  expect(listener1).toBeCalledTimes(1);
  expect(listener2).toBeCalledTimes(1);
});
