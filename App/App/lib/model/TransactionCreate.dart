class TransactionCreate {
  String wallet;
  double amount;
  bool exclude;
  String notes;
  String date;
  String category;
  String type;
  double amountDisplay;

  TransactionCreate({
    required this.wallet,
    required this.amount,
    required this.exclude,
    required this.notes,
    required this.date,
    required this.category,
    required this.type,
    required this.amountDisplay
  });

  // Convert a Transaction to a Map
  Map<String, dynamic> toJson() {
    return {
      'wallet': wallet,
      'amount': amount,
      'exclude': exclude,
      'notes': notes,
      'date': date,
      'category': category,
      'type': type,
      'amountDisplay': amountDisplay
    };
  }

  // Create a Transaction from a Map
  factory TransactionCreate.fromJson(Map<String, dynamic> json) {
    return TransactionCreate(
      wallet: json['wallet'],
      amount: json['amount'],
      exclude: json['exclude'],
      notes: json['notes'],
      date: json['date'],
      category: json['category'],
      type: json['type'],
      amountDisplay: json['amountDisplay'],
    );
  }
}
