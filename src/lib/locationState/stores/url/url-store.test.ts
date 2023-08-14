import { UrlStore } from "./url-store";

const replaceSpy = jest
  .spyOn(history, "replaceState")
  .mockImplementation(() => {
    /* noop */
  });

beforeEach(() => {
  replaceSpy.mockClear();
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
  expect(replaceSpy).toHaveBeenCalledTimes(1);
  expect(replaceSpy).toHaveBeenCalledWith(
    null,
    "",
    "/?store-key=%7B%22foo%22%3A%22updated%22%7D",
  );
});
