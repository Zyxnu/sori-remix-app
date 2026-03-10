import type { ActionFunctionArgs } from "react-router";
import {
    analyzeSROI,
    parsePDFProposal,
    analyzeStakeholders,
    analyzeOutcomes,
    analyzeFinancialProxies,
    analyzeImpactFactors,
    analyzeImpactValue,
    calculateFinalSROI
} from "../services/geminiService";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const payload = await request.json();
        const { actionType, data } = payload;

        switch (actionType) {
            case "analyzeSROI":
                return Response.json({ result: await analyzeSROI(data.inputs, data.outputs) });
            case "parsePDFProposal":
                return Response.json({ result: await parsePDFProposal(data.base64Data, data.mimeType) });
            case "analyzeStakeholders":
                return Response.json({ result: await analyzeStakeholders(data.projectData) });
            case "analyzeOutcomes":
                return Response.json({ result: await analyzeOutcomes(data.projectData, data.inputs, data.outputs) });
            case "analyzeFinancialProxies":
                return Response.json({ result: await analyzeFinancialProxies(data.stakeholders, data.outcomes) });
            case "analyzeImpactFactors":
                return Response.json({ result: await analyzeImpactFactors(data.stakeholders, data.outcomes) });
            case "analyzeImpactValue":
                return Response.json({ result: await analyzeImpactValue(data.financials, data.impactFactors) });
            case "calculateFinalSROI":
                return Response.json({ result: await calculateFinalSROI(data.totalCost, data.totalImpactValue) });
            default:
                return Response.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("API Route Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
