export async function readFirstLineFromFile(file: File): Promise<string> {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';

  while (true) {
    const { value: chunk, done } = await reader.read();
    if (done) break;

    result += decoder.decode(chunk, { stream: true });
    const newlineIndex = result.indexOf('\n');
    if (newlineIndex !== -1) {
      return result.slice(0, newlineIndex);
    }
  }

  return result;
}