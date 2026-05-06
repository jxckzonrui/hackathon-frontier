export function isSnsName(value: string): boolean {
  return /^[a-z0-9-]+\.sol$/.test(value);
}

export function normalizeSnsName(value: string): string {
  const normalized = value.trim().toLowerCase();

  return normalized.endsWith(".sol") ? normalized : `${normalized}.sol`;
}

export function displayIdentity(name: string, wallet: string): string {
  if (isSnsName(name)) {
    return name;
  }

  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}
