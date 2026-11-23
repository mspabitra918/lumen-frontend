// Template legal copy for the demo site. Have qualified counsel review and
// replace before using with real customers.

export type LegalSection = { id: string; h: string; p: string[]; list?: string[] };
export type LegalDoc = { slug: string; title: string; eyebrow: string; updated: string; intro: string; sections: LegalSection[] };

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    updated: "November 23, 2026",
    intro: "This policy explains what personal information Lumen collects, how we use it, who we share it with, and the choices you have. We wrote it to be read, not skimmed past.",
    sections: [
      { id: "collect", h: "Information we collect", p: ["We collect information you give us when you check your rate, apply for a loan, or contact us, along with information from third parties that help us verify your identity and assess your application."], list: ["Identity details: name, date of birth, Social Security number, and government ID number", "Contact details: email address, phone number, and home address", "Financial details: income, employment, housing costs, and bank account information", "Credit information from consumer reporting agencies", "Device and usage data, such as IP address, browser type, and pages visited"] },
      { id: "use", h: "How we use it", p: ["We use your information to provide and service your loan and to operate our business responsibly."], list: ["Verify your identity and prevent fraud", "Evaluate your application and determine loan terms", "Deposit funds and process payments", "Communicate with you about your application and account", "Meet legal, regulatory, and audit obligations", "Improve our products and website"] },
      { id: "share", h: "How we share it", p: ["We do not sell your personal information. We share it only as needed to provide our services or as required by law, including with consumer reporting agencies, identity verification and fraud prevention providers, payment processors and banks, service providers bound by confidentiality obligations, and government authorities when legally required."] },
      { id: "security", h: "How we protect it", p: ["We use administrative, technical, and physical safeguards designed to protect your information, including 256-bit encryption in transit and at rest, role-based access controls, and regular security reviews. No system is perfectly secure, but we work continuously to keep your data safe."] },
      { id: "choices", h: "Your choices and rights", p: ["You can update your contact details at any time, opt out of marketing emails using the unsubscribe link, and withdraw consent to automated calls or texts by replying STOP. Depending on your state, you may have additional rights to access, correct, or delete certain information. Contact us to make a request."] },
      { id: "retention", h: "How long we keep it", p: ["We keep personal information for as long as needed to service your account and to meet legal and regulatory record-keeping requirements, then securely delete or de-identify it."] },
      { id: "contact", h: "Contact us", p: ["Questions about this policy? Email privacy@lumen.example or call 1-800-555-0199."] },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    eyebrow: "Legal",
    updated: "November 23, 2026",
    intro: "These terms govern your use of the Lumen website and online services. By using the site, you agree to them. Your loan itself is governed by your separate loan agreement.",
    sections: [
      { id: "eligibility", h: "Eligibility", p: ["You must be at least 18 years old and a U.S. resident to use our services and apply for a loan. Loan availability, amounts, and terms vary by state."] },
      { id: "accounts", h: "Your account", p: ["You’re responsible for keeping your login details confidential and for activity under your account. Tell us right away if you suspect unauthorized access."] },
      { id: "accuracy", h: "Accurate information", p: ["You agree to provide true, accurate, and complete information in your application. Providing false information may result in denial of your application, termination of your loan, and may violate law."] },
      { id: "acceptable-use", h: "Acceptable use", p: ["You agree not to misuse the site, including by:"], list: ["Attempting to access accounts or data that aren’t yours", "Interfering with the site’s security or operation", "Using automated tools to scrape or collect data", "Using the site for any unlawful purpose"] },
      { id: "ip", h: "Intellectual property", p: ["The site, including its design, text, graphics, and software, is owned by Lumen or its licensors and protected by intellectual property laws. You may not copy or reuse it without permission."] },
      { id: "disclaimers", h: "Disclaimers", p: ["Calculators, examples, and estimates on the site are for illustration only and are not offers of credit. The site is provided “as is” without warranties of any kind, to the extent permitted by law."] },
      { id: "liability", h: "Limitation of liability", p: ["To the extent permitted by law, Lumen is not liable for indirect, incidental, or consequential damages arising from your use of the site."] },
      { id: "changes", h: "Changes to these terms", p: ["We may update these terms from time to time. The “last updated” date shows when they last changed. Continued use of the site means you accept the updated terms."] },
    ],
  },
  {
    slug: "e-sign-consent",
    title: "E-Sign Consent",
    eyebrow: "Legal",
    updated: "November 23, 2026",
    intro: "To apply and get a loan online, we need your consent to provide disclosures and documents electronically and to accept your electronic signature, as allowed by the federal Electronic Signatures in Global and National Commerce Act (E-SIGN).",
    sections: [
      { id: "scope", h: "What this consent covers", p: ["This consent applies to all communications related to your application and loan, including:"], list: ["Application disclosures and adverse action notices", "Your loan agreement and related documents", "Account statements, payment notices, and receipts", "Privacy notices and changes to terms"] },
      { id: "requirements", h: "System requirements", p: ["To access and keep electronic records you need a current web browser, a valid email address, a PDF viewer, and enough storage to save documents or a printer to print them."] },
      { id: "paper", h: "Getting paper copies", p: ["You may request a paper copy of any electronic record at no charge by calling 1-800-555-0199 or emailing hello@lumen.example."] },
      { id: "withdraw", h: "Withdrawing consent", p: ["You may withdraw your consent at any time by contacting us. Withdrawing consent doesn’t affect the validity of records already provided electronically. If you withdraw before your loan is funded, we may be unable to continue processing your application."] },
      { id: "update", h: "Keeping your contact details current", p: ["Please let us know promptly if your email address changes so you continue to receive important records."] },
    ],
  },
  {
    slug: "responsible-lending",
    title: "Responsible Lending",
    eyebrow: "Our commitment",
    updated: "November 23, 2026",
    intro: "A loan should help you move forward, not hold you back. These are the practices we follow so that the loans we make are ones our customers can afford.",
    sections: [
      { id: "ability", h: "We check ability to repay", p: ["Before making a loan, we review your income, existing obligations, and banking history to make sure the payment fits your budget. If it doesn’t, we may offer a smaller amount or decline, even if that means less business for us."] },
      { id: "transparency", h: "We show the full cost up front", p: ["Every offer shows the APR, monthly payment, number of payments, and total amount you’ll repay before you sign. There are no prepayment penalties."] },
      { id: "short-term", h: "Installment loans are for short-term needs", p: ["Installment loans are an expensive form of credit. They’re intended to help with short-term financial needs and are not a long-term financial solution. Consider other options, such as savings, credit union loans, or help from family, before borrowing."] },
      { id: "hardship", h: "We help when things get hard", p: ["If you’re having trouble making payments, contact us as early as you can. Depending on your situation, we may be able to change your payment date, set up a payment plan, or offer a short deferral."], list: ["Call 1-800-555-0199, Monday to Saturday", "Email hello@lumen.example", "We never use threatening or abusive collection practices"] },
      { id: "fair", h: "We lend fairly", p: ["We comply with fair lending laws and do not discriminate based on race, color, religion, national origin, sex, marital status, age, or receipt of public assistance income."] },
      { id: "resources", h: "Free financial resources", p: ["Nonprofit credit counseling agencies, such as members of the National Foundation for Credit Counseling, offer free or low-cost budgeting and debt help."] },
    ],
  },
];

export const getLegalDoc = (slug: string) => LEGAL_DOCS.find((d) => d.slug === slug);
