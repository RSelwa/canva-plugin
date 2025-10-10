import type { Image } from "@canva/app-components";
import { upload } from "@canva/asset";
import { useAddElement } from "utils/use_add_element";

type Props = { image: Image };

const VirtualImageCard = ({ image }: Props) => {
  const addElement = useAddElement();

  const importAndAddImage = async () => {
    // Start uploading the image using Canva's upload API
    // This creates an asset reference that can be used immediately while the upload continues in the background
    const img = await upload({
      type: "image",
      mimeType: "image/jpeg",
      url: image.thumbnail.url,
      thumbnailUrl: image.thumbnail.url,
      width: image.width || 1920,
      height: image.height || 1080,
      aiDisclosure: "none",
    });

    // Add the image element to the current design using the asset reference
    // Canva will display the thumbnail initially and replace it with the full image once upload completes
    await addElement({
      type: "image",
      ref: img.ref,
      altText: {
        text: "a photo of buildings by the water",
        decorative: undefined,
      },
    });

    // Wait for the upload to complete to handle any upload errors
    // In production apps, this should include proper error handling and user feedback
    await img.whenUploaded();

    // Upload completed successfully
    console.log("Upload complete!");
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    importAndAddImage();

    console.log(event);
  };

  return (
    <img
      src={image.thumbnail.url}
      onClick={importAndAddImage}
      onDragEnd={handleDragEnd}
    />
    // <ImageCard
    //   onClick={handleClick}
    //   alt={image.name}
    //   thumbnailUrl={image.thumbnail.url}
    //   // onDragStart={handleDragStart}
    // />
  );
};

export default VirtualImageCard;
