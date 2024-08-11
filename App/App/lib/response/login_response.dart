import '../model/user.dart';

class LoginResponse {
  final String accessToken;
  final String refreshToken;
  final User user;

  LoginResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['data']['access_token'],
      refreshToken: json['data']['refresh_token'],
      user: User.fromJson(json['data']['user']),
    );
  }
}
