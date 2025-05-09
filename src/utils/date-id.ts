// e.g., "20250508075958" => yyyyMMddHHmmss
export const dateId = () => {
  return new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14)
}
