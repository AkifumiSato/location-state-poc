import { NavigationSyncer } from "@/lib/locationState/syncer/navigation/navigation-syncer";
import { createNavigationMock } from "@/lib/locationState/syncer/navigation/navigation.mock";

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
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  navigationSyncer.sync({
    listener: listener1,
    signal: new AbortController().signal,
  });
  navigationSyncer.sync({
    listener: listener2,
    signal: new AbortController().signal,
  });
  // Act
  navigation.navigate("/hoge");
  // Assert
  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
});

test("Listener is called when `currententrychange` event and `event.navigationType` is `replace`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  navigationSyncer.sync({
    listener: listener1,
    signal: new AbortController().signal,
  });
  navigationSyncer.sync({
    listener: listener2,
    signal: new AbortController().signal,
  });
  // Act
  navigation.navigate("/hoge", { history: "replace" });
  // Assert
  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
});

test("Listener is not called when `currententrychange` event and `event.navigationType` is `reload`.", () => {
  // Arrange
  const navigation = createNavigationMock("/");
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  navigationSyncer.sync({
    listener,
    signal: new AbortController().signal,
  });
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
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  const controller = new AbortController();
  navigationSyncer.sync({ listener: listener1, signal: controller.signal });
  navigationSyncer.sync({
    listener: listener2,
    signal: new AbortController().signal,
  });
  controller.abort();
  // Act
  navigation.navigate("/hoge");
  // Assert
  expect(listener1).not.toHaveBeenCalled();
  expect(listener2).toHaveBeenCalled();
});
