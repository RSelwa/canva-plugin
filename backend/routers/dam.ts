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

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

  /**
   * This endpoint returns the data for your app.
   */
  router.post("/resources/find", async (req, res) => {
    try {
      const headers = req.headers;
      const authorization = headers["authorization"];
      const token = authorization?.split(" ")[1];
      const userId = headers["userid"];

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
        containerId,
        parentContainerType,
      } = req.body;

      let resources: Resource[] = [];
      if (types.includes("IMAGE")) {
        const page = parseInt(continuation) || 0;
        const board_id =
          parentContainerType === "folder" && containerId ? containerId : "";

        const searchQuery = {
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
            board_id,
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
          page,
          sort_by: "addedAt",
          order_by: "",
          number_per_pages: limit,
        };

        const result = await fetch(`${baseUrl}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(searchQuery),
        });
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
        const result = await fetch(`${baseUrl}/user/${userId}/boards`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const boardsData = await result.json();
        const boards = [
          ...(boardsData?.boards || []),
          ...(boardsData?.writerBoards || []),
          ...(boardsData?.readerBoards || []),
        ];

        const folders: Container[] = boards.map((board, i) => ({
          id: board.boardId,
          containerType: "folder",
          name: board.title,
          type: "CONTAINER",
        }));

        resources = resources.concat(folders);
      }

      res.send({
        resources,
        continuation: +(continuation || 0) + 1,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error in /resources/find", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  return router;
};
