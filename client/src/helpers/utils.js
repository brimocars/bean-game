export function getCurrentUrl() {
  const url = location.href.slice(0, -1).split('/').pop();
  console.log(url);
  return url;
}