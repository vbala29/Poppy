export default function formatNumber(n: number | null): string {
  if (n == null) {
    return "0";
  }
  
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
