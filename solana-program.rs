use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("8pCCWwZbyeJiZRkB22oJWEEbztfW3mBCQKdxtMKAPgRt");


#[program]
pub mod solana_quiz_program {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn create_or_update_user(ctx: Context<CreateOrUpdateUser>, points: u32) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.wallet = ctx.accounts.signer.key();
        user.points += points;
        Ok(())
    }

    pub fn create_question(ctx: Context<CreateQuestion>, question: String, options: Vec<String>, answer: u8) -> Result<()> {
        require!(question.len() <= 256, ErrorCode::QuestionTooLong);
        require!(options.len() <= 4, ErrorCode::TooManyOptions);
        require!(options.iter().all(|opt| opt.len() <= 64), ErrorCode::OptionTooLong);

        let question_account = &mut ctx.accounts.question;
        question_account.question = question;
        question_account.options = options;
        question_account.answer = answer;
        question_account.answered = false;
        question_account.authority = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn delete_question(_ctx: Context<DeleteQuestion>) -> Result<()> {
        // The account will be closed and rent returned to the user
        Ok(())
    }

    pub fn mark_question_answered(ctx: Context<MarkQuestionAnswered>) -> Result<()> {
        let question = &mut ctx.accounts.question;
        question.answered = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateOrUpdateUser<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + 32 + 4 + 1,
        seeds = [b"user", signer.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateQuestion<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 4 + 256 + 4 + (4 * 64) + 1 + 1 + 32
    )]
    pub question: Account<'info, Question>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteQuestion<'info> {
    #[account(mut, close = authority, has_one = authority)]
    pub question: Account<'info, Question>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarkQuestionAnswered<'info> {
    #[account(mut, has_one = authority)]
    pub question: Account<'info, Question>,
    pub authority: Signer<'info>,
}

#[account]
pub struct User {
    pub wallet: Pubkey,
    pub points: u32,
}

#[account]
pub struct Question {
    pub question: String,
    pub options: Vec<String>,
    pub answer: u8,
    pub answered: bool,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Question is too long")]
    QuestionTooLong,   
    #[msg("Too many options provided")]
    TooManyOptions,
    #[msg("Option is too long")]
    OptionTooLong,
}