import 'dart:convert';


import '../model/Signup.dart';
import '/model/user.dart';
import 'package:dio/dio.dart';

import '../response/login_response.dart';
import 'sharepre.dart';

class API {
  final Dio _dio = Dio();
  String baseUrl = "http://172.27.0.1:8082";

  API() {
    _dio.options.baseUrl = "$baseUrl/api/v1/";
  }

  Dio get sendRequest => _dio;
}

class APIRepository {
  API api = API();

  Map<String, dynamic> header(String token) {
    return {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Bearer $token'
    };
  }

  Future<String> register(Signup signup) async {
    try {
      final body = jsonEncode(signup.toJson());
      Response res = await  api.sendRequest.post(
        'auth/register',
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        return "ok";
      } else if (res.statusCode == 400) {
        return "Email is exist";
      } else {
        return "signup fail";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<LoginResponse?> login(String email, String password) async {
    print("da vo");
    try {
      // Tạo body cho yêu cầu đăng nhập
      final body = jsonEncode({
        'email': email,
        'password': password,
      });

      // Gửi yêu cầu POST đến API
      Response res = await api.sendRequest.post(
        'auth/login',
        options: Options(
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );

      // In ra mã trạng thái HTTP và nội dung phản hồi
      print("Response status code: ${res.statusCode}");
      print("Response data: ${res.data}");

      if (res.statusCode == 200) {
        // Nếu mã trạng thái là 200 (OK), phân tích dữ liệu và trả về đối tượng LoginResponse
        final Map<String, dynamic> data = res.data;
        final loginResponse = LoginResponse.fromJson(data);
        print("Login successful");
        print("Access token: ${loginResponse?.accessToken}");
        print("Refresh token: ${loginResponse?.refreshToken}");
        print("User: ${loginResponse?.user}");
        return loginResponse;
      } else if (res.statusCode == 400) {
        // Nếu mã trạng thái là 400 (Bad Request), thông báo lỗi
        print("Login failed: Unregistered account or wrong password");
        return null; // Tài khoản chưa được đăng ký hoặc mật khẩu không đúng
      } else if (res.statusCode == 403) {
        // Nếu mã trạng thái là 403 (Forbidden), thông báo lỗi
        print("Login failed: Forbidden access. Check your credentials or permissions.");
        return null; // Quyền truy cập bị từ chối
      } else {
        // Nếu mã trạng thái không phải là 200, 400, hoặc 403, thông báo lỗi chung
        print("Login failed with status code: ${res.statusCode}");
        return null; // Đăng nhập thất bại
      }
    } catch (ex) {
      // Xử lý lỗi và in ra thông báo lỗi
      print("Exception occurred: $ex");
      return null; // Xử lý lỗi
    }
  }

}
