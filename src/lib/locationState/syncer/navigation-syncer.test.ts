import { NavigationSyncer } from "@/lib/locationState/syncer/navigation-syncer";
import { Navigation as NavigationPolyfill } from "@virtualstate/navigation";

test("Key changes when `navigation.currentEntry` changes.", () => {
  // Arrange
  const navigation = new NavigationPolyfill() as unknown as Navigation;
  const navigationSyncer = new NavigationSyncer(navigation);
  navigation.navigate("/");
  const key1 = navigationSyncer.key();
  navigation.navigate("/hoge");
  // Act
  const key2 = navigationSyncer.key();
  // Assert
  expect(key1).not.toBe(key2);
});

test("Listener is called when `currententrychange` event and `event.navigationType` is `push`.", () => {
  // Arrange
  const navigation = new NavigationPolyfill() as unknown as Navigation;
  const navigationSyncer = new NavigationSyncer(navigation);
  const listener = jest.fn();
  navigationSyncer.sync({ listener, signal: new AbortController().signal });
  navigation.navigate("/");
  // Act
  navigation.navigate("/hoge");
  // Assert
  expect(listener).toBeCalled();
});

test.todo(
  "Listener is called when `currententrychange` event and `event.navigationType` is `replace`.",
);

test.todo(
  "Listener is not called when `currententrychange` event and `event.navigationType` is `pop`.",
);

test.todo(
  "After `abort`, listener is called when `currententrychange` event and `event.navigationType` is `replace`.",
);
