import { UrlStore } from "./url-store";

const replaceSpy = jest
  .spyOn(history, "replaceState")
  .mockImplementation(() => {
    /* noop */
  });

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
  replaceSpy.mockClear();
  prepareLocation({
    pathname: "/",
    search: "",
  });
});

test("If params is empty, the initial value is undefined.", () => {
  // Arrange
  const store = new UrlStore({
    key: "store-key",
  });
  // Act
  const slice = store.get("foo");
  // Assert
  expect(slice).toBeUndefined();
});

test("Updating a slice, the updated value can be obtained and url is updated.", () => {
  // Arrange
  const store = new UrlStore({
    key: "store-key",
  });
  // Act
  store.set("foo", "updated");
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test('On `load` called, the state is loaded from url by "store-key".', () => {
  // Arrange
  prepareLocation({
    pathname: "/",
    search: "?store-key=%7B%22foo%22%3A%22updated%22%7D",
  });
  const store = new UrlStore({
    key: "store-key",
  });
  // Act
  store.load();
  // Assert
  expect(store.get("foo")).toBe("updated");
});

test("On `save` called, the state is saved in url by history API.", () => {
  // Arrange
  const store = new UrlStore({
    key: "store-key",
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
});
