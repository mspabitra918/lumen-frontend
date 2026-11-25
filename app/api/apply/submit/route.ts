import { ApplicationFormData } from "@/components/apply/types";
import { validateApplication } from "@/components/apply/validation";
import { backendFetch } from "@/lib/backend";
import { NextResponse } from "next/server";

// Validates the wizard payload, then forwards it to the backend's
// POST /api/apply/submit, which runs eligibility checks and stores the application.

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

  const errors = validateApplication(revive(body));
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Some fields need attention.", errors },
      { status: 422 },
    );
  }

  // Never log the payload — it contains SSN and bank details.
  try {
    const { ok, status, json } = await backendFetch("/api/apply/submit", req, {
      method: "POST",
      body: { data: body },
    });

    if (!ok) {
      return NextResponse.json(
        {
          message:
            (json.error as string) ?? "Something went wrong. Please try again.",
          field: json.field,
          // A 409 for an existing application carries its ID and status.
          applicationId: json.applicationId,
          status: json.status,
          retryInSeconds: json.retryInSeconds,
        },
        { status },
      );
    }

    return NextResponse.json(
      { applicationId: json.applicationId, status: json.status },
      { status: 201 },
    );
  } catch (err) {
    console.error("Backend submit unreachable:", (err as Error)?.message);
    return NextResponse.json(
      {
        message:
          "We couldn’t reach our application service. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
