
export const INITIAL_SYSTEM_INSTRUCTION = `You are an expert proposal writer with extensive experience in crafting compelling business documents. Your primary goal is to assist users by generating comprehensive, professional, and persuasive project proposals based on the provided job description. Your tone should be formal and authoritative.`;

export const PROPOSAL_GENERATION_PROMPT_TEMPLATE = `Based on the provided job description, generate a project proposal.

The proposal must:
1.  Demonstrate a clear understanding of the job requirements and client needs.
2.  Outline a strategic approach and proposed solution to address these needs.
3.  Highlight key deliverables and expected outcomes.
4.  (If applicable and inferable from the job description) Suggest a potential timeline or project phases.
5.  Emphasize unique selling points or strengths that make the proposed solution a strong fit.
6.  Be written in formal, professional business English.
7.  Be well-structured with clear headings (e.g., ## Introduction, ## Understanding the Requirements, ## Proposed Solution, ## Key Deliverables, ## Timeline (Optional), ## Why Choose Us, ## Conclusion). Use markdown for formatting.
8.  Use bullet points for lists to enhance readability.

Job Description:
---
{JOB_DESCRIPTION}
---

Proposal Output (in Markdown format):
`;

export const SYSTEM_INSTRUCTION_STORAGE_KEY = 'aiProposalGeneratorSystemInstruction';
