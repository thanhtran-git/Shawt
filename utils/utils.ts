  export function generateShortId(number: number
  ): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let randomValues = new Uint32Array(number);
    crypto.getRandomValues(randomValues);
  
    for (let i = 0; i < number; i++) {
      let randomIndex = randomValues[i] % chars.length;
      result += chars.charAt(randomIndex);
    }
    return result;
  };
  
  export default function buildShortUrl(shortId: string) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/r/${shortId}`
  };
