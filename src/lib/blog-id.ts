export function generateBlogId() {
  const part1 = Math.floor(10000 + Math.random() * 90000);
  const part2 = String(Date.now()).slice(-13);
  const part3 = Math.floor(100 + Math.random() * 900);
  return `${part1}-${part2}-${part3}`;
}
