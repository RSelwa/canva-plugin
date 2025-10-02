import type { Image } from "@canva/app-components";
import { ImageCard } from "@canva/app-ui-kit";
import { addElementAtCursor, ImageRef } from "@canva/design";

type Props = { image: Image };

const VirtualImageCard = ({ image }: Props) => {
  // handler click pour ajouter l'élément au design
  function handleClick() {
    const exampleImageRef = "YOUR_IMAGE_REF" as ImageRef;

    const data = {
      type: "image",
      ref: exampleImageRef,
      altText: { text: image.name, decorative: false },
      dataUrl: image.thumbnail.url,
      top: 100,
      left: 100,
      width: 300,
      height: 200,
    };

    console.log(data);

    addElementAtCursor(data);
  }

  // handler drag start pour démarrer le drag and drop
  // function handleDragStart(event) {
  //   event.dataTransfer.setData("application/json", JSON.stringify(image));

  //   ui.startDragToPoint(event, {
  //     type: "image",
  //     previewUrl: image.thumbnail.url,
  //     previewSize:
  //   });
  // }

  return (
    <ImageCard
      onClick={handleClick}
      alt={image.name}
      thumbnailUrl={image.thumbnail.url}
      // onDragStart={handleDragStart}
    />
  );
};

export default VirtualImageCard;
