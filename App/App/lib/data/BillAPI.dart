import 'package:dio/dio.dart';
import 'package:shoehubapp/data/sharepre.dart'; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
import '../model/Bill.dart';
import '../response/BillResponse.dart';
import 'api.dart';

class BillAPI {
  final API api;
  String? _token; // Biến để lưu trữ token

  // Khởi tạo với đối tượng API
  BillAPI(this.api);

  // Phương thức để thiết lập token
  Future<void> setToken() async {
    try {
      _token = await getToken(); // Lấy token từ SharedPreferences
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  // Lấy danh sách hóa đơn
  Future<BillResponse> getBills() async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.get(
        'bills',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      print('API Response: ${res.data}'); // Debug print

      if (res.statusCode == 200) {
        return BillResponse.fromJson(res.data);
      } else {
        throw Exception('Failed to load bills');
      }
    } catch (e) {
      print('Error fetching bills: $e');
      throw e;
    }
  }


  // Thêm hóa đơn mới
  Future<String> addBill(Bill bill) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = bill.toJson();
      final Response res = await api.sendRequest.post(
        'bill/add',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Bill added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add bill";
      }
    } catch (e) {
      print('Error adding bill: $e');
      return "Failed to add bill";
    }
  }

  // Cập nhật hóa đơn
  Future<String> updateBill(Bill bill) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = bill.toJson();
      final Response res = await api.sendRequest.put(
        'bill/update/${bill.id}',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Bill updated successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to update bill";
      }
    } catch (e) {
      print('Error updating bill: $e');
      return "Failed to update bill";
    }
  }

  // Xóa hóa đơn
  Future<String> deleteBill(String billId) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final Response res = await api.sendRequest.delete(
        'bill/delete/$billId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Bill deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid bill ID";
      } else {
        return "Failed to delete bill";
      }
    } catch (e) {
      print('Error deleting bill: $e');
      return "Failed to delete bill";
    }
  }
}
