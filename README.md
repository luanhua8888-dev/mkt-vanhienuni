# VHU — Hiểu mình. Chọn ngành. Vững tương lai.

Landing page một trang giới thiệu Đại học Văn Hiến, dành cho học sinh và phụ huynh đang tìm hiểu ngành học, chọn trường.

## Chạy tại máy

Cần Node.js. Trang không dùng thư viện phụ thuộc và không cần cài đặt package.

```sh
npm run dev
```

Mở `http://127.0.0.1:4173`. Có thể mở trực tiếp `dist/index.html` bằng trình duyệt.

```sh
npm run check
```

## Đưa lên Vercel

1. Đăng nhập Vercel, chọn **Add New → Project** và import repository này từ GitHub.
2. Để **Root Directory** là thư mục gốc repository (`./`).
3. **Framework Preset:** Other. **Output Directory:** `dist`. Không cần Build Command hoặc biến môi trường.
4. Chọn **Deploy**. Vercel cấp đường dẫn `.vercel.app` để chia sẻ.

File `vercel.json` đã khai báo thư mục xuất bản. Các lần push tiếp theo có thể được Vercel tự động triển khai khi bật Git Integration.

## Nội dung và tài nguyên

- `dist/index.html`: nội dung trang.
- `dist/styles.css`: giao diện, bố cục responsive và hiệu ứng chuyển động (tự tắt khi thiết bị bật giảm chuyển động).
- `dist/app.js`: menu điện thoại, thanh tiến trình cuộn, hiệu ứng xuất hiện khi cuộn, bộ lọc ngành, chọn chủ đề tư vấn, thanh liên hệ trên điện thoại và hộp nguồn tham khảo.
- `dist/assets/`: ảnh thực tế, logo, phông chữ và `trong-dong.svg` (hoạ tiết mặt trống đồng vẽ lại dạng nét, dùng làm nền).
- Slideshow cơ sở đào tạo có 5 ảnh, tự chuyển sau 6,5 giây, hỗ trợ vuốt, phím mũi tên và tạm dừng. Tự dừng khi rê chuột, dùng bàn phím trong slideshow, ra khỏi khung nhìn hoặc chuyển tab; mặc định tắt tự chạy khi thiết bị bật giảm chuyển động.
- Ảnh Harmony, myU và Nguyễn Bá Tuyển: [UniZone, 2024](https://unizone.edu.vn/vhu-cac-co-so-dao-tao-dai-hoc-van-hien/). Ảnh Quận 12: [Phòng Quản trị Cơ sở vật chất VHU, 2014](https://csvc.vhu.edu.vn/vi/tin-tuc-moi-nhat/cac-co-so-hoc-tap-cua-truong-1). Đây là ảnh tư liệu, không xác nhận diện mạo hiện tại. Họa tiết chim Lạc tham khảo [trống Ngọc Lũ tại Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/en/Articles/1004/73640/national-treasures-the-ngoc-lu-drum.html), được vẽ lại bằng SVG cho nền trang.
- Mỗi phần của trang cao đúng một màn hình. Phần Campus 360° nhúng trực tiếp tour tại https://360.vhu.edu.vn/.

Thông tin và hình ảnh tham khảo từ website [Đại học Văn Hiến](https://vhu.edu.vn/), [cổng tuyển sinh](https://tuyensinh.vhu.edu.vn/) và [cổng tân sinh viên](https://tansinhvien.vhu.edu.vn/). Trang có mục nguồn thông tin, hình ảnh và ghi chú đây là bài thực hành marketing, không phải cổng tuyển sinh chính thức.

Ảnh và logo thuộc nguồn công bố của trường; không cấp quyền sử dụng lại tài nguyên của bên thứ ba. Điều kiện tuyển sinh, học phí và học bổng cần được xác nhận với trường tại thời điểm đăng ký.
