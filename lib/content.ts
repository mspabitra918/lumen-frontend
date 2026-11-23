export type Faq = { q: string; a: string };
export type FaqGroup = { key: string; label: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    key: "applying",
    label: "Applying",
    items: [
      { q: "Will checking my rate affect my credit score?", a: "No. We start with a soft credit inquiry, which doesn’t affect your score. A hard inquiry only happens if you accept an offer and move forward." },
      { q: "What do I need to apply?", a: "You need to be 18 or older with a valid SSN, a steady source of income, an active bank account, and a working email and phone number. Have your driver’s license or state ID and your bank’s routing and account numbers handy." },
      { q: "How long does the application take?", a: "About five minutes. You can see the amount, term and estimated payment before you share anything personal." },
      { q: "Can I apply if I’m self-employed or retired?", a: "Yes. We consider income from self-employment, Social Security, pensions, disability and other regular sources, not just a paycheck." },
      { q: "Can I apply with a co-borrower?", a: "Not yet. Every application is for one borrower right now. Joint applications are on our roadmap." },
    ],
  },
  {
    key: "rates",
    label: "Rates & fees",
    items: [
      { q: "What will my rate be?", a: "Your APR depends on your credit history, income, debts, loan amount, term and state of residence. You’ll see your exact APR and total cost before you sign anything." },
      { q: "Are there prepayment penalties?", a: "Never. Pay extra or pay the loan off early whenever you want, and you’ll save on interest." },
      { q: "Is there an application fee?", a: "No. Applying and checking your rate are free." },
      { q: "What happens if I pay late?", a: "Contact us before your due date if you think you’ll be late. We can often move a payment date. Late fees, where allowed by your state, are listed in your loan agreement." },
    ],
  },
  {
    key: "funding",
    label: "Funding",
    items: [
      { q: "How fast can I get the money?", a: "Most decisions take a few minutes. Once you e-sign, funds are usually sent by the next business day, depending on your bank’s processing times." },
      { q: "Where does the money go?", a: "Straight to the checking or savings account you give us in your application, by ACH deposit." },
      { q: "Why might my application need more review?", a: "Sometimes we need to verify identity, income or bank details. If so, we’ll email you a secure link to upload a document. Most reviews are finished within one business day." },
    ],
  },
  {
    key: "repaying",
    label: "Repaying",
    items: [
      { q: "How do I make payments?", a: "Autopay from your bank account is the easiest way and keeps you on schedule. You can also make one-time payments online or by phone." },
      { q: "Can I change my payment date?", a: "Yes, once per year, as long as your account is current. Call or message us and we’ll help." },
      { q: "What if I’m having trouble paying?", a: "Talk to us early. Depending on your situation we may be able to offer a payment plan or a short deferral. Real people answer, six days a week." },
    ],
  },
  {
    key: "security",
    label: "Privacy & security",
    items: [
      { q: "Is my information secure?", a: "Yes. Your data is encrypted in transit and at rest using 256-bit encryption, and access is limited to staff who need it to service your loan." },
      { q: "Do you sell my information?", a: "No. We never sell your personal information. See our Privacy Policy for exactly how we use and share data." },
    ],
  },
];
