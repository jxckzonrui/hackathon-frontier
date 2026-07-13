import { z } from "zod";

export const invoiceDraftSchema = z.object({
  clientDisplay: z.string().min(1),
  clientWallet: z.string().min(32),
  amountMinor: z.string().regex(/^\d+$/),
  currency: z.enum(["PUSD", "USDC", "USDT"]),
  dueDate: z.string().min(10),
  serviceTitle: z.string().min(1),
  lineItems: z
    .array(
      z.object({
        label: z.string().min(1),
        amountMinor: z.string().regex(/^\d+$/),
      }),
    )
    .min(1),
  memo: z.string(),
  attachmentHash: z.string(),
});

export const reviewRequestSchema = z.object({
  draft: invoiceDraftSchema,
  knownAttachmentHashes: z.array(z.string()),
});
