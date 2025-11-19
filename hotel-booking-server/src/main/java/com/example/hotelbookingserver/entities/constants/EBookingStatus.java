package com.example.hotelbookingserver.entities.constants;

public enum EBookingStatus {

    PENDING("Đang chờ xác nhận"),
    ACTIVE("Đã đặt, còn hiệu lực"),
    COMPLETED("Đã hoàn thành"),
    CANCELLED("Đã hủy bởi người dùng"),
    AUTO_CANCELLED("Hệ thống tự hủy do quá hạn"),
    FAILED("Thanh toán thất bại"),
    REFUNDED("Đã hoàn tiền");

    private final String description;

    EBookingStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
