function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.findIndex(i => JSON.stringify(i) == JSON.stringify(value))
  console.log(index)
  if (index > -1) arr.splice(index, 1)
  return [...arr]
}

export default removeItem