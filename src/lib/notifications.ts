export async function requestPermission() {
  await navigator.permissions?.query({
    name: 'notifications',
  });
}
