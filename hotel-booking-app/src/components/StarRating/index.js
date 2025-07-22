import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import './StarRating.scss'


const StarRating = ({ rate }) => {
    const fullStars = Math.floor(rate); // Số sao đầy đủ
    const halfStar = rate % 1 !== 0; // Kiểm tra có sao nửa hay không
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Số sao trống

    return (
      <span className="rate">
        {[...Array(fullStars)].map((_, i) => <TiStarFullOutline className="star" key={`full-${i}`} />)}
        {halfStar && <TiStarHalfOutline className="star"/>}
        {[...Array(emptyStars)].map((_, i) => <TiStarOutline className="star" key={`empty-${i}`} />)}
      </span>
    );
  };

  export default StarRating;