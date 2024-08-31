import '../response/CategoryResponse.dart';

class Transaction {
  final String id;
  final double amount;
  final bool remind;
  final bool exclude;
  final String? notes;
  final String date;
  final Category? category;
  final String userId;

  Transaction({
    required this.id,
    required this.amount,
    required this.remind,
    required this.exclude,
    this.notes,
    required this.date,
    this.category,
    required this.userId,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? '',
      amount: json['amount']?.toDouble() ?? 0.0,
      remind: json['remind'] ?? false,
      exclude: json['exclude'] ?? false,
      notes: json['notes'] ?? '',
      date: json['date'] ?? '',
      category: json['category'] != null ? Category.fromJson(json['category']) : null,
      userId: json['user']?['id'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'remind': remind,
      'exclude': exclude,
      'notes': notes,
      'date': date,
      'category': category,
    };
  }
}
