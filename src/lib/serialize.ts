// Serialize dates for getServerSideProps
export function serialize<T>(data: T) {
  return JSON.parse(JSON.stringify(data)) as T;
}
