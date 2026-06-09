import { NextResponse } from "next/server";
import { executeTenantSQL } from "@/lib/db/db-manager";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const connector = searchParams.get("connector");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter 'projectId'" },
        { status: 400 }
      );
    }

    const payload = await request.json();
    console.log(`[Webhooks Router] Received payload for project ${projectId} via connector "${connector}":`, payload);

    // Prepare dynamic SQL insert depending on the connector
    let sqlQuery = "";
    if (connector === "stripe") {
      const amount = payload.amount || 49.00;
      const email = payload.email || "customer@example.com";
      sqlQuery = `
        INSERT INTO leads (name, email, company, message) 
        VALUES ('Stripe Event', '${email}', 'Stripe Connect', 'Received Stripe webhook payment alert of $${amount}.');
      `;
    } else if (connector === "slack") {
      sqlQuery = `
        INSERT INTO leads (name, email, company, message) 
        VALUES ('Slack Hook', 'slack@bot.com', 'Slack Inc', 'Alert hook received: ${payload.text || "No text provided"}.');
      `;
    } else {
      sqlQuery = `
        INSERT INTO leads (name, email, company, message) 
        VALUES ('Webhook Event', 'webhook@api.com', 'Webhook Source', 'Payload received: ${JSON.stringify(payload).slice(0, 100)}');
      `;
    }

    const dbRes = await executeTenantSQL(projectId, sqlQuery);

    if (dbRes.success) {
      return NextResponse.json({
        success: true,
        message: `Webhook received and successfully saved to table 'leads' inside Postgres tenant schema.`,
        details: dbRes.message
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Webhook received but database sync failed.",
        error: dbRes.message
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("API /api/webhooks error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to route webhook event.";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
