import { SessionStorageStore } from "./SessionStorageStore";

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
