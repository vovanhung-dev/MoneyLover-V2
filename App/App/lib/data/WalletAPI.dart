import 'package:dio/dio.dart';
import 'package:shoehubapp/data/sharepre.dart';
import '../model/Wallet.dart';
import '../response/WalletResponse.dart';
import 'api.dart';

class WalletAPI {
  final API api;
  String? _token; // Biến để lưu trữ token

  // Khởi tạo với đối tượng API
  WalletAPI(this.api);

  // Phương thức để thiết lập token
  Future<void> setToken() async {
    try {
      _token = await getToken(); // Lấy token từ SharedPreferences
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  // Lấy danh sách ví
  Future<WalletResponse> getWallets(int pageNumber) async {
    await setToken(); // Ensure token is set
    try {
      final Response res = await api.sendRequest.get(
        'wallets',
        queryParameters: {'page': pageNumber},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      print('API Response: ${res.data}'); // Debug print

      if (res.statusCode == 200) {
        return WalletResponse.fromJson(res.data);
      } else {
        throw Exception('Failed to load wallets');
      }
    } catch (e) {
      print('Error fetching wallets: $e');
      throw e;
    }
  }

  // Thêm ví mới
  Future<String> addWallet(Wallet wallet) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = wallet.toJson();
      final Response res = await api.sendRequest.post(
        'addWallet',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token' // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add wallet";
      }
    } catch (e) {
      print('Error adding wallet: $e');
      return "Failed to add wallet";
    }
  }

  // Cập nhật ví
  Future<String> updateWallet(Wallet wallet) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = wallet.toJson();
      final Response res = await api.sendRequest.put(
        'updateWallet/${wallet.id}',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token' // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet updated successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to update wallet";
      }
    } catch (e) {
      print('Error updating wallet: $e');
      return "Failed to update wallet";
    }
  }

  // Xóa ví
  Future<String> deleteWallet(String walletId) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final Response res = await api.sendRequest.delete(
        'wallet/delete/$walletId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token' // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Wallet deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid wallet ID";
      } else {
        return "Failed to delete wallet";
      }
    } catch (e) {
      print('Error deleting wallet: $e');
      return "Failed to delete wallet";
    }
  }

  // Đặt ví chính
  Future<String> setPrimaryWallet(String walletId) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final Response res = await api.sendRequest.post(
        'wallet/changeMain/$walletId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Primary wallet set successfully";
      } else if (res.statusCode == 400) {
        return "Invalid wallet ID or request";
      } else {
        return "Failed to set primary wallet";
      }
    } catch (e) {
      print('Error setting primary wallet: $e');
      return "Failed to set primary wallet";
    }
  }
}
