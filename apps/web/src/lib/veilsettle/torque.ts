export type TorqueEventPayload = {
  eventName: "invoice_paid_early";
  invoiceId: string;
  paidAt: string;
  dueDate: string;
};

export async function emitEarlyPaymentEvent(
  payload: TorqueEventPayload,
): Promise<{ queued: boolean }> {
  if (new Date(payload.paidAt) > new Date(payload.dueDate)) {
    return { queued: false };
  }

  if (!process.env.TORQUE_API_KEY) {
    return { queued: true };
  }

  await fetch("https://api.torque.so/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TORQUE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return { queued: true };
}
