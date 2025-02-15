export function paginate(
  url: string,
  content: string,
  prefix: string,
  startIndex: number,
  maxLength: number,
) {
  const originalLength = content.length;
  let result = content;
  if (startIndex >= originalLength) {
    result = '<error>No more content available.</error>';
  } else {
    result = result.slice(startIndex, startIndex + maxLength);
    if (!result) {
      result = '<error>No more content available.</error>';
    } else {
      const actualLength = result.length;
      const remainingLength = originalLength - startIndex - actualLength;
      if (actualLength === maxLength && remainingLength > 0) {
        const nextStartIndex = startIndex + actualLength;
        result += `\n\n<error>Content truncated. Call the fetch tool with a start_index of ${nextStartIndex.toString()} to get more content.</error>`;
      }
    }
  }
  return [prefix, `Contents of ${url}`, result].join('\n');
}
