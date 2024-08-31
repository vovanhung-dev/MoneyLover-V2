import '../model/user.dart';
import 'CategoryResponse.dart';

class TransactionResponse {
  final String id;
  final double amount;
  final bool remind;
  final bool exclude;
  final String notes;
  final Category category;
  final String date;
  final User user;

  TransactionResponse({
    required this.id,
    required this.amount,
    required this.remind,
    required this.exclude,
    required this.notes,
    required this.category,
    required this.date,
    required this.user,
  });

  factory TransactionResponse.fromJson(Map<String, dynamic> json) {
    return TransactionResponse(
      id: json['id'] ?? '',
      amount: json['amount']?.toDouble() ?? 0.0,
      remind: json['remind'] ?? false,
      exclude: json['exclude'] ?? false,
      notes: json['notes'] ?? '',
      category: json['category'] != null ? Category.fromJson(json['category']) : Category(id: '', name: '', categoryType: '', categoryIcon: '', defaultIncome: false, debtLoanType: 0),
      date: json['date'] ?? '',
      user: json['user'] != null ? User.fromJson(json['user']) : User(id: '', username: '', email: '', enable: false),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'remind': remind,
      'exclude': exclude,
      'notes': notes,
      'category': category.toJson(),
      'date': date,
      'user': user.toJson(),
    };
  }
}
