import 'package:shoehubapp/model/user.dart';

class Manager {
  final User user;
  final String permission;
  final int totalAmount;
  final int totalTransaction;

  Manager({
    required this.user,
    required this.permission,
    required this.totalAmount,
    required this.totalTransaction,
  });

  factory Manager.fromJson(Map<String, dynamic> json) {
    return Manager(
      user: User.fromJson(json['user']),
      permission: json['permission'] ?? 'Read',
      totalAmount: json['totalAmount'] ?? 0,
      totalTransaction: json['totalTransaction'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user.toJson(),
      'permission': permission,
      'totalAmount': totalAmount,
      'totalTransaction': totalTransaction,
    };
  }
}