import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../model/Budget.dart';
import '../model/BudgetCreate.dart';
import '../data/sharepre.dart'; // Thay đổi nếu cần
import 'api.dart';

class BudgetAPI {
  final API api;
  String? _token; // Biến để lưu trữ token

  // Khởi tạo với đối tượng API
  BudgetAPI(this.api);

  // Phương thức để thiết lập token
  Future<void> setToken() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('token'); // Get token from SharedPreferences
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

  // Lấy danh sách ngân sách theo ví đã chọn
  Future<List<Budget>> getBudgets(String walletId) async {
    await setToken(); // Đảm bảo token được thiết lập
    try {
      final Response res = await api.sendRequest.get(
        'budgets?wallet=$walletId',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        final Map<String, dynamic> responseData = res.data;
        final List<dynamic> data = responseData['data'] as List<dynamic>;

        // Print the data to see the raw data returned from the API
        print('Fetched data: $data');

        return data.map((item) => Budget.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load budgets');
      }
    } catch (e) {
      print('Error fetching budgets: $e');
      throw e;
    }
  }



  // Thêm ngân sách mới
  Future<String> addBudget(BudgetCreate budget) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = budget.toJson();
      final Response res = await api.sendRequest.post(
        'budget/add',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Budget added successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to add budget";
      }
    } catch (e) {
      print('Error adding budget: $e');
      return "Failed to add budget";
    }
  }

  // Cập nhật ngân sách
  Future<String> updateBudget(String id, BudgetCreate budget) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final body = budget.toJson();
      final Response res = await api.sendRequest.put(
        'budgets/update/$id',
        data: body,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Budget updated successfully";
      } else if (res.statusCode == 400) {
        return "Invalid data provided";
      } else {
        return "Failed to update budget";
      }
    } catch (e) {
      print('Error updating budget: $e');
      return "Failed to update budget";
    }
  }

  // Xóa ngân sách
  Future<String> deleteBudget(String id) async {
    await setToken(); // Đảm bảo token đã được thiết lập
    try {
      final Response res = await api.sendRequest.delete(
        'budgets/delete/$id',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token', // Thêm token vào header
          },
        ),
      );

      if (res.statusCode == 200) {
        return "Budget deleted successfully";
      } else if (res.statusCode == 400) {
        return "Invalid budget ID";
      } else {
        return "Failed to delete budget";
      }
    } catch (e) {
      print('Error deleting budget: $e');
      return "Failed to delete budget";
    }
  }
}
