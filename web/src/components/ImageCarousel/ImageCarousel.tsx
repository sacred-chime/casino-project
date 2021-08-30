import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Image } from "../Image";
import { CarouselData } from "./CarouselData";

interface ImageCarouselProps {
  slides: {
    image: string;
    caption: string;
    href?: string;
  }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [check, setCheck] = useState(0);

  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
      setCheck(check + 1);
    }, 5000);
    return () => clearInterval(timer);
  }),
    [check];

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box
          mr={"5"}
          fontSize="5xl"
          zIndex={"10"}
          cursor="pointer"
          userSelect="none"
        >
          <FaArrowAltCircleLeft onClick={prevSlide} />
        </Box>
        {CarouselData.map((slide, index) => {
          return (
            <Box
              key={index}
              opacity={index === current ? "1" : "0"}
              transitionDuration={index === current ? "1s" : "1s ease"}
              transform={
                index === current ? "translateX(0px)" : "translateX(-50px)"
              }
            >
              {index === current && (
                <Image
                  src={slide.image}
                  caption={slide.caption}
                  href={slide.href}
                />
              )}
            </Box>
          );
        })}
        <Box
          ml={"5"}
          fontSize="5xl"
          zIndex={"10"}
          cursor="pointer"
          userSelect="none"
        >
          <FaArrowAltCircleRight onClick={nextSlide} />
        </Box>
      </Flex>
    </Box>
  );
};

export default ImageCarousel;
