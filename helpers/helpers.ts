export const readFileAsBinaryStringAsync = (file: File): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(<string>reader.result)
    }
    reader.readAsBinaryString(file)
  })
}
