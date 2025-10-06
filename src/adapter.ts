import type {
  FindResourcesRequest,
  FindResourcesResponse,
} from "@canva/app-components";
import { auth as authCanvas } from "@canva/user";
import { auth } from "utils/db";

export type ContainerTypes = "boards" | "genai";

export async function findResources(
  request: FindResourcesRequest<ContainerTypes>,
): Promise<FindResourcesResponse> {
  const userToken = await authCanvas.getCanvaUserToken();
  const token = await auth.currentUser?.getIdToken();
  const userId = auth.currentUser?.uid;

  // TODO: Update the API path to match your backend
  // If using the backend example, the URL should be updated to `${BACKEND_HOST}/api/resources/find` to ensure requests are authenticated in production
  const url = new URL(`${BACKEND_HOST}/resources/find`);

  const req = { ...request };
  req.limit = 100;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        userID: userId || "",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });
    const body = await response.json();

    console.log("REQUEST", request, "RESPONSE", body);

    if (body.resources) {
      return {
        type: "SUCCESS",
        resources: body.resources,
        continuation: body.continuation,
      };
    }

    return {
      type: "ERROR",
      errorCode: body.errorCode || "INTERNAL_ERROR",
    };
  } catch {
    return {
      type: "ERROR",
      errorCode: "INTERNAL_ERROR",
    };
  }
}
