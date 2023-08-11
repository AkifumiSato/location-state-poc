import { NavigationSyncer } from "@/lib/locationState/syncer/navigation-syncer";
import { createNavigationMock } from "@/lib/locationState/syncer/navigation.mock";

test("Key changes when `navigation.currentEntry` changes.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const key1 = navigationSyncer.key();
  navigation.navigate("/hoge");
  // Act
  const key2 = navigationSyncer.key();
  // Assert
  expect(key1).not.toBeUndefined();
  expect(key2).not.toBeUndefined();
  expect(key1).not.toBe(key2);
});

test("Listener is called when `currententrychange` event and `event.navigationType` is `push`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  navigationSyncer.sync({ listener, signal: new AbortController().signal });
  // Act
  navigation.navigate("/hoge");
  // Assert
  expect(listener).toHaveBeenCalledTimes(1);
});

test("Listener is called when `currententrychange` event and `event.navigationType` is `replace`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  navigationSyncer.sync({ listener, signal: new AbortController().signal });
  // Act
  navigation.navigate("/hoge", { history: "replace" });
  // Assert
  expect(listener).toHaveBeenCalledTimes(1);
});

test("Listener is not called when `currententrychange` event and `event.navigationType` is `reload`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  navigationSyncer.sync({ listener, signal: new AbortController().signal });
  // Act
  navigation.reload();
  // Assert
  expect(listener).not.toHaveBeenCalled();
});

// abort does not work well, but the cause is unknown
test("After `abort`, listener is called when `currententrychange` event and `event.navigationType` is `push`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  const controller = new AbortController();
  navigationSyncer.sync({ listener, signal: controller.signal });
  controller.abort();
  // Act
  navigation.navigate("/hoge");
  // Assert
  expect(listener).not.toHaveBeenCalled();
});
