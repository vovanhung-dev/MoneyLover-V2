class BudgetCreate {
  final double amount; // Amount in integer format
  final String category; // Category ID
  final bool repeat; // Repeat status
  final String name; // Name of the budget
  final String amountDisplay; // Display amount as String
  final String wallet; // Wallet ID
  final DateTime periodStart; // Start period
  final DateTime periodEnd; // End period

  BudgetCreate({
    required this.amount,
    required this.category,
    required this.repeat,
    required this.name,
    required this.amountDisplay,
    required this.wallet,
    required this.periodStart,
    required this.periodEnd,
  });

  // Factory constructor to create a BudgetCreate object from JSON
  factory BudgetCreate.fromJson(Map<String, dynamic> json) {
    return BudgetCreate(
      amount: (json['amount'] as num).toDouble(), // Convert to double if necessary
      category: json['category'] as String,
      repeat: json['repeat_bud'] as bool, // Map to 'repeat_bud'
      name: json['name'] as String,
      amountDisplay: json['amountDisplay'] as String, // Amount display as String
      wallet: json['wallet'] as String, // Wallet ID
      periodStart: DateTime.parse(json['period_start'] as String), // Parse DateTime
      periodEnd: DateTime.parse(json['period_end'] as String), // Parse DateTime
    );
  }

  // Method to convert a BudgetCreate object to JSON
  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'category': category,
      'repeat_bud': repeat, // Map to 'repeat_bud'
      'name': name,
      'amountDisplay': amountDisplay,
      'wallet': wallet,
      'period_start': periodStart.toIso8601String(), // Convert DateTime to String
      'period_end': periodEnd.toIso8601String(), // Convert DateTime to String
    };
  }
}
