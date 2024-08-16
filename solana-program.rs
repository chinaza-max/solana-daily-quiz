use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("FQCbKG25ZK3txCm5DbvJtVMNbsTHHe85ZFaRMXuLFdK1");



#[program]
pub mod user_points {
    use super::*;

    pub fn update_user_points(ctx: Context<UpdateUserPoints>) -> Result<()> {
        let user = &mut ctx.accounts.user;

        if !user.is_initialized {
            user.is_initialized = true;
            user.points = 0;
        }

        user.points += 2;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateUserPoints<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + 8 + 1, // discriminator + points + is_initialized
        seeds = [b"user", signer.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct User {
    pub points: u64,
    pub is_initialized: bool,
}