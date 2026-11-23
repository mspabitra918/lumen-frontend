import { ApplicationFormData } from "@/components/apply/types";
import { validateApplication } from "@/components/apply/validation";
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

// Demo endpoint: validates the wizard payload and returns a reference.
// Swap the body of the success branch for a real insert / forward to your backend.

/** JSON turns NaN into null; restore NaN so numeric checks behave the same as in the browser. */
function revive(body: ApplicationFormData): ApplicationFormData {
  const n = (v: unknown) => (typeof v === "number" ? v : NaN);
  return {
    ...body,
    loan: {
      ...body.loan,
      amount: n(body.loan?.amount),
      loanTerm: n(body.loan?.loanTerm),
    },
    personal: {
      ...body.personal,
      yearsAtAddress: n(body.personal?.yearsAtAddress),
      monthlyHousingCost: n(body.personal?.monthlyHousingCost),
    },
    employment: {
      ...body.employment,
      employmentLengthMo: n(body.employment?.employmentLengthMo),
    },
  };
}

export async function POST(req: Request) {
  let body: ApplicationFormData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }
  if (
    !body ||
    typeof body !== "object" ||
    !body.loan ||
    !body.personal ||
    !body.employment ||
    !body.banking ||
    !body.consent
  ) {
    return NextResponse.json(
      { message: "Missing application sections." },
      { status: 400 },
    );
  }

  const data = revive(body);
  const errors = validateApplication(data);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Some fields need attention.", errors },
      { status: 422 },
    );
  }

  // Never log the payload — it contains SSN and bank details.
  await new Promise((r) => setTimeout(r, 900));
  const applicationId = `LMN-${randomBytes(4).toString("hex").toUpperCase()}`;
  return NextResponse.json(
    { applicationId, status: "under_review" },
    { status: 201 },
  );
}
