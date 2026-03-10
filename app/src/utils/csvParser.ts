export const parseCSVLine = (line: string) => {
  const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
  return matches ? matches.map(m => m.replace(/^"|"$/g, '')) : [];
};

export const parseCSV = <T>(csv: string, mapper: (parts: string[]) => T): T[] => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  if (lines.length <= 1) return [];
  return lines.slice(1).map(line => mapper(parseCSVLine(line)));
};
