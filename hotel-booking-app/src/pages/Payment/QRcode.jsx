

export function QRcode (props){
    const { price } = props; 

    return(
        <>
            <div>QRcode</div>
            <h3>Vui lòng thanh toán: {price.toLocaleString("vi-VN")} VND</h3>

        </>
    )
}