import 'Category.dart';

class Budget {
  final String id;
  final double amount;
  final DateTime periodStart;
  final DateTime periodEnd;
  final bool repeat;
  final String wallet;
  final String name;
  final Category category;

  Budget({
    required this.id,
    required this.amount,
    required this.periodStart,
    required this.periodEnd,
    required this.repeat,
    required this.wallet,
    required this.name,
    required this.category,
  });

  // Factory constructor to create a Budget object from JSON
  factory Budget.fromJson(Map<String, dynamic> json) {
    return Budget(
      id: json['id'] as String,
      amount: (json['amount'] as num).toDouble(),
      periodStart: DateTime.parse(json['periodStart'] as String),
      periodEnd: DateTime.parse(json['periodEnd'] as String),
      repeat: json['repeat'] as bool,
      wallet: json['wallet'] as String,
      name: json['name'] as String,
      category: Category.fromJson(json['category'] as Map<String, dynamic>),
    );
  }

  // Method to convert a Budget object to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'periodStart': periodStart.toIso8601String(),
      'periodEnd': periodEnd.toIso8601String(),
      'repeat': repeat,
      'wallet': wallet,
      'name': name,
      'category': category.toJson(),
    };
  }
}
