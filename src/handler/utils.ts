export function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export function generateRandomText(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomText = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomText += characters.charAt(randomIndex)
  }

  return randomText
}