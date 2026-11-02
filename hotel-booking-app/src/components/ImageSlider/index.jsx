
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ImageSlider.scss"

const ImageSlider = (props) => {
    const { images } = props;

  return (
    <div className="slide">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="swiper"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img className="image" src={img} alt={`Slide ${idx + 1}`}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
