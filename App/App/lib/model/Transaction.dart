class Transaction {
  final String id; // Add this line if necessary
  final String wallet;
  final double amount;
  final bool remind;
  final bool exclude;
  final String notes;
  final String date;
  final String category;
  final String type; // Should be "Expense" or "Income"

  Transaction({
    required this.id, // Add this line if necessary
    required this.wallet,
    required this.amount,
    required this.remind,
    required this.exclude,
    required this.notes,
    required this.date,
    required this.category,
    required this.type,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'], // Add this line if necessary
      wallet: json['wallet'],
      amount: json['amount'].toDouble(),
      remind: json['remind'],
      exclude: json['exclude'],
      notes: json['notes'],
      date: json['date'],
      category: json['category'],
      type: json['type'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id, // Add this line if necessary
      'wallet': wallet,
      'amount': amount,
      'remind': remind,
      'exclude': exclude,
      'notes': notes,
      'date': date,
      'category': category,
      'type': type,
    };
  }
}
