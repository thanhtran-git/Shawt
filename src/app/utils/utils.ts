export function isValidUrl(input: string): boolean {
  const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/[\w\d-]*)*\/?$/i;
  return regex.test(input) && (input.startsWith("http://") || input.startsWith("https://"));
}

  
  export function generateShortId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  