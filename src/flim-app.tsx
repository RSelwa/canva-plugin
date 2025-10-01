import type { Image } from "@canva/app-components";
import { Box } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { addElementAtPoint } from "@canva/design";
import { useEffect, useState } from "react";
import { findResources } from "src/adapter";
import ImageCard from "src/ui/image-card";
import { auth } from "utils/db";
import * as styles from "./index.css";

const FlimApp = () => {
  const [images, setImages] = useState<Image[]>([]);

  const search = async (query: string) => {
    try {
      const data = await findResources({
        limit: 100,
        query,
        locale: "",
        types: ["IMAGE", "VIDEO", "EMBED", "CONTAINER"],
      });

      if (data.type === "SUCCESS" && data?.resources) {
        const imagesList = data.resources.filter((r) => r.type === "IMAGE");
        console.log(imagesList);
        setImages(imagesList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const searchTerm = formData.get("search");
    const query = searchTerm?.toString() || "";
    search(query);
  };

  const initSearch = async () => {
    await search("");
  };

  async function addCustomImageToDesign(
    imageUrl: string,
    thumbnailUrl: string,
  ) {
    const result = await upload({
      type: "image",
      mimeType: "image/png", // or appropriate mimeType
      url: imageUrl,
      thumbnailUrl: thumbnailUrl,
      aiDisclosure: "none",
    });

    await addElementAtPoint({
      type: "image",
      ref: result.ref,
      altText: { text: "Custom image", decorative: false },
    });
  }

  const key = "token";
  const setToken = (token: string) => {
    window.localStorage.setItem(key, token);
  };

  const getToken = () => {
    const value = window.localStorage.getItem(key);
    console.log(value);

    return value;
  };

  useEffect(() => {
    initSearch();
  }, []);

  console.log(images.length);

  return (
    <Box className={styles.rootWrapper}>
      <form onSubmit={handleSearch} style={{ padding: "30px" }}>
        <input type="search" name="search" id="" />
        <button type="submit">Search</button>
      </form>
      <section>
        {images.map((img) => (
          <ImageCard key={img.id} image={img} />
        ))}
      </section>

      <button onClick={() => console.log(auth.currentUser)}>Get auth</button>
      <button onClick={() => setToken("TEST")}>Set Token</button>
      <button onClick={getToken}>Get Token</button>
    </Box>
  );
};

export default FlimApp;
