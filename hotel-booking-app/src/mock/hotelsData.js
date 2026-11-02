// src/mock/hotelsData.js
// Dữ liệu mẫu chất lượng cao chuẩn hệ thống OTA (Online Travel Agency)

export const MOCK_HOTELS = [
  {
    id: "hotel-danang-01",
    name: "TMS Hotel Da Nang Beach",
    thumbnailUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    address: "292 Võ Nguyên Giáp, Quận Ngũ Hành Sơn, Đà Nẵng",
    city: "Đà Nẵng",
    linkMap: "https://maps.google.com/?q=TMS+Hotel+Da+Nang+Beach",
    description: "Khách sạn TMS Hotel Da Nang Beach tọa lạc ngay đối diện bãi biển Mỹ Khê xinh đẹp. Với phong cách thiết kế hiện đại, sang trọng, hồ bơi vô cực trên tầng 28 ngắm trọn cảnh biển và thành phố, cùng trung tâm spa chuyên nghiệp, mang đến cho quý khách kỳ nghỉ dưỡng đáng nhớ.",
    rate: 4.8,
    reviewsCount: 342,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-1", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-2", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-3", imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-4", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-5", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80" },
    ],
    roomTypes: [
      {
        id: "rt-tms-01",
        name: "Premier City View King",
        price: 1450000,
        originalPrice: 1950000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 32,
        amenities: [
          { name: "Wi-Fi miễn phí" },
          { name: "Điều hòa không khí" },
          { name: "Bữa sáng miễn phí" },
          { name: "TV màn hình phẳng" },
          { name: "Ban công riêng" },
          { name: "Minibar" }
        ]
      },
      {
        id: "rt-tms-02",
        name: "Grand Ocean Suite",
        price: 2450000,
        originalPrice: 3200000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 50,
        amenities: [
          { name: "View biển toàn cảnh" },
          { name: "Bồn tắm nằm cao cấp" },
          { name: "Bữa sáng buffet 5 sao" },
          { name: "Wi-Fi tốc độ cao" },
          { name: "Trà & cà phê miễn phí" },
          { name: "Áo choàng tắm & dép" }
        ]
      },
      {
        id: "rt-tms-03",
        name: "Family Ocean 2-Bedroom Suite",
        price: 3850000,
        originalPrice: 4800000,
        quantityPeople: 4,
        quantityBed: 2,
        roomArea: 75,
        amenities: [
          { name: "Phòng gia đình 2 phòng ngủ" },
          { name: "View biển trực diện" },
          { name: "Phòng khách riêng biệt" },
          { name: "Khu vực bếp & bàn ăn" },
          { name: "Bữa sáng miễn phí cho 4 người" }
        ]
      }
    ]
  },
  {
    id: "hotel-hanoi-01",
    name: "Sofitel Legend Metropole Hanoi",
    thumbnailUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    address: "15 Phố Ngô Quyền, Quận Hoàn Kiếm, Hà Nội",
    city: "Hà Nội",
    linkMap: "https://maps.google.com/?q=Sofitel+Legend+Metropole+Hanoi",
    description: "Khách sạn di sản 5 sao sang trọng bậc nhất thủ đô Hà Nội từ năm 1901. Tọa lạc ngay trung tâm Phố Cổ, gần Hồ Hoàn Kiếm và Nhà Hát Lớn, Sofitel Legend Metropole lưu giữ nét kiến trúc Pháp cổ điển kết hợp dịch vụ đẳng cấp thế giới.",
    rate: 4.9,
    reviewsCount: 520,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-hn-1", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-hn-2", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-hn-3", imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-hn-4", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-metro-01",
        name: "Premium Luxury Heritage Room",
        price: 5200000,
        originalPrice: 6500000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 38,
        amenities: [
          { name: "Nội thất phong cách Pháp" },
          { name: "Bữa sáng kiểu Pháp cao cấp" },
          { name: "Bồn tắm đứng & bồn tắm nằm" },
          { name: "Dịch vụ phòng 24/7" },
          { name: "Wi-Fi tốc độ cao" }
        ]
      },
      {
        id: "rt-metro-02",
        name: "Opera Wing Grand Luxury",
        price: 7800000,
        originalPrice: 9200000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 48,
        amenities: [
          { name: "Ban công view vườn Metropole" },
          { name: "Đặc quyền Club Lounge" },
          { name: "Bữa sáng & trà chiều miễn phí" },
          { name: "Quà chào mừng đặc biệt" }
        ]
      }
    ]
  },
  {
    id: "hotel-saigon-01",
    name: "The Reverie Saigon Luxury Hotel",
    thumbnailUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    address: "22-36 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    city: "TP. Hồ Chí Minh",
    linkMap: "https://maps.google.com/?q=The+Reverie+Saigon",
    description: "Khách sạn 6 sao duy nhất tọa lạc trên đại lộ Nguyễn Huệ sầm uất. Đỉnh cao của phong cách vương giả Ý, nội thất mạ vàng xa hoa, hồ bơi ngoài trời trên cao với hệ thống âm thanh dưới nước và tầm nhìn ôm trọn sông Sài Gòn.",
    rate: 4.9,
    reviewsCount: 412,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-sg-1", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-sg-2", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-sg-3", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-rev-01",
        name: "Deluxe King River View",
        price: 4900000,
        originalPrice: 5800000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 43,
        amenities: [
          { name: "View sông Sài Gòn" },
          { name: "Phòng tắm ốp đá cẩm thạch Ý" },
          { name: "Hệ thống tự động hóa thông minh" },
          { name: "Bữa sáng quốc tế" }
        ]
      },
      {
        id: "rt-rev-02",
        name: "Panoramic Suite Nguyễn Huệ",
        price: 8500000,
        originalPrice: 10500000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 68,
        amenities: [
          { name: "Toàn cảnh phố đi bộ Nguyễn Huệ" },
          { name: "Đặc quyền Reverie Lounge" },
          { name: "Xe đưa đón sân bay miễn phí" }
        ]
      }
    ]
  },
  {
    id: "hotel-phuquoc-01",
    name: "JW Marriott Phu Quoc Emerald Bay Resort & Spa",
    thumbnailUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    address: "Bãi Khem, An Thới, Thành phố Phú Quốc, Kiên Giang",
    city: "Phú Quốc",
    linkMap: "https://maps.google.com/?q=JW+Marriott+Phu+Quoc",
    description: "Khu nghỉ dưỡng kiệt tác được thiết kế bởi kiến trúc sư lừng danh Bill Bensley với chủ đề trường đại học viễn tưởng Lamarck University. Nằm ôm trọn bãi cát trắng mịn Bãi Khem, sở hữu bãi biển riêng và bể bơi hình vỏ sò trứ danh.",
    rate: 4.9,
    reviewsCount: 680,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-pq-1", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-pq-2", imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-pq-3", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-marriott-01",
        name: "Emerald Bay View King Room",
        price: 6200000,
        originalPrice: 7500000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 53,
        amenities: [
          { name: "Ban công view biển Bãi Khem" },
          { name: "Bữa sáng buffet thịnh soạn" },
          { name: "Chèo thuyền kayak miễn phí" },
          { name: "Hồ bơi vỏ sò biểu tượng" }
        ]
      },
      {
        id: "rt-marriott-02",
        name: "Turquoise Oceanfront Suite",
        price: 11500000,
        originalPrice: 14000000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 90,
        amenities: [
          { name: "Mặt biển trực diện tuyệt mỹ" },
          { name: "Bồn tắm ngoài trời" },
          { name: "Bao gồm dịch vụ spa 60 phút" }
        ]
      }
    ]
  },
  {
    id: "hotel-nhatrang-01",
    name: "Vinpearl Resort & Spa Nha Trang Bay",
    thumbnailUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    address: "Đảo Hòn Tre, Phường Vĩnh Nguyên, Nha Trang, Khánh Hòa",
    city: "Nha Trang",
    linkMap: "https://maps.google.com/?q=Vinpearl+Resort+Nha+Trang+Bay",
    description: "Khu nghỉ dưỡng 5 sao hình cánh cung tuyệt mỹ trên đảo Hòn Tre. Tầm nhìn trọn vẹn vịnh Nha Trang xinh đẹp, bãi biển riêng cát trắng trải dài, kèm cáp treo vượt biển và công viên giải trí VinWonders kề bên.",
    rate: 4.7,
    reviewsCount: 388,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-nt-1", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-nt-2", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-nt-3", imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-vp-01",
        name: "Deluxe King Ocean View",
        price: 2150000,
        originalPrice: 2800000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 45,
        amenities: [
          { name: "Miễn phí vé tàu cao tốc sang đảo" },
          { name: "Ban công view biển vịnh Nha Trang" },
          { name: "Bữa sáng buffet tiêu chuẩn quốc tế" },
          { name: "Sử dụng hồ bơi nước ngọt lớn nhất đảo" }
        ]
      },
      {
        id: "rt-vp-02",
        name: "Villa 2-Bedroom Private Pool Ocean View",
        price: 5800000,
        originalPrice: 7200000,
        quantityPeople: 4,
        quantityBed: 2,
        roomArea: 190,
        amenities: [
          { name: "Hồ bơi riêng biệt lập" },
          { name: "2 phòng ngủ cao cấp" },
          { name: "Bao gồm vé vui chơi VinWonders" }
        ]
      }
    ]
  },
  {
    id: "hotel-hoian-01",
    name: "Anantara Hoi An Resort",
    thumbnailUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    address: "1 Đường Phạm Hồng Thái, Cẩm Châu, Hội An, Quảng Nam",
    city: "Hội An",
    linkMap: "https://maps.google.com/?q=Anantara+Hoi+An+Resort",
    description: "Nằm duyên dáng bên dòng sông Thu Bồn thơ mộng, chỉ cách phố cổ Hội An vài phút tản bộ. Không gian xanh mát đậm phong cách thuộc địa Pháp kết hợp nét duyên dáng truyền thống xứ Quảng.",
    rate: 4.8,
    reviewsCount: 295,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-ha-1", imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-ha-2", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-anantara-01",
        name: "Deluxe Balcony River View",
        price: 3100000,
        originalPrice: 3900000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 42,
        amenities: [
          { name: "Ban công ngắm hoàng hôn sông Thu Bồn" },
          { name: "Xe đạp miễn phí tham quan phố cổ" },
          { name: "Bữa sáng truyền thống & phương Tây" }
        ]
      }
    ]
  },
  {
    id: "hotel-dalat-01",
    name: "Dalat Edensee Lake Resort & Spa",
    thumbnailUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    address: "Khu chức năng VII.2, Hồ Tuyền Lâm, Phường 4, Đà Lạt, Lâm Đồng",
    city: "Đà Lạt",
    linkMap: "https://maps.google.com/?q=Dalat+Edensee+Lake+Resort",
    description: "Như một ngôi làng châu Âu thu nhỏ nằm e ấp giữa rừng thông xanh bạt ngàn soi bóng xuống mặt hồ Tuyền Lâm phẳng lặng. Không khí trong lành, sương mờ lãng mạn và dịch vụ chăm sóc sức khỏe spa đẳng cấp.",
    rate: 4.7,
    reviewsCount: 260,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-dl-1", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-dl-2", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-edensee-01",
        name: "Mimosa Deluxe Pine Forest View",
        price: 1850000,
        originalPrice: 2400000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 40,
        amenities: [
          { name: "Lò sưởi ấm áp trong phòng" },
          { name: "Ban công view rừng thông và hồ" },
          { name: "Xe điện đưa đón quanh resort" },
          { name: "Bữa sáng buffet phong phú" }
        ]
      }
    ]
  },
  {
    id: "hotel-sapa-01",
    name: "Hôtel de la Coupole - MGallery Sapa",
    thumbnailUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    address: "1 Đường Hoàng Liên, Thị xã Sa Pa, Lào Cai",
    city: "Sa Pa",
    linkMap: "https://maps.google.com/?q=Hotel+de+la+Coupole+Sapa",
    description: "Tuyệt tác thiết kế giao thoa giữa thời trang cao cấp Haute Couture Pháp thập niên 1920 và sắc màu văn hóa các dân tộc vùng cao Tây Bắc. Kết nối thẳng nhà ga tàu hỏa leo núi Mường Hoa lên đỉnh Fansipan.",
    rate: 4.9,
    reviewsCount: 475,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancel: true,
    deposit: false,
    images: [
      { id: "img-sp-1", imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80" },
      { id: "img-sp-2", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" }
    ],
    roomTypes: [
      {
        id: "rt-coupole-01",
        name: "Classic King Valley View",
        price: 3600000,
        originalPrice: 4500000,
        quantityPeople: 2,
        quantityBed: 1,
        roomArea: 33,
        amenities: [
          { name: "Tầm nhìn thung lũng Mường Hoa" },
          { name: "Bể bơi nước nóng trong nhà Le Grand Bassin" },
          { name: "Bữa sáng thượng hạng tại nhà hàng Chic" }
        ]
      }
    ]
  }
];

export const POPULAR_DESTINATIONS = [
  {
    id: "dest-danang",
    name: "Đà Nẵng",
    properties: "1,240 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
    tag: "Biển Mỹ Khê & Cầu Vàng"
  },
  {
    id: "dest-hanoi",
    name: "Hà Nội",
    properties: "2,150 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1509024644558-2f56ce76c003?auto=format&fit=crop&w=600&q=80",
    tag: "Phố Cổ & Ẩm thực"
  },
  {
    id: "dest-saigon",
    name: "TP. Hồ Chí Minh",
    properties: "3,400 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80",
    tag: "Sôi động & Mua sắm"
  },
  {
    id: "dest-phuquoc",
    name: "Phú Quốc",
    properties: "780 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80",
    tag: "Thiên đường hoàng hôn"
  },
  {
    id: "dest-nhatrang",
    name: "Nha Trang",
    properties: "960 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80",
    tag: "Vịnh biển đẹp & Hải sản"
  },
  {
    id: "dest-dalat",
    name: "Đà Lạt",
    properties: "1,100 chỗ nghỉ",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tag: "Thành phố sương mờ"
  }
];

