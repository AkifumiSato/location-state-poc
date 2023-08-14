import { UrlStore } from "./url-store";

const TEST_URL_STORE_KEY = "store-key";

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
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
  });
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBeUndefined();
});

test("Updating a slice, the updated value can be obtained and url is updated.", () => {
  // Arrange
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
  });
  // Act
  store.set("foo", "updated");
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("listener is called when updating slice.", () => {
  // Arrange
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
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
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
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
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
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
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
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

test("On `load` called, the state is loaded from url by TEST_URL_STORE_KEY.", () => {
  // Arrange
  prepareLocation({
    pathname: "/",
    search: "?store-key=%7B%22foo%22%3A%22updated%22%7D",
  });
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
  });
  // Act
  store.load();
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("On `save` called, the state is saved in url by history API.", () => {
  // Arrange
  const replaceSpy = jest
    .spyOn(history, "replaceState")
    .mockImplementation(() => {
      /* noop */
    });
  const store = new UrlStore({
    key: TEST_URL_STORE_KEY,
  });
  store.load();
  store.set("foo", "updated");
  // Act
  store.save();
  // Assert
  expect(replaceSpy).toHaveBeenCalledTimes(1);
  expect(replaceSpy).toHaveBeenCalledWith(
    null,
    "",
    "/?store-key=%7B%22foo%22%3A%22updated%22%7D",
  );
  replaceSpy.mockRestore();
});
