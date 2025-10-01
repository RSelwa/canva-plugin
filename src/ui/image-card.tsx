import type { Image } from "@canva/app-components";
import { ImageCard } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";

type Props = { image: Image };

const VirtualImageCard = ({ image }: Props) => {
  async function uploadImageAndGetRef(imageUrl, thumbnailUrl) {
    const asset = await upload({
      type: "image",
      mimeType: "image/jpeg", // or your image mimeType
      url: imageUrl,
      thumbnailUrl: thumbnailUrl,
      aiDisclosure: "none",
    });

    console.log("Uploaded asset ref:", asset.ref);
    return asset.ref;
  }

  async function handleDragStart(event) {
    const ref = await uploadImageAndGetRef(image.url, image.thumbnail.url);
    // ui.startDragToCursor(event, {
    //   type: "image",
    //   ref, // ref returned after uploading image with Canva API
    //   previewUrl: image.thumbnail.url,
    //   previewSize: { width: 150, height: 150 },
    //   altText: { text: image.id || "Image", decorative: false },
    // });
  }

  return (
    <ImageCard
      alt={image.name}
      thumbnailUrl={image.thumbnail.url}
      onDragStart={handleDragStart}
    />
  );
};

export default VirtualImageCard;
