use anchor_lang::prelude::*;

declare_id!("5gMe3BAjnC5WrQuMyw2hcX6KfUssZu1Dqaoa5WnswTja");

#[program]
pub mod veilsettle {
    use super::*;

    pub fn create_invoice_commitment(
        ctx: Context<CreateInvoiceCommitment>,
        invoice_id: [u8; 16],
        payer_hash: [u8; 32],
        metadata_hash: [u8; 32],
        amount_commitment: [u8; 32],
        due_date_hash: [u8; 32],
    ) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.creator = ctx.accounts.creator.key();
        invoice.invoice_id = invoice_id;
        invoice.payer_hash = payer_hash;
        invoice.metadata_hash = metadata_hash;
        invoice.amount_commitment = amount_commitment;
        invoice.due_date_hash = due_date_hash;
        invoice.status = InvoiceStatus::Created;
        invoice.payment_proof_reference = [0; 32];
        Ok(())
    }

    pub fn mark_paid(ctx: Context<UpdateInvoice>, payment_proof_reference: [u8; 32]) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(
            invoice.status == InvoiceStatus::Created,
            VeilSettleError::InvalidStatus
        );
        invoice.status = InvoiceStatus::Paid;
        invoice.payment_proof_reference = payment_proof_reference;
        Ok(())
    }

    pub fn void_invoice(ctx: Context<UpdateInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(
            invoice.status == InvoiceStatus::Created,
            VeilSettleError::InvalidStatus
        );
        invoice.status = InvoiceStatus::Voided;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(invoice_id: [u8; 16])]
pub struct CreateInvoiceCommitment<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + InvoiceCommitment::INIT_SPACE,
        seeds = [b"invoice", creator.key().as_ref(), invoice_id.as_ref()],
        bump
    )]
    pub invoice: Account<'info, InvoiceCommitment>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateInvoice<'info> {
    #[account(mut, has_one = creator)]
    pub invoice: Account<'info, InvoiceCommitment>,
    pub creator: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct InvoiceCommitment {
    pub creator: Pubkey,
    pub invoice_id: [u8; 16],
    pub payer_hash: [u8; 32],
    pub metadata_hash: [u8; 32],
    pub amount_commitment: [u8; 32],
    pub due_date_hash: [u8; 32],
    pub status: InvoiceStatus,
    pub payment_proof_reference: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum InvoiceStatus {
    Created,
    Paid,
    Voided,
}

#[error_code]
pub enum VeilSettleError {
    #[msg("Invoice is not in a valid state for this transition")]
    InvalidStatus,
}
