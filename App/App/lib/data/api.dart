import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shoehubapp/data/sharepre.dart';

import '../model/Signup.dart';
import '/model/user.dart';
import '../response/login_response.dart';

class API {
  final Dio _dio = Dio();
  String baseUrl = "http://192.168.1.3:8082";

  API() {
    _dio.options.baseUrl = "$baseUrl/api/v1/";
  }

  Dio get sendRequest => _dio;
}

class APIRepository {
  API api = API();
  String? _token;


  Future<void> setToken() async {
    try {
      _token = await getToken();
      api.sendRequest.options.headers['Authorization'] = 'Bearer $_token';
    } catch (e) {
      print('Error setting token: $e');
    }
  }

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
      Response res = await api.sendRequest.post(
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
    try {
      final body = jsonEncode({
        'email': email,
        'password': password,
      });

      Response res = await api.sendRequest.post(
        'auth/login',
        options: Options(
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        final Map<String, dynamic> data = res.data;
        final loginResponse = LoginResponse.fromJson(data);
        return loginResponse;
      } else if (res.statusCode == 400) {
        return null;
      } else if (res.statusCode == 403) {
        return null;
      } else {
        return null;
      }
    } catch (ex) {
      print("Exception occurred: $ex");
      return null;
    }
  }

  Future<String> changePassword(String email, String oldPassword, String newPassword, String confirmPassword) async {
    try {
      final body = jsonEncode({
        'email': email,
        'oldPassword': oldPassword,
        'newPassword': newPassword,
        'confirmPassword': confirmPassword,
      });

      Response res = await api.sendRequest.post(
        'auth/changePassword',
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        return "Password changed successfully";
      } else if (res.statusCode == 400) {
        return "Invalid request data";
      } else if (res.statusCode == 401) {
        return "Unauthorized request";
      } else {
        return "Password change failed";
      }
    } catch (ex) {
      print(ex);
      return "An error occurred";
    }
  }

  // New API methods

  Future<String> forgotPassword(String email) async {
    try {
      final body = jsonEncode({'email': email});

      Response res = await api.sendRequest.post(
        'auth/forgot',
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        return "Password reset email sent";
      } else if (res.statusCode == 400) {
        return "Invalid email";
      } else {
        return "Forgot password request failed";
      }
    } catch (ex) {
      print(ex);
      return "An error occurred";
    }
  }

  // Function to get user details by ID or email
  Future<Map<String, dynamic>> getUserDetails(String idOrEmail) async {
    await setToken(); // Ensure the token is set for authorization
    try {
      final Response res = await api.sendRequest.post(
        'user/' + idOrEmail,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_token',
          },
        ),
      );

      if (res.statusCode == 200) {
        return res.data['data']; // Correctly returning the user data
      } else {
        throw Exception('Failed to fetch user details');
      }
    } catch (e) {
      print('Error fetching user details: $e');
      throw e;
    }
  }

// Function to submit OTP for password reset
  Future<String> submitOtp(String email, String otp) async {
    try {
      // Fetch user details using the provided email
      final userDetails = await getUserDetails(email);
      print(userDetails);
      final userId = userDetails['id']; // Get the user ID from the details
      print(userId);
      final body = jsonEncode({
        'account': userId,
        'otp': otp,
      });

      Response res = await api.sendRequest.post(
        'auth/submitOtp',
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        return "OTP verified successfully";
      } else if (res.statusCode == 400) {
        return "Invalid OTP";
      } else {
        return "OTP submission failed";
      }
    } catch (ex) {
      print('Error submitting OTP: $ex');
      return "An error occurred";
    }
  }


  Future<String> changePasswordForgot(String email, String password) async {
    // Fetch user details using the provided email
    final userDetails = await getUserDetails(email);
    final userId = userDetails['id']; // Get the user ID from the details
    try {
      final body = jsonEncode({
        'account': userId,
        'password': password,
      });

      Response res = await api.sendRequest.post(
        'auth/changePasswordForgot',
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
        data: body,
      );

      if (res.statusCode == 200) {
        return "Password changed successfully";
      } else if (res.statusCode == 400) {
        return "Invalid request data";
      } else {
        return "Password change failed";
      }
    } catch (ex) {
      print(ex);
      return "An error occurred";
    }
  }
}
