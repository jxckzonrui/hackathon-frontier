export type TorqueEventPayload = {
  eventName: "invoice_paid_early";
  invoiceId: string;
  paidAt: string;
  dueDate: string;
};

export function getTorqueApiToken(): string | undefined {
  return process.env.TORQUE_API_TOKEN || process.env.TORQUE_API_KEY;
}

export async function emitEarlyPaymentEvent(
  payload: TorqueEventPayload,
): Promise<{ queued: boolean }> {
  if (new Date(payload.paidAt) > new Date(payload.dueDate)) {
    return { queued: false };
  }

  const apiToken = getTorqueApiToken();

  if (!apiToken) {
    return { queued: true };
  }

  await fetch("https://api.torque.so/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return { queued: true };
}
