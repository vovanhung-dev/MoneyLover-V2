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
    // Ensure no null values for critical fields
    final String id = json['id'] ?? '';
    final double amount = (json['amount'] as num?)?.toDouble() ?? 0.0;
    final DateTime periodStart = DateTime.tryParse(json['periodStart'] as String? ?? '') ?? DateTime.now();
    final DateTime periodEnd = DateTime.tryParse(json['periodEnd'] as String? ?? '') ?? DateTime.now();
    final bool repeat = json['repeat'] ?? false;
    final String wallet = json['wallet'] ?? '';
    final String name = json['name'] ?? '';
    final Category category = Category.fromJson(json['category'] as Map<String, dynamic>? ?? {});

    return Budget(
      id: id,
      amount: amount,
      periodStart: periodStart,
      periodEnd: periodEnd,
      repeat: repeat,
      wallet: wallet,
      name: name,
      category: category,
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
