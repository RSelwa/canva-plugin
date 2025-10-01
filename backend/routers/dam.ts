import type { Container, Resource } from "@canva/app-components";
import * as crypto from "crypto";
import * as express from "express";

/**
 * Generates a unique hash for a url.
 * Handy for uniquely identifying an image and creating an image id
 */
export async function generateHash(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const imageUrls = [
  "https://images.pexels.com/photos/1495580/pexels-photo-1495580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/3943197/pexels-photo-3943197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/7195267/pexels-photo-7195267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2904142/pexels-photo-2904142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/5403478/pexels-photo-5403478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const fakeUrl =
  "https://flim-upload-genai.s3.eu-central-1.amazonaws.com/full/upload-1759237236458-0";

export const createDamRouter = () => {
  const router = express.Router();

  router.get("/config", (req, res) => {
    const headers = req.headers;
    const authorization = headers["authorization"];
    const token = authorization?.split(" ")[1];

    if (token !== process.env.BACKEND_SECRET) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    const apiKey = process.env.NEXT_PUBLIC_FBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FBASE_PROJECT_ID || "";
    const messagingSenderId = process.env.NEXT_PUBLIC_FBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FBASE_APP_ID;
    const measurementId = process.env.NEXT_PUBLIC_FBASE_MEASUREMENT_ID;

    res.send({
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId,
      appId,
      measurementId,
    });
  });

  router.get("/me", async (req, res) => {
    const headers = req.headers;
    const authorization = headers["authorization"];
    const token = authorization?.split(" ")[1];
    const uid = ""; // replace with actual user id

    const result = await fetch(
      `
https://dev-api.flim.ai/2.0.0/user/${uid}/boards`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await result.json();

    res.send(data);
  });

  /**
   * This endpoint returns the data for your app.
   */
  router.post("/resources/find", async (req, res) => {
    // You should modify these lines to return data from your
    // digital asset manager (DAM) based on the findResourcesRequest
    const {
      types,
      continuation,
      locale,
      // other available fields from the `FindResourcesRequest`
      // containerTypes,
      limit,
      // filters,
      query,
      // sort,
      // tab,
      // containerId,
      // parentContainerType,
    } = req.body;

    let resources: Resource[] = [];
    if (types.includes("IMAGE")) {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search: {
              saved_images: false,
              full_text: query || "",
              similar_picture_id: "",
              movie_id: "",
              dop: "",
              director: "",
              brand: "",
              agency: "",
              production_company: "",
              actor: "",
              creator: "",
              artist: "",
              collection_id: "",
              board_id: "",
              filters: {
                genres: [],
                colors: [],
                number_of_persons: [],
                years: [],
                shot_types: [],
                movie_types: [],
                aspect_ratio: [],
                safety_content: [],
                has_video_cuts: false,
                camera_motions: [],
              },
              negative_filters: {
                aspect_ratio: [],
                genres: ["ANIMATION"],
                movie_types: [],
                colors: [],
                shot_types: [],
                number_of_persons: [],
                years: [],
                safety_content: ["nudity", "violence"],
              },
            },
            page: 0,
            sort_by: "",
            order_by: "",
            number_per_pages: limit,
          }),
        },
      );
      const data = await result.json();

      const images = data?.query_response?.images || [];

      resources = images.map((image) => ({
        id: image.id,
        mimeType: "image/jpeg",
        name: image.title,
        type: "IMAGE",
        thumbnail: {
          url: image.thumbnail_url,
        },
        url: image.full_resolution_url || image.medium_resolution_url,
      }));
    }

    if (types.includes("CONTAINER")) {
      const containers = await Promise.all(
        Array.from(
          { length: 10 },
          async (_, i) =>
            ({
              id: await generateHash(i + ""),
              containerType: "folder",
              name: `My folder ${i}`,
              type: "CONTAINER",
            }) satisfies Container,
        ),
      );

      resources = resources.concat(containers);
    }

    res.send({
      resources,
      continuation: +(continuation || 0) + 1,
    });
  });

  return router;
};
